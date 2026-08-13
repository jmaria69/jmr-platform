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
import { demoDashboardStats } from "@/lib/demo-data";
import { findAllProjects } from "@/lib/repositories/projects.repository";

// Consulta la BD (Prisma) en cada request: no prerenderizar en build, donde
// DATABASE_URL no es accesible y Prisma lanza errores de inicializacion.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Demo — Analytics",
};

export default async function DemoAnalyticsPage() {
    const dashboardStats = demoDashboardStats;
    const projects = await findAllProjects();

    const totalRevenue = projects.reduce((sum, p) => sum + (p.metrics?.revenue || 0), 0);
    const totalUsers = projects.reduce((sum, p) => sum + (p.metrics?.users || 0), 0);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Analytics Demo</h2>
                <p className="text-muted-foreground">
                    Rendimiento y métricas en modo visualización.{" "}
                    <strong>Inicia sesión para ver datos reales de GA4.</strong>
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
                            {(totalRevenue * 6).toLocaleString("es")}€
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
                    <CardDescription>Métricas de cada proyecto</CardDescription>
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
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map((project) => (
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Traffic by country */}
            <Card>
                <CardHeader>
                    <CardTitle>Tráfico por País</CardTitle>
                    <CardDescription>Origen geográfico de los visitantes (simulado)</CardDescription>
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
                                    <span className="text-sm text-muted-foreground w-24 text-right">
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
