import { getSession } from "@/lib/auth/session";
import { NextResponse } from "next/server";

const AGENT_URL = process.env.AGENT_BACKEND_URL || process.env.NEXT_PUBLIC_AGENT_URL || "http://127.0.0.1:8010";
const AGENT_ADMIN_KEY = process.env.AGENT_ADMIN_KEY || "";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${AGENT_URL}/conversaciones`, {
      headers: { "x-admin-key": AGENT_ADMIN_KEY },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "El agente no respondió correctamente" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "No se pudo conectar con el agente" }, { status: 502 });
  }
}
