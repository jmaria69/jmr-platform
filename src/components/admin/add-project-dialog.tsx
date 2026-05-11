"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
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

interface AddProjectDialogProps {
  onAdd: (project: Project) => void;
}

export function AddProjectDialog({ onAdd }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    longDescription: "",
    status: "development" as Project["status"],
    category: "web" as Project["category"],
    color: "#3b82f6",
    tech: [] as string[],
    url: "",
    github: "",
    users: "",
    revenue: "",
    rating: "",
  });

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim()) return;

    const id = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const project: Project = {
      id,
      name: form.name.trim(),
      description: form.description.trim(),
      longDescription: form.longDescription.trim() || form.description.trim(),
      tech: form.tech,
      status: form.status,
      category: form.category,
      color: form.color,
      image: `/projects/${id}.svg`,
      url: form.url.trim() || undefined,
      github: form.github.trim() || undefined,
      metrics: {
        users: form.users ? Number(form.users) : undefined,
        revenue: form.revenue ? Number(form.revenue) : undefined,
        rating: form.rating ? Number(form.rating) : undefined,
      },
    };

    onAdd(project);
    setOpen(false);
    resetForm();
  }

  function resetForm() {
    setForm({
      name: "",
      description: "",
      longDescription: "",
      status: "development",
      category: "web",
      color: "#3b82f6",
      tech: [],
      url: "",
      github: "",
      users: "",
      revenue: "",
      rating: "",
    });
    setTechInput("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2" />}>
        <Plus className="h-4 w-4" />
        Añadir Proyecto
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuevo Proyecto</DialogTitle>
          <DialogDescription>
            Rellena los datos para añadir un nuevo proyecto a la plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {/* Row 1: Name + Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="proj-name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="proj-name"
                placeholder="Mi Nuevo Proyecto"
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

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="proj-desc">
              Descripción corta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="proj-desc"
              placeholder="Breve descripción del proyecto (1-2 líneas)"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="proj-long">Descripción detallada</Label>
            <Textarea
              id="proj-long"
              placeholder="Descripción completa del proyecto, funcionalidades principales, público objetivo..."
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
              <Label htmlFor="proj-url">URL del proyecto</Label>
              <Input
                id="proj-url"
                placeholder="https://miproyecto.com"
                value={form.url}
                onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proj-github">Repositorio</Label>
              <Input
                id="proj-github"
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
              <Label htmlFor="proj-users">Usuarios</Label>
              <Input
                id="proj-users"
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
              <Label htmlFor="proj-revenue">Ingresos/mes (€)</Label>
              <Input
                id="proj-revenue"
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
              <Label htmlFor="proj-rating">Rating</Label>
              <Input
                id="proj-rating"
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

          {/* Preview color bar */}
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
              onClick={() => {
                setOpen(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <Plus className="h-4 w-4" />
              Crear Proyecto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
