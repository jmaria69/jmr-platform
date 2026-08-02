import { NextResponse } from "next/server";
import { selfTrafficSnapshot } from "@/lib/self-metrics";

// Auto-métricas de esta misma app para el panel de escalabilidad. Público
// (no requiere sesión) y dinámico para no cachearse — igual que /api/health.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ traffic: selfTrafficSnapshot() });
}
