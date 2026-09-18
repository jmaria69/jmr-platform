import { getSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";
import { buscarAgente, agentesConfigurados, pedirAlAgente } from "@/lib/agents";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ telefono: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { telefono } = await params;

  // Los cuatro widgets generan el id igual ("web-" + 8 aleatorios), así que el
  // teléfono por sí solo no identifica el hilo: hace falta saber de qué agente
  // viene. Sin ?producto se usa el primero configurado (comportamiento previo).
  const producto = new URL(req.url).searchParams.get("producto");
  const agente = producto ? buscarAgente(producto) : agentesConfigurados()[0];
  if (!agente) {
    return NextResponse.json({ error: "Agente desconocido" }, { status: 404 });
  }

  try {
    const res = await pedirAlAgente(agente, `/conversaciones/${encodeURIComponent(telefono)}`);
    if (!res.ok) {
      return NextResponse.json({ error: "El agente no respondió correctamente" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con el agente" }, { status: 502 });
  }
}
