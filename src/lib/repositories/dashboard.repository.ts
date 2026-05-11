/**
 * Dashboard Repository — Aggregated Stats
 *
 * Merges real data from the database (project metrics, CRM pipeline)
 * with simulated traffic analytics (no real analytics backend yet).
 */

import { DashboardStats } from "@/types";
import { findAllProjects } from "./projects.repository";
import { getCRMStats } from "./crm.repository";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [projects, crmStats] = await Promise.all([
    findAllProjects(),
    getCRMStats(),
  ]);

  // ─── Real data from DB ───
  const revenueMonth = projects.reduce(
    (sum, p) => sum + (p.metrics?.revenue ?? 0),
    0
  );
  const totalUsers = projects.reduce(
    (sum, p) => sum + (p.metrics?.users ?? 0),
    0
  );

  // Estimate total revenue as ~6x monthly (simulating ~6 months of history)
  const revenueTotal = revenueMonth * 6;

  // Top projects sorted by metrics.users descending, with estimated visits
  const topProjects = projects
    .filter((p) => p.metrics?.users)
    .sort((a, b) => (b.metrics?.users ?? 0) - (a.metrics?.users ?? 0))
    .map((p) => ({
      name: p.name,
      visits: Math.round((p.metrics?.users ?? 0) * 3.2),
    }));

  // CRM conversion rate from real deal data
  const conversionRate = Math.round(crmStats.conversionRate * 10) / 10;

  // ─── Simulated traffic data ───
  // These would come from Google Analytics / Plausible in a real setup
  const visitorsMonth = Math.round(totalUsers * 4.5);
  const visitorsWeek = Math.round(visitorsMonth / 4.2);
  const visitorsToday = Math.round(visitorsWeek / 7) + randomInt(-20, 20);
  const activeNow = Math.max(3, Math.round(visitorsToday * 0.04));

  const trafficByHour = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, "0")}:00`,
    visitors:
      Math.floor(seededRandom(i) * 80) + (i >= 9 && i <= 20 ? 60 : 10),
  }));

  const deviceBreakdown = [
    { device: "Desktop", count: Math.round(visitorsMonth * 0.545) },
    { device: "Mobile", count: Math.round(visitorsMonth * 0.367) },
    { device: "Tablet", count: Math.round(visitorsMonth * 0.088) },
  ];

  const osBreakdown = [
    { os: "Windows", count: Math.round(visitorsMonth * 0.39) },
    { os: "macOS", count: Math.round(visitorsMonth * 0.222) },
    { os: "Android", count: Math.round(visitorsMonth * 0.201) },
    { os: "iOS", count: Math.round(visitorsMonth * 0.167) },
    { os: "Linux", count: Math.round(visitorsMonth * 0.02) },
  ];

  const trafficByCountry = [
    { country: "España", visitors: Math.round(visitorsMonth * 0.423) },
    { country: "México", visitors: Math.round(visitorsMonth * 0.192) },
    { country: "Argentina", visitors: Math.round(visitorsMonth * 0.118) },
    { country: "Colombia", visitors: Math.round(visitorsMonth * 0.095) },
    { country: "Chile", visitors: Math.round(visitorsMonth * 0.067) },
    { country: "USA", visitors: Math.round(visitorsMonth * 0.063) },
    { country: "Otros", visitors: Math.round(visitorsMonth * 0.042) },
  ];

  return {
    visitorsToday,
    visitorsWeek,
    visitorsMonth,
    activeNow,
    topProjects,
    deviceBreakdown,
    osBreakdown,
    revenueTotal,
    revenueMonth,
    conversionRate,
    avgSessionDuration: 245,
    bounceRate: 34.2,
    trafficByHour,
    trafficByCountry,
  };
}

// ─── Helpers ───

/** Deterministic pseudo-random for consistent traffic chart per hour */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/** Bounded random integer (server-safe for slight variation) */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
