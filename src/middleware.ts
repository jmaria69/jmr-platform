import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { checkRateLimit, isMaliciousBot } from "@/lib/security-logger";

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function logToAPI(req: NextRequest, info: Record<string, string>): void {
  const secret = process.env.SECURITY_LOG_SECRET || process.env.BLOB_READ_WRITE_TOKEN || "";
  const url = new URL("/api/security/log", req.url);

  fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-security-secret": secret,
    },
    body: JSON.stringify(info),
  }).catch((err) => {
    console.error("[middleware:logToAPI]", err instanceof Error ? err.message : String(err));
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  const ua = request.headers.get("user-agent") || "";

  // ─── 1. Bot malicioso → 403 ───
  if (isMaliciousBot(ua)) {
    logToAPI(request, {
      type: "bot_blocked",
      ip,
      path: pathname,
      userAgent: ua,
      details: `Bot malicioso bloqueado: ${ua.slice(0, 100)}`,
    });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // ─── 2. Rate limiting (login y API) ───
  if (pathname === "/login" || pathname.startsWith("/api/")) {
    const kind = pathname === "/login" ? "login" : "api";
    const { blocked, count } = checkRateLimit(ip, kind);

    if (blocked) {
      logToAPI(request, {
        type: "rate_limited",
        ip,
        path: pathname,
        userAgent: ua,
        details: `Rate limit excedido: ${count} peticiones/min (${kind})`,
      });
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // ─── 3. Auth admin + detección de tokens inválidos ───
  if (pathname.startsWith("/admin") && pathname !== "/admin/demo") {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await verifyToken(token);
    if (!session) {
      logToAPI(request, {
        type: "invalid_token",
        ip,
        path: pathname,
        userAgent: ua,
        details: "Token JWT inválido, expirado o manipulado",
      });
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/api/:path*"],
};
