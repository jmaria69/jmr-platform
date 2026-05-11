"use client";

import Link from "next/link";
import { Star, Users, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";

const statusLabel: Record<Project["status"], string> = {
  production: "Producción",
  beta: "Beta",
  development: "Desarrollo",
};

const categoryLabel: Record<Project["category"], string> = {
  web: "Web",
  desktop: "Desktop",
  mobile: "Móvil",
  ai: "IA",
  automation: "Automatización",
};

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <Link href={`/proyectos/${project.id}`} className={featured ? "sm:col-span-2 sm:row-span-2" : ""}>
      <div className="group relative h-full rounded-2xl glass border-gradient overflow-hidden transition-all duration-500 hover:scale-[1.02] glow-hover cursor-pointer">
        {/* Accent glow behind card */}
        <div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
          style={{ backgroundColor: `${project.color}20` }}
        />

        {/* Color accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${project.color}, ${project.color}80, transparent)`,
          }}
        />

        <div className={`p-5 sm:p-6 flex flex-col h-full ${featured ? "sm:p-8" : ""}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3
                className={`font-bold group-hover:text-gradient transition-all duration-300 ${
                  featured ? "text-2xl" : "text-lg"
                }`}
              >
                {project.name}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${project.color}15`,
                    color: project.color,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  {statusLabel[project.status]}
                </span>
                <Badge
                  variant="secondary"
                  className="text-[11px] bg-white/5 border-white/10 text-muted-foreground"
                >
                  {categoryLabel[project.category]}
                </Badge>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-muted-foreground group-hover:text-foreground group-hover:bg-white/10 transition-all group-hover:rotate-12">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>

          {/* Description */}
          <p
            className={`text-muted-foreground leading-relaxed flex-1 ${
              featured ? "text-base" : "text-sm"
            }`}
          >
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Metrics */}
          {project.metrics && (
            <div className="flex items-center gap-4 pt-4 mt-4 border-t border-white/5 text-sm">
              {project.metrics.users != null && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {project.metrics.users}
                </span>
              )}
              {project.metrics.rating != null && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {project.metrics.rating}
                </span>
              )}
              {project.metrics.revenue != null && (
                <span className="ml-auto font-semibold text-emerald-400">
                  {project.metrics.revenue.toLocaleString("es")}€
                  <span className="text-[11px] font-normal text-muted-foreground">/mes</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
