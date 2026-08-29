import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/lib/repositories/projects.repository", () => ({
  findAllProjects: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/home-config", () => ({
  getHomeConfig: vi.fn().mockResolvedValue({
    hero: {
      tagline: "Automatización a medida",
      h1: "El trabajo que haces a mano,",
      h1em: "hecho solo",
      lede: "No vendemos IA. Montamos un sistema que lo hace por ti.",
    },
    sections: { problema: true, servicios: true, como: true, productos: true, contacto: true },
    sectionOrder: ["problema", "servicios", "como", "productos", "contacto"],
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

describe("SSR de la home para agentes sin JS", () => {
  it("renderiza un único <h1> con el titular real en el HTML crudo", async () => {
    const element = await Home();
    const html = renderToStaticMarkup(element);
    const matches = html.match(/<h1[^>]*>.*?<\/h1>/gs) ?? [];
    expect(matches).toHaveLength(1);
    expect(matches[0]).toContain("El trabajo que haces a mano");
  });

  it("incluye al menos 500 caracteres de texto legible sin ejecutar JS", async () => {
    const element = await Home();
    const html = renderToStaticMarkup(element);
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    expect(text.length).toBeGreaterThanOrEqual(500);
  });
});
