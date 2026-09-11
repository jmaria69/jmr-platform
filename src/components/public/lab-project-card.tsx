"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Project } from "@/types";
import { getProjectCoverAlt } from "@/lib/project-cover-meta";

type Lang = "es" | "en";

const STATUS_LABEL: Record<Lang, Record<string, string>> = {
  es: { production: "Producción", beta: "Beta", development: "Desarrollo" },
  en: { production: "Production", beta: "Beta", development: "Development" },
};

const COPY: Record<Lang, { viewDetails: string; viewLive: string; fallbackAlt: (name: string) => string }> = {
  es: {
    viewDetails: "Ver detalles",
    viewLive: "Ver en vivo",
    fallbackAlt: (name) => `Portada de ${name}`,
  },
  en: {
    viewDetails: "View details",
    viewLive: "View live",
    fallbackAlt: (name) => `Cover art for ${name}`,
  },
};

const FALLBACK_COVER = "/projects/default.svg";

/**
 * Tarjeta de proyecto para los listados públicos del laboratorio (`/laboratorio`
 * y `/en/lab`). Antes cada página tenía su propia copia de esta tarjeta — se
 * unificaron aquí para no duplicar el markup, y de paso se añadió la portada
 * visual (antes estas páginas no mostraban ninguna imagen).
 *
 * La imagen sale de `project.image` (la misma fuente que ya usa la home en
 * `neural-timeline.ts` y que el admin puede refrescar con una captura real
 * desde `/admin/proyectos`); el texto alternativo sale de `getProjectCoverAlt`.
 * Si la imagen tarda, carga con `loading="lazy"`; si falla, cae a una portada
 * de reserva neutra y, si esa también fallara, se oculta sin romper el layout.
 */
export function LabProjectCard({ project, lang }: { project: Project; lang: Lang }) {
  const [coverSrc, setCoverSrc] = useState(project.image || FALLBACK_COVER);
  const [coverFailed, setCoverFailed] = useState(false);
  const statusLabel = STATUS_LABEL[lang];
  const copy = COPY[lang];
  const alt = project.image ? getProjectCoverAlt(project, lang) : copy.fallbackAlt(project.name);

  const handleImgError = () => {
    if (coverSrc !== FALLBACK_COVER) {
      setCoverSrc(FALLBACK_COVER);
    } else {
      // La propia portada de reserva falló: evita un bucle y oculta la imagen.
      setCoverFailed(true);
    }
  };

  return (
    <div className="project-card-v2 group rounded-2xl transition-all overflow-hidden">
      {!coverFailed && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-white/5 bg-black/20">
          {/* eslint-disable-next-line @next/next/no-img-element -- next/image is not configured in this app (see neural-timeline.ts, which uses the same plain <img> pattern) */}
          <img
            src={coverSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={handleImgError}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1"
            style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}40, transparent)` }}
          />
        </div>
      )}

      <div className="p-6">
        {coverFailed && (
          <div
            className="h-0.5 w-full rounded-full mb-5"
            style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}40, transparent)` }}
          />
        )}
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
                {statusLabel[project.status] ?? (lang === "en" ? "Exploring" : "Explorando")}
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
            {copy.viewDetails} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-purple-500 dark:text-purple-400 hover:text-purple-300 font-semibold transition"
            >
              {copy.viewLive} <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
