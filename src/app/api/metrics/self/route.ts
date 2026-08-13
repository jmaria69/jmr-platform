import { NextRequest, NextResponse } from "next/server";
import { selfTrafficSnapshot } from "@/lib/self-metrics";

// Auto-métricas de esta misma app para el panel de escalabilidad. Público
// (no requiere sesión) y dinámico para no cachearse — igual que /api/health.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // proxy.ts acumula el contador (globalThis no se comparte con este route
  // handler en producción, ver comentario en proxy.ts) y lo pasa aquí por
  // cabecera. En `next dev` (mismo proceso) la cabecera también llega, pero
  // se deja el fallback local por si el request no pasó por el proxy.
  const header = request.headers.get("x-self-traffic");
  const traffic = header ? JSON.parse(header) : selfTrafficSnapshot();
  return NextResponse.json({ traffic });
}
