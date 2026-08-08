"use client";

import { useState, useCallback, useEffect } from "react";
import { Project } from "@/types";

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  addProject: (data: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, data: Partial<Omit<Project, "id">>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  captureScreenshot: (id: string) => Promise<void>;
  toggleStatus: (id: string) => void;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing projects with optimistic updates
 *
 * Fetches from API, supports CRUD with instant UI feedback.
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Error al cargar proyectos");
      const json = await res.json();
      setProjects(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = useCallback(async (data: Omit<Project, "id">) => {
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimistic: Project = { id: tempId, ...data };
    setProjects((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Rollback
        setProjects((prev) => prev.filter((p) => p.id !== tempId));
        const json = await res.json();
        throw new Error(json.error?.message || "Error al crear proyecto");
      }

      const json = await res.json();
      // Replace optimistic with real
      setProjects((prev) =>
        prev.map((p) => (p.id === tempId ? json.data : p))
      );
    } catch (err) {
      setProjects((prev) => prev.filter((p) => p.id !== tempId));
      throw err;
    }
  }, []);

  const updateProject = useCallback(async (id: string, data: Partial<Omit<Project, "id">>) => {
    // Optimistic update
    let previous: Project | undefined;
    setProjects((prev) => {
      previous = prev.find((p) => p.id === id);
      return prev.map((p) => (p.id === id ? { ...p, ...data } : p));
    });

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        // Rollback
        if (previous) setProjects((prev) => prev.map((p) => (p.id === id ? previous! : p)));
        const json = await res.json();
        throw new Error(json.error?.message || "Error al actualizar proyecto");
      }

      const json = await res.json();
      setProjects((prev) => prev.map((p) => (p.id === id ? json.data : p)));
    } catch (err) {
      if (previous) setProjects((prev) => prev.map((p) => (p.id === id ? previous! : p)));
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    // Optimistic
    let removed: Project | undefined;
    setProjects((prev) => {
      removed = prev.find((p) => p.id === id);
      return prev.filter((p) => p.id !== id);
    });

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        // Rollback
        if (removed) setProjects((prev) => [...prev, removed!]);
        throw new Error("Error al eliminar proyecto");
      }
    } catch (err) {
      if (removed) setProjects((prev) => [...prev, removed!]);
      throw err;
    }
  }, []);

  const captureScreenshot = useCallback(async (id: string) => {
    const res = await fetch(`/api/projects/${id}/screenshot`, { method: "PATCH" });
    if (!res.ok) {
      const json = await res.json().catch(() => null);
      throw new Error(json?.error?.message || "No se pudo capturar la pantalla");
    }
    const json = await res.json();
    setProjects((prev) => prev.map((p) => (p.id === id ? json.data : p)));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          status: p.status === "production" ? "development" as const : "production" as const,
        };
      })
    );
    // Fire-and-forget PATCH
    fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status:
          projects.find((p) => p.id === id)?.status === "production"
            ? "development"
            : "production",
      }),
    }).catch((err) => {
      console.error("[toggleStatus] PATCH failed:", err instanceof Error ? err.message : String(err));
    });
  }, [projects]);

  return {
    projects,
    isLoading,
    error,
    addProject,
    updateProject,
    deleteProject,
    captureScreenshot,
    toggleStatus,
    refresh: fetchProjects,
  };
}
