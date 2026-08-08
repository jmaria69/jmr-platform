"use client";

import { Trash2, Users, Star, DollarSign, AlertCircle, Loader2, GripVertical, Eye, Camera } from "lucide-react";
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
import { useState, useEffect, useMemo, useRef } from "react";

interface ProjectsManagerProps {
  isReadOnly?: boolean;
}

const STORAGE_KEY = "praxia-projects-order";

export function ProjectsManager({ isReadOnly = false }: ProjectsManagerProps) {
  const { projects, isLoading, error, addProject, updateProject, deleteProject, toggleStatus, captureScreenshot } =
    useProjects();
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [capturingIds, setCapturingIds] = useState<Set<string>>(new Set());

  async function handleCapture(id: string) {
    setCapturingIds((prev) => new Set(prev).add(id));
    try {
      await captureScreenshot(id);
    } catch (err) {
      console.error("[captureScreenshot] failed:", err instanceof Error ? err.message : String(err));
    } finally {
      setCapturingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  // Conteo de vistas por proyecto (analítica interna)
  const [viewCounts, setViewCounts] = useState<Record<string, { total: number; last7d: number; uniques: number }>>({});
  useEffect(() => {
    if (isReadOnly) return;
    fetch("/api/projects/views")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => { if (j?.data) setViewCounts(j.data); })
      .catch(() => { /* sin métricas de vistas, no pasa nada */ });
  }, [isReadOnly]);

  // ─── Drag & drop state ───
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const dragIndexRef = useRef<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Migración única: si hay un orden antiguo en localStorage (de cuando el
  // orden no se persistía en BD), súbelo a la BD y elimínalo. A partir de ahí
  // la fuente de verdad es el servidor (la home y /proyectos leen de ahí).
  useEffect(() => {
    if (isReadOnly) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids) && ids.length > 0) {
          setOrderedIds(ids);
          fetch("/api/projects/reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids }),
          })
            .then((r) => { if (r.ok) localStorage.removeItem(STORAGE_KEY); })
            .catch(() => { /* reintentará en la próxima visita */ });
        }
      }
    } catch { /* ignorar */ }
  }, [isReadOnly]);

  // Proyectos en el orden del usuario; los nuevos (no guardados) van al final
  const orderedProjects = useMemo(() => {
    if (orderedIds.length === 0) return projects;
    const map = new Map(projects.map(p => [p.id, p]));
    const inOrder = orderedIds.map(id => map.get(id)).filter(Boolean) as Project[];
    const inOrderIds = new Set(orderedIds);
    const extra = projects.filter(p => !inOrderIds.has(p.id));
    return [...inOrder, ...extra];
  }, [projects, orderedIds]);

  function saveOrder(ordered: Project[]) {
    const ids = ordered.map(p => p.id);
    setOrderedIds(ids);
    // Persistir en BD: este orden es el que ven la home pública y /proyectos.
    // (Ya no se guarda en localStorage: la BD es la única fuente de verdad.)
    fetch("/api/projects/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    }).catch((err) => console.error("No se pudo persistir el orden:", err));
  }

  // ─── Handlers de drag ───
  function onDragStart(index: number) {
    dragIndexRef.current = index;
    setIsDragging(true);
  }

  function onDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }

  function onDragEnd() {
    setIsDragging(false);
    setOverIndex(null);
    dragIndexRef.current = null;
  }

  function onDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    const from = dragIndexRef.current;
    if (from === null || from === dropIndex) {
      onDragEnd();
      return;
    }
    const next = [...orderedProjects];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    saveOrder(next);
    onDragEnd();
  }

  // ─── Delete ───
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

  // ─── Loading ───
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

  // ─── Error ───
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
              : "Arrastra las tarjetas para reordenar."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => window.open("/proyectos", "_blank", "noopener")}>
            <Eye className="mr-2 h-4 w-4" /> Ver en la web
          </Button>
          {!isReadOnly && (
            <AddProjectDialog onAdd={(p) => addProject(p).catch((err) => console.error("[AddProject] failed:", err instanceof Error ? err.message : String(err)))} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {orderedProjects.map((project, index) => {
          const isOver = overIndex === index && isDragging && dragIndexRef.current !== index;
          const isBeingDragged = isDragging && dragIndexRef.current === index;

          return (
            <div
              key={project.id}
              className="relative"
              draggable={!isReadOnly}
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDrop={(e) => onDrop(e, index)}
              onDragEnd={onDragEnd}
            >
              {/* Línea indicadora de inserción */}
              {isOver && (
                <div className="absolute -top-1.5 left-4 right-4 h-0.5 rounded-full bg-purple-400 z-10 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
              )}

              <Card
                className={[
                  "group relative overflow-hidden rounded-2xl glass border-gradient glow-hover transition-all duration-200",
                  isBeingDragged ? "opacity-40 scale-[0.98] shadow-none" : "",
                  isOver ? "translate-y-1" : "",
                ].join(" ")}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: project.color }}
                />
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex items-start gap-2">
                    {/* Handle de arrastre — solo en modo admin */}
                    {!isReadOnly && (
                      <div
                        className="mt-0.5 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors touch-none"
                        title="Arrastra para reordenar"
                      >
                        <GripVertical className="h-5 w-5" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{PROJECT_STATUS_LABELS[project.status]}</Badge>
                        <Badge variant="secondary" className="text-xs bg-white/5 border-white/10">
                          {project.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
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
                    {!isReadOnly && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-cyan-400"
                          title="Actualizar captura"
                          aria-label="Actualizar captura"
                          disabled={capturingIds.has(project.id)}
                          onClick={() => handleCapture(project.id)}
                        >
                          {capturingIds.has(project.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </Button>
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
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span className="font-semibold text-foreground">{viewCounts[project.id]?.total ?? 0}</span>
                    vistas
                    <span className="opacity-60">
                      · {viewCounts[project.id]?.uniques ?? 0} únicos · {viewCounts[project.id]?.last7d ?? 0} en 7d
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Delete confirmation */}
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
