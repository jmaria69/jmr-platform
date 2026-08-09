"use client";

import { useState, useEffect } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Project } from "@/types";

const COLORS = [
  { label: "Índigo", value: "#6366f1" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Esmeralda", value: "#10b981" },
  { label: "Ámbar", value: "#f59e0b" },
  { label: "Rojo", value: "#ef4444" },
  { label: "Violeta", value: "#8b5cf6" },
  { label: "Rosa", value: "#ec4899" },
  { label: "Lima", value: "#84cc16" },
  { label: "Naranja", value: "#f97316" },
  { label: "Azul", value: "#3b82f6" },
];

interface EditProjectDialogProps {
  project: Project;
  onSave: (id: string, data: Partial<Omit<Project, "id">>) => Promise<void>;
}

export function EditProjectDialog({ project, onSave }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState(projectToForm(project));

  // Reset form when project changes or dialog opens
  useEffect(() => {
    if (open) setForm(projectToForm(project));
  }, [open, project]);

  function handleAddTech() {
    const tag = techInput.trim();
    if (tag && !form.tech.includes(tag)) {
      setForm((prev) => ({ ...prev, tech: [...prev.tech, tag] }));
      setTechInput("");
    }
  }

  function handleRemoveTech(tag: string) {
    setForm((prev) => ({ ...prev, tech: prev.tech.filter((t) => t !== tag) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;

    setSaving(true);
    try {
      await onSave(project.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        longDescription: form.longDescription.trim() || form.description.trim(),
        tech: form.tech,
        status: form.status,
        category: form.category,
        color: form.color,
        showOnHome: form.showOnHome,
        showInLab: form.showInLab,
        url: form.url.trim() || undefined,
        github: form.github.trim() || undefined,
        metrics: {
          users: form.users ? Number(form.users) : undefined,
          revenue: form.revenue ? Number(form.revenue) : undefined,
          rating: form.rating ? Number(form.rating) : undefined,
        },
      });
      setOpen(false);
    } catch (err) {
      console.error("Error saving project:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-blue-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          />
        }
      >
        <Pencil className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Proyecto</DialogTitle>
          <DialogDescription>
            Modifica los datos de <strong>{project.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Row 1: Name + Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="edit-name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, color: c.value }))}
                    className={`h-7 w-7 rounded-full border-2 transition-all ${
                      form.color === c.value
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Status + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v as Project["status"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Desarrollo</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                  <SelectItem value="production">Producción</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v as Project["category"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Móvil</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="ai">IA</SelectItem>
                  <SelectItem value="automation">Automatización</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Visibilidad (controla dónde aparece el proyecto) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Mostrar en Home</Label>
                <p className="text-xs text-muted-foreground">Destacado en la portada</p>
              </div>
              <Switch
                checked={form.showOnHome}
                onCheckedChange={(v) => setForm((p) => ({ ...p, showOnHome: v }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Mostrar en Laboratorio</Label>
                <p className="text-xs text-muted-foreground">Aparece en /laboratorio</p>
              </div>
              <Switch
                checked={form.showInLab}
                onCheckedChange={(v) => setForm((p) => ({ ...p, showInLab: v }))}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-desc">
              Descripción corta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-desc"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-long">Descripción detallada</Label>
            <Textarea
              id="edit-long"
              rows={3}
              value={form.longDescription}
              onChange={(e) =>
                setForm((p) => ({ ...p, longDescription: e.target.value }))
              }
            />
          </div>

          {/* Tech Stack */}
          <div className="space-y-2">
            <Label>Stack Tecnológico</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Ej: React, Python, Docker..."
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTech();
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTech}>
                Añadir
              </Button>
            </div>
            {form.tech.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.tech.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tag)}
                      className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL del proyecto</Label>
              <Input
                id="edit-url"
                placeholder="https://miproyecto.com"
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-github">Repositorio</Label>
              <Input
                id="edit-github"
                placeholder="https://github.com/..."
                value={form.github}
                onChange={(e) =>
                  setForm((p) => ({ ...p, github: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-users">Usuarios</Label>
              <Input
                id="edit-users"
                type="number"
                min="0"
                placeholder="0"
                value={form.users}
                onChange={(e) =>
                  setForm((p) => ({ ...p, users: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-revenue">Ingresos/mes (€)</Label>
              <Input
                id="edit-revenue"
                type="number"
                min="0"
                placeholder="0"
                value={form.revenue}
                onChange={(e) =>
                  setForm((p) => ({ ...p, revenue: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rating">Rating</Label>
              <Input
                id="edit-rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="4.5"
                value={form.rating}
                onChange={(e) =>
                  setForm((p) => ({ ...p, rating: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground mb-2">Vista previa</p>
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg shrink-0"
                style={{ backgroundColor: form.color }}
              />
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {form.name || "Nombre del proyecto"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {form.description || "Descripción del proyecto"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Helper ───

function projectToForm(p: Project) {
  return {
    name: p.name,
    description: p.description,
    longDescription: p.longDescription || "",
    status: p.status,
    category: p.category,
    color: p.color,
    showOnHome: p.showOnHome ?? false,
    showInLab: p.showInLab ?? true,
    tech: [...p.tech],
    url: p.url || "",
    github: p.github || "",
    users: p.metrics?.users?.toString() || "",
    revenue: p.metrics?.revenue?.toString() || "",
    rating: p.metrics?.rating?.toString() || "",
  };
}
