import { prisma } from "@/lib/prisma";
import { Project } from "@/types";
import { projects as seed } from "@/lib/projects";

// ─── Helper ───
function dbRowToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    longDescription: row.longDescription || "",
    tech: row.tech || [],
    status: row.status as Project["status"],
    category: row.category as Project["category"],
    url: row.url || undefined,
    github: row.github || undefined,
    image: row.image,
    color: row.color,
    metrics: {
      users: row.metricsUsers || undefined,
      revenue: row.metricsRevenue || undefined,
      rating: row.metricsRating || undefined,
    },
  };
}

// ─── Read operations ───

export async function findAllProjects(): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany();
    return projects.map(dbRowToProject);
  } catch (err) {
    console.warn("DB error, using seed:", err);
    return [...seed];
  }
}

export async function findProjectById(id: string): Promise<Project | undefined> {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    return project ? dbRowToProject(project) : undefined;
  } catch (err) {
    console.warn("DB error:", err);
    return seed.find((p) => p.id === id);
  }
}

export async function findProjectsByCategory(
  category: Project["category"]
): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({ where: { category } });
    return projects.map(dbRowToProject);
  } catch (err) {
    console.warn("DB error:", err);
    return seed.filter((p) => p.category === category);
  }
}

export async function findProjectsByStatus(
  status: Project["status"]
): Promise<Project[]> {
  try {
    const projects = await prisma.project.findMany({ where: { status } });
    return projects.map(dbRowToProject);
  } catch (err) {
    console.warn("DB error:", err);
    return seed.filter((p) => p.status === status);
  }
}

export async function countProjects(): Promise<number> {
  try {
    return await prisma.project.count();
  } catch (err) {
    console.warn("DB error:", err);
    return seed.length;
  }
}

// ─── Write operations ───

export async function createProject(
  data: Omit<Project, "id">
): Promise<Project> {
  const id = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const existing = await findProjectById(id);
  if (existing) throw new ProjectAlreadyExistsError(id);

  try {
    const project = await prisma.project.create({
      data: {
        id,
        name: data.name,
        description: data.description,
        longDescription: data.longDescription,
        tech: data.tech,
        status: data.status,
        category: data.category,
        url: data.url || null,
        github: data.github || null,
        image: data.image,
        color: data.color,
        metricsUsers: data.metrics?.users || null,
        metricsRevenue: data.metrics?.revenue || null,
        metricsRating: data.metrics?.rating || null,
      },
    });
    return dbRowToProject(project);
  } catch (err) {
    console.error("Create project error:", err);
    throw err;
  }
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id">>
): Promise<Project> {
  const existing = await findProjectById(id);
  if (!existing) throw new ProjectNotFoundError(id);

  try {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.longDescription !== undefined)
      updateData.longDescription = data.longDescription;
    if (data.tech !== undefined) updateData.tech = data.tech;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.github !== undefined) updateData.github = data.github;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.metrics?.users !== undefined)
      updateData.metricsUsers = data.metrics.users;
    if (data.metrics?.revenue !== undefined)
      updateData.metricsRevenue = data.metrics.revenue;
    if (data.metrics?.rating !== undefined)
      updateData.metricsRating = data.metrics.rating;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    return dbRowToProject(project);
  } catch (err) {
    console.error("Update project error:", err);
    throw err;
  }
}

export async function deleteProject(id: string): Promise<void> {
  const existing = await findProjectById(id);
  if (!existing) throw new ProjectNotFoundError(id);

  try {
    await prisma.project.delete({ where: { id } });
  } catch (err) {
    console.error("Delete project error:", err);
    throw err;
  }
}

export async function toggleProjectStatus(id: string): Promise<Project> {
  const project = await findProjectById(id);
  if (!project) throw new ProjectNotFoundError(id);

  const nextStatus: Project["status"] =
    project.status === "production" ? "development" : "production";

  return updateProject(id, { status: nextStatus });
}

// ─── Aggregate queries ───

export async function getProjectsStats() {
  const all = await findAllProjects();
  return {
    total: all.length,
    byStatus: {
      production: all.filter((p) => p.status === "production").length,
      beta: all.filter((p) => p.status === "beta").length,
      development: all.filter((p) => p.status === "development").length,
    },
    totalUsers: all.reduce((sum, p) => sum + (p.metrics?.users ?? 0), 0),
    totalRevenue: all.reduce((sum, p) => sum + (p.metrics?.revenue ?? 0), 0),
    avgRating:
      all.reduce((sum, p) => sum + (p.metrics?.rating ?? 0), 0) /
      (all.filter((p) => p.metrics?.rating).length || 1),
  };
}

// ─── Custom errors ───

export class ProjectNotFoundError extends Error {
  constructor(id: string) {
    super(`Project not found: ${id}`);
    this.name = "ProjectNotFoundError";
  }
}

export class ProjectAlreadyExistsError extends Error {
  constructor(id: string) {
    super(`Project already exists: ${id}`);
    this.name = "ProjectAlreadyExistsError";
  }
}