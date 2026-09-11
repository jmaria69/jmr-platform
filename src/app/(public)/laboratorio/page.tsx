import type { Metadata } from "next";
import { findAllProjects } from "@/lib/repositories/projects.repository";
import { LabProjectCard } from "@/components/public/lab-project-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Laboratorio",
  description:
    "Sistemas que he construido: producción, betas y experimentos. La prueba de que lo que prometo se entrega.",
  alternates: {
    canonical: "/laboratorio",
    languages: { en: "/en/lab", "x-default": "/laboratorio" },
  },
};

export default async function LaboratorioPage() {
  // Muestra los proyectos con el flag "mostrar en laboratorio" activado
  // (toggle en /admin/proyectos). force-dynamic → refleja admin al instante.
  const allProjects = await findAllProjects();
  const proyectos = allProjects.filter((p) => p.showInLab);

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <h1 className="font-display text-4xl text-gray-900 dark:text-white mb-4">
            Laboratorio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Cosas que he construido. Algunas están en producción, otras son experimentos que
            siguen vivos. No son productos a la venta: están aquí como prueba de que lo que
            prometo se entrega.
          </p>
        </div>

        {proyectos.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            Todavía no hay proyectos que mostrar aquí.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proyectos.map((project) => (
            <LabProjectCard key={project.id} project={project} lang="es" />
          ))}
        </div>
      </div>
    </div>
  );
}
