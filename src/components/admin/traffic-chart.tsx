"use client";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface TrafficChartProps {
  trafficByDay: { label: string; visitors: number }[];
  trafficByMonth: { label: string; visitors: number }[];
  trafficByYear: { label: string; visitors: number }[];
}

const chartConfig = {
  visitors: {
    label: "Visitantes",
    color: "oklch(0.7 0.18 275)",
  },
} satisfies ChartConfig;

type Period = "day" | "month" | "year";

export function TrafficChart({ trafficByDay, trafficByMonth, trafficByYear }: TrafficChartProps) {
  const [period, setPeriod] = useState<Period>("day");

  const dataMap = {
    day: trafficByDay || [],
    month: trafficByMonth || [],
    year: trafficByYear || [],
  };

  const data = dataMap[period];

  const labels = {
    day: "Últimos 30 días",
    month: "Últimos meses",
    year: "Por año",
  };

  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl glass border-gradient p-6">
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Sin datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl glass border-gradient p-6 glow-hover transition-all">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tráfico</h3>
          <p className="text-sm text-muted-foreground">{labels[period]}</p>
        </div>
        <div className="flex gap-2">
          {(["day", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${period === p
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-slate-800/50 text-gray-400 hover:text-white border border-purple-500/20 hover:border-purple-500/50"
                }`}
            >
              {p === "day" ? "Día" : p === "month" ? "Mes" : "Año"}
            </button>
          ))}
        </div>
      </div>
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.7 0.18 275)" stopOpacity={0.4} />
              <stop offset="50%" stopColor="oklch(0.6 0.15 195)" stopOpacity={0.1} />
              <stop offset="95%" stopColor="oklch(0.7 0.18 275)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 5%)" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
            interval={Math.max(0, Math.floor(data.length / 6))}
            axisLine={{ stroke: "oklch(1 0 0 / 5%)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
            width={35}
            axisLine={{ stroke: "oklch(1 0 0 / 5%)" }}
            tickLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="visitors"
            stroke="oklch(0.7 0.18 275)"
            fill="url(#colorVisitors)"
            strokeWidth={2.5}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}