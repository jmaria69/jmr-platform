import type { Metadata } from "next";
import { StatsCards } from "@/components/admin/stats-cards";
import { TrafficChart } from "@/components/admin/traffic-chart";
import { VisitorsTable } from "@/components/admin/visitors-table";
import { DeviceChart } from "@/components/admin/device-chart";
import { getDashboardStats } from "@/lib/repositories/dashboard.repository";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitorización en tiempo real de tu plataforma.
        </p>
      </div>

      <StatsCards stats={stats} />
      <TrafficChart data={stats.trafficByHour} />
      <DeviceChart
        deviceData={stats.deviceBreakdown}
        osData={stats.osBreakdown}
      />
      <VisitorsTable />
    </div>
  );
}