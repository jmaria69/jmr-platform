import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { reorderProjects } from "@/lib/repositories";
import { apiSuccess, apiBadRequest, apiServerError } from "@/lib/api-response";

/**
 * POST /api/projects/reorder
 * Body: { ids: string[] } — la posición en el array define el orden con el
 * que se muestran los proyectos en la home pública y en /proyectos.
 * Requiere sesión admin.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifyToken(token) : null;
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0 || !ids.every((i) => typeof i === "string")) {
      return apiBadRequest("ids debe ser un array de strings");
    }

    await reorderProjects(ids);
    return apiSuccess({ reordered: ids.length });
  } catch {
    return apiServerError();
  }
}
