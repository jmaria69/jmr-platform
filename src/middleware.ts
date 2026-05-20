/**
 * Next.js Middleware — Edge-level security gate
 *
 * Protects all /admin/** routes with JWT verification.
 * Runs before ANY rendering — bots, crawlers and AI agents
 * are blocked at the edge before reaching any server code.
 */

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "jmr_session";
const LOGIN_PATH = "/login";
const ADMIN_PREFIX = "/admin";

// ─── Rate limiting store (edge-memory, per instance) ──────────────────────────
// For multi-region production: replace with Upstash Redis
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `rl:${ip}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now > record.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1, resetAt: now + WINDOW_MS };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  record.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - record.count, resetAt: record.resetAt };
}

// ─── JWT verification ─────────────────────────────────────────────────────────

async function verifySession(token: string): Promise<boolean> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

// ─── Security headers ─────────────────────────────────────────────────────────

function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self';"
  );
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  return response;
}

// ─── Bot / AI agent detection ─────────────────────────────────────────────────

const BLOCKED_AGENTS = [
  "gpt", "openai", "anthropic", "claude", "gemini", "bard", "copilot",
  "chatgpt", "bing-ai", "perplexity", "you.com", "cohere", "llama",
  "mistral", "huggingface", "scrapy", "python-requests", "httpx",
  "aiohttp", "wget", "curl", "axios", "node-fetch", "go-http",
  "java/", "libwww", "lwp-", "jakarta", "python-urllib",
  "bot", "crawler", "spider", "scraper", "headless",
];

function isBlockedAgent(req: NextRequest): boolean {
  const ua = (req.headers.get("user-agent") ?? "").toLowerCase();
  return BLOCKED_AGENTS.some((pattern) => ua.includes(pattern));
}

// ─── Main middleware ───────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isLoginPage = pathname === LOGIN_PATH;
  const isLoginPost = isLoginPage && req.method === "POST";

  // --- Block bots/AI on admin routes ---
  if (isAdminRoute && isBlockedAgent(req)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // --- Rate-limit login attempts ---
  if (isLoginPost) {
    const key = getRateLimitKey(req);
    const { allowed, remaining, resetAt } = checkRateLimit(key);

    if (!allowed) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      return new NextResponse(
        JSON.stringify({
          error: `Demasiados intentos. Espera ${Math.ceil(retryAfter / 60)} minutos.`,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(retryAfter),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return addSecurityHeaders(response);
  }

  // --- Protect admin routes ---
  if (isAdminRoute) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      const loginUrl = new URL(LOGIN_PATH, req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const valid = await verifySession(token);
    if (!valid) {
      // Token expired or tampered — clear cookie and redirect
      const loginUrl = new URL(LOGIN_PATH, req.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(SESSION_COOKIE);
      return response;
    }

    // Session valid — add security headers and proceed
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // --- Public routes — add security headers only ---
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon, icons, public assets
     * - API routes that handle their own auth
     */
    "/((?!_next/static|_next/image|favicon|icon|apple-icon|robots.txt|sitemap.xml|videos/|projects/).*)",
  ],
};
