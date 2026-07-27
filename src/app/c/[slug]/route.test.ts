import { describe, expect, it, vi, beforeEach } from "vitest";

// Mockeamos el repositorio: los tests no tocan la base de datos.
const findCampaignBySlug = vi.fn();
const recordClick = vi.fn();
vi.mock("@/lib/repositories", () => ({
  findCampaignBySlug: (...args: unknown[]) => findCampaignBySlug(...args),
  recordClick: (...args: unknown[]) => recordClick(...args),
}));

import { NextRequest } from "next/server";
import { GET } from "./route";

const CAMPAIGN = {
  id: "camp-1",
  slug: "linkedin-nis2",
  status: "activa",
  targetUrl: "https://praxialabs.com/siam",
  utmSource: "linkedin",
  utmMedium: "social",
  utmCampaign: "nis2-oct",
};

function req(ua: string) {
  return new NextRequest("https://praxialabs.com/c/linkedin-nis2", {
    headers: { "user-agent": ua, "x-forwarded-for": "1.2.3.4" },
  });
}

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });

beforeEach(() => {
  findCampaignBySlug.mockReset();
  recordClick.mockReset();
});

describe("GET /c/[slug]", () => {
  it("redirige a la home y no registra click si el slug no existe", async () => {
    findCampaignBySlug.mockResolvedValue(null);
    const res = await GET(req("Mozilla/5.0"), params("no-existe"));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://praxialabs.com/");
    expect(recordClick).not.toHaveBeenCalled();
  });

  it("redirige a la home y no registra click si la campaña está finalizada", async () => {
    findCampaignBySlug.mockResolvedValue({ ...CAMPAIGN, status: "finalizada" });
    const res = await GET(req("Mozilla/5.0"), params("linkedin-nis2"));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://praxialabs.com/");
    expect(recordClick).not.toHaveBeenCalled();
  });

  it("no cuenta a los bots pero sí los redirige al destino", async () => {
    findCampaignBySlug.mockResolvedValue(CAMPAIGN);
    const res = await GET(req("LinkedInBot/1.0"), params("linkedin-nis2"));
    expect(res.status).toBe(302);
    expect(recordClick).not.toHaveBeenCalled();
    expect(res.headers.get("location")).toContain("praxialabs.com/siam");
  });

  it("registra el click de un humano con IP hasheada (nunca la IP en claro)", async () => {
    findCampaignBySlug.mockResolvedValue(CAMPAIGN);
    const res = await GET(req("Mozilla/5.0 (Windows NT 10.0)"), params("linkedin-nis2"));
    expect(res.status).toBe(302);
    expect(recordClick).toHaveBeenCalledTimes(1);
    const [campaignId, meta] = recordClick.mock.calls[0];
    expect(campaignId).toBe("camp-1");
    expect(meta.ipHash).toMatch(/^[a-f0-9]{32}$/);
    expect(JSON.stringify(meta)).not.toContain("1.2.3.4");
  });

  it("añade los UTM de la campaña a la URL de destino", async () => {
    findCampaignBySlug.mockResolvedValue(CAMPAIGN);
    const res = await GET(req("Mozilla/5.0"), params("linkedin-nis2"));
    const loc = res.headers.get("location")!;
    expect(loc).toContain("utm_source=linkedin");
    expect(loc).toContain("utm_medium=social");
    expect(loc).toContain("utm_campaign=nis2-oct");
  });

  it("da el mismo hash para la misma IP+UA (idempotente) y distinto para otra IP", async () => {
    findCampaignBySlug.mockResolvedValue(CAMPAIGN);
    await GET(req("Mozilla/5.0"), params("linkedin-nis2"));
    await GET(req("Mozilla/5.0"), params("linkedin-nis2"));
    const h1 = recordClick.mock.calls[0][1].ipHash;
    const h2 = recordClick.mock.calls[1][1].ipHash;
    expect(h1).toBe(h2);
  });
});
