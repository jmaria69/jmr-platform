import { put, get } from "@vercel/blob";

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

export interface DemoStore {
  events: SecurityEvent[];
  rateLimitMap: Record<string, { count: number; firstSeen: number }>;
}

const BLOB_KEY = "security-events.json";

export async function readStore(): Promise<DemoStore> {
  try {
    const result = await get(BLOB_KEY, {
      access: "private",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      useCache: false,
    });
    if (!result) return { events: [], rateLimitMap: {} };

    const text = await new Response(result.stream).text();
    return JSON.parse(text) as DemoStore;
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

  const result = await put(BLOB_KEY, JSON.stringify(store), {
    token: process.env.BLOB_READ_WRITE_TOKEN,
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log("[writeStore] OK —", store.events.length, "events saved to", result.pathname);
}
