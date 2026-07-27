/**
 * Catálogo de copy de las landings de producto.
 *
 * Las reglas de la spec (§6) se verifican automáticamente en products.test.ts.
 * Si editas estos textos, ejecuta `npm test` antes de commitear.
 */

import type { Fuente } from "@/lib/nis2";

export type Dolor = {
  texto: string;
  /** true si el texto contiene una cifra publicada; obliga a rellenar `fuente`. */
  cifra?: boolean;
  fuente?: Fuente;
};

export type Product = {
  slug: string;
  nombre: string;
  badge: string;
  titular: string;
  bajada: string;
  promesa: string;
  dolores: Dolor[];
  ctaTexto: string;
  ctaHref: string;
  color: string;
  /** Solo SIAM lleva campaña activa: determina el peso visual en la home. */
  foco: boolean;
  /**
   * Fuentes que respaldan las cifras citadas en `titular`, `bajada` o `promesa`
   * (las cifras de `dolores` ya llevan su propia `fuente`). Debe ser no vacío
   * si alguno de esos tres campos contiene una cifra.
   */
  fuentes: Fuente[];
};

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

export const PRODUCTS: readonly Product[] = [
  {
    slug: "siam",
    nombre: "SIAM",
    badge: "SOC virtual para pymes",
    titular: "Si te atacan mañana, ¿sabrías qué se llevaron?",
    bajada:
      "El 70% de los ciberataques en España caen sobre pymes. El coste medio es de 75.000 €, y la ley te obligará a notificarlo en 24 horas. SIAM te da el SOC que no puedes permitirte contratar.",
    promesa:
      "Visibilidad y cumplimiento: sabrás qué ha pasado en tu red y podrás notificarlo dentro del plazo que exige la directiva.",
    dolores: [
      {
        texto: "El 70% de los ciberataques en España se dirigen a pymes.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto: "El coste medio de un ciberataque a una pyme española es de 75.000 €.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto: "El 60% de las pymes que sufren un ataque grave cierran en los seis meses siguientes.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto:
          "Montar un SOC propio es inviable para una empresa de tu tamaño, y contratar un MSSP grande te deja siendo su cliente más pequeño.",
      },
    ],
    ctaTexto: "Calcular mi exposición",
    ctaHref: "#calculadora",
    color: "#dc2626",
    foco: true,
    fuentes: [FUENTE_INCIBE, FUENTE_NIS2_PLAZO],
  },
  {
    slug: "core-ops",
    nombre: "Core OPS",
    badge: "Operaciones IT en un panel",
    titular: "Tu equipo se entera de que algo falla cuando llama un cliente",
    bajada:
      "Red, ERP, inventario y operaciones repartidos en seis herramientas que nadie mira a la vez. Core OPS los une en un panel único con alertas en tiempo real.",
    promesa:
      "Un solo sitio donde mirar cuando algo va mal, en lugar de seis pestañas y una llamada.",
    dolores: [
      {
        texto:
          "Monitorización de red, ERP y operaciones viven en herramientas distintas que no se hablan entre sí.",
      },
      {
        texto:
          "Cuando hay una incidencia, reconstruir qué pasó exige cruzar registros a mano de varios sistemas.",
      },
      {
        texto: "No hay una cifra fiable de disponibilidad que enseñar a dirección.",
      },
    ],
    ctaTexto: "Ver el panel en vivo",
    ctaHref: "/contacto",
    color: "#06b6d4",
    foco: false,
    fuentes: [],
  },
  {
    slug: "adminapp",
    nombre: "AdminApp Maestro",
    badge: "Para administradores de fincas",
    titular: "Tu despacho tiene las derramas sin cobrar y las persigues a mano",
    bajada:
      "El 14,3% de las viviendas arrastra deuda con su comunidad, con una media de 1.847 € cada una. AdminApp reclama, concilia y documenta sin que tengas que abrir una hoja de cálculo.",
    promesa:
      "Sigues decidiendo tú qué se reclama y a quién; deja de ser tuya la parte de teclear.",
    dolores: [
      {
        texto: "El 14,3% de las viviendas en comunidades españolas tiene deuda pendiente.",
        cifra: true,
        fuente: FUENTE_MOROSIDAD,
      },
      {
        texto: "La deuda media por vivienda morosa es de 1.847 €.",
        cifra: true,
        fuente: FUENTE_MOROSIDAD,
      },
      {
        texto:
          "Actas, circulares y el mismo correo respondido cuarenta veces se llevan las tardes que deberían ser de gestión.",
      },
    ],
    ctaTexto: "Ver AdminApp",
    ctaHref: "/contacto",
    color: "#6366f1",
    foco: false,
    fuentes: [FUENTE_MOROSIDAD],
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
