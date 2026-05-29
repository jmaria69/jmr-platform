/**
 * /api/security/alert — receives attack events from proxy and:
 *  1. Persists them in Vercel Blob (survives across serverless instances)
 *  2. Sends an email alert via EmailJS REST API when thresholds are exceeded
 */

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SecurityEvent {
  id: string;
  type: "bot_blocked" | "rate_limited" | "invalid_token" | "brute_force" | "suspicious";
  ip: string;
  path: string;
  userAgent: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
  details: string;
  resolved: boolean;
}

interface DemoStore {
  events: SecurityEvent[];
  rateLimitMap: Record<string, { count: number; firstSeen: number }>;
}

// ─── Blob helpers ─────────────────────────────────────────────────────────────
const BLOB_KEY = "security-events.json";
const VALID_TYPES = ["bot_blocked", "rate_limited", "invalid_token", "brute_force", "suspicious"];

async function readStore(): Promise<DemoStore> {
  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return { events: [], rateLimitMap: {} };

    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return { events: [], rateLimitMap: {} };

    return (await res.json()) as DemoStore;
  } catch {
    return { events: [], rateLimitMap: {} };
  }
}

async function writeStore(store: DemoStore): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn("⚠️ BLOB_READ_WRITE_TOKEN no configurado");
    return;
  }

  await put(BLOB_KEY, JSON.stringify(store), {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

// ─── Rate-limit helpers (persisted in store) ─────────────────────────────────
const EMAIL_COOLDOWN_MS = 5 * 60 * 1000;
let lastEmailSentAt = 0;

// ─── Email via EmailJS REST API ────────────────────────────────────────────────
async function sendAlertEmail(
  event: SecurityEvent,
  totalEvents: number
): Promise<string | null> {
  const now = Date.now();
  if (now - lastEmailSentAt < EMAIL_COOLDOWN_MS) return "cooldown";

  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_SECURITY_TEMPLATE;
  const alertEmail = process.env.SECURITY_ALERT_EMAIL || "admin@praxialabs.com";

  if (!publicKey || !serviceId || !templateId) return "missing_env";

  const severityEmoji = { low: "🟡", medium: "🟠", high: "🔴", critical: "🚨" }[event.severity];
  const typeLabels: Record<string, string> = {
    bot_blocked: "Bot / Agente IA bloqueado",
    rate_limited: "Fuerza bruta / Rate limit",
    invalid_token: "Token JWT inválido o expirado",
    brute_force: "Intento de fuerza bruta",
    suspicious: "Actividad sospechosa",
  };

  const solutions: Record<string, string> = {
    bot_blocked: "El bot fue bloqueado automáticamente. No se requiere acción inmediata.",
    rate_limited: "IP bloqueada durante 15 minutos. Si persiste, considera lista negra permanente.",
    invalid_token: "URGENTE: Posible falsificación de sesión JWT. Revisa sesiones activas no autorizadas.",
    brute_force: "CRÍTICO: Múltiples intentos fallidos de login. Cambia la contraseña de admin inmediatamente.",
    suspicious: "Actividad anómala. Revisa los logs completos en el panel de seguridad.",
  };

  try {
    const panelUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://praxialabs.com"}/admin/seguridad`;

    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          severidad: `${severityEmoji} ${event.severity.toUpperCase()}`,
          tipo_ataque: typeLabels[event.type] || event.type,
          ip_atacante: event.ip,
          ruta: event.path,
          user_agent: event.userAgent.slice(0, 120),
          fecha_hora: new Date(event.timestamp).toLocaleString("es-ES", { timeZone: "Europe/Madrid" }),
          detalles: event.details,
          solucion: solutions[event.type] || "Revisa el panel de seguridad.",
          total_eventos: String(totalEvents),
          panel_url: panelUrl,
          to_email: alertEmail,
        },
      }),
    });

    if (res.ok) {
      lastEmailSentAt = now;
      return "sent";
    }
    console.error("[Security] EmailJS error:", res.status);
    return `error_${res.status}`;
  } catch (err) {
    console.error("[Security] Email fetch failed:", err);
    return "fetch_failed";
  }
}

// ─── Route handlers ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ✅ Validate internal secret to prevent abuse
  const secret = req.headers.get("x-security-secret");
  if (secret !== process.env.SECURITY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json() as Partial<SecurityEvent>;

    // ✅ Validate type
    if (body.type && !VALID_TYPES.includes(body.type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const store = await readStore();
    const ip = body.ip ?? "unknown";

    // ✅ Clean old rate limit entries (>24h)
    const NOW = Date.now();
    Object.keys(store.rateLimitMap).forEach(ipKey => {
      if (NOW - store.rateLimitMap[ipKey].firstSeen > 24 * 60 * 60 * 1000) {
        delete store.rateLimitMap[ipKey];
      }
    });

    const ipRecord = store.rateLimitMap[ip] ?? { count: 0, firstSeen: NOW };
    ipRecord.count++;
    store.rateLimitMap[ip] = ipRecord;

    // Escalate severity for repeated offenders
    let severity = body.severity ?? "medium";
    if (ipRecord.count >= 10) severity = "critical";
    else if (ipRecord.count >= 5) severity = "high";

    const event: SecurityEvent = {
      id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: body.type ?? "suspicious",
      ip,
      path: body.path ?? "/",
      userAgent: (body.userAgent ?? "").slice(0, 200), // ✅ Truncate
      timestamp: new Date().toISOString(),
      severity,
      details: body.details ?? "",
      resolved: false,
    };

    // Keep last 200 events
    store.events.unshift(event);
    if (store.events.length > 200) store.events.splice(200);

    await writeStore(store);

    // Send email for medium+ severity
    let emailResult = "skipped";
    if (["medium", "high", "critical"].includes(severity)) {
      emailResult = (await sendAlertEmail(event, store.events.length)) ?? "unknown";
    }

    return NextResponse.json({ ok: true, id: event.id, email: emailResult });
  } catch (err) {
    console.error("[Security] POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // ✅ Validate secret for GET too
  const secret = req.headers.get("x-security-secret");
  if (secret !== process.env.SECURITY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "50"), 500);
  const type = req.nextUrl.searchParams.get("type");

  const store = await readStore();
  const { events } = store;

  let filtered = type ? events.filter(e => e.type === type) : events;
  filtered = filtered.slice(0, limit);

  const stats = {
    total: events.length,
    critical: events.filter(e => e.severity === "critical").length,
    high: events.filter(e => e.severity === "high").length,
    medium: events.filter(e => e.severity === "medium").length,
    low: events.filter(e => e.severity === "low").length,
    byType: {
      bot_blocked: events.filter(e => e.type === "bot_blocked").length,
      rate_limited: events.filter(e => e.type === "rate_limited").length,
      invalid_token: events.filter(e => e.type === "invalid_token").length,
      brute_force: events.filter(e => e.type === "brute_force").length,
      suspicious: events.filter(e => e.type === "suspicious").length,
    },
    topIPs: Object.entries(store.rateLimitMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([ip, r]) => ({ ip, count: r.count })),
  };

  return NextResponse.json({ events: filtered, stats });
}

export async function PATCH(req: NextRequest) {
  // ✅ Validate secret for PATCH too
  const secret = req.headers.get("x-security-secret");
  if (secret !== process.env.SECURITY_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const store = await readStore();
  const ev = store.events.find(e => e.id === body.id);

  if (ev) {
    ev.resolved = true;
    await writeStore(store);
  }

  return NextResponse.json({ ok: true });
}