import { describe, expect, it } from "vitest";
import { ES_TO_EN, EN_TO_ES, isEnglishPath, counterpartPath } from "./i18n-routes";

describe("i18n-routes", () => {
  it("ES_TO_EN y EN_TO_ES son inversos exactos", () => {
    for (const [es, en] of Object.entries(ES_TO_EN)) {
      expect(EN_TO_ES[en]).toBe(es);
    }
    expect(Object.keys(EN_TO_ES).length).toBe(Object.keys(ES_TO_EN).length);
  });

  it("isEnglishPath detecta rutas /en/* y las rutas con nombre en inglés ya existentes", () => {
    expect(isEnglishPath("/en")).toBe(true);
    expect(isEnglishPath("/en/siam")).toBe(true);
    expect(isEnglishPath("/about")).toBe(true);
    expect(isEnglishPath("/contact")).toBe(true);
  });

  it("isEnglishPath es false para rutas en español", () => {
    expect(isEnglishPath("/")).toBe(false);
    expect(isEnglishPath("/siam")).toBe(false);
    expect(isEnglishPath("/acerca-de")).toBe(false);
    expect(isEnglishPath("/proyectos/olga-ai")).toBe(false);
  });

  it("counterpartPath resuelve la home en ambos sentidos", () => {
    expect(counterpartPath("/")).toBe("/en");
    expect(counterpartPath("/en")).toBe("/");
  });

  it("counterpartPath resuelve páginas con slug distinto por idioma", () => {
    expect(counterpartPath("/laboratorio")).toBe("/en/lab");
    expect(counterpartPath("/en/lab")).toBe("/laboratorio");
    expect(counterpartPath("/precios")).toBe("/en/pricing");
    expect(counterpartPath("/en/pricing")).toBe("/precios");
  });

  it("counterpartPath resuelve las páginas de confianza ya existentes", () => {
    expect(counterpartPath("/acerca-de")).toBe("/about");
    expect(counterpartPath("/about")).toBe("/acerca-de");
  });

  it("counterpartPath cae a la home del idioma destino cuando no hay par exacto", () => {
    expect(counterpartPath("/proyectos/olga-ai")).toBe("/en");
    expect(counterpartPath("/en/no-existe")).toBe("/");
  });

  it("counterpartPath ignora una barra final", () => {
    expect(counterpartPath("/siam/")).toBe("/en/siam");
  });
});
