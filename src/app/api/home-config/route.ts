import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { getHomeConfig, saveHomeConfig, mergeHomeConfig } from "@/lib/home-config";
import { apiSuccess, apiServerError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

async function requireSession(req: NextRequest) {
  const t = req.cookies.get(SESSION_COOKIE)?.value;
  if (!t) return null;
  return verifyToken(t);
}

/** GET — config actual (requiere sesión admin). */
export async function GET(req: NextRequest) {
  if (!(await requireSession(req))) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  return apiSuccess(await getHomeConfig());
}

/** PUT — guarda la config (requiere sesión admin). Se sanea contra los defaults. */
export async function PUT(req: NextRequest) {
  if (!(await requireSession(req))) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  try {
    const body = await req.json();
    const cfg = mergeHomeConfig(body);
    await saveHomeConfig(cfg);
    return apiSuccess(cfg);
  } catch {
    return apiServerError();
  }
}
