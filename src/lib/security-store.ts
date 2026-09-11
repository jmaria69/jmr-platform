import { put, get } from "@vercel/blob";

export interface SecurityEvent {
  id: string;
  type: "bot_blocked" | "rate_limited" | "invalid_token" | "brute_force" | "suspicious" | "waf_blocked";
  ip: string;
  path: string;
  userAgent: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  details: string;
  resolved: boolean;
}

export interface DemoStore {
  events: SecurityEvent[];
  rateLimitMap: Record<string, { count: number; firstSeen: number }>;
  // Ids de eventos de Cloudflare (prefijo "cf-", ver src/lib/cloudflare-waf.ts)
  // marcados como resueltos. Esos eventos no viven en `events` -- se
  // recalculan en cada GET desde la GraphQL API de Cloudflare, así que su
  // estado "resuelto" no puede guardarse en el propio objeto del evento
  // como con los de proxy.ts; se guarda aparte y se aplica al fusionar.
  resolvedCfIds?: string[];
  // Ids de eventos de Cloudflare eliminados desde el panel. Igual que
  // resolvedCfIds: esos eventos se recalculan en cada GET desde la API de
  // Cloudflare (no se pueden borrar de verdad ahi), asi que "eliminar" un
  // evento cf- solo significa dejar de mostrarlo aqui.
  hiddenCfIds?: string[];
  // Timestamp (ms) del último email de alerta enviado (ver src/lib/security-email.ts).
  // Cooldown global de 5 min para no saturar el buzón durante un ataque sostenido.
  lastEmailSentAt?: number;
}

const BLOB_KEY = "security-events.json";

// Cache en memoria de corta duración -- el panel /admin/seguridad y el
// threat-map sondean este store cada pocos segundos, y cada lectura es una
// "Advanced Operation" facturable en Vercel Blob (plan Hobby: 2k/mes). Sin
// esto, dos peticiones casi simultáneas a la misma instancia caliente
// (varias pestañas, o el panel + el mapa) pagaban una lectura de Blob cada
// una. Con TTL de 5s se colapsan en una sola lectura real por ráfaga; no
// sirve entre instancias serverless distintas, pero reduce mucho el
// consumo dentro de la misma instancia caliente, que es el caso común.
let storeCache: { data: DemoStore; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 5_000;

export async function readStore(): Promise<DemoStore> {
  if (storeCache && Date.now() - storeCache.fetchedAt < CACHE_TTL_MS) {
    return storeCache.data;
  }

  try {
    const result = await get(BLOB_KEY, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      useCache: false,
    });
    const data = result ? (JSON.parse(await new Response(result.stream).text()) as DemoStore) : { events: [], rateLimitMap: {} };
    storeCache = { data, fetchedAt: Date.now() };
    return data;
  } catch (err) {
    console.warn("[readStore] Error:", err instanceof Error ? err.message : String(err));
    return { events: [], rateLimitMap: {} };
  }
}

export async function writeStore(store: DemoStore): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn("[writeStore] BLOB_READ_WRITE_TOKEN not configured");
    return;
  }

  try {
    const result = await put(BLOB_KEY, JSON.stringify(store), {
      token: process.env.BLOB_READ_WRITE_TOKEN,
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    console.log("[writeStore] OK —", store.events.length, "events saved to", result.pathname);
  } catch (err) {
    console.warn("[writeStore] Storage unavailable:", err instanceof Error ? err.message : String(err));
  }
}
