"use client";

import { Users, Eye, TrendingUp, DollarSign, Clock, Activity, MousePointerClick } from "lucide-react";
import type { DashboardStats } from "@/lib/repositories/dashboard.repository";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Visitantes Hoy",
      value: stats.visitorsToday.toLocaleString("es"),
      change: null,
      icon: Eye,
      gradient: "from-blue-500/20 to-blue-600/5",
      iconColor: "text-blue-400",
      glow: "bg-blue-500/20",
    },
    {
      title: "Activos Ahora",
      value: stats.activeNow.toString(),
      change: "en vivo",
      icon: Activity,
      gradient: "from-emerald-500/20 to-emerald-600/5",
      iconColor: "text-emerald-400",
      glow: "bg-emerald-500/20",
      pulse: true,
    },
    {
      title: "Ingresos Mes",
      value: `${stats.revenueMonth.toLocaleString("es")}€`,
      change: null,
      icon: DollarSign,
      gradient: "from-green-500/20 to-green-600/5",
      iconColor: "text-green-400",
      glow: "bg-green-500/20",
    },
    {
      title: "Conversión",
      value: `${stats.conversionRate}%`,
      change: null,
      icon: TrendingUp,
      gradient: "from-purple-500/20 to-purple-600/5",
      iconColor: "text-purple-400",
      glow: "bg-purple-500/20",
    },
    {
      title: "Visitantes Mes",
      value: stats.visitorsMonth.toLocaleString("es"),
      change: null,
      icon: Users,
      gradient: "from-cyan-500/20 to-cyan-600/5",
      iconColor: "text-cyan-400",
      glow: "bg-cyan-500/20",
    },
    {
      title: "Sesión Media",
      value: stats.avgSessionDuration > 0
        ? `${Math.floor(stats.avgSessionDuration / 60)}m ${stats.avgSessionDuration % 60}s`
        : "—",
      change: null,
      icon: Clock,
      gradient: "from-amber-500/20 to-amber-600/5",
      iconColor: "text-amber-400",
      glow: "bg-amber-500/20",
    },
    {
      title: "Rebote",
      value: stats.bounceRate > 0 ? `${stats.bounceRate}%` : "—",
      change: null,
      icon: MousePointerClick,
      gradient: "from-red-500/20 to-red-600/5",
      iconColor: "text-red-400",
      glow: "bg-red-500/20",
    },
    {
      title: "Ingresos Total",
      value: `${stats.revenueTotal.toLocaleString("es")}€`,
      change: "acumulado",
      icon: DollarSign,
      gradient: "from-yellow-500/20 to-yellow-600/5",
      iconColor: "text-yellow-400",
      glow: "bg-yellow-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
      {cards.map((card) => (
        <div
          key={card.title}
          className="group relative rounded-2xl glass border-gradient overflow-hidden transition-all duration-300 hover:scale-[1.02] glow-hover p-5"
        >
          {/* Background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-50 group-hover:opacity-80 transition-opacity`}
          />

          {/* Content */}
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">
                {card.title}
              </span>
              <div className={`rounded-xl p-2 ${card.glow}`}>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold tracking-tight">{card.value}</p>
              {card.change && (
                <span
                  className={`text-xs font-medium mb-0.5 ${
                    card.pulse
                      ? "text-emerald-400 flex items-center gap-1.5"
                      : card.change.startsWith("-")
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {card.pulse && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                    </span>
                  )}
                  {card.change}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
