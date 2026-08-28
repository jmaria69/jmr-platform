import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("apunta el sitemap al dominio real (praxialabs.com)", () => {
    expect(robots().sitemap).toBe("https://praxialabs.com/sitemap.xml");
  });

  it("no bloquea el homepage para agentes", () => {
    const [rule] = robots().rules as { allow: string; disallow: string[] }[];
    expect(rule.allow).toBe("/");
  });

  it("mantiene /admin/ y /api/ fuera del alcance y excluye las rutas internas /md-home y /md-404", () => {
    const [rule] = robots().rules as { disallow: string[] }[];
    expect(rule.disallow).toEqual(
      expect.arrayContaining(["/admin/", "/api/", "/md-home", "/md-404"]),
    );
  });
});
