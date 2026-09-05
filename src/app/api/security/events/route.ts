import { getSession } from "@/lib/auth/session";
import { readStore, writeStore, type SecurityEvent } from "@/lib/security-store";
import { fetchCloudflareWafEvents } from "@/lib/cloudflare-waf";
import { sendSecurityAlertEmail } from "@/lib/security-email";
import { NextRequest, NextResponse } from "next/server";

const VALID_TYPES = ["bot_blocked", "rate_limited", "invalid_token", "brute_force", "suspicious"];

const SEVERITY_RANK: Record<SecurityEvent["severity"], number> = { low: 0, medium: 1, high: 2, critical: 3 };
const EMAIL_COOLDOWN_MS = 5 * 60 * 1000;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as Partial<SecurityEvent>;

    if (body.type && !VALID_TYPES.includes(body.type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const store = await readStore();
    const ip = body.ip ?? "unknown";

    const NOW = Date.now();
    for (const ipKey of Object.keys(store.rateLimitMap)) {
      if (NOW - store.rateLimitMap[ipKey].firstSeen > 24 * 60 * 60 * 1000) {
        delete store.rateLimitMap[ipKey];
      }
    }

    const ipRecord = store.rateLimitMap[ip] ?? { count: 0, firstSeen: NOW };
    ipRecord.count++;
    store.rateLimitMap[ip] = ipRecord;

    let severity = body.severity ?? "medium";
    if (ipRecord.count >= 10) severity = "critical";
    else if (ipRecord.count >= 5) severity = "high";

    const event: SecurityEvent = {
      id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: body.type ?? "suspicious",
      ip,
      path: body.path ?? "/",
      userAgent: (body.userAgent ?? "").slice(0, 200),
      timestamp: new Date().toISOString(),
      severity,
      details: body.details ?? "",
      resolved: false,
    };

    store.events.unshift(event);
    if (store.events.length > 200) store.events.splice(200);

    // Alerta por email (EmailJS) para severidad media o superior, con cooldown
    // global de 5 min para no saturar el buzón durante un ataque sostenido.
    const now = Date.now();
    if (
      SEVERITY_RANK[event.severity] >= SEVERITY_RANK.medium &&
      (!store.lastEmailSentAt || now - store.lastEmailSentAt >= EMAIL_COOLDOWN_MS)
    ) {
      store.lastEmailSentAt = now;
      await sendSecurityAlertEmail(event);
    }

    await writeStore(store);

    return NextResponse.json({ ok: true, id: event.id });
  } catch (err) {
    console.error("[POST /security/events]", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") ?? "50"), 500);
  const type = req.nextUrl.searchParams.get("type");

  const store = await readStore();

  // Bloqueos reales del WAF de Cloudflare (edge, ver src/lib/cloudflare-waf.ts)
  // -- proxy.ts nunca los ve porque Cloudflare corta la petición antes de que
  // llegue a Vercel, así que sin esto el panel no reflejaba ataques reales
  // (caso detectado 2026-09-04, intento de RCE CVE-2025-55182). Últimas 24h.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const resolvedCfIds = new Set(store.resolvedCfIds ?? []);
  const hiddenCfIds = new Set(store.hiddenCfIds ?? []);
  const cfEvents = (await fetchCloudflareWafEvents(since))
    .filter((e) => !hiddenCfIds.has(e.id))
    .map((e) => (resolvedCfIds.has(e.id) ? { ...e, resolved: true } : e));

  const events = [...cfEvents, ...store.events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  let filtered = type ? events.filter((e) => e.type === type) : events;
  filtered = filtered.slice(0, limit);

  const ipCounts = new Map<string, number>();
  for (const e of events) ipCounts.set(e.ip, (ipCounts.get(e.ip) ?? 0) + 1);
  for (const [ip, r] of Object.entries(store.rateLimitMap)) {
    ipCounts.set(ip, Math.max(ipCounts.get(ip) ?? 0, r.count));
  }

  const stats = {
    total: events.length,
    critical: events.filter((e) => e.severity === "critical").length,
    high: events.filter((e) => e.severity === "high").length,
    medium: events.filter((e) => e.severity === "medium").length,
    low: events.filter((e) => e.severity === "low").length,
    byType: {
      bot_blocked: events.filter((e) => e.type === "bot_blocked").length,
      rate_limited: events.filter((e) => e.type === "rate_limited").length,
      invalid_token: events.filter((e) => e.type === "invalid_token").length,
      brute_force: events.filter((e) => e.type === "brute_force").length,
      suspicious: events.filter((e) => e.type === "suspicious").length,
      waf_blocked: events.filter((e) => e.type === "waf_blocked").length,
    },
    topIPs: [...ipCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([ip, count]) => ({ ip, count })),
  };

  return NextResponse.json({ events: filtered, stats });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { id?: string };
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const store = await readStore();

  // Los eventos de Cloudflare (prefijo "cf-") no viven en store.events -- se
  // recalculan en cada GET (ver src/lib/cloudflare-waf.ts), así que su
  // resolución se guarda en una lista aparte y se reaplica al fusionar.
  if (body.id.startsWith("cf-")) {
    const resolvedCfIds = new Set(store.resolvedCfIds ?? []);
    resolvedCfIds.add(body.id);
    store.resolvedCfIds = [...resolvedCfIds];
    await writeStore(store);
    return NextResponse.json({ ok: true });
  }

  const ev = store.events.find((e) => e.id === body.id);
  if (ev) {
    ev.resolved = true;
    await writeStore(store);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { ids?: string[] };
  const ids = body.ids ?? [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "Missing ids" }, { status: 400 });
  }

  const store = await readStore();

  const cfIdsToHide = ids.filter((id) => id.startsWith("cf-"));
  const localIdsToDelete = new Set(ids.filter((id) => !id.startsWith("cf-")));

  if (cfIdsToHide.length > 0) {
    const hiddenCfIds = new Set(store.hiddenCfIds ?? []);
    for (const id of cfIdsToHide) hiddenCfIds.add(id);
    store.hiddenCfIds = [...hiddenCfIds];
  }

  if (localIdsToDelete.size > 0) {
    store.events = store.events.filter((e) => !localIdsToDelete.has(e.id));
  }

  await writeStore(store);

  return NextResponse.json({ ok: true, deleted: ids.length });
}
