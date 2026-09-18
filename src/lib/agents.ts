// Registro de agentes conversacionales. Cada producto tiene su propio servicio
// (whatsapp-agent-*) con su propia base de datos: el origen de una conversación
// es simplemente qué agente la atendió, no un campo dentro de los datos.
//
// Un agente solo aparece en el panel si tiene URL configurada. Así se puede
// desplegar el agregador antes de que todos los agentes estén publicados.

export interface Agente {
  id: string;
  nombre: string;
  // Clases del badge con el que se distingue el producto en el panel. Viven
  // aquí, junto a la definición, para que añadir un agente nuevo no deje su
  // etiqueta sin color: la API las envía al cliente.
  color: string;
  url: string;
  adminKey: string;
}

interface DefinicionAgente {
  id: string;
  nombre: string;
  color: string;
  url?: string;
  adminKey?: string;
}

// Praxia Labs mantiene los nombres de variable originales (AGENT_BACKEND_URL /
// AGENT_ADMIN_KEY) para no romper el despliegue que ya está en producción.
const DEFINICIONES: DefinicionAgente[] = [
  {
    id: "praxialabs",
    nombre: "Praxia Labs",
    color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
    url: process.env.AGENT_BACKEND_URL || process.env.NEXT_PUBLIC_AGENT_URL,
    adminKey: process.env.AGENT_ADMIN_KEY,
  },
  {
    id: "adminapp",
    nombre: "AdminApp",
    color: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    url: process.env.AGENT_ADMINAPP_URL,
    adminKey: process.env.AGENT_ADMINAPP_ADMIN_KEY,
  },
  {
    id: "saludapp",
    nombre: "SaludApp",
    color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    url: process.env.AGENT_SALUDAPP_URL,
    adminKey: process.env.AGENT_SALUDAPP_ADMIN_KEY,
  },
  {
    id: "marketing40",
    nombre: "Marketing 4.0",
    color: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
    url: process.env.AGENT_MARKETING40_URL,
    adminKey: process.env.AGENT_MARKETING40_ADMIN_KEY,
  },
];

export function agentesConfigurados(): Agente[] {
  return DEFINICIONES.filter((d) => d.url).map((d) => ({
    id: d.id,
    nombre: d.nombre,
    color: d.color,
    url: d.url!.replace(/\/$/, ""),
    adminKey: d.adminKey || "",
  }));
}

export function buscarAgente(id: string): Agente | undefined {
  return agentesConfigurados().find((a) => a.id === id);
}

// Un agente caído no debe dejar colgado el panel entero: se corta pronto y el
// resto de productos se muestra igual. Con varios agentes en paralelo hay que
// dejar margen para que la función no agote su propio límite de ejecución y
// devuelva un 504 que se llevaría por delante también a los sanos.
export const TIMEOUT_AGENTE_MS = 5000;

export async function pedirAlAgente(agente: Agente, ruta: string): Promise<Response> {
  return fetch(`${agente.url}${ruta}`, {
    headers: { "x-admin-key": agente.adminKey },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_AGENTE_MS),
  });
}
