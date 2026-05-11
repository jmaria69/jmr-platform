import type { Metadata } from "next";
import { ProjectCard } from "@/components/public/project-card";
import { findAllProjects } from "@/lib/repositories/projects.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Explora todos los proyectos: aplicaciones web, móviles, IA y automatización.",
};

export default async function ProyectosPage() {
  const projects = await findAllProjects();
  const categories = [
    { value: "all", label: "Todos" },
    { value: "web", label: "Web" },
    { value: "mobile", label: "Móvil" },
    { value: "ai", label: "IA" },
    { value: "automation", label: "Automatización" },
    { value: "desktop", label: "Desktop" },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Todos los Proyectos</h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Soluciones tecnológicas para cada necesidad empresarial.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
