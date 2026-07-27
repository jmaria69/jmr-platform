import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { findAllCampaigns, createCampaign } from "@/lib/repositories";
import { apiSuccess, apiCreated, apiBadRequest, apiServerError } from "@/lib/api-response";

async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * GET /api/campaigns
 * Lista campañas con métricas de clicks (requiere sesión admin)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const campaigns = await findAllCampaigns();
    return apiSuccess(campaigns);
  } catch {
    return apiServerError();
  }
}

/**
 * POST /api/campaigns
 * Crea una campaña (requiere sesión admin)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const body = await request.json();
    const { slug, name, targetUrl } = body || {};
    if (!slug || !name || !targetUrl) {
      return apiBadRequest("slug, name y targetUrl son obligatorios");
    }
    if (!/^[a-z0-9-]{2,40}$/.test(slug)) {
      return apiBadRequest("El slug solo admite minúsculas, números y guiones (2-40 caracteres)");
    }
    try {
      new URL(targetUrl);
    } catch {
      return apiBadRequest("targetUrl no es una URL válida");
    }

    const campaign = await createCampaign({
      slug,
      name,
      targetUrl,
      description: body.description,
      channel: body.channel,
      utmSource: body.utmSource,
      utmMedium: body.utmMedium,
      utmCampaign: body.utmCampaign,
    });
    return apiCreated(campaign);
  } catch (err: any) {
    if (err?.code === "P2002") return apiBadRequest("Ya existe una campaña con ese slug");
    return apiServerError();
  }
}
