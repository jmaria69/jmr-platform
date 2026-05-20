/**
 * Projects Repository — Data Access Layer
 *
 * Dual-mode: uses Drizzle/Neon when DATABASE_URL is set,
 * falls back to in-memory store for local dev without a DB.
 */

import { Project } from "@/types";
import { projects as seed } from "@/lib/projects";

// ─── Database imports (lazy) ───
let _dbModule: typeof import("@/lib/db") | null = null;
let _schemaModule: typeof import("@/lib/db/schema") | null = null;
let _eqFn: typeof import("drizzle-orm")["eq"] | null = null;

async function getDbModules() {
  if (!USE_DB || !process.env.DATABASE_URL) return null;
  if (!_dbModule) {
    _dbModule = await import("@/lib/db");
    _schemaModule = await import("@/lib/db/schema");
    const drizzleOrm = await import("drizzle-orm");
    _eqFn = drizzleOrm.eq;
  }
  return { getDb: _dbModule!.getDb, schema: _schemaModule!, eq: _eqFn! };
}

// ─── In-memory store (source of truth until DB migration is run) ───
// Set USE_DB=true in env to switch to Drizzle/Neon.
const USE_DB = process.env.USE_DB === "true";
let memoryStore: Project[] = [...seed];

// ─── Helpers ───

function dbRowToProject(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    longDescription: (row.longDescription ?? row.long_description ?? "") as string,
    tech: (row.tech ?? []) as string[],
    status: row.status as Project["status"],
    category: row.category as Project["category"],
    url: (row.url ?? undefined) as string | undefined,
    github: (row.github ?? undefined) as string | undefined,
    image: row.image as string,
    color: row.color as string,
    metrics: {
      users: (row.metricsUsers ?? row.metrics_users ?? undefined) as number | undefined,
      revenue: (row.metricsRevenue ?? row.metrics_revenue ?? undefined) as number | undefined,
      rating: (row.metricsRating ?? row.metrics_rating ?? undefined) as number | undefined,
    },
  };
}

// ─── Read operations ───

export async function findAllProjects(): Promise<Project[]> {
  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const rows = await db.select().from(mods.schema.projects);
    return rows.map(dbRowToProject);
  }
  return [...memoryStore];
}

export async function findProjectById(id: string): Promise<Project | undefined> {
  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const rows = await db
      .select()
      .from(mods.schema.projects)
      .where(mods.eq(mods.schema.projects.id, id));
    return rows[0] ? dbRowToProject(rows[0]) : undefined;
  }
  return memoryStore.find((p) => p.id === id);
}

export async function findProjectsByCategory(
  category: Project["category"]
): Promise<Project[]> {
  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const rows = await db
      .select()
      .from(mods.schema.projects)
      .where(mods.eq(mods.schema.projects.category, category));
    return rows.map(dbRowToProject);
  }
  return memoryStore.filter((p) => p.category === category);
}

export async function findProjectsByStatus(
  status: Project["status"]
): Promise<Project[]> {
  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const rows = await db
      .select()
      .from(mods.schema.projects)
      .where(mods.eq(mods.schema.projects.status, status));
    return rows.map(dbRowToProject);
  }
  return memoryStore.filter((p) => p.status === status);
}

export async function countProjects(): Promise<number> {
  const all = await findAllProjects();
  return all.length;
}

// ─── Write operations ───

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  const id = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const existing = await findProjectById(id);
  if (existing) throw new ProjectAlreadyExistsError(id);

  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    await db.insert(mods.schema.projects).values({
      id,
      name: data.name,
      description: data.description,
      longDescription: data.longDescription,
      tech: data.tech,
      status: data.status,
      category: data.category,
      url: data.url ?? null,
      github: data.github ?? null,
      image: data.image,
      color: data.color,
      metricsUsers: data.metrics?.users ?? null,
      metricsRevenue: data.metrics?.revenue ?? null,
      metricsRating: data.metrics?.rating ?? null,
    });
    return { id, ...data };
  }

  const project: Project = { id, ...data };
  memoryStore = [...memoryStore, project];
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<Omit<Project, "id">>
): Promise<Project> {
  const existing = await findProjectById(id);
  if (!existing) throw new ProjectNotFoundError(id);

  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.longDescription !== undefined) updateData.longDescription = data.longDescription;
    if (data.tech !== undefined) updateData.tech = data.tech;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.github !== undefined) updateData.github = data.github;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.metrics?.users !== undefined) updateData.metricsUsers = data.metrics.users;
    if (data.metrics?.revenue !== undefined) updateData.metricsRevenue = data.metrics.revenue;
    if (data.metrics?.rating !== undefined) updateData.metricsRating = data.metrics.rating;
    updateData.updatedAt = new Date();

    await db
      .update(mods.schema.projects)
      .set(updateData)
      .where(mods.eq(mods.schema.projects.id, id));

    return { ...existing, ...data };
  }

  const updated = { ...existing, ...data };
  memoryStore = memoryStore.map((p) => (p.id === id ? updated : p));
  return updated;
}

export async function deleteProject(id: string): Promise<void> {
  const existing = await findProjectById(id);
  if (!existing) throw new ProjectNotFoundError(id);

  const mods = await getDbModules();
  if (mods) {
    const db = mods.getDb();
    await db
      .delete(mods.schema.projects)
      .where(mods.eq(mods.schema.projects.id, id));
    return;
  }

  memoryStore = memoryStore.filter((p) => p.id !== id);
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
