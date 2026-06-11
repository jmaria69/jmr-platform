import { getSession } from "@/lib/auth/session";
import { readStore, writeStore, type SecurityEvent } from "@/lib/security-store";
import { NextRequest, NextResponse } from "next/server";

const TEST_IPS = [
  "185.220.100.240", "198.51.100.50", "203.0.113.42", "192.0.2.100",
  "217.69.139.200", "178.62.85.97", "104.21.35.114", "131.232.99.209",
];
const TYPES = ["bot_blocked", "rate_limited", "invalid_token", "brute_force", "suspicious"] as const;
const SEVERITIES = ["low", "medium", "high", "critical"] as const;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as { count?: number };
    const count = Math.min(body.count || 5, 20);
    const store = await readStore();

    for (let i = 0; i < count; i++) {
      const event: SecurityEvent = {
        id: `test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
        ip: TEST_IPS[Math.floor(Math.random() * TEST_IPS.length)],
        path: "/api/test",
        userAgent: "Mozilla/5.0 (Testing)",
        timestamp: new Date().toISOString(),
        severity: SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)],
        details: "Test attack",
        resolved: false,
      };
      store.events.unshift(event);
    }

    if (store.events.length > 200) store.events = store.events.slice(0, 200);
    await writeStore(store);

    return NextResponse.json({
      ok: true,
      generated: count,
      total: store.events.length,
    });
  } catch (err) {
    console.error("[Generate]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
