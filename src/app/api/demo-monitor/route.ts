/**
 * /api/demo-monitor — public endpoint called by all demo sites
 * No auth required (client-side calls). Rate-limited by IP.
 * Stores events in Vercel Blob alongside security events.
 */

import { NextRequest, NextResponse } from "next/server";
import { put, list } from "@vercel/blob";

export interface DemoEvent {
  id: string;
  site: string;
  eventType: "visit" | "bot" | "suspicious" | "error";
  ip: string;
  userAgent: string;
  path: string;
  referrer: string;
  timestamp: string;
  country?: string;
  severity: "low" | "medium" | "high";
}

interface DemoStore {
  events: DemoEvent[];
  rateLimitMap: Record<string, { count: number; resetAt: number }>;
}

const BLOB_KEY = "demo-monitor.json";
const RATE_LIMIT = 30;          // max events per IP per hour
const RATE_WINDOW = 60 * 60 * 1000;

// Bot UA patterns (same as proxy)
const BOT_PATTERNS = [
  "gpt", "openai", "anthropic", "claude", "gemini", "bard", "copilot",
  "chatgpt", "bing-ai", "perplexity", "cohere", "llama", "mistral",
  "huggingface", "scrapy", "python-requests", "httpx", "aiohttp",
  "wget", "libwww", "lwp-", "jakarta", "python-urllib",
  "bot", "crawler", "spider", "scraper", "headless", "phantom",
  "slurp", "mediapartners",
];

function detectBot(ua: string): boolean {
  const lower = ua.toLowerCase();
  if (!lower) return true;
  return BOT_PATTERNS.some(p => lower.includes(p));
}

async function readStore(): Promise<DemoStore> {
  try {
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
  await put(BLOB_KEY, JSON.stringify(store), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ─── POST — record demo event ─────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // CORS — allow requests from any vercel.app or localhost
  const origin = req.headers.get("origin") ?? "";
  const allowed =
    origin.includes("vercel.app") ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1");

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowed ? origin : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const ip = getClientIP(req);
  const store = await readStore();

  // Rate limit per IP
  const now = Date.now();
  const rl = store.rateLimitMap[ip] ?? { count: 0, resetAt: now + RATE_WINDOW };
  if (now > rl.resetAt) { rl.count = 0; rl.resetAt = now + RATE_WINDOW; }
  if (rl.count >= RATE_LIMIT) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: corsHeaders });
  }
  rl.count++;
  store.rateLimitMap[ip] = rl;

  const body = await req.json().catch(() => ({}));
  const ua = req.headers.get("user-agent") ?? body.ua ?? "";
  const isBot = detectBot(ua) || body.isBot === true;

  const severity: DemoEvent["severity"] =
    isBot ? "high" : rl.count > 20 ? "medium" : "low";

  const event: DemoEvent = {
    id:        `demo-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    site:      String(body.site ?? "unknown").slice(0, 50),
    eventType: isBot ? "bot" : "visit",
    ip,
    userAgent: ua.slice(0, 200),
    path:      String(body.path ?? "/").slice(0, 100),
    referrer:  String(body.referrer ?? "").slice(0, 200),
    timestamp: new Date().toISOString(),
    severity,
  };

  store.events.unshift(event);
  if (store.events.length > 500) store.events.splice(500);

  await writeStore(store);

  return NextResponse.json({ ok: true, id: event.id }, { headers: corsHeaders });
}

// ─── GET — stats for admin panel ─────────────────────────────────────────────
export async function GET() {
  const store = await readStore();
  const { events } = store;

  const bySite: Record<string, { visits: number; bots: number; lastSeen: string }> = {};
  for (const e of events) {
    if (!bySite[e.site]) bySite[e.site] = { visits: 0, bots: 0, lastSeen: e.timestamp };
    if (e.eventType === "bot") bySite[e.site].bots++;
    else bySite[e.site].visits++;
  }

  return NextResponse.json({
    events: events.slice(0, 100),
    stats: {
      total: events.length,
      bots:  events.filter(e => e.eventType === "bot").length,
      visits: events.filter(e => e.eventType === "visit").length,
      bySite,
      topIPs: Object.entries(store.rateLimitMap)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 5)
        .map(([ip, r]) => ({ ip, count: r.count })),
    },
  });
}

// ─── OPTIONS — preflight ─────────────────────────────────────────────────────
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
