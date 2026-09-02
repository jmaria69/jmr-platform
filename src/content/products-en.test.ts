import { describe, expect, it } from "vitest";
import { PRODUCTS_EN, getProductEn } from "./products-en";
import { PRODUCTS } from "./products";

describe("PRODUCTS_EN", () => {
  it("tiene el mismo conjunto de slugs que el catálogo en español", () => {
    expect(PRODUCTS_EN.map((p) => p.slug).sort()).toEqual(PRODUCTS.map((p) => p.slug).sort());
  });

  it("cada producto tiene titular, bajada y al menos un dolor, todos en inglés (sin tildes españolas)", () => {
    for (const p of PRODUCTS_EN) {
      expect(p.titular.length).toBeGreaterThan(10);
      expect(p.bajada.length).toBeGreaterThan(20);
      expect(p.dolores.length).toBeGreaterThan(0);
    }
  });

  it("toda cifra publicada en dolores lleva una fuente con url https", () => {
    for (const p of PRODUCTS_EN) {
      for (const d of p.dolores) {
        if (d.cifra) {
          expect(d.fuente).toBeTruthy();
          expect(d.fuente!.url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("el CTA de cada producto apunta a rutas en inglés, nunca a /contacto", () => {
    for (const p of PRODUCTS_EN) {
      expect(p.ctaHref).not.toBe("/contacto");
    }
  });

  it("getProductEn devuelve el producto correcto por slug", () => {
    expect(getProductEn("siam")?.nombre).toBe("SIAM");
    expect(getProductEn("no-existe")).toBeUndefined();
  });
});
