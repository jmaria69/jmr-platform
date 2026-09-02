/**
 * English copy for the product landing pages (/en/siam, /en/core-ops,
 * /en/adminapp). Mirrors the shape of `Product` from ./products so both
 * catalogs render through the same <ProductLanding> component.
 *
 * The cited sources are Spanish-language publications (the underlying data
 * is about the Spanish market) — only the surrounding copy is translated,
 * the source titles are kept as published.
 */
import type { Product } from "./products";
import type { Fuente } from "@/lib/nis2";

const FUENTE_INCIBE: Fuente = {
  titulo: "Ciberseguridad para pymes 2026: retos, IA y normativa NIS2 — Afianza",
  url: "https://www.afianza.es/sala-prensa/ciberseguridad-pymes-empresas-espanolas/",
};

const FUENTE_MOROSIDAD: Fuente = {
  titulo: "Morosidad en comunidades de propietarios en 2026 — Guía Administradores de Fincas",
  url: "https://guiaadministradoresfincas.com/noticias/morosidad-en-comunidades-de-propietarios-en-2026-todo-lo-que-el-administrador-de-fincas-debe-saber-tras-la-sentencia-del-tribunal-supremo-y-la-nueva-ley-de-mediacion-obligatoria/",
};

const FUENTE_NIS2_PLAZO: Fuente = {
  titulo: "NIS2 España: transposición, entidades esenciales, plazos y sanciones — Legiscope",
  url: "https://www.legiscope.com/blog/nis2-espana-transposicion.html",
};

export const PRODUCTS_EN: readonly Product[] = [
  {
    slug: "siam",
    nombre: "SIAM",
    badge: "Virtual SOC for SMBs",
    titular: "If you got hit tomorrow, would you know what they took?",
    bajada:
      "70% of cyberattacks in Spain hit small and mid-sized businesses. The average cost is €75,000, and upcoming regulation will require reporting within 24 hours. SIAM gives you the SOC you can't afford to hire.",
    promesa:
      "Visibility and compliance: you'll know what happened on your network and be able to report it within the deadline the directive requires.",
    dolores: [
      {
        texto: "70% of cyberattacks in Spain target small and mid-sized businesses.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto: "The average cost of a cyberattack on a Spanish SMB is €75,000.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto: "60% of SMBs that suffer a serious attack close within the following six months.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto:
          "Running your own SOC isn't realistic at your size, and hiring a large MSSP makes you their smallest, least-priority client.",
      },
    ],
    ctaTexto: "Book a free call",
    ctaHref: "/contact",
    appUrl: "https://siem.praxialabs.com",
    color: "#dc2626",
    foco: true,
    fuentes: [FUENTE_INCIBE, FUENTE_NIS2_PLAZO],
  },
  {
    slug: "core-ops",
    nombre: "Core OPS",
    badge: "IT operations in one dashboard",
    titular: "Your team finds out something's broken when a customer calls",
    bajada:
      "Network, ERP, inventory, and operations spread across six tools nobody watches at once. Core OPS brings them into a single dashboard with real-time alerts.",
    promesa:
      "One place to look when something goes wrong, instead of six tabs and a phone call.",
    dolores: [
      {
        texto:
          "Network monitoring, ERP, and operations live in separate tools that don't talk to each other.",
      },
      {
        texto:
          "When an incident happens, reconstructing what went wrong means manually cross-checking logs across several systems.",
      },
      {
        texto: "There's no reliable uptime figure you can show leadership.",
      },
    ],
    ctaTexto: "Let's talk",
    ctaHref: "/contact",
    appUrl: "https://demcore.praxialabs.com",
    color: "#06b6d4",
    foco: false,
    fuentes: [],
  },
  {
    slug: "adminapp",
    nombre: "AdminApp Maestro",
    badge: "For property management firms",
    titular: "Your office has unpaid dues and chases them by hand",
    bajada:
      "14.3% of homes in Spain carry unpaid debt with their community, averaging €1,847 each. AdminApp claims, reconciles, and documents it without you opening a spreadsheet.",
    promesa:
      "You still decide what gets claimed and from whom; you stop being the one who types it up.",
    dolores: [
      {
        texto: "14.3% of homes in Spanish residential communities have outstanding debt.",
        cifra: true,
        fuente: FUENTE_MOROSIDAD,
      },
      {
        texto: "The average debt per delinquent household is €1,847.",
        cifra: true,
        fuente: FUENTE_MOROSIDAD,
      },
      {
        texto:
          "Minutes, circulars, and the same email answered forty times eat up the afternoons that should go to actual management.",
      },
    ],
    ctaTexto: "Let's talk",
    ctaHref: "/contact",
    appUrl: "https://adminapp.praxialabs.com/presentation",
    color: "#6366f1",
    foco: false,
    fuentes: [FUENTE_MOROSIDAD],
  },
];

export function getProductEn(slug: string): Product | undefined {
  return PRODUCTS_EN.find((p) => p.slug === slug);
}
