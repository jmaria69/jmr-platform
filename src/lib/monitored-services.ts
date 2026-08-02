/**
 * Servicios monitorizados por el panel de escalabilidad (/admin/escalabilidad).
 *
 * Añadir un proyecto nuevo = añadir una entrada aquí. Cada servicio se sondea
 * desde el panel: si expone un endpoint de métricas (FastAPI con el módulo
 * `metrics.py`), se leen sus métricas internas; si no, se mide solo blackbox
 * (up/down + latencia) contra `healthPath`.
 *
 * Las URLs salen de env vars para poder apuntar a local (métricas completas) o
 * a producción sin tocar código.
 */

export interface MonitoredService {
  id: string;
  name: string;
  url: string;
  /** Endpoint de métricas internas (rps, p95, hit ratio…). "" = solo blackbox. */
  metricsPath: string;
  /** Endpoint barato para medir up/down + latencia si no hay métricas. */
  healthPath: string;
}

const strip = (u: string) => u.replace(/\/$/, "");

export const MONITORED_SERVICES: MonitoredService[] = [
  {
    id: "core-ops",
    name: "CORE OPS",
    url: strip(process.env.CORE_OPS_URL || "https://core-node.praxialabs.com"),
    metricsPath: "/api/metrics/scalability",
    healthPath: "/api/health",
  },
  {
    id: "siam",
    name: "SIAM · SIEM/SOC",
    url: strip(process.env.SIAM_URL || "https://siem.praxialabs.com"),
    metricsPath: "/v1/metrics/scalability",
    healthPath: "/v1/metrics",
  },
  {
    // /api/backend/{status,metrics} es el proxy de Next reenviando al backend
    // VERA (Flask) por el túnel Cloudflare con el token compartido — exento
    // de sesión de usuario a propósito (son sondas de solo lectura, sin datos
    // de residentes/negocio). Solo dan 200 si funcionan Vercel + proxy +
    // túnel + backend + token; si el túnel o el backend caen, 502/401 y el
    // panel lo marca caído. metrics trae rps/latencia reales (ventana móvil
    // en memoria del propio backend); sin capa de caché, así que sin hit ratio.
    id: "adminapp",
    name: "AdminApp · VERA",
    url: strip(process.env.ADMINAPP_URL || "https://adminapp.praxialabs.com"),
    metricsPath: "/api/backend/metrics",
    healthPath: "/api/backend/status",
  },
  {
    // La propia web pública de Praxia Labs (Vercel). /api/metrics/self cuenta
    // peticiones a /api/* desde proxy.ts (rps real); no mide latencia/error
    // rate porque el middleware de Next no ve la respuesta final del route
    // handler (a diferencia de CORE OPS/VERA, que sí miden su propio
    // request/response completo). Fallback a blackbox si ese endpoint falla.
    id: "praxia-web",
    name: "Praxia Labs Web",
    url: strip(process.env.PRAXIA_WEB_URL || "https://praxialabs.com"),
    metricsPath: "/api/metrics/self",
    healthPath: "/api/health",
  },
];
