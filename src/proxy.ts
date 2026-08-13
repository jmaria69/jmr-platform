import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { checkRateLimit, isMaliciousBot, logThreatAwait } from "@/lib/security-logger";
import { recordApiHit, selfTrafficSnapshot } from "@/lib/self-metrics";

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  const ua = request.headers.get("user-agent") || "";

  // ─── 1. Bot malicioso → 403 ───
  if (isMaliciousBot(ua)) {
    after(async () => {
      try {
        await logThreatAwait({
          type: "bot_blocked",
          ip,
          path: pathname,
          userAgent: ua,
          details: `Bot malicioso bloqueado: ${ua.slice(0, 100)}`,
        });
      } catch (err) {
        console.error("[proxy:after]", err instanceof Error ? err.message : String(err));
      }
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ─── 2. Rate limiting (login y API) ───
  if (pathname === "/login" || pathname.startsWith("/api/")) {
    const kind = pathname === "/login" ? "login" : "api";
    const { blocked, count } = checkRateLimit(ip, kind);

    if (blocked) {
      after(async () => {
        try {
          await logThreatAwait({
            type: "rate_limited",
            ip,
            path: pathname,
            userAgent: ua,
            details: `Rate limit excedido: ${count} peticiones/min (${kind})`,
          });
        } catch (err) {
          console.error("[proxy:after]", err instanceof Error ? err.message : String(err));
        }
      });
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // ─── 3. Auth admin + detección de tokens inválidos ───
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await verifyToken(token);
    if (!session) {
      after(async () => {
        try {
          await logThreatAwait({
            type: "invalid_token",
            ip,
            path: pathname,
            userAgent: ua,
            details: "Token JWT inválido, expirado o manipulado",
          });
        } catch (err) {
          console.error("[proxy:after]", err instanceof Error ? err.message : String(err));
        }
      });
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ─── 4. Auto-métricas: cuenta peticiones de API que llegan hasta aquí ───
  if (pathname.startsWith("/api/")) {
    recordApiHit();
  }

  // En Vercel el Proxy corre como función independiente de los route
  // handlers (aunque ambos usen runtime Node.js): no comparten `globalThis`
  // en producción, solo en `next dev` (un único proceso). Por eso el
  // contador vive aquí y se le pasa a /api/metrics/self por cabecera en
  // vez de fiarse de memoria compartida.
  if (pathname === "/api/metrics/self") {
    const headers = new Headers(request.headers);
    headers.set("x-self-traffic", JSON.stringify(selfTrafficSnapshot()));
    return NextResponse.next({ request: { headers } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/api/:path*"],
};
