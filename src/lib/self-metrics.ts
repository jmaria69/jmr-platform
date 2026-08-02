/**
 * Auto-métricas de tráfico de esta misma app (Praxia Labs Web), para el panel
 * de escalabilidad. Solo cuenta peticiones a /api/* (ventana móvil en memoria,
 * igual que CORE OPS/VERA) — registradas desde proxy.ts.
 *
 * No mide latencia real: el middleware de Next.js no tiene visibilidad del
 * response final del route handler (no es un modelo request/response como
 * Flask/FastAPI), así que solo se reporta lo que sí se puede medir con
 * honestidad — el conteo de peticiones — y se deja la latencia como "sin
 * medir" en vez de inventar un número.
 */

const WINDOW_MS = 60_000;

// globalThis (no una variable de módulo): Next.js/Turbopack puede instanciar
// este módulo por separado para el Proxy y para los route handlers aunque
// compartan proceso Node.js; globalThis sí es el mismo objeto en todo el
// proceso (mismo patrón que usa Prisma para evitar clientes duplicados
// entre recargas de Next.js en dev).
const store = globalThis as unknown as { __praxiaApiHits?: number[] };
if (!store.__praxiaApiHits) store.__praxiaApiHits = [];

export function recordApiHit(): void {
  const hits = store.__praxiaApiHits!;
  const now = Date.now();
  hits.push(now);
  const cutoff = now - WINDOW_MS;
  while (hits.length && hits[0] < cutoff) hits.shift();
}

export function selfTrafficSnapshot(): { rps: number; latency_ms: null; error_rate: null } {
  const cutoff = Date.now() - WINDOW_MS;
  const recent = store.__praxiaApiHits!.filter((t) => t >= cutoff).length;
  return {
    rps: Math.round((recent / (WINDOW_MS / 1000)) * 100) / 100,
    latency_ms: null,
    error_rate: null,
  };
}
