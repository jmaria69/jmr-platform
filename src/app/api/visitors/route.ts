import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { getRealtimeVisitors } from "@/lib/services/google-analytics";
import { apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * GET /api/visitors
 * Visitantes en tiempo real (GA4 Realtime). Requiere sesión admin.
 * Si GA no está configurado o falla, devuelve lista vacía para que la tabla
 * muestre su estado vacío en lugar de romperse.
 */
export async function GET(request: NextRequest) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const visitors = await getRealtimeVisitors();
    return apiSuccess(visitors);
  } catch (error) {
    console.error("❌ /api/visitors:", error instanceof Error ? error.message : error);
    return apiSuccess([]);
  }
}
