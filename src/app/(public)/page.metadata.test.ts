import { describe, expect, it, vi } from "vitest";

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

import { metadata, ORG_JSON_LD } from "./page";

describe("home metadata", () => {
  it("declara una URL canónica para la home", () => {
    expect(metadata.alternates?.canonical).toBe("/");
  });
});

describe("ORG_JSON_LD", () => {
  it("incluye un contactPoint con email y contactType", () => {
    expect(ORG_JSON_LD.contactPoint).toMatchObject({
      "@type": "ContactPoint",
      email: expect.stringContaining("@"),
      contactType: expect.any(String),
    });
  });

  it("incluye una address con addressCountry", () => {
    expect(ORG_JSON_LD.address).toMatchObject({
      "@type": "PostalAddress",
      addressCountry: "ES",
    });
  });
});
