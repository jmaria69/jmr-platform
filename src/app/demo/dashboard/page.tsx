import type { Metadata } from "next";
import { getDashboardStats } from "@/lib/repositories/dashboard.repository";
import { StatsCards } from "@/components/admin/stats-cards";
import { TrafficChart } from "@/components/admin/traffic-chart";
import { VisitorsTable } from "@/components/admin/visitors-table";
import { DeviceChart } from "@/components/admin/device-chart";
import { AnalyticsAnalysis } from "@/components/admin/analytics-analysis";

// Consulta la BD (Prisma) en cada request: no prerenderizar en build, donde
// DATABASE_URL no es accesible y Prisma lanza errores de inicializacion.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Demo — Dashboard",
};

export default async function DemoDashboardPage() {
    const stats = await getDashboardStats();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard Demo</h2>
                <p className="text-muted-foreground">
                    Datos de demostración con seed/mock.{" "}
                    <strong>Inicia sesión para ver datos reales.</strong>
                </p>
            </div>

            <StatsCards stats={stats} />
            <TrafficChart
                trafficByDay={stats.trafficByDay}
                trafficByMonth={stats.trafficByMonth}
                trafficByYear={stats.trafficByYear}
            />
            <DeviceChart
                deviceData={stats.deviceData}
                osData={stats.osData}
            />
            <VisitorsTable />
            <AnalyticsAnalysis />
        </div>
    );
}
