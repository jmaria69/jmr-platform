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
    // No expone métricas internas, pero su healthPath es un chivato de la
    // cadena entera: /api/backend/status es el proxy de Next reenviando al
    // backend VERA por el túnel Cloudflare con el token compartido. Solo da
    // 200 si funcionan Vercel + proxy + túnel + backend + token; si el túnel
    // o el backend local caen, responde 502 y el panel lo marca caído.
    id: "adminapp",
    name: "AdminApp · VERA",
    url: strip(process.env.ADMINAPP_URL || "https://adminapp.praxialabs.com"),
    metricsPath: "",
    healthPath: "/api/backend/status",
  },
];
