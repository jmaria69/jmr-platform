import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/repositories/projects.repository", () => ({
  findAllProjects: vi.fn().mockResolvedValue([]),
}));

import sitemap from "./sitemap";

describe("sitemap", () => {
  it("incluye las páginas de confianza (acerca-de, contacto, política de privacidad)", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://praxialabs.com/acerca-de");
    expect(urls).toContain("https://praxialabs.com/contacto");
    expect(urls).toContain("https://praxialabs.com/politica-privacidad");
  });

  it("incluye las versiones en inglés de las páginas de confianza (about, contact, privacy)", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://praxialabs.com/about");
    expect(urls).toContain("https://praxialabs.com/contact");
    expect(urls).toContain("https://praxialabs.com/privacy");
  });
});
