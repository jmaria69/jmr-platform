import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock de Prisma: los tests no tocan la base de datos.
// vi.hoisted garantiza que los mocks existen antes de que vi.mock (elevado) se ejecute.
const { campaign, campaignClick } = vi.hoisted(() => ({
  campaign: { findMany: vi.fn() },
  campaignClick: { groupBy: vi.fn(), findMany: vi.fn() },
}));
vi.mock("@/lib/prisma", () => ({
  prisma: { campaign, campaignClick },
}));

import { findAllCampaigns, getClicksByDay } from "./campaigns.repository";

beforeEach(() => {
  campaign.findMany.mockReset();
  campaignClick.groupBy.mockReset();
  campaignClick.findMany.mockReset();
});

describe("getClicksByDay", () => {
  it("devuelve una serie continua de N días, rellenando con ceros", async () => {
    campaignClick.findMany.mockResolvedValue([]);
    const serie = await getClicksByDay("camp-1", 7);
    expect(serie).toHaveLength(7);
    expect(serie.every((d) => d.count === 0)).toBe(true);
    // Ordenada de más antigua a hoy
    expect(serie[serie.length - 1].day).toBe(new Date().toISOString().slice(0, 10));
  });

  it("cuenta los clicks en el día correcto", async () => {
    const hoy = new Date();
    const ayer = new Date(Date.now() - 86400000);
    campaignClick.findMany.mockResolvedValue([
      { ts: hoy }, { ts: hoy }, { ts: ayer },
    ]);
    const serie = await getClicksByDay("camp-1", 7);
    const hoyKey = hoy.toISOString().slice(0, 10);
    const ayerKey = ayer.toISOString().slice(0, 10);
    expect(serie.find((d) => d.day === hoyKey)?.count).toBe(2);
    expect(serie.find((d) => d.day === ayerKey)?.count).toBe(1);
  });

  it("devuelve [] si la BD falla (nunca rompe el panel)", async () => {
    campaignClick.findMany.mockRejectedValue(new Error("db down"));
    expect(await getClicksByDay("camp-1")).toEqual([]);
  });
});

describe("findAllCampaigns", () => {
  it("mapea total, last7d y únicos por campaña", async () => {
    campaign.findMany.mockResolvedValue([
      { id: "a", slug: "a", name: "A", description: "", channel: "linkedin", status: "activa",
        targetUrl: "https://x", utmSource: "", utmMedium: "", utmCampaign: "",
        startDate: new Date(), endDate: null, createdAt: new Date(), _count: { clicks: 10 } },
    ]);
    campaignClick.groupBy.mockImplementation((args: { where?: unknown; by: string[] }) => {
      // Con filtro de fecha → clicks recientes (last7d); sin filtro → únicos por ipHash
      if (args.where) return Promise.resolve([{ campaignId: "a", _count: { _all: 4 } }]);
      return Promise.resolve([
        { campaignId: "a", ipHash: "h1" },
        { campaignId: "a", ipHash: "h2" },
      ]);
    });

    const [c] = await findAllCampaigns();
    expect(c.stats.total).toBe(10);
    expect(c.stats.last7d).toBe(4);
    expect(c.stats.uniques).toBe(2);
  });

  it("devuelve [] si la BD falla", async () => {
    campaign.findMany.mockRejectedValue(new Error("db down"));
    expect(await findAllCampaigns()).toEqual([]);
  });
});
