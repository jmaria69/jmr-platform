import { describe, expect, it } from "vitest";
import { PRODUCTS, getProduct } from "./products";

const TITULARES = () => PRODUCTS.map((p) => p.titular);
const TEXTO_COMPLETO = () =>
  PRODUCTS.flatMap((p) => [p.titular, p.bajada, ...p.dolores.map((d) => d.texto)]).join(" ");

// Verbos que implican "detener/impedir el ataque" (bloquear, detener, evitar,
// prevenir, eliminar) cerca de "ataque(s)"/"ciberataque(s)", más las
// fórmulas originales y "blindaje". Ver el test de control negativo más abajo
// para la prueba de que este patrón atrapa las variantes realistas.
const PROMESA_ESCUDO_REGEX =
  /no te (van a )?atacar|te protege de|impide (los )?ataques|(bloque|detien|evita|previen|elimina)\w*\s+(que\s+te\s+ataquen|(los\s+|las\s+)?(ciber)?ataques?)|blindaje/i;

// Cifras en titular/bajada/promesa: porcentajes, importes en euros y
// cantidades con dígitos (horas, días, meses, años...).
const FIGURA_REGEX =
  /\d+([.,]\d+)?\s*%|\d+([.,]\d+)?\s*€|€\s*\d+([.,]\d+)?|\d+\s*(horas?|d[ií]as?|semanas?|meses?|a[ñn]os?|minutos?|h\b)/i;

describe("PRODUCTS", () => {
  it("contiene exactamente los tres productos con landing", () => {
    expect(PRODUCTS.map((p) => p.slug).sort()).toEqual(["adminapp", "core-ops", "siam"]);
  });

  it("cada producto tiene slug, titular, bajada y al menos un dolor", () => {
    for (const p of PRODUCTS) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.titular.length).toBeGreaterThan(10);
      expect(p.bajada.length).toBeGreaterThan(20);
      expect(p.dolores.length).toBeGreaterThan(0);
    }
  });

  it("toda cifra publicada en dolores lleva una fuente con url https", () => {
    for (const p of PRODUCTS) {
      for (const d of p.dolores) {
        if (d.cifra) {
          expect(d.fuente).toBeTruthy();
          expect(d.fuente!.url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("toda cifra en titular/bajada/promesa lleva fuentes de producto con url https", () => {
    for (const p of PRODUCTS) {
      const texto = [p.titular, p.bajada, p.promesa].join(" ");
      if (FIGURA_REGEX.test(texto)) {
        expect(p.fuentes.length).toBeGreaterThan(0);
        for (const fuente of p.fuentes) {
          expect(fuente.url).toMatch(/^https:\/\//);
        }
      }
    }
  });

  it("getProduct devuelve el producto por slug", () => {
    expect(getProduct("siam")?.slug).toBe("siam");
  });

  it("getProduct devuelve undefined para un slug desconocido", () => {
    expect(getProduct("no-existe")).toBeUndefined();
  });
});

describe("reglas globales de copy", () => {
  it("ningún titular menciona IA ni inteligencia artificial", () => {
    for (const titular of TITULARES()) {
      expect(titular).not.toMatch(/\bIA\b|inteligencia artificial/i);
    }
  });

  it("no promete impedir ataques en ninguna parte del copy", () => {
    expect(TEXTO_COMPLETO()).not.toMatch(PROMESA_ESCUDO_REGEX);
  });

  it("el regex de promesa-escudo detecta variantes realistas de la violación (control negativo)", () => {
    // Prueba que el guardarraíl realmente atrapa las frases que debe atrapar,
    // no solo que el copy actual las evita.
    const violaciones = [
      "no te van a atacar",
      "te protege de los ataques",
      "impide los ataques",
      "bloquea los ataques",
      "detiene los ciberataques",
      "evita que te ataquen",
      "previene los ciberataques",
      "elimina los ataques",
      "blindaje total",
    ];
    for (const violacion of violaciones) {
      expect(violacion).toMatch(PROMESA_ESCUDO_REGEX);
    }
  });

  it("no cita ninguna fecha límite de NIS2", () => {
    // España no ha transpuesto la directiva: no hay plazo que citar.
    expect(TEXTO_COMPLETO()).not.toMatch(/antes del \d|fecha l[ií]mite|plazo (m[aá]ximo )?hasta/i);
  });

  it("SIAM no promete despliegue en 48 h", () => {
    const siam = getProduct("siam")!;
    const texto = [siam.titular, siam.bajada, ...siam.dolores.map((d) => d.texto)].join(" ");
    expect(texto).not.toMatch(/48\s*h/i);
  });

  it("SIAM se posiciona como visibilidad y cumplimiento", () => {
    const siam = getProduct("siam")!;
    expect(siam.promesa).toMatch(/notificar|visibilidad|cumplimiento/i);
  });
});
