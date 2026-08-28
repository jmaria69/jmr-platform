import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { checkRateLimit, isMaliciousBot, logThreatAwait } from "@/lib/security-logger";
import { recordApiHit, selfTrafficSnapshot } from "@/lib/self-metrics";
import { prefersMarkdown, withMarkdownVary } from "@/lib/markdown-negotiation";

// Primeros segmentos de ruta que resuelven a una página o handler real.
// Cualquier otro segmento de primer nivel es, por definición, un 404 — se
// usa para decidir si una petición que prefiere markdown debe reescribirse
// a /md-404 en vez de dejar pasar el HTML normal (ver bloque 1c).
const KNOWN_TOP_SEGMENTS = new Set([
  "acerca-de", "adminapp", "contacto", "core-ops", "laboratorio",
  "precios", "proyectos", "siam",
  "admin", "api", "c", "demo", "login", "md-home", "md-404",
  "apple-icon", "opengraph-image",
]);

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

  // ─── 1b. Home: negociación de Accept (texto/markdown para agentes) ───
  // https://acceptmarkdown.com — el Vary se añade siempre (también cuando
  // se sirve el HTML normal) para que la CDN no mezcle las dos variantes.
  if (pathname === "/") {
    const accept = request.headers.get("accept");
    const res = prefersMarkdown(accept)
      ? NextResponse.rewrite(new URL("/md-home", request.url))
      : NextResponse.next();
    res.headers.set("Vary", withMarkdownVary(res.headers.get("Vary")));
    return res;
  }

  // ─── 1c. 404 de primer nivel: mismo trato markdown que la home ───
  // Solo mira el primer segmento — un 404 anidado bajo una ruta real
  // (p.ej. /proyectos/no-existe) sigue devolviendo el 404 HTML normal.
  const firstSegment = pathname.split("/")[1] || "";
  if (firstSegment && !KNOWN_TOP_SEGMENTS.has(firstSegment)) {
    const accept = request.headers.get("accept");
    if (prefersMarkdown(accept)) {
      const res = NextResponse.rewrite(new URL("/md-404", request.url));
      res.headers.set("Vary", withMarkdownVary(res.headers.get("Vary")));
      return res;
    }
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
  // Todo excepto los internos de Next y ficheros estáticos (cualquier
  // segmento final con extensión: .ico, .xml, .txt, .svg, .js...), para que
  // el bloque 1c pueda detectar rutas de primer nivel desconocidas.
  matcher: ["/((?!_next/static|_next/image|.*\\.[^/]+$).*)"],
};
