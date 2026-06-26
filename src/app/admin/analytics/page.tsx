import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRealDashboardStats } from "@/lib/repositories/dashboard.repository";
import { findAllProjects } from "@/lib/repositories/projects.repository";

export const metadata: Metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const [dashboardStats, projects] = await Promise.all([
    getRealDashboardStats(),
    findAllProjects(),
  ]);

  const totalRevenue = projects.reduce((sum, p) => sum + (p.metrics?.revenue || 0), 0);
  const totalUsers = projects.reduce((sum, p) => sum + (p.metrics?.users || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Analytics & Monetización</h2>
        <p className="text-muted-foreground">
          Datos de rendimiento y oportunidades de monetización.
        </p>
      </div>

      {/* Revenue overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ingresos Totales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {dashboardStats.revenueTotal.toLocaleString("es")}€
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Usuarios Totales</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalUsers.toLocaleString("es")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ingresos/Mes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {totalRevenue.toLocaleString("es")}€
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project performance table */}
      <Card>
        <CardHeader>
          <CardTitle>Rendimiento por Proyecto</CardTitle>
          <CardDescription>Métricas de cada proyecto para análisis de monetización</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Usuarios</TableHead>
                <TableHead className="text-right">Ingresos/mes</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Visitas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="font-medium">{project.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          project.status === "production"
                            ? "text-green-600 border-green-300"
                            : "text-amber-600 border-amber-300"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {project.metrics?.users?.toLocaleString("es") ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      {project.metrics?.revenue
                        ? `${project.metrics.revenue.toLocaleString("es")}€`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {project.metrics?.rating ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {project.metrics?.users?.toLocaleString("es") ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Traffic by country */}
      <Card>
        <CardHeader>
          <CardTitle>Tráfico por País</CardTitle>
          <CardDescription>Origen geográfico de los visitantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardStats.trafficByCountry.map((entry) => {
              const pct = Math.round(
                (entry.visitors / dashboardStats.visitorsMonth) * 100
              );
              return (
                <div key={entry.country} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-20 shrink-0">
                    {entry.country}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/70 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-20 text-right">
                    {entry.visitors.toLocaleString("es")} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
