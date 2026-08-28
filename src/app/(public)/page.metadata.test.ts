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

import { metadata } from "./page";

describe("home metadata", () => {
  it("declara una URL canónica para la home", () => {
    expect(metadata.alternates?.canonical).toBe("/");
  });
});
