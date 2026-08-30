import { NextRequest, NextResponse } from "next/server";
import { findAllProjects } from "@/lib/repositories/projects.repository";
import { getHomeConfig } from "@/lib/home-config";
import { withMarkdownVary } from "@/lib/markdown-negotiation";
import { APP_NAME, APP_DESCRIPTION, CONTACT_EMAIL } from "@/lib/constants";

const BASE_URL = "https://praxialabs.com";

const KEY_PAGES = [
  { href: "/siam", label: "SIAM" },
  { href: "/core-ops", label: "Core OPS" },
  { href: "/adminapp", label: "AdminApp" },
  { href: "/laboratorio", label: "Laboratorio" },
  { href: "/precios", label: "Precios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/acerca-de", label: "Acerca de" },
  { href: "/contacto", label: "Contacto" },
  { href: "/politica-privacidad", label: "Política de privacidad" },
  { href: "/about", label: "About (English)" },
  { href: "/contact", label: "Contact (English)" },
  { href: "/privacy", label: "Privacy Policy (English)" },
];

/**
 * Markdown representation of the homepage, served via content negotiation
 * (see src/proxy.ts) when a client sends `Accept: text/markdown`.
 * Not meant to be crawled directly — see robots.ts disallow for /md-home.
 */
export async function GET(_request: NextRequest) {
  const [projects, cfg] = await Promise.all([findAllProjects(), getHomeConfig()]);
  const featured = projects.filter((p) => p.showOnHome).slice(0, 8);
  const shown = featured.length ? featured : projects.slice(0, 6);

  const lines = [
    `# ${APP_NAME} — ${cfg.hero.tagline}`,
    "",
    `## ${cfg.hero.h1} ${cfg.hero.h1em}`,
    "",
    cfg.hero.lede,
    "",
    `> ${APP_DESCRIPTION}`,
    "",
    "## Casos reales",
    "",
    ...shown.map((p) => `- [${p.name}](${BASE_URL}/proyectos/${p.id}): ${p.description}`),
    "",
    "## Páginas clave",
    "",
    ...KEY_PAGES.map((p) => `- [${p.label}](${BASE_URL}${p.href})`),
    "",
    "## Contacto",
    "",
    `- Email: ${CONTACT_EMAIL}`,
    `- Mapa del sitio: ${BASE_URL}/sitemap.xml`,
    `- Resumen para agentes: ${BASE_URL}/llms.txt`,
  ];

  const res = new NextResponse(lines.join("\n") + "\n", {
    status: 200,
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
  res.headers.set("Vary", withMarkdownVary(res.headers.get("Vary")));
  return res;
}
