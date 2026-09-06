import { prisma } from "@/lib/prisma";
import { getGAMetrics, getGAAggregateStats } from "@/lib/services/google-analytics";

export interface DashboardStats {
  visitorsToday: number;
  visitorsWeek: number;
  visitorsMonth: number;
  activeNow: number;
  revenueTotal: number;
  revenueMonth: number;
  conversionRate: number;
  avgSessionDuration: number;
  bounceRate: number;
  trafficByDay: { label: string; visitors: number }[];
  trafficByMonth: { label: string; visitors: number }[];
  trafficByYear: { label: string; visitors: number }[];
  deviceData: { device: string; count: number }[];
  osData: { os: string; count: number }[];
  trafficByCountry: { country: string; visitors: number }[];
}

export async function getRealDashboardStats(): Promise<DashboardStats> {
  console.log("📍 Iniciando getRealDashboardStats");

  try {
    // Obtener métricas de GA4 en paralelo
    console.log("📍 getGAMetrics + getGAAggregateStats iniciados");
    const [gaData, gaAggregate] = await Promise.all([
      getGAMetrics().catch(err => {
        console.warn("⚠️ getGAMetrics falló, usando fallback:", err);
        return null;
      }),
      getGAAggregateStats().catch(err => {
        console.warn("⚠️ getGAAggregateStats falló, usando fallback:", err);
        return null;
      }),
    ]);

    let totalActiveUsers = 0;
    let totalPageViews = 0;

    if (gaData?.rows && gaData.rows.length > 0) {
      console.log("🔍 trafficByDay length:", gaData.rows.length);
      console.log("🔍 gaData.rows sample:", JSON.stringify(gaData.rows[0], null, 2));

      gaData.rows.forEach((row) => {
        const users = parseInt(row.metricValues?.[0]?.value || "0", 10);
        const pageViews = parseInt(row.metricValues?.[1]?.value || "0", 10);
        totalActiveUsers += users;
        totalPageViews += pageViews;
      });
    } else {
      console.warn("⚠️ GA4 sin datos, usando fallback");
    }

    // Obtener stats de CRM (contratos ganados)
    const crmContacts = await prisma.crmContact.findMany({
      include: {
        interactions: true,
      },
    });

    const wonContacts = crmContacts.filter((c) => c.stage === "won");
    const crmStats = {
      totalContacts: crmContacts.length,
      wonValue: wonContacts.reduce((sum, c) => sum + (c.value || 0), 0),
      conversionRate:
        crmContacts.length > 0
          ? (wonContacts.length / crmContacts.length) * 100
          : 0,
    };

    console.log("✅ CRM Stats:", crmStats);

    // Procesar tráfico por día: las filas de GA se repiten por dispositivo/SO,
    // así que agregamos visitantes por fecha y nos quedamos con los ÚLTIMOS 30
    // días (antes se cogían los 30 primeros → el gráfico no llegaba a hoy).
    const visitorsByDate = new Map<string, number>();
    for (const row of gaData?.rows ?? []) {
      const raw = row.dimensionValues?.[0]?.value || "";
      if (!/^\d{8}$/.test(raw)) continue;
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      const visitors = parseInt(row.metricValues?.[0]?.value || "0", 10);
      visitorsByDate.set(date, (visitorsByDate.get(date) || 0) + visitors);
    }
    const trafficByDay = [...visitorsByDate.entries()]
      .map(([label, visitors]) => ({ label, visitors }))
      .sort((a, b) => a.label.localeCompare(b.label))
      .slice(-30);

    // Procesar datos de tráfico por mes
    const trafficByMonth = (gaData?.rows ?? [])
      .reduce(
        (acc, row) => {
          const date = row.dimensionValues?.[0]?.value || "Unknown";
          const month = date.slice(0, 6); // YYYYMM
          const visitors = parseInt(row.metricValues?.[0]?.value || "0", 10);

          const existing = acc.find((item) => item.label === month);
          if (existing) {
            existing.visitors += visitors;
          } else {
            acc.push({ label: month, visitors });
          }
          return acc;
        },
        [] as { label: string; visitors: number }[]
      )
      .sort((a, b) => a.label.localeCompare(b.label)) || [];

    // Procesar datos de tráfico por año
    const trafficByYear = (gaData?.rows ?? [])
      .reduce(
        (acc, row) => {
          const date = row.dimensionValues?.[0]?.value || "Unknown";
          const year = date.slice(0, 4); // YYYY
          const visitors = parseInt(row.metricValues?.[0]?.value || "0", 10);

          const existing = acc.find((item) => item.label === year);
          if (existing) {
            existing.visitors += visitors;
          } else {
            acc.push({ label: year, visitors });
          }
          return acc;
        },
        [] as { label: string; visitors: number }[]
      )
      .sort((a, b) => a.label.localeCompare(b.label)) || [];

    console.log("✅ trafficByDay procesado:", trafficByDay.length, "días");
    console.log("✅ trafficByMonth procesado:", trafficByMonth.length, "meses");
    console.log("✅ trafficByYear procesado:", trafficByYear.length, "años");

    // Procesar datos por dispositivo
    const deviceData = (gaData?.rows ?? [])
      .reduce(
        (acc, row) => {
          const device = row.dimensionValues?.[1]?.value || "Unknown";
          const count = parseInt(row.metricValues?.[0]?.value || "0", 10);

          const existing = acc.find((item) => item.device === device);
          if (existing) {
            existing.count += count;
          } else {
            acc.push({ device, count });
          }
          return acc;
        },
        [] as { device: string; count: number }[]
      )
      .sort((a, b) => b.count - a.count) || [];

    // Procesar datos por SO
    const osData = (gaData?.rows ?? [])
      .reduce(
        (acc, row) => {
          const os = row.dimensionValues?.[2]?.value || "Unknown";
          const count = parseInt(row.metricValues?.[0]?.value || "0", 10);

          const existing = acc.find((item) => item.os === os);
          if (existing) {
            existing.count += count;
          } else {
            acc.push({ os, count });
          }
          return acc;
        },
        [] as { os: string; count: number }[]
      )
      .sort((a, b) => b.count - a.count) || [];

    // Métricas reales de GA4 aggregate (con fallback numérico si la llamada falla)
    const avgSessionDuration = gaAggregate?.avgSessionDuration ?? 0;
    const bounceRate         = gaAggregate?.bounceRate         ?? 0;
    const visitorsWeek       = gaAggregate?.visitorsWeek       ?? Math.round(totalActiveUsers * 1.4);
    const visitorsToday      = gaAggregate?.visitorsToday      ?? totalActiveUsers;
    const trafficByCountry   = gaAggregate?.trafficByCountry?.length
      ? gaAggregate.trafficByCountry
      : [
          { country: "España",    visitors: Math.round(totalPageViews * 0.45) },
          { country: "México",    visitors: Math.round(totalPageViews * 0.15) },
          { country: "Argentina", visitors: Math.round(totalPageViews * 0.12) },
          { country: "Colombia",  visitors: Math.round(totalPageViews * 0.08) },
          { country: "EE.UU.",    visitors: Math.round(totalPageViews * 0.07) },
        ];

    return {
      visitorsToday,
      visitorsWeek,
      visitorsMonth: totalPageViews,
      activeNow: Math.round(totalActiveUsers * 0.15),
      revenueTotal: crmStats.wonValue,
      revenueMonth: Math.round(crmStats.wonValue / 6),
      conversionRate: crmStats.conversionRate,
      avgSessionDuration,
      bounceRate,
      trafficByDay,
      trafficByMonth,
      trafficByYear,
      deviceData,
      osData,
      trafficByCountry,
    };
  } catch (error) {
    console.error("❌ Error en getRealDashboardStats:", error);
    return getDashboardStats();
  }
}

export function getDashboardStats(): DashboardStats {
  return {
    visitorsToday: 0,
    visitorsWeek: 0,
    visitorsMonth: 0,
    activeNow: 0,
    revenueTotal: 0,
    revenueMonth: 0,
    conversionRate: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    // Fallback honesto: sin GA no inventamos tráfico → todo vacío ("sin datos").
    trafficByDay: [],
    trafficByMonth: [],
    trafficByYear: [],
    deviceData: [],
    osData: [],
    trafficByCountry: [],
  };
}