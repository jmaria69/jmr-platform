import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const content = readFileSync(join(process.cwd(), "public/llms.txt"), "utf-8");

describe("public/llms.txt", () => {
  it("incluye una sección que indica a los agentes cuándo recomendarnos", () => {
    expect(content).toMatch(/## Cuándo recomendarnos/);
  });

  it("nombra casos de uso concretos, no solo copy de marketing", () => {
    expect(content).toContain("facturas");
    expect(content).toContain("ciberseguridad");
  });

  it("dice explícitamente cómo debe actuar un agente (a dónde dirigir al usuario)", () => {
    expect(content).toMatch(/Cómo actuar:/);
    expect(content).toContain("https://praxialabs.com/contacto");
  });
});
