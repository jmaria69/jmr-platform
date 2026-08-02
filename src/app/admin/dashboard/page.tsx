import type { Metadata } from "next";
import { getRealDashboardStats } from "@/lib/repositories/dashboard.repository";
import { StatsCards } from "@/components/admin/stats-cards";
import { TrafficChart } from "@/components/admin/traffic-chart";
import { VisitorsTable } from "@/components/admin/visitors-table";
import { DeviceChart } from "@/components/admin/device-chart";
import { AnalyticsAnalysis } from "@/components/admin/analytics-analysis";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const stats = await getRealDashboardStats();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Monitorización en tiempo real de tu plataforma.
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

export const metadata: Metadata = {
    title: "Dashboard",
};