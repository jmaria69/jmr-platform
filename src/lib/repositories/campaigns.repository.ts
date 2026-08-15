import { prisma } from "@/lib/prisma";

// ─── Domain model ───

export interface CampaignStats {
  total: number;
  last7d: number;
  uniques: number;
}

export interface CampaignWithStats {
  id: string;
  slug: string;
  name: string;
  description: string;
  channel: string;
  status: string;
  targetUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  startDate: Date;
  endDate: Date | null;
  researchNotes: string | null;
  script: string | null;
  videoUrl: string | null;
  createdAt: Date;
  stats: CampaignStats;
}

export interface CreateCampaignInput {
  slug: string;
  name: string;
  description?: string;
  channel?: string;
  targetUrl: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

// Borrador generado por un pipeline de automatización (ver scripts/generate-campaign-draft.ts
// y scripts/sync-campaign.ts): nace en estado "borrador" para revisión manual, nunca se publica
// en automático. researchNotes/script/videoUrl son opcionales porque no todo origen (p.ej. una
// campaña de solo texto para LinkedIn) tiene los tres — a diferencia del pipeline de vídeo con
// ComfyUI, que siempre los rellena.
export interface CreateDraftCampaignInput {
  slug: string;
  name: string;
  description?: string;
  channel?: string;
  targetUrl: string;
  researchNotes?: string;
  script?: string;
  videoUrl?: string;
}

function dbRowToCampaign(row: any, stats: CampaignStats): CampaignWithStats {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    channel: row.channel,
    status: row.status,
    targetUrl: row.targetUrl,
    utmSource: row.utmSource,
    utmMedium: row.utmMedium,
    utmCampaign: row.utmCampaign,
    startDate: row.startDate,
    endDate: row.endDate,
    researchNotes: row.researchNotes ?? null,
    script: row.script ?? null,
    videoUrl: row.videoUrl ?? null,
    createdAt: row.createdAt,
    stats,
  };
}

// ─── Read operations ───

export async function findAllCampaigns(): Promise<CampaignWithStats[]> {
  try {
    const since7d = new Date(Date.now() - 7 * 86400000);
    const campaigns = await prisma.campaign.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { clicks: true } } },
    });

    const [recent, uniques] = await Promise.all([
      prisma.campaignClick.groupBy({
        by: ["campaignId"],
        where: { ts: { gte: since7d } },
        _count: { _all: true },
      }),
      prisma.campaignClick.groupBy({
        by: ["campaignId", "ipHash"],
      }),
    ]);

    const recentMap = new Map(recent.map((r) => [r.campaignId, r._count._all]));
    const uniquesMap = new Map<string, number>();
    uniques.forEach((u) => uniquesMap.set(u.campaignId, (uniquesMap.get(u.campaignId) || 0) + 1));

    return campaigns.map((c) =>
      dbRowToCampaign(c, {
        total: c._count.clicks,
        last7d: recentMap.get(c.id) || 0,
        uniques: uniquesMap.get(c.id) || 0,
      })
    );
  } catch (err) {
    console.warn("DB error listing campaigns:", err);
    return [];
  }
}

export async function findCampaignBySlug(slug: string) {
  try {
    return await prisma.campaign.findUnique({ where: { slug } });
  } catch (err) {
    console.warn("DB error finding campaign:", err);
    return null;
  }
}

// Serie diaria de clicks (para el mini-gráfico del admin)
export async function getClicksByDay(campaignId: string, days = 14): Promise<{ day: string; count: number }[]> {
  try {
    const since = new Date(Date.now() - days * 86400000);
    const clicks = await prisma.campaignClick.findMany({
      where: { campaignId, ts: { gte: since } },
      select: { ts: true },
    });
    const byDay = new Map<string, number>();
    for (let i = days - 1; i >= 0; i--) {
      byDay.set(new Date(Date.now() - i * 86400000).toISOString().slice(0, 10), 0);
    }
    clicks.forEach((c) => {
      const key = c.ts.toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) || 0) + 1);
    });
    return Array.from(byDay.entries()).map(([day, count]) => ({ day, count }));
  } catch (err) {
    console.warn("DB error getting click series:", err);
    return [];
  }
}

// ─── Write operations ───

export async function createCampaign(input: CreateCampaignInput): Promise<CampaignWithStats> {
  const row = await prisma.campaign.create({
    data: {
      slug: input.slug,
      name: input.name,
      description: input.description || "",
      channel: input.channel || "linkedin",
      targetUrl: input.targetUrl,
      utmSource: input.utmSource || "",
      utmMedium: input.utmMedium || "",
      utmCampaign: input.utmCampaign || input.slug,
    },
  });
  return dbRowToCampaign(row, { total: 0, last7d: 0, uniques: 0 });
}

export async function createDraftCampaign(input: CreateDraftCampaignInput): Promise<CampaignWithStats> {
  const row = await prisma.campaign.create({
    data: {
      slug: input.slug,
      name: input.name,
      description: input.description || "",
      channel: input.channel || "linkedin",
      status: "borrador",
      targetUrl: input.targetUrl,
      researchNotes: input.researchNotes ?? null,
      script: input.script ?? null,
      videoUrl: input.videoUrl ?? null,
    },
  });
  return dbRowToCampaign(row, { total: 0, last7d: 0, uniques: 0 });
}

// Actualiza el contenido de un borrador ya existente (mismo slug, re-sincronizado). El llamador
// es responsable de comprobar antes que el estado sigue siendo "borrador" — esta función no
// vuelve a comprobarlo para no ocultar una condición de carrera entre la comprobación y la
// escritura; ver scripts/sync-campaign.ts para el guard real.
export async function updateDraftCampaignContent(
  id: string,
  input: Partial<CreateDraftCampaignInput>
): Promise<CampaignWithStats> {
  const row = await prisma.campaign.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.channel !== undefined && { channel: input.channel }),
      ...(input.targetUrl !== undefined && { targetUrl: input.targetUrl }),
      ...(input.researchNotes !== undefined && { researchNotes: input.researchNotes }),
      ...(input.script !== undefined && { script: input.script }),
      ...(input.videoUrl !== undefined && { videoUrl: input.videoUrl }),
    },
  });
  const [total, uniques] = await Promise.all([
    prisma.campaignClick.count({ where: { campaignId: id } }),
    prisma.campaignClick.groupBy({ by: ["ipHash"], where: { campaignId: id } }),
  ]);
  return dbRowToCampaign(row, { total, last7d: 0, uniques: uniques.length });
}

export async function updateCampaignStatus(id: string, status: string) {
  return prisma.campaign.update({ where: { id }, data: { status } });
}

export async function deleteCampaign(id: string) {
  return prisma.campaign.delete({ where: { id } });
}

export async function recordClick(
  campaignId: string,
  data: { referer?: string; userAgent?: string; ipHash?: string }
) {
  try {
    await prisma.campaignClick.create({
      data: {
        campaignId,
        referer: (data.referer || "").slice(0, 300),
        userAgent: (data.userAgent || "").slice(0, 300),
        ipHash: data.ipHash || "",
      },
    });
  } catch (err) {
    // Un fallo al registrar el click nunca debe romper la redirección
    console.warn("DB error recording click:", err);
  }
}
