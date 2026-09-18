// Registro de agentes conversacionales. Cada producto tiene su propio servicio
// (whatsapp-agent-*) con su propia base de datos: el origen de una conversación
// es simplemente qué agente la atendió, no un campo dentro de los datos.
//
// Un agente solo aparece en el panel si tiene URL configurada. Así se puede
// desplegar el agregador antes de que todos los agentes estén publicados.

export interface Agente {
  id: string;
  nombre: string;
  url: string;
  adminKey: string;
}

interface DefinicionAgente {
  id: string;
  nombre: string;
  url?: string;
  adminKey?: string;
}

// Praxia Labs mantiene los nombres de variable originales (AGENT_BACKEND_URL /
// AGENT_ADMIN_KEY) para no romper el despliegue que ya está en producción.
const DEFINICIONES: DefinicionAgente[] = [
  {
    id: "praxialabs",
    nombre: "Praxia Labs",
    url: process.env.AGENT_BACKEND_URL || process.env.NEXT_PUBLIC_AGENT_URL,
    adminKey: process.env.AGENT_ADMIN_KEY,
  },
  {
    id: "adminapp",
    nombre: "AdminApp",
    url: process.env.AGENT_ADMINAPP_URL,
    adminKey: process.env.AGENT_ADMINAPP_ADMIN_KEY,
  },
  {
    id: "saludapp",
    nombre: "SaludApp",
    url: process.env.AGENT_SALUDAPP_URL,
    adminKey: process.env.AGENT_SALUDAPP_ADMIN_KEY,
  },
  {
    id: "marketing40",
    nombre: "Marketing 4.0",
    url: process.env.AGENT_MARKETING40_URL,
    adminKey: process.env.AGENT_MARKETING40_ADMIN_KEY,
  },
];

export function agentesConfigurados(): Agente[] {
  return DEFINICIONES.filter((d) => d.url).map((d) => ({
    id: d.id,
    nombre: d.nombre,
    url: d.url!.replace(/\/$/, ""),
    adminKey: d.adminKey || "",
  }));
}

export function buscarAgente(id: string): Agente | undefined {
  return agentesConfigurados().find((a) => a.id === id);
}

// Un agente caído no debe dejar colgado el panel entero: se corta pronto y el
// resto de productos se muestra igual.
export const TIMEOUT_AGENTE_MS = 8000;

export async function pedirAlAgente(agente: Agente, ruta: string): Promise<Response> {
  return fetch(`${agente.url}${ruta}`, {
    headers: { "x-admin-key": agente.adminKey },
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_AGENTE_MS),
  });
}
