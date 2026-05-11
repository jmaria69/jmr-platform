import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "jmr_session";

const ADMIN_ROUTES = ["/admin"];
const PUBLIC_ROUTES = ["/login"];

/**
 * Proxy — runs on every matched route (Next.js 16 convention)
 *
 * - Security headers on all responses
 * - JWT session verification for /admin/* routes
 * - Redirects unauthenticated users to /login
 * - Redirects authenticated users away from /login
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ─── Security headers ───
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // ─── API rate limiting headers ───
  if (pathname.startsWith("/api")) {
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", "99");
  }

  // ─── Auth check ───
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  // Verify session
  const session = await verifySession(request);

  // Redirect unauthenticated users away from admin
  if (isAdminRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from login page
  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return response;
}

/**
 * Verify JWT from cookie — edge-compatible via jose
 */
async function verifySession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;

  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;

  try {
    const key = new TextEncoder().encode(secret);
    await jwtVerify(token, key);
    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|projects/|placeholder).*)",
  ],
};
