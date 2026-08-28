import { NextRequest, NextResponse } from "next/server";
import { withMarkdownVary } from "@/lib/markdown-negotiation";

const BASE_URL = "https://praxialabs.com";

/**
 * Markdown 404 body, served via content negotiation (see src/proxy.ts) when
 * a client requests an unknown top-level path with `Accept: text/markdown`.
 * Not meant to be crawled directly — see robots.ts disallow for /md-404.
 */
export async function GET(_request: NextRequest) {
  const lines = [
    "# 404 — Página no encontrada",
    "",
    "La página que buscas no existe o ha sido movida.",
    "",
    "## Dónde mirar",
    "",
    `- [Inicio](${BASE_URL}/): propuesta de valor y casos reales.`,
    `- [Proyectos](${BASE_URL}/proyectos): catálogo completo de casos reales.`,
    `- [Mapa del sitio](${BASE_URL}/sitemap.xml)`,
    `- [Resumen para agentes (llms.txt)](${BASE_URL}/llms.txt)`,
  ];

  const res = new NextResponse(lines.join("\n") + "\n", {
    status: 404,
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
  res.headers.set("Vary", withMarkdownVary(res.headers.get("Vary")));
  return res;
}
