import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { findAllProjects } from "@/lib/repositories/projects.repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Laboratorio | Praxia Labs",
  description:
    "Sistemas que he construido: producción, betas y experimentos. La prueba de que lo que prometo se entrega.",
};

const ETIQUETA_ESTADO: Record<string, string> = {
  production: "Producción",
  beta: "Beta",
};

export default async function LaboratorioPage() {
  // Muestra TODOS los proyectos de admin/proyectos (mismo orden por sortOrder).
  // Antes se excluían los que tienen landing propia (siam/crm-it/admin-app);
  // ahora el laboratorio refleja 1:1 lo que hay en admin.
  const proyectos = await findAllProjects();

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
            <div key={project.id} className="project-card-v2 group p-6 rounded-2xl transition-all">
              <div
                className="h-0.5 w-full rounded-full mb-5"
                style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}40, transparent)` }}
              />
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    {project.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${project.color}18`,
                        color: project.color,
                        border: `1px solid ${project.color}30`,
                      }}
                    >
                      {ETIQUETA_ESTADO[project.status] ?? "Explorando"}
                    </span>
                    <span className="badge-tech">{project.category.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-500 dark:text-gray-400 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Link
                  href={`/proyectos/${project.id}`}
                  className="flex items-center gap-1 text-sm text-cyan-500 dark:text-cyan-400 hover:text-cyan-300 font-semibold transition"
                >
                  Ver detalles <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-purple-500 dark:text-purple-400 hover:text-purple-300 font-semibold transition"
                  >
                    Ver en vivo <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
