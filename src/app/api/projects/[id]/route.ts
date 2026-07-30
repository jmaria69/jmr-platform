import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import {
  findProjectById,
  updateProject,
  deleteProject,
  ProjectNotFoundError,
} from "@/lib/repositories";
import {
  apiSuccess,
  apiNotFound,
  apiServerError,
} from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * GET /api/projects/:id
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const project = await findProjectById(id);
    if (!project) return apiNotFound("Proyecto");
    return apiSuccess(project);
  } catch {
    return apiServerError();
  }
}

/**
 * PATCH /api/projects/:id (requiere sesión admin)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();
    const updated = await updateProject(id, body);
    return apiSuccess(updated);
  } catch (err) {
    if (err instanceof ProjectNotFoundError) return apiNotFound("Proyecto");
    return apiServerError();
  }
}

/**
 * DELETE /api/projects/:id (requiere sesión admin)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    const { id } = await params;
    await deleteProject(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ProjectNotFoundError) return apiNotFound("Proyecto");
    return apiServerError();
  }
}
