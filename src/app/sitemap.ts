import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";

// Fixed: was incorrectly set to "https://jmrplatform.com"
const BASE_URL = "https://praxialabs.com";

// Only public-facing AI/automation projects appear in the sitemap.
// Non-AI projects are excluded from the public portfolio.
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

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/proyectos`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/precios`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/acerca-de`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contacto`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];

  const publicProjects = projects.filter(
    (p) => PUBLIC_PROJECT_IDS.has(p.id) || p.category === "ai" || p.category === "automation"
  );

  const projectPages: MetadataRoute.Sitemap = publicProjects.map((project) => ({
    url: `${BASE_URL}/proyectos/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}
