import type { Metadata } from "next";
import { findAllProjects } from "@/lib/repositories/projects.repository";
import { LabProjectCard } from "@/components/public/lab-project-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Systems we've built: production, betas, and experiments. Proof that what we promise gets delivered.",
  alternates: {
    canonical: "/en/lab",
    languages: { es: "/laboratorio", "x-default": "/laboratorio" },
  },
};

export default async function LabPageEn() {
  // Same source as /laboratorio (toggle in /admin/proyectos); project titles
  // and descriptions are entered in Spanish and are not translated here —
  // see i18n scope notes.
  const allProjects = await findAllProjects();
  const projects = allProjects.filter((p) => p.showInLab);

  return (
    <div lang="en" className="min-h-screen bg-transparent pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <h1 className="font-display text-4xl text-gray-900 dark:text-white mb-4">
            Lab
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Things we&apos;ve built. Some are in production, others are experiments still
            alive. Not products for sale — they&apos;re here as proof that what we promise
            gets delivered.
          </p>
        </div>

        {projects.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">
            No projects to show here yet.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <LabProjectCard key={project.id} project={project} lang="en" />
          ))}
        </div>
      </div>
    </div>
  );
}
