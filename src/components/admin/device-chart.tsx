"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface DeviceChartProps {
  deviceData: { device: string; count: number }[];
  osData: { os: string; count: number }[];
}

const deviceConfig = {
  count: { label: "Visitantes", color: "oklch(0.7 0.15 195)" },
} satisfies ChartConfig;

const osConfig = {
  count: { label: "Visitantes", color: "oklch(0.7 0.15 155)" },
} satisfies ChartConfig;

export function DeviceChart({ deviceData, osData }: DeviceChartProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-2xl glass border-gradient p-6 glow-hover transition-all">
        <div className="mb-4">
          <h3 className="text-base font-semibold">Por Dispositivo</h3>
          <p className="text-sm text-muted-foreground">Distribución de accesos</p>
        </div>
        <ChartContainer config={deviceConfig} className="h-[200px] w-full">
          <BarChart data={deviceData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="device" type="category" tick={{ fontSize: 12, fill: "oklch(0.8 0 0)" }} width={60} axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ChartContainer>
      </div>

      <div className="rounded-2xl glass border-gradient p-6 glow-hover transition-all">
        <div className="mb-4">
          <h3 className="text-base font-semibold">Por Sistema Operativo</h3>
          <p className="text-sm text-muted-foreground">Windows, macOS, iOS, Android, Linux</p>
        </div>
        <ChartContainer config={osConfig} className="h-[200px] w-full">
          <BarChart data={osData} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" tick={{ fontSize: 11, fill: "oklch(0.6 0 0)" }} axisLine={false} tickLine={false} />
            <YAxis dataKey="os" type="category" tick={{ fontSize: 12, fill: "oklch(0.8 0 0)" }} width={60} axisLine={false} tickLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
