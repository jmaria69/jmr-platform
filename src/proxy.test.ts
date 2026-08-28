import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth/session", () => ({
  verifyToken: vi.fn(),
  SESSION_COOKIE: "session",
}));

vi.mock("@/lib/security-logger", () => ({
  checkRateLimit: vi.fn(() => ({ blocked: false, count: 0 })),
  isMaliciousBot: vi.fn(() => false),
  logThreatAwait: vi.fn(async () => {}),
}));

vi.mock("@/lib/self-metrics", () => ({
  recordApiHit: vi.fn(),
  selfTrafficSnapshot: vi.fn(() => ({ rps: 0, latency_ms: null, error_rate: null })),
}));

import { NextRequest } from "next/server";
import { proxy } from "./proxy";

function req(path: string, accept?: string) {
  const headers: Record<string, string> = {};
  if (accept) headers.accept = accept;
  return new NextRequest(`https://praxialabs.com${path}`, { headers });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("proxy — negociación markdown en 404 de primer nivel", () => {
  it("reescribe a /md-404 un segmento desconocido cuando el cliente prefiere markdown", async () => {
    const res = await proxy(req("/esto-no-existe", "text/markdown"));
    expect(res.headers.get("x-middleware-rewrite")).toBe("https://praxialabs.com/md-404");
  });

  it("no reescribe si el cliente no pide markdown", async () => {
    const res = await proxy(req("/esto-no-existe", "text/html"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("no reescribe una ruta anidada bajo un segmento conocido, aunque no exista", async () => {
    const res = await proxy(req("/proyectos/no-existe", "text/markdown"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("no reescribe segmentos de primer nivel conocidos", async () => {
    const res = await proxy(req("/siam", "text/markdown"));
    expect(res.headers.get("x-middleware-rewrite")).toBeNull();
  });

  it("añade Accept y Accept-Encoding a Vary al reescribir", async () => {
    const res = await proxy(req("/esto-no-existe", "text/markdown"));
    expect(res.headers.get("Vary")).toBe("Accept, Accept-Encoding");
  });
});
