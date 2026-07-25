/**
 * /admin/escalabilidad — Panel de métricas de escalabilidad multi-servicio.
 *
 * Server component: toma la foto inicial (todos los servicios + CRM) y el
 * histórico en el servidor, y los pasa al panel cliente, que hace auto-refresh.
 */

import { getDashboardSnapshot } from "@/lib/coreops-metrics";
import { readHistory } from "@/lib/metrics-history";
import { ScalabilityPanel } from "@/components/admin/scalability-panel";

export const dynamic = "force-dynamic";

export default async function EscalabilidadPage() {
  const [dashboard, history] = await Promise.all([
    getDashboardSnapshot().catch(() => null),
    readHistory().catch(() => []),
  ]);

  return (
    <div className="space-y-6">
      <ScalabilityPanel initialDashboard={dashboard} initialHistory={history} />
    </div>
  );
}
