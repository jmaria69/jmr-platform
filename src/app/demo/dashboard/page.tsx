import type { Metadata } from "next";
import { getDashboardStats } from "@/lib/repositories/dashboard.repository";
import { StatsCards } from "@/components/admin/stats-cards";
import { TrafficChart } from "@/components/admin/traffic-chart";
import { VisitorsTable } from "@/components/admin/visitors-table";
import { DeviceChart } from "@/components/admin/device-chart";
import { AnalyticsAnalysis } from "@/components/admin/analytics-analysis";

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
            <TrafficChart data={stats.trafficByHour} />
            <DeviceChart
                deviceData={stats.deviceBreakdown}
                osData={stats.osBreakdown}
            />
            <VisitorsTable />
            <AnalyticsAnalysis />
        </div>
    );
}
