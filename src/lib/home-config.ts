import { prisma } from "@/lib/prisma";

/** Configuración de apariencia de la home, editable desde /admin/apariencia. */
export type HomeConfig = {
  accent: string;       // cian principal (acento del sitio)
  accentBlue: string;   // azul del degradado
  effectsEnabled: boolean;
  bolt: string;         // preset del rayo: fuego | azul | lima | oro | magenta | hielo
  thickness: number;    // grosor del haz (0.5–2)
  length: number;       // longitud de la estela (8–34 puntos)
  sparkDensity: number; // densidad de chispas (0–2)
  sparkColors: string[];// colores de las partículas
  starfield: boolean;   // constelación viva del hero
  hero: { tagline: string; h1: string; h1em: string; lede: string };
  sections: { problema: boolean; servicios: boolean; como: boolean; productos: boolean; contacto: boolean };
};

export const HOME_DEFAULTS: HomeConfig = {
  accent: "#00f2ff",
  accentBlue: "#3b6bff",
  effectsEnabled: true,
  bolt: "azul",
  thickness: 1,
  length: 22,
  sparkDensity: 1,
  sparkColors: ["#a88cff", "#c9b8e8", "#8f6dff", "#b9a6e6", "#ff8a3c", "#ff6a1e"],
  starfield: true,
  hero: {
    tagline: "Automatización a medida · desde España",
    h1: "El trabajo que haces a mano,",
    h1em: "hecho solo",
    lede:
      'No vendemos "IA". Nos sentamos 15 minutos contigo, encontramos qué te come el día — facturas, seguimiento, informes — y montamos un sistema que lo hace por ti. En producción, no en diapositivas.',
  },
  sections: { problema: true, servicios: true, como: true, productos: true, contacto: true },
};

/** Mezcla defaults + lo guardado, tolerante a campos ausentes o BD caída. */
export function mergeHomeConfig(data: Partial<HomeConfig> | null | undefined): HomeConfig {
  const d = data ?? {};
  return {
    ...HOME_DEFAULTS,
    ...d,
    hero: { ...HOME_DEFAULTS.hero, ...(d.hero ?? {}) },
    sections: { ...HOME_DEFAULTS.sections, ...(d.sections ?? {}) },
    sparkColors: Array.isArray(d.sparkColors) && d.sparkColors.length ? d.sparkColors : HOME_DEFAULTS.sparkColors,
  };
}

export async function getHomeConfig(): Promise<HomeConfig> {
  try {
    const row = await prisma.homeConfig.findUnique({ where: { id: 1 } });
    return mergeHomeConfig(row?.data as Partial<HomeConfig> | undefined);
  } catch {
    return HOME_DEFAULTS;
  }
}

export async function saveHomeConfig(data: HomeConfig): Promise<void> {
  await prisma.homeConfig.upsert({
    where: { id: 1 },
    create: { id: 1, data: data as object },
    update: { data: data as object },
  });
}
