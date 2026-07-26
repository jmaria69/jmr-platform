"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RealtimeVisitor {
  id: string;
  device: "mobile" | "tablet" | "desktop";
  country: string;
  city: string;
  page: string;
  activeUsers: number;
}

const deviceIcon = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

const REFRESH_MS = 5000;

export function VisitorsTable() {
  const [visitors, setVisitors] = useState<RealtimeVisitor[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch("/api/visitors", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        if (alive) setVisitors(Array.isArray(json.data) ? json.data : []);
      } catch {
        // Mantener el último estado si falla una petición puntual.
      } finally {
        if (alive) setLoaded(true);
      }
    };

    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  const totalActive = visitors.reduce((sum, v) => sum + v.activeUsers, 0);

  return (
    <div className="rounded-2xl glass border-gradient p-6 glow-hover transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Visitantes en Tiempo Real</h3>
          <p className="text-sm text-muted-foreground">
            {totalActive} {totalActive === 1 ? "usuario activo" : "usuarios activos"} · actualización cada 5 s
          </p>
        </div>
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <span className="text-xs font-semibold text-emerald-400">En vivo</span>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Dispositivo</TableHead>
              <TableHead className="hidden sm:table-cell text-muted-foreground">País</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground">Ciudad</TableHead>
              <TableHead className="text-muted-foreground">Página</TableHead>
              <TableHead className="text-right text-muted-foreground">Activos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.length === 0 && (
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-12">
                  {loaded
                    ? "Sin visitantes activos ahora mismo."
                    : "Cargando visitantes en tiempo real…"}
                </TableCell>
              </TableRow>
            )}
            {visitors.map((v) => {
              const Icon = deviceIcon[v.device];
              return (
                <TableRow
                  key={v.id}
                  className="border-white/5 animate-in fade-in slide-in-from-top-1 duration-300 hover:bg-white/3"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs capitalize hidden sm:inline">{v.device}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-sm">{v.country}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{v.city}</span>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-white/5 px-2 py-0.5 rounded-md border border-white/5 font-mono">
                      {v.page}
                    </code>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-xs bg-white/5 border-white/10 font-mono">
                      {v.activeUsers}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
