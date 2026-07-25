"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Activity, Gauge, Database, Zap, Users, TrendingUp, CircleCheck, CircleX, Server } from "lucide-react";
import type { DashboardSnapshot, ServiceSnapshot } from "@/lib/coreops-metrics";
import type { HistoryPoint } from "@/lib/metrics-history";

interface Props {
  initialDashboard: DashboardSnapshot | null;
  initialHistory: HistoryPoint[];
}

const REFRESH_MS = 5000;
const LINE_COLORS = ["oklch(0.7 0.18 275)", "oklch(0.72 0.19 145)", "oklch(0.78 0.16 60)", "oklch(0.68 0.2 25)"];

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function ServiceCard({ svc }: { svc: ServiceSnapshot }) {
  const m = svc.internal;
  return (
    <div className="rounded-2xl glass border-gradient p-5 glow-hover transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-purple-300" />
          <span className="font-semibold text-purple-100">{svc.name}</span>
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${svc.reachable ? "text-green-400" : "text-red-400"}`}>
          {svc.reachable ? <CircleCheck className="h-3.5 w-3.5" /> : <CircleX className="h-3.5 w-3.5" />}
          {svc.reachable ? "Online" : "Offline"}
          {svc.latencyMs != null && <span className="text-muted-foreground ml-1">{svc.latencyMs} ms</span>}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Metric icon={<Activity className="h-3.5 w-3.5" />} label="Throughput" value={m ? `${m.rps}` : "—"} sub="req/s" />
        <Metric icon={<Gauge className="h-3.5 w-3.5" />} label="Lat. p95" value={m ? `${m.latencyP95} ms` : "—"} sub={m ? `p99 ${m.latencyP99}` : "sin métricas"} tone={m && m.latencyP95 > 300 ? "amber" : "purple"} />
        <Metric icon={<Database className="h-3.5 w-3.5" />} label="Hit ratio" value={m?.hasCache ? `${(m.cacheHitRatio * 100).toFixed(1)}%` : "n/a"} sub={m?.hasCache ? m.cacheBackend : "sin caché"} tone="green" />
        <Metric icon={<Zap className="h-3.5 w-3.5" />} label="Error rate" value={m ? `${(m.errorRate * 100).toFixed(2)}%` : "—"} tone={m && m.errorRate > 0.01 ? "red" : "green"} />
      </div>
    </div>
  );
}

function Metric({ icon, label, value, sub, tone = "purple" }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; tone?: "purple" | "green" | "red" | "amber";
}) {
  const toneClass = { purple: "text-purple-300", green: "text-green-400", red: "text-red-400", amber: "text-amber-400" }[tone];
  return (
    <div>
      <div className="flex items-center gap-1 text-muted-foreground text-[11px] mb-1">
        <span className={toneClass}>{icon}</span>{label}
      </div>
      <div className={`text-lg font-semibold ${toneClass}`}>{value}</div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function CrmTile({ icon, label, value, tone = "purple" }: { icon: React.ReactNode; label: string; value: string; tone?: "purple" | "green" | "amber" }) {
  const toneClass = { purple: "text-purple-300", green: "text-green-400", amber: "text-amber-400" }[tone];
  return (
    <div className="rounded-2xl glass border-gradient p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2"><span className={toneClass}>{icon}</span>{label}</div>
      <div className={`text-2xl font-semibold ${toneClass}`}>{value}</div>
    </div>
  );
}

export function ScalabilityPanel({ initialDashboard, initialHistory }: Props) {
  const [dash, setDash] = useState<DashboardSnapshot | null>(initialDashboard);
  const [history, setHistory] = useState<HistoryPoint[]>(initialHistory);
  const [live, setLive] = useState(true);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await fetch("/api/metrics/scalability", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (cancelled) return;
        if (json.data?.dashboard) setDash(json.data.dashboard as DashboardSnapshot);
        if (Array.isArray(json.data?.history)) setHistory(json.data.history as HistoryPoint[]);
      } catch {
        /* red intermitente: reintenta en el siguiente tick */
      }
    };
    const id = setInterval(tick, REFRESH_MS);
    return () => { cancelled = true; clearInterval(id); };
  }, [live]);

  const services = dash?.services ?? [];
  const crm = dash?.crm;

  const chartData = history.map((p) => {
    const row: Record<string, number | string | null> = { label: fmtTime(p.ts) };
    for (const [id, v] of Object.entries(p.services)) row[id] = v.latencyMs;
    return row;
  });
  const chartConfig: ChartConfig = Object.fromEntries(
    services.map((s, i) => [s.id, { label: s.name, color: LINE_COLORS[i % LINE_COLORS.length] }])
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-purple-100">Escalabilidad — servicios</h2>
          <p className="text-sm text-muted-foreground">
            {services.length} servicio{services.length === 1 ? "" : "s"} · actualizado {dash ? fmtTime(dash.ts) : "—"}
          </p>
        </div>
        <button
          onClick={() => setLive((v) => !v)}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-2 ${
            live ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-slate-700/40 text-muted-foreground border border-slate-600/40"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${live ? "bg-green-400 animate-pulse" : "bg-slate-500"}`} />
          {live ? "En vivo" : "Pausado"}
        </button>
      </div>

      {/* Una tarjeta por servicio */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {services.length === 0 ? (
          <div className="rounded-2xl glass border-gradient p-6 text-muted-foreground">Sin servicios monitorizados</div>
        ) : (
          services.map((svc) => <ServiceCard key={svc.id} svc={svc} />)
        )}
      </div>

      {/* CRM real (Prisma) */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">CRM (datos reales)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <CrmTile icon={<Users className="h-4 w-4" />} label="Contactos" value={crm ? `${crm.totalContacts}` : "—"} />
          <CrmTile icon={<TrendingUp className="h-4 w-4" />} label="Pipeline" value={crm ? `${crm.pipelineValue.toLocaleString("es-ES")} €` : "—"} tone="amber" />
          <CrmTile icon={<CircleCheck className="h-4 w-4" />} label="Deals ganados" value={crm ? `${crm.wonDeals}` : "—"} tone="green" />
          <CrmTile icon={<Gauge className="h-4 w-4" />} label="Conversión" value={crm ? `${crm.conversionRate}%` : "—"} />
          <CrmTile icon={<Activity className="h-4 w-4" />} label="Campañas" value={crm ? `${crm.campaigns}` : "—"} />
        </div>
      </div>

      {/* Histórico de latencia por servicio */}
      <div className="rounded-2xl glass border-gradient p-6">
        <h3 className="text-lg font-semibold mb-1">Latencia por servicio</h3>
        <p className="text-sm text-muted-foreground mb-4">Round-trip medido desde el panel</p>
        {chartData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-muted-foreground">Aún sin muestras</div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <LineChart data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={40} />
              <YAxis tickLine={false} axisLine={false} width={44} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {services.map((s) => (
                <Line key={s.id} dataKey={s.id} name={s.name} type="monotone" stroke={`var(--color-${s.id})`} dot={false} strokeWidth={2} connectNulls />
              ))}
            </LineChart>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
