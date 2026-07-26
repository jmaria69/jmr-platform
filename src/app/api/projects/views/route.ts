import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { getProjectViewCounts } from "@/lib/repositories";
import { apiSuccess, apiServerError } from "@/lib/api-response";

/**
 * GET /api/projects/views — conteo de vistas por proyecto (requiere sesión admin).
 * Devuelve un mapa projectId → { total, last7d, uniques }.
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    return apiSuccess(await getProjectViewCounts());
  } catch {
    return apiServerError();
  }
}
