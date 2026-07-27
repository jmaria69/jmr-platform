import { NextResponse } from "next/server";

// Endpoint ligero de salud para el monitor de escalabilidad (blackbox up/down
// + latencia). Público (no requiere sesión) y dinámico para no cachearse.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ status: "ok", service: "praxia-web" });
}
