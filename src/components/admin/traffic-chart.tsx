"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface TrafficChartProps {
  data: { hour: string; visitors: number }[];
}

const chartConfig = {
  visitors: {
    label: "Visitantes",
    color: "oklch(0.7 0.18 275)",
  },
} satisfies ChartConfig;

export function TrafficChart({ data }: TrafficChartProps) {
  return (
    <div className="rounded-2xl glass border-gradient p-6 glow-hover transition-all">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Tráfico por Hora</h3>
        <p className="text-sm text-muted-foreground">Visitantes en las últimas 24 horas</p>
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
            dataKey="hour"
            tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }}
            interval={2}
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
