import { describe, expect, it, vi, beforeEach } from "vitest";

const findAllProjects = vi.fn();
vi.mock("@/lib/repositories/projects.repository", () => ({
  findAllProjects: (...args: unknown[]) => findAllProjects(...args),
}));

const getHomeConfig = vi.fn();
vi.mock("@/lib/home-config", () => ({
  getHomeConfig: (...args: unknown[]) => getHomeConfig(...args),
}));

import { NextRequest } from "next/server";
import { GET } from "./route";

const CFG = {
  hero: {
    tagline: "Automatización a medida",
    h1: "El trabajo que haces a mano,",
    h1em: "hecho solo",
    lede: "No vendemos IA. Montamos un sistema que lo hace por ti.",
  },
};

const PROJECTS = [
  { id: "olga-ai", name: "OLGA.ai", description: "Agente de operaciones", showOnHome: true },
  { id: "hidden", name: "Oculto", description: "No sale en home", showOnHome: false },
];

beforeEach(() => {
  findAllProjects.mockReset().mockResolvedValue(PROJECTS);
  getHomeConfig.mockReset().mockResolvedValue(CFG);
});

function req() {
  return new NextRequest("https://praxialabs.com/md-home");
}

describe("GET /md-home", () => {
  it("responde con Content-Type text/markdown", async () => {
    const res = await GET(req());
    expect(res.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
  });

  it("añade Accept y Accept-Encoding a Vary", async () => {
    const res = await GET(req());
    expect(res.headers.get("Vary")).toBe("Accept, Accept-Encoding");
  });

  it("incluye el H1 y la descripción de la home", async () => {
    const res = await GET(req());
    const body = await res.text();
    expect(body).toContain("El trabajo que haces a mano, hecho solo");
    expect(body).toContain("No vendemos IA. Montamos un sistema que lo hace por ti.");
  });

  it("solo lista proyectos con showOnHome", async () => {
    const res = await GET(req());
    const body = await res.text();
    expect(body).toContain("OLGA.ai");
    expect(body).not.toContain("Oculto");
  });

  it("enlaza al sitemap y a llms.txt", async () => {
    const res = await GET(req());
    const body = await res.text();
    expect(body).toContain("https://praxialabs.com/sitemap.xml");
    expect(body).toContain("https://praxialabs.com/llms.txt");
  });
});
