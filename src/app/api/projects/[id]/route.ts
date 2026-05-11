import { NextRequest } from "next/server";
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
import { NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{ id: string }>;
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
 * PATCH /api/projects/:id
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
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
 * DELETE /api/projects/:id
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    await deleteProject(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (err instanceof ProjectNotFoundError) return apiNotFound("Proyecto");
    return apiServerError();
  }
}
