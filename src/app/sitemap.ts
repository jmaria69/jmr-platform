import type { MetadataRoute } from "next";
import { findAllProjects } from "@/lib/repositories/projects.repository";

const BASE_URL = "https://praxialabs.com";

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/siam`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/core-ops`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/adminapp`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/laboratorio`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/precios`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/acerca-de`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contacto`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/politica-privacidad`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/about`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contact`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/privacy`,      lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/en`,           lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/en/siam`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/en/core-ops`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/en/adminapp`,  lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/en/lab`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/en/pricing`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  ];

  // Proyectos públicos desde la DB — si añades/editas desde admin, el sitemap se actualiza solo
  const allProjects = await findAllProjects();
  const publicProjects = allProjects.filter(
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
