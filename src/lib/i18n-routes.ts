/**
 * Mapa único ES↔EN de rutas públicas. Fuente de verdad para el switcher de
 * idioma del Navbar y para el `alternates.languages` (hreflang) de cada
 * página — así ambos no pueden desincronizarse.
 */
export const ES_TO_EN: Record<string, string> = {
  "/": "/en",
  "/siam": "/en/siam",
  "/core-ops": "/en/core-ops",
  "/adminapp": "/en/adminapp",
  "/laboratorio": "/en/lab",
  "/precios": "/en/pricing",
  "/acerca-de": "/about",
  "/contacto": "/contact",
  "/politica-privacidad": "/privacy",
};

export const EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.entries(ES_TO_EN).map(([es, en]) => [en, es]),
);

/** true si la ruta (o su versión sin slash final) tiene contraparte en inglés/español. */
function normalize(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function isEnglishPath(pathname: string): boolean {
  const p = normalize(pathname);
  return p === "/en" || p.startsWith("/en/") || p in EN_TO_ES;
}

/**
 * Devuelve la URL de la contraparte en el otro idioma. Si la ruta no tiene
 * par exacto (p.ej. /proyectos/[id], que no tiene versión en inglés — ver
 * scope de i18n), cae a la home del idioma de destino.
 */
export function counterpartPath(pathname: string): string {
  const p = normalize(pathname);
  if (isEnglishPath(p)) {
    return EN_TO_ES[p] ?? "/";
  }
  return ES_TO_EN[p] ?? "/en";
}
