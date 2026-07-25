/**
 * Fuente de datos del panel de escalabilidad (/admin/escalabilidad), multi-servicio.
 *
 * Sondea cada servicio de MONITORED_SERVICES en paralelo:
 *  - Blackbox: cronometra la petición (latencia + disponibilidad desde fuera).
 *  - Interno: si el servicio expone métricas (FastAPI con `metrics.py`), las lee.
 * Y añade una vez los datos CRM reales desde Prisma.
 */

import { getCRMStats, findAllCampaigns } from "@/lib/repositories";
import { MONITORED_SERVICES, type MonitoredService } from "@/lib/monitored-services";

const FETCH_TIMEOUT_MS = 4000;

export interface InternalMetrics {
  rps: number;
  latencyP50: number;
  latencyP95: number;
  latencyP99: number;
  errorRate: number;
  cacheBackend: string;
  cacheHitRatio: number;
  jobsTotal: number;
  /** true si el servicio expone una capa de caché (para no mostrar hit ratio 0 falso). */
  hasCache: boolean;
}

export interface ServiceSnapshot {
  id: string;
  name: string;
  url: string;
  reachable: boolean;
  latencyMs: number | null;
  status: number | null;
  internal: InternalMetrics | null;
}

export interface CrmSnapshot {
  totalContacts: number;
  pipelineValue: number;
  wonDeals: number;
  conversionRate: number;
  campaigns: number;
}

export interface DashboardSnapshot {
  ts: number;
  services: ServiceSnapshot[];
  crm: CrmSnapshot;
}

async function timedFetch(url: string): Promise<{ ok: boolean; status: number | null; latencyMs: number | null; body: unknown }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const start = performance.now();
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    const latencyMs = Math.round(performance.now() - start);
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return { ok: res.ok, status: res.status, latencyMs, body };
  } catch {
    return { ok: false, status: null, latencyMs: null, body: null };
  } finally {
    clearTimeout(timer);
  }
}

function parseInternal(body: unknown): InternalMetrics | null {
  if (!body || typeof body !== "object") return null;
  const b = body as {
    traffic?: { rps?: number; latency_ms?: { p50?: number; p95?: number; p99?: number }; error_rate?: number };
    cache?: { backend?: string; hit_ratio?: number };
    jobs?: { total?: number };
  };
  if (!b.traffic && !b.cache) return null;
  const hasCache = !!b.cache;
  return {
    rps: b.traffic?.rps ?? 0,
    latencyP50: b.traffic?.latency_ms?.p50 ?? 0,
    latencyP95: b.traffic?.latency_ms?.p95 ?? 0,
    latencyP99: b.traffic?.latency_ms?.p99 ?? 0,
    errorRate: b.traffic?.error_rate ?? 0,
    cacheBackend: b.cache?.backend ?? "n/a",
    cacheHitRatio: b.cache?.hit_ratio ?? 0,
    jobsTotal: b.jobs?.total ?? 0,
    hasCache,
  };
}

async function probeService(svc: MonitoredService): Promise<ServiceSnapshot> {
  const base = { id: svc.id, name: svc.name, url: svc.url };
  // 1) Intenta el endpoint de métricas (da latencia + datos internos de una vez).
  if (svc.metricsPath) {
    const m = await timedFetch(`${svc.url}${svc.metricsPath}`);
    if (m.ok) {
      return { ...base, reachable: true, latencyMs: m.latencyMs, status: m.status, internal: parseInternal(m.body) };
    }
  }
  // 2) Sin métricas o caído: blackbox contra healthPath.
  const h = await timedFetch(`${svc.url}${svc.healthPath}`);
  return { ...base, reachable: h.ok, latencyMs: h.latencyMs, status: h.status, internal: null };
}

async function readCrm(): Promise<CrmSnapshot> {
  try {
    const [stats, campaigns] = await Promise.all([getCRMStats(), findAllCampaigns()]);
    return {
      totalContacts: stats.totalContacts,
      pipelineValue: Math.round(stats.totalPipelineValue),
      wonDeals: stats.wonDeals,
      conversionRate: Math.round(stats.conversionRate * 10) / 10,
      campaigns: campaigns.length,
    };
  } catch {
    return { totalContacts: 0, pipelineValue: 0, wonDeals: 0, conversionRate: 0, campaigns: 0 };
  }
}

/** Foto completa: todos los servicios (blackbox + interno) + CRM, en paralelo. */
export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [services, crm] = await Promise.all([
    Promise.all(MONITORED_SERVICES.map(probeService)),
    readCrm(),
  ]);
  return { ts: Date.now(), services, crm };
}
