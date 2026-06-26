import type { Metadata } from "next";
import { ProjectCard } from "@/components/public/project-card";
import { findAllProjects } from "@/lib/repositories/projects.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos de automatizacion e IA",
  description:
    "Agentes IA y plataformas de automatizacion disenados por Praxia Labs: OLGA.ai, AdminApp Maestro, Core OPS, Agente Emprendedor y mas.",
};

// IDs del seed que se muestran en el portfolio publico.
// Criterio: solo proyectos con IA real o automatizacion implementada.
// Excluidos: webs de futbol, adiestramiento canino, landings estaticas sin IA.
const PUBLIC_PROJECT_IDS = new Set([
  "olga-ai",
  "admin-app",
  "crm-it",
  "generador-ideas",
  "app-voz",
  "app-mejores-productos",
  "siam",
  "saludapp",
]);

export default async function ProyectosPage() {
  const allProjects = await findAllProjects();

  // Show only AI/automation projects.
  // Explicit whitelist covers seed data.
  // Category filter catches future DB projects with category ai/automation.
  const techProjects = allProjects.filter(
    (p) => PUBLIC_PROJECT_IDS.has(p.id) || p.category === "ai" || p.category === "automation"
  );

  const productionCount = techProjects.filter((p) => p.status === "production").length;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-600/15 border border-purple-500/25 mb-5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
            {productionCount} en produccion activa
          </span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Agentes IA y automatizacion
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-base">
          Sistemas reales corriendo para clientes reales — no prototipos ni demos vacias.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {techProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {techProjects.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          Cargando proyectos...
        </div>
      )}
    </section>
  );
}
