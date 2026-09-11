import { Project } from "@/types";

/**
 * Metadata de portada por proyecto — desacoplada del campo `image` de
 * `Project` (que puede ser una captura de pantalla real, refrescable desde
 * `/admin/proyectos`, o una ilustración estática como las de `/public/projects`).
 *
 * Esta tabla solo aporta lo que no vive en la base de datos: el texto
 * alternativo accesible de la portada, en cada idioma soportado por el sitio
 * público. Añadir un proyecto nuevo aquí es opcional — si no hay entrada,
 * `getProjectCoverAlt` genera un alt razonable a partir del nombre.
 */
export interface ProjectCoverMeta {
  alt: {
    es: string;
    en: string;
  };
}

export const PROJECT_COVER_META: Record<string, ProjectCoverMeta> = {
  "olga-ai": {
    alt: {
      es: "Portada de OLGA.ai: red de agentes IA orbitando un controlador central sobre fondo violeta",
      en: "OLGA.ai cover: AI agent network orbiting a central controller on a violet background",
    },
  },
  "admin-app": {
    alt: {
      es: "Captura de AdminApp Maestro, panel de administración para gestoras de comunidades",
      en: "Screenshot of AdminApp Maestro, an admin panel for property management companies",
    },
  },
  "crm-it": {
    alt: {
      es: "Captura de Core OPS, centro de mando enterprise para equipos IT",
      en: "Screenshot of Core OPS, an enterprise command center for IT teams",
    },
  },
  "generador-ideas": {
    alt: {
      es: "Portada de Agente Emprendedor IA: bombilla de idea junto a un panel de análisis DAFO",
      en: "Agente Emprendedor IA cover: idea lightbulb next to a SWOT analysis panel",
    },
  },
  "campo-abierto": {
    alt: {
      es: "Portada de Campo Abierto: campos de cultivo bajo el sol con panel de ayudas PAC",
      en: "Campo Abierto cover: farmland under the sun with a farm-subsidy panel",
    },
  },
  "cf-jaramal": {
    alt: {
      es: "Portada del Club Fútbol Rivas 2016 B: campo de juego con formación táctica",
      en: "Club Fútbol Rivas 2016 B cover: pitch diagram with tactical formation",
    },
  },
  "cd-rivas-jarama": {
    alt: {
      es: "Portada de CD Rivas Jarama: escudo del club con balón y estadísticas de la temporada",
      en: "CD Rivas Jarama cover: club crest with football and season stats",
    },
  },
  frajamo: {
    alt: {
      es: "Portada de Frajamo Madrid: silueta de perro y medalla sobre fondo azul marino y dorado",
      en: "Frajamo Madrid cover: dog silhouette and medal on a navy and gold background",
    },
  },
  "landing-inmobiliaria": {
    alt: {
      es: "Portada de InmoTech: icono de vivienda con panel de leads cualificados por IA",
      en: "InmoTech cover: house icon with an AI-qualified leads panel",
    },
  },
  "app-voz": {
    alt: {
      es: "Portada de AppVoz: micrófono con ecualizador de sonido y panel de transcripción",
      en: "AppVoz cover: microphone with sound equalizer and a transcript panel",
    },
  },
  "app-mejores-productos": {
    alt: {
      es: "Portada de MejoresProductos: etiqueta de precio con lupa y gráfico de tendencia",
      en: "MejoresProductos cover: price tag with magnifier and a trend chart",
    },
  },
  siam: {
    alt: {
      es: "Captura de SIAM, plataforma de ciberseguridad con detección de amenazas en tiempo real",
      en: "Screenshot of SIAM, a cybersecurity platform with real-time threat detection",
    },
  },
  saludapp: {
    alt: {
      es: "Portada de SaludApp: cruz médica con línea de pulso y agenda de citas automatizada",
      en: "SaludApp cover: medical cross with a pulse line and an automated appointment agenda",
    },
  },
};

export function getProjectCoverAlt(project: Pick<Project, "id" | "name">, lang: "es" | "en" = "es"): string {
  const entry = PROJECT_COVER_META[project.id];
  if (entry) return entry.alt[lang];
  return lang === "en" ? `Cover art for ${project.name}` : `Portada de ${project.name}`;
}
