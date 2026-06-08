"use client";

import { Trash2, Users, Star, DollarSign, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddProjectDialog } from "@/components/admin/add-project-dialog";
import { EditProjectDialog } from "@/components/admin/edit-project-dialog";
import { useProjects } from "@/hooks/use-projects";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import { Project } from "@/types";
import { useState } from "react";

interface ProjectsManagerProps {
  /** En modo demo/read-only oculta los controles de edición */
  isReadOnly?: boolean;
}

export function ProjectsManager({ isReadOnly = false }: ProjectsManagerProps) {
  const { projects, isLoading, error, addProject, updateProject, deleteProject, toggleStatus } =
    useProjects();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  }

  // ─── Loading state ───
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          {!isReadOnly && <Skeleton className="h-10 w-40 rounded-xl" />}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl glass p-6 space-y-4">
              <Skeleton className="h-1 w-full" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Error state ───
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-2xl glass border-gradient p-8 max-w-md">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error al cargar proyectos</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          {!isReadOnly && (
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Proyectos</h2>
          <p className="text-muted-foreground">
            {projects.length} proyectos registrados.{" "}
            {isReadOnly
              ? "Modo visualización — inicia sesión para gestionar."
              : "Administra, añade y elimina."}
          </p>
        </div>
        {/* Solo muestra el botón añadir en modo admin */}
        {!isReadOnly && (
          <AddProjectDialog onAdd={(p) => addProject(p).catch(console.error)} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group relative overflow-hidden rounded-2xl glass border-gradient glow-hover transition-all"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: project.color }}
            />
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{PROJECT_STATUS_LABELS[project.status]}</Badge>
                  <Badge variant="secondary" className="text-xs bg-white/5 border-white/10">
                    {project.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Switch solo en modo admin */}
                {!isReadOnly && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`active-${project.id}`} className="text-xs">Activo</Label>
                    <Switch
                      id={`active-${project.id}`}
                      checked={project.status === "production"}
                      onCheckedChange={() => toggleStatus(project.id)}
                    />
                  </div>
                )}
                {/* Botones editar/borrar solo en modo admin */}
                {!isReadOnly && (
                  <>
                    <EditProjectDialog project={project} onSave={updateProject} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setDeleteTarget(project)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Users, value: project.metrics?.users, label: "Usuarios", color: "text-blue-400" },
                  { icon: Star, value: project.metrics?.rating, label: "Rating", color: "text-amber-400" },
                  { icon: DollarSign, value: project.metrics?.revenue ? `${project.metrics.revenue}€` : undefined, label: "€/mes", color: "text-green-400" },
                ].map(({ icon: Icon, value, label, color }) => (
                  <div key={label} className="text-center p-2 rounded-lg bg-white/3">
                    <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
                    <p className="text-sm font-bold">{value ?? "—"}</p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">{t}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete confirmation — solo en modo admin */}
      {!isReadOnly && (
        <Dialog open={deleteTarget !== null} onOpenChange={(v) => { if (!v) setDeleteTarget(null); }}>
          <DialogContent className="max-w-md glass-strong">
            <DialogHeader>
              <DialogTitle>Eliminar proyecto</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar <strong>{deleteTarget?.name}</strong>? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Eliminar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
