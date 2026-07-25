/**
 * Histórico persistido de métricas de escalabilidad (multi-servicio).
 *
 * Usa Vercel Blob (mismo patrón que /api/demo-monitor) para no requerir una
 * migración de Prisma. Serie temporal acotada; cada punto guarda, por servicio,
 * latencia/rps/p95/hit-ratio. Muestreo throttled: un punto por SAMPLE_INTERVAL_MS.
 */

import { put, list } from "@vercel/blob";
import type { DashboardSnapshot } from "@/lib/coreops-metrics";

const BLOB_KEY = "scalability-history.json";
const MAX_POINTS = 500;
const SAMPLE_INTERVAL_MS = 60_000;

export interface ServicePoint {
  reachable: boolean;
  latencyMs: number | null;
  rps: number | null;
  p95: number | null;
  cacheHitRatio: number | null;
}

export interface HistoryPoint {
  ts: number;
  services: Record<string, ServicePoint>;
}

interface HistoryStore {
  points: HistoryPoint[];
}

export async function readHistory(): Promise<HistoryPoint[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return [];
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return [];
    const store = (await res.json()) as HistoryStore;
    return Array.isArray(store.points) ? store.points : [];
  } catch {
    return [];
  }
}

function toPoint(snap: DashboardSnapshot): HistoryPoint {
  const services: Record<string, ServicePoint> = {};
  for (const s of snap.services) {
    services[s.id] = {
      reachable: s.reachable,
      latencyMs: s.latencyMs,
      rps: s.internal?.rps ?? null,
      p95: s.internal?.latencyP95 ?? null,
      cacheHitRatio: s.internal?.hasCache ? s.internal.cacheHitRatio : null,
    };
  }
  return { ts: snap.ts, services };
}

/**
 * Añade un punto al histórico si ha pasado el intervalo de muestreo.
 * Devuelve la serie resultante. No-op silencioso si Blob no está configurado.
 */
export async function recordSample(snap: DashboardSnapshot): Promise<HistoryPoint[]> {
  const points = await readHistory();
  const last = points[points.length - 1];
  if (last && snap.ts - last.ts < SAMPLE_INTERVAL_MS) {
    return points;
  }

  const next = [...points, toPoint(snap)].slice(-MAX_POINTS);

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return next;
  }
  try {
    await put(BLOB_KEY, JSON.stringify({ points: next } satisfies HistoryStore), {
      token: process.env.BLOB_READ_WRITE_TOKEN,
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    });
  } catch {
    // best-effort
  }
  return next;
}
