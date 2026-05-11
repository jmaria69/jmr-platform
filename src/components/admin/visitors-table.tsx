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
import { Visitor } from "@/types";
import { generateVisitors } from "@/lib/mock-data";

const deviceIcon = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

export function VisitorsTable() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  useEffect(() => {
    setVisitors(generateVisitors(20));
    const interval = setInterval(() => {
      setVisitors((prev) => {
        const newVisitor = generateVisitors(1)[0];
        return [newVisitor, ...prev.slice(0, 29)];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl glass border-gradient p-6 glow-hover transition-all">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Visitantes en Tiempo Real</h3>
          <p className="text-sm text-muted-foreground">Actualización cada 5 segundos</p>
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
              <TableHead className="text-muted-foreground">Página</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground">Origen</TableHead>
              <TableHead className="hidden lg:table-cell text-muted-foreground">OS</TableHead>
              <TableHead className="text-right text-muted-foreground">Duración</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                  <TableCell>
                    <code className="text-xs bg-white/5 px-2 py-0.5 rounded-md border border-white/5 font-mono">
                      {v.page}
                    </code>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs bg-white/5 border-white/10">
                      {v.referrer}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{v.os}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-xs font-mono text-muted-foreground">
                      {Math.floor(v.duration / 60)}:{(v.duration % 60).toString().padStart(2, "0")}
                    </span>
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
