import { readStore, writeStore, type SecurityEvent } from "./security-store";

export type ThreatType = SecurityEvent["type"];

interface ThreatInfo {
  type: ThreatType;
  ip: string;
  path: string;
  userAgent: string;
  details: string;
}

export function logThreat(info: ThreatInfo): void {
  logThreatAsync(info).catch((err) => {
    console.error("[logThreat]", err instanceof Error ? err.message : String(err));
  });
}

export { logThreatAsync as logThreatAwait };

async function logThreatAsync(info: ThreatInfo): Promise<void> {
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
}

// ─── In-memory rate limiter ───

interface RateEntry {
  count: number;
  windowStart: number;
}

const rateMaps = {
  login: new Map<string, RateEntry>(),
  api: new Map<string, RateEntry>(),
};

const LIMITS = {
  login: { max: 5, windowMs: 60_000 },
  api: { max: 60, windowMs: 60_000 },
};

export function checkRateLimit(ip: string, kind: "login" | "api"): { blocked: boolean; count: number } {
  const map = rateMaps[kind];
  const limit = LIMITS[kind];
  const now = Date.now();

  if (map.size > 10_000) {
    for (const [key, entry] of map) {
      if (now - entry.windowStart > limit.windowMs) map.delete(key);
    }
  }

  const entry = map.get(ip);
  if (!entry || now - entry.windowStart > limit.windowMs) {
    map.set(ip, { count: 1, windowStart: now });
    return { blocked: false, count: 1 };
  }

  entry.count++;
  return { blocked: entry.count > limit.max, count: entry.count };
}

// ─── Bot detection ───

const MALICIOUS_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /masscan/i, /nmap/i,
  /dirbuster/i, /gobuster/i, /wpscan/i, /hydra/i,
  /metasploit/i, /havij/i, /acunetix/i, /nessus/i,
  /openvas/i, /burpsuite/i, /zmeu/i, /morfeus/i,
];

export function isMaliciousBot(userAgent: string): boolean {
  return MALICIOUS_UA_PATTERNS.some((p) => p.test(userAgent));
}
