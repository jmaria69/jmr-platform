"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/public/hero";
import { ProjectCard } from "@/components/public/project-card";
import { projects } from "@/lib/projects";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function HomePage() {
  const projectsRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <>
      <Hero />

      {/* Featured projects — Bento Grid */}
      <section
        ref={projectsRef}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32"
      >
        <div className="text-center mb-16 reveal">
          <span className="inline-block text-sm font-semibold text-[oklch(0.7_0.18_275)] tracking-wider uppercase mb-3">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Proyectos <span className="text-gradient">Destacados</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
            Cada proyecto resuelve problemas reales con tecnología de vanguardia.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 stagger-children">
          {/* First project is featured (2x2) */}
          <ProjectCard project={projects[0]} featured />
          {projects.slice(1).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-[oklch(0.5_0.18_275/15%)] blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center glass rounded-3xl p-10 sm:p-14 border-gradient reveal">
            <h2 className="text-3xl sm:text-4xl font-bold">
              ¿Tienes un proyecto{" "}
              <span className="text-gradient">en mente</span>?
            </h2>
            <p className="mt-5 text-muted-foreground text-lg">
              Hablemos de cómo la tecnología puede impulsar tu negocio. Sin compromisos.
            </p>
            <Link href="/contacto" className="inline-block mt-8">
              <button className="shimmer-btn inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-transform hover:scale-105 active:scale-[0.98]">
                Empezar conversación
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
