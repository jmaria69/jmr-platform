import { readStore, writeStore, type SecurityEvent } from "@/lib/security-store";
import { NextRequest, NextResponse } from "next/server";

const INTERNAL_SECRET = process.env.SECURITY_LOG_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("x-security-secret");
  if (!auth || auth !== INTERNAL_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const info = (await req.json()) as {
      type: SecurityEvent["type"];
      ip: string;
      path: string;
      userAgent: string;
      details: string;
    };

    const store = await readStore();

    const NOW = Date.now();
    for (const ipKey of Object.keys(store.rateLimitMap)) {
      if (NOW - store.rateLimitMap[ipKey].firstSeen > 24 * 60 * 60 * 1000) {
        delete store.rateLimitMap[ipKey];
      }
    }

    const ipRecord = store.rateLimitMap[info.ip] ?? { count: 0, firstSeen: NOW };
    ipRecord.count++;
    store.rateLimitMap[info.ip] = ipRecord;

    let severity: SecurityEvent["severity"] = "medium";
    if (info.type === "brute_force") severity = "high";
    if (info.type === "bot_blocked") severity = "low";
    if (ipRecord.count >= 10) severity = "critical";
    else if (ipRecord.count >= 5) severity = "high";

    const event: SecurityEvent = {
      id: `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: info.type,
      ip: info.ip,
      path: info.path,
      userAgent: info.userAgent.slice(0, 200),
      timestamp: new Date().toISOString(),
      severity,
      details: info.details,
      resolved: false,
    };

    store.events.unshift(event);
    if (store.events.length > 200) store.events.splice(200);

    await writeStore(store);

    return NextResponse.json({ ok: true, id: event.id });
  } catch (err) {
    console.error("[POST /security/log]", err instanceof Error ? err.message : String(err));
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
