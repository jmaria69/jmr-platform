import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "jmr_session";
const ADMIN_ROUTES = ["/admin"];
const PUBLIC_ROUTES = ["/login"];

// ─── Rate limiting (edge-memory, per instance) ────────────────────────────────
// For multi-region: replace with Upstash Redis
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const key = `rl:${ip}`;
  const record = loginAttempts.get(key);

  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    return { allowed: false, retryAfterSec: Math.ceil((record.resetAt - now) / 1000) };
  }
  record.count++;
  return { allowed: true, retryAfterSec: 0 };
}

// ─── Bot / AI agent detection ─────────────────────────────────────────────────
const BLOCKED_UA_PATTERNS = [
  "gpt", "openai", "anthropic", "claude", "gemini", "bard", "copilot",
  "chatgpt", "bing-ai", "perplexity", "cohere", "llama", "mistral",
  "huggingface", "scrapy", "python-requests", "httpx", "aiohttp",
  "wget", "libwww", "lwp-", "jakarta", "python-urllib",
  "bot", "crawler", "spider", "scraper", "headless", "phantom",
  "slurp", "mediapartners", "facebookexternalhit",
];

function isBlockedUserAgent(req: NextRequest): boolean {
  const ua = (req.headers.get("user-agent") ?? "").toLowerCase();
  if (!ua) return true; // No UA = likely a script
  return BLOCKED_UA_PATTERNS.some((p) => ua.includes(p));
}

// ─── Security headers ─────────────────────────────────────────────────────────
function applySecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; ")
  );
}

// ─── JWT verification ─────────────────────────────────────────────────────────
async function verifySession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

// ─── Main proxy ───────────────────────────────────────────────────────────────
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isLoginPost = pathname === "/login" && method === "POST";

  // 1 — Block bots and AI agents from all admin routes
  if (isAdminRoute && isBlockedUserAgent(request)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // 2 — Rate-limit login POST attempts per IP
  if (isLoginPost) {
    const ip = getClientIP(request);
    const { allowed, retryAfterSec } = checkRateLimit(ip);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          error: `Demasiados intentos. Espera ${Math.ceil(retryAfterSec / 60)} min.`,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfterSec),
          },
        }
      );
    }
  }

  // 3 — Verify session JWT
  const session = await verifySession(request);

  // 4 — Guard: unauthenticated → /login
  if (isAdminRoute && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    const redirect = NextResponse.redirect(url);
    // Clear potentially stale cookie
    redirect.cookies.delete(SESSION_COOKIE);
    return redirect;
  }

  // 5 — Already logged in → skip /login
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // 6 — Allow — apply security headers
  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icon|apple-icon|robots.txt|sitemap.xml|videos/|projects/).*)",
  ],
};
