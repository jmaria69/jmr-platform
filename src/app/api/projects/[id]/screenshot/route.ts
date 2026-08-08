import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { findProjectById, updateProject, ProjectNotFoundError } from "@/lib/repositories";
import { captureProjectScreenshot } from "@/lib/screenshot";
import { apiSuccess, apiBadRequest, apiNotFound, apiServerError } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Cubre lanzamiento de Chromium en frío + navegación (NAV_TIMEOUT_MS) con margen;
// 60s cabe tanto en el techo de Hobby como en el de Pro sin asumir el plan de Vercel.
export const maxDuration = 60;

async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * PATCH /api/projects/:id/screenshot (requiere sesión admin)
 * Captura la home real del proyecto y actualiza su `image`. Si falla
 * cualquier paso (captura o subida), no se toca la imagen anterior.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const project = await findProjectById(id);
  if (!project) return apiNotFound("Proyecto");
  if (!project.url) return apiBadRequest("El proyecto no tiene URL configurada");

  let shot: Awaited<ReturnType<typeof captureProjectScreenshot>>;
  try {
    shot = await captureProjectScreenshot(project.url);
  } catch {
    return NextResponse.json(
      { error: { code: "CAPTURE_FAILED", message: "No se pudo capturar la web del proyecto (¿está caída o tarda demasiado?)" } },
      { status: 502 },
    );
  }

  try {
    const blob = await put(`projects/${id}-${Date.now()}.png`, shot.buffer, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
      access: "public",
      contentType: shot.contentType,
      addRandomSuffix: false,
    });
    const updated = await updateProject(id, { image: blob.url });
    return apiSuccess(updated);
  } catch (err) {
    if (err instanceof ProjectNotFoundError) return apiNotFound("Proyecto");
    return apiServerError();
  }
}
