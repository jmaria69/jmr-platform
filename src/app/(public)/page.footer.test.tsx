import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/lib/repositories/projects.repository", () => ({
  findAllProjects: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/home-config", () => ({
  getHomeConfig: vi.fn().mockResolvedValue({
    hero: { tagline: "", h1: "", h1em: "", lede: "" },
    sections: {},
    sectionOrder: [],
    accent: "#000",
    accentBlue: "#000",
    effectsEnabled: false,
    bolt: 0,
    thickness: 0,
    length: 0,
    sparkDensity: 0,
    sparkColors: [],
    starfield: false,
  }),
}));

import Home from "./page";

describe("footer de la home", () => {
  it("enlaza a las páginas de confianza (acerca de, contacto, privacidad)", async () => {
    const element = await Home();
    const html = renderToStaticMarkup(element);
    expect(html).toContain('href="/acerca-de"');
    expect(html).toContain('href="/contacto"');
    expect(html).toContain('href="/politica-privacidad"');
  });
});
