/**
 * GET /api/metrics/scalability
 *
 * Foto en vivo de escalabilidad de TODOS los servicios monitorizados (blackbox +
 * métricas internas) + datos CRM reales, y registra una muestra en el histórico
 * persistido (throttled). Lo consume el panel /admin/escalabilidad con
 * auto-refresh. Protegido por el middleware de admin.
 */

import { getDashboardSnapshot } from "@/lib/coreops-metrics";
import { recordSample, readHistory } from "@/lib/metrics-history";
import { apiSuccess, apiServerError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dashboard = await getDashboardSnapshot();
    const history = await recordSample(dashboard);
    return apiSuccess({ dashboard, history });
  } catch {
    try {
      const history = await readHistory();
      return apiSuccess({ dashboard: null, history });
    } catch {
      return apiServerError();
    }
  }
}
