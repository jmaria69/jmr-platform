/**
 * Lógica de evaluación de ámbito NIS2.
 *
 * Criterio de tamaño: Recomendación 2003/361/CE.
 *   - Mediana empresa: >= 50 empleados O > 10 M€ de facturación.
 *   - Gran empresa:    >= 250 empleados O > 50 M€ de facturación.
 *
 * Entidades esenciales   = Anexo I + gran empresa.
 * Entidades importantes  = resto de entidades dentro de ámbito.
 *
 * IMPORTANTE: España no ha transpuesto NIS2 a fecha de 2026-07-22. Este módulo
 * no debe usarse para afirmar plazos legales concretos: no existen todavía.
 */

export type Anexo = "I" | "II" | "ninguno";

export type Nis2Sector = {
  id: string;
  label: string;
  anexo: Anexo;
};

export type Nis2Input = {
  sectorId: string;
  empleados: number;
  facturacionMEur: number;
};

export type Categoria = "esencial" | "importante" | "fuera";

export type Nis2Result = {
  enAmbito: boolean;
  categoria: Categoria;
  motivo: string;
  obligaciones: string[];
  exposicionEur: number;
};

export type Fuente = {
  titulo: string;
  url: string;
};

export const NIS2_SECTORS: readonly Nis2Sector[] = [
  { id: "energia",       label: "Energía",                          anexo: "I" },
  { id: "transporte",    label: "Transporte",                       anexo: "I" },
  { id: "banca",         label: "Banca y mercados financieros",     anexo: "I" },
  { id: "sanidad",       label: "Sanidad",                          anexo: "I" },
  { id: "agua",          label: "Agua potable y residuales",        anexo: "I" },
  { id: "digital",       label: "Infraestructura digital y TIC",    anexo: "I" },
  { id: "administracion",label: "Administración pública",           anexo: "I" },
  { id: "espacio",       label: "Espacio",                          anexo: "I" },
  { id: "postal",        label: "Servicios postales y mensajería",  anexo: "II" },
  { id: "residuos",      label: "Gestión de residuos",              anexo: "II" },
  { id: "quimica",       label: "Fabricación y distribución química",anexo: "II" },
  { id: "alimentacion",  label: "Producción y distribución de alimentos", anexo: "II" },
  { id: "manufactura",   label: "Fabricación (sanitaria, electrónica, maquinaria, vehículos)", anexo: "II" },
  { id: "proveedores",   label: "Proveedores digitales y plataformas", anexo: "II" },
  { id: "investigacion", label: "Investigación",                    anexo: "II" },
  { id: "otro",          label: "Otro sector",                      anexo: "ninguno" },
];

/** Coste medio publicado de un ciberincidente en una pyme española. */
const COSTE_MEDIO_INCIDENTE_EUR = 75_000;

export const FUENTES_NIS2: readonly Fuente[] = [
  {
    titulo: "NIS2 España: transposición, entidades esenciales, plazos y sanciones — Legiscope",
    url: "https://www.legiscope.com/blog/nis2-espana-transposicion.html",
  },
  {
    titulo: "Ciberseguridad para pymes 2026: retos, IA y normativa NIS2 — Afianza",
    url: "https://www.afianza.es/sala-prensa/ciberseguridad-pymes-empresas-espanolas/",
  },
];

const OBLIGACIONES_BASE = [
  "Notificar una alerta temprana al CSIRT nacional en menos de 24 h desde la detección.",
  "Presentar un informe formal del incidente en un plazo de 72 h.",
  "Implantar medidas de gestión de riesgos de ciberseguridad y poder demostrarlas.",
  "Responsabilidad directa de la dirección sobre el cumplimiento.",
];

function sanear(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function buscarSector(sectorId: string): Nis2Sector | undefined {
  return NIS2_SECTORS.find((s) => s.id === sectorId);
}

/**
 * Exposición económica estimada. Ancla en el coste medio publicado y escala
 * con la plantilla. Es una estimación orientativa, no una previsión.
 */
function calcularExposicion(empleados: number): number {
  const factor = 1 + Math.min(empleados, 250) / 250;
  return Math.round((COSTE_MEDIO_INCIDENTE_EUR * factor) / 1000) * 1000;
}

export function evaluarNis2(input: Nis2Input): Nis2Result {
  const empleados = sanear(input.empleados);
  const facturacion = sanear(input.facturacionMEur);
  const sector = buscarSector(input.sectorId);

  const fuera = (motivo: string): Nis2Result => ({
    enAmbito: false,
    categoria: "fuera",
    motivo,
    obligaciones: [],
    exposicionEur: 0,
  });

  if (!sector || sector.anexo === "ninguno") {
    return fuera(
      "Tu sector no figura entre los recogidos por la directiva. Eso no elimina el riesgo: solo la obligación."
    );
  }

  const esMediana = empleados >= 50 || facturacion > 10;
  if (!esMediana) {
    return fuera(
      "Por tamaño quedas por debajo del umbral general de la directiva. Eso no elimina el riesgo: solo la obligación."
    );
  }

  const esGrande = empleados >= 250 || facturacion > 50;
  const categoria: Categoria = sector.anexo === "I" && esGrande ? "esencial" : "importante";

  const motivo =
    categoria === "esencial"
      ? `${sector.label} figura en el Anexo I y tu empresa supera el umbral de gran empresa: entidad esencial.`
      : `${sector.label} está dentro del ámbito de la directiva y tu empresa supera el umbral de mediana empresa: entidad importante.`;

  return {
    enAmbito: true,
    categoria,
    motivo,
    obligaciones: [...OBLIGACIONES_BASE],
    exposicionEur: calcularExposicion(empleados),
  };
}
