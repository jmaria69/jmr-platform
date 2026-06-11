import { getSession } from "@/lib/auth/session";
import { readStore, writeStore, type SecurityEvent } from "@/lib/security-store";
import { NextRequest, NextResponse } from "next/server";

const VALID_TYPES = ["bot_blocked", "rate_limited", "invalid_token", "brute_force", "suspicious"];

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
  const { events } = store;

  let filtered = type ? events.filter((e) => e.type === type) : events;
  filtered = filtered.slice(0, limit);

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
    },
    topIPs: Object.entries(store.rateLimitMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([ip, r]) => ({ ip, count: r.count })),
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
  const ev = store.events.find((e) => e.id === body.id);

  if (ev) {
    ev.resolved = true;
    await writeStore(store);
  }

  return NextResponse.json({ ok: true });
}
