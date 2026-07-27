import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { updateCampaignStatus, deleteCampaign, getClicksByDay } from "@/lib/repositories";
import { apiSuccess, apiBadRequest, apiServerError } from "@/lib/api-response";

async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * GET /api/campaigns/[id] — serie diaria de clicks (requiere sesión admin)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const series = await getClicksByDay(id);
    return apiSuccess(series);
  } catch {
    return apiServerError();
  }
}

/**
 * PATCH /api/campaigns/[id] — cambia el estado (activa/pausada/finalizada)
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const { status } = await request.json();
    if (!["activa", "pausada", "finalizada"].includes(status)) {
      return apiBadRequest("Estado inválido");
    }
    const updated = await updateCampaignStatus(id, status);
    return apiSuccess(updated);
  } catch {
    return apiServerError();
  }
}

/**
 * DELETE /api/campaigns/[id]
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    await deleteCampaign(id);
    return apiSuccess({ deleted: true });
  } catch {
    return apiServerError();
  }
}
