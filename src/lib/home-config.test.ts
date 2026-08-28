import { describe, expect, it } from "vitest";
import { mergeHomeConfig, HOME_DEFAULTS } from "./home-config";

describe("mergeHomeConfig", () => {
  it("usa los defaults cuando no hay datos guardados", () => {
    expect(mergeHomeConfig(null).hero).toEqual(HOME_DEFAULTS.hero);
  });

  it("respeta un h1 guardado no vacío", () => {
    const cfg = mergeHomeConfig({ hero: { ...HOME_DEFAULTS.hero, h1: "Otro titular" } });
    expect(cfg.hero.h1).toBe("Otro titular");
  });

  it("cae al default si el admin guardó el h1 en blanco (nunca deja el H1 vacío)", () => {
    const cfg = mergeHomeConfig({ hero: { ...HOME_DEFAULTS.hero, h1: "", h1em: "" } });
    expect(cfg.hero.h1).toBe(HOME_DEFAULTS.hero.h1);
    expect(cfg.hero.h1em).toBe(HOME_DEFAULTS.hero.h1em);
  });
});
