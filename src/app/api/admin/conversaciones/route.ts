import { getSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { agentesConfigurados, pedirAlAgente } from "@/lib/agents";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentes = agentesConfigurados();
  if (agentes.length === 0) {
    return NextResponse.json(
      { error: "No hay ningún agente configurado (falta AGENT_BACKEND_URL)" },
      { status: 503 }
    );
  }

  const resultados = await Promise.all(
    agentes.map(async (agente) => {
      try {
        const res = await pedirAlAgente(agente, "/conversaciones");
        if (!res.ok) {
          return { agente, error: `respondió ${res.status}` };
        }
        const data = await res.json();
        return { agente, conversaciones: data.conversaciones ?? [] };
      } catch {
        return { agente, error: "no responde" };
      }
    })
  );

  // Se etiqueta cada conversación con su producto de origen y se mezclan todas
  // en una sola lista cronológica; el filtro por producto vive en el cliente.
  const conversaciones = resultados
    .flatMap((r) =>
      (r.conversaciones ?? []).map((c: Record<string, unknown>) => ({
        ...c,
        producto: r.agente.id,
        producto_nombre: r.agente.nombre,
      }))
    )
    .sort((a, b) => String(b.ultimo_timestamp ?? "").localeCompare(String(a.ultimo_timestamp ?? "")));

  // Un agente caído se reporta aparte: el panel sigue mostrando los demás.
  const fallos = resultados
    .filter((r) => r.error)
    .map((r) => ({ producto: r.agente.id, nombre: r.agente.nombre, motivo: r.error }));

  return NextResponse.json({
    conversaciones,
    productos: agentes.map((a) => ({ id: a.id, nombre: a.nombre })),
    fallos,
  });
}
