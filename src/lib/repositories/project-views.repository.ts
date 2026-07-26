import { prisma } from "@/lib/prisma";

export interface ProjectViewStats {
  total: number;
  last7d: number;
  uniques: number;
}

/**
 * Registra una vista de proyecto. Nunca lanza: un fallo de tracking no debe
 * afectar a la navegación del usuario.
 */
export async function recordProjectView(
  projectId: string,
  data: { referer?: string; userAgent?: string; ipHash?: string }
): Promise<void> {
  try {
    await prisma.projectView.create({
      data: {
        projectId,
        referer: (data.referer || "").slice(0, 300),
        userAgent: (data.userAgent || "").slice(0, 300),
        ipHash: data.ipHash || "",
      },
    });
  } catch (err) {
    console.warn("DB error recording project view:", err);
  }
}

/**
 * Conteo de vistas por proyecto: total histórico, últimos 7 días y visitantes
 * únicos (por hash de IP). Devuelve un mapa projectId → stats.
 */
export async function getProjectViewCounts(): Promise<Record<string, ProjectViewStats>> {
  try {
    const since7d = new Date(Date.now() - 7 * 86400000);
    const [totals, recent, uniques] = await Promise.all([
      prisma.projectView.groupBy({ by: ["projectId"], _count: { _all: true } }),
      prisma.projectView.groupBy({
        by: ["projectId"],
        where: { ts: { gte: since7d } },
        _count: { _all: true },
      }),
      prisma.projectView.groupBy({ by: ["projectId", "ipHash"] }),
    ]);

    const recentMap = new Map(recent.map((r) => [r.projectId, r._count._all]));
    const uniquesMap = new Map<string, number>();
    uniques.forEach((u) => uniquesMap.set(u.projectId, (uniquesMap.get(u.projectId) || 0) + 1));

    const out: Record<string, ProjectViewStats> = {};
    for (const t of totals) {
      out[t.projectId] = {
        total: t._count._all,
        last7d: recentMap.get(t.projectId) || 0,
        uniques: uniquesMap.get(t.projectId) || 0,
      };
    }
    return out;
  } catch (err) {
    console.warn("DB error getting project view counts:", err);
    return {};
  }
}
