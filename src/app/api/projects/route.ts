import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import {
  findAllProjects,
  findProjectsByCategory,
  createProject,
  getProjectsStats,
  ProjectAlreadyExistsError,
} from "@/lib/repositories";
import {
  apiSuccess,
  apiCreated,
  apiBadRequest,
  apiServerError,
} from "@/lib/api-response";

async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * GET /api/projects
 * Returns all projects with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const includeStats = searchParams.get("stats") === "true";

    const projects = category
      ? await findProjectsByCategory(category as "web" | "desktop" | "mobile" | "ai" | "automation")
      : await findAllProjects();

    const meta = includeStats ? { stats: await getProjectsStats() } : undefined;
    return apiSuccess(projects, meta);
  } catch (err) {
    return apiServerError();
  }
}

/**
 * POST /api/projects
 * Creates a new project (requiere sesión admin)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession(request);
    if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    const body = await request.json();

    // Validation
    const errors: string[] = [];
    if (!body.name?.trim()) errors.push("name es obligatorio");
    if (!body.description?.trim()) errors.push("description es obligatorio");
    if (!body.category) errors.push("category es obligatorio");
    if (!body.status) errors.push("status es obligatorio");

    if (errors.length > 0) {
      return apiBadRequest("Datos de proyecto inválidos", { fields: errors });
    }

    const project = await createProject({
      name: body.name.trim(),
      description: body.description.trim(),
      longDescription: body.longDescription?.trim() || body.description.trim(),
      tech: body.tech || [],
      status: body.status,
      category: body.category,
      color: body.color || "#3b82f6",
      image: body.image || `/projects/default.svg`,
      url: body.url || undefined,
      github: body.github || undefined,
      metrics: {
        users: body.metrics?.users || undefined,
        revenue: body.metrics?.revenue || undefined,
        rating: body.metrics?.rating || undefined,
      },
    });

    return apiCreated(project);
  } catch (err) {
    if (err instanceof ProjectAlreadyExistsError) {
      return apiBadRequest(err.message);
    }
    return apiServerError();
  }
}
