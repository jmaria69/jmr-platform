import type { Project } from "@/types";
import { PRESENTATION_PATHS } from "@/lib/presentation-paths";

const STATUS_LABELS: Record<string, string> = {
  production: "EN PRODUCCIÓN",
  beta: "BETA",
  development: "EN DESARROLLO",
};

function esc(s: string): string {
  return (s || "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
  );
}

/** Solo deja pasar http(s) y rutas relativas — evita esquemas tipo javascript: en campos editables desde admin. */
export function safeUrl(s: string | null | undefined): string {
  if (!s) return "";
  try {
    const u = new URL(s, "https://praxialabs.com");
    return u.protocol === "http:" || u.protocol === "https:" ? s : "";
  } catch {
    return "";
  }
}

/**
 * Segmento SVG en S de una fila. Id de gradiente por fila (namespaced con el
 * id del proyecto) para no colisionar cuando varias filas comparten página.
 * viewBox -30..30 de ancho = amplitud de ±30, escalada por --neural-amp en
 * CSS (se reduce a casi 0 en móvil).
 */
function neuralSegmentSvg(rowId: string): string {
  const gradId = `neuralGrad-${esc(rowId)}`;
  return `<svg class="nseg" viewBox="-30 0 60 200" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--seg-c1, #ff8a3c)" />
          <stop offset="50%" stop-color="var(--seg-c2, #d946ef)" />
          <stop offset="100%" stop-color="var(--seg-c3, #00f2ff)" />
        </linearGradient>
      </defs>
      <path d="M 0,0 C 30,50 30,50 0,100 C -30,150 -30,150 0,200" stroke="url(#${gradId})" fill="none" stroke-width="3" stroke-linecap="round" />
    </svg>`;
}

export function buildNeuralRowHtml(p: Project, _index: number): string {
  const status = STATUS_LABELS[p.status] || "EN PRODUCCIÓN";
  const safeImage = safeUrl(p.image);
  const presentationPath = PRESENTATION_PATHS[p.id];
  const safeLink = presentationPath || safeUrl(p.url);
  const initial = esc((p.name.trim().charAt(0) || "?").toUpperCase());
  const fallback = `<span class="nimg-fb" style="color:${esc(p.color)};background:${esc(p.color)}20">${initial}</span>`;
  const img = safeImage
    ? `<div class="nimg">${fallback}<img src="${esc(safeImage)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'"></div>`
    : `<div class="nimg">${fallback}</div>`;
  const link = safeLink
    ? presentationPath
      ? `<a class="nlink" href="${esc(safeLink)}">Ver proyecto &rarr;</a>`
      : `<a class="nlink" href="${esc(safeLink)}" target="_blank" rel="noopener noreferrer">Ver proyecto &rarr;</a>`
    : "";
  const tech = p.tech.length
    ? `<div class="ntech">${p.tech.map((t) => `<span class="ntech-pill">${esc(t)}</span>`).join("")}</div>`
    : "";
  return `
        <div class="nrow rev">
          ${neuralSegmentSvg(p.id)}
          <div class="nnode"></div>
          <div class="ncard">
            ${img}
            <div class="ncard-body">
              <div class="ntag">${esc(p.category)}<span class="nst">&#9679; ${status}</span></div>
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.description)}</p>
              ${tech}
              ${link}
            </div>
          </div>
        </div>`;
}
