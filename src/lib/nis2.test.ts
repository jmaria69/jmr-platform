import { describe, expect, it } from "vitest";
import { evaluarNis2, NIS2_SECTORS, FUENTES_NIS2 } from "./nis2";

describe("evaluarNis2", () => {
  it("deja fuera de ámbito a una empresa pequeña de sector listado", () => {
    const r = evaluarNis2({ sectorId: "energia", empleados: 20, facturacionMEur: 3 });
    expect(r.categoria).toBe("fuera");
    expect(r.enAmbito).toBe(false);
  });

  it("deja fuera de ámbito a una empresa grande de sector no listado", () => {
    const r = evaluarNis2({ sectorId: "otro", empleados: 900, facturacionMEur: 200 });
    expect(r.categoria).toBe("fuera");
    expect(r.enAmbito).toBe(false);
  });

  it("clasifica como importante a una mediana del Anexo I", () => {
    const r = evaluarNis2({ sectorId: "energia", empleados: 80, facturacionMEur: 15 });
    expect(r.categoria).toBe("importante");
    expect(r.enAmbito).toBe(true);
  });

  it("clasifica como esencial a una grande del Anexo I por empleados", () => {
    const r = evaluarNis2({ sectorId: "energia", empleados: 300, facturacionMEur: 20 });
    expect(r.categoria).toBe("esencial");
  });

  it("clasifica como esencial a una grande del Anexo I por facturación", () => {
    const r = evaluarNis2({ sectorId: "sanidad", empleados: 60, facturacionMEur: 80 });
    expect(r.categoria).toBe("esencial");
  });

  it("nunca clasifica como esencial a un sector del Anexo II", () => {
    const r = evaluarNis2({ sectorId: "alimentacion", empleados: 900, facturacionMEur: 300 });
    expect(r.categoria).toBe("importante");
  });

  it("entra en ámbito por facturación aunque tenga menos de 50 empleados", () => {
    const r = evaluarNis2({ sectorId: "digital", empleados: 30, facturacionMEur: 40 });
    expect(r.enAmbito).toBe(true);
  });

  it("devuelve las obligaciones de notificación cuando está en ámbito", () => {
    const r = evaluarNis2({ sectorId: "energia", empleados: 80, facturacionMEur: 15 });
    expect(r.obligaciones.some((o) => o.includes("24 h"))).toBe(true);
    expect(r.obligaciones.some((o) => o.includes("72 h"))).toBe(true);
  });

  it("no devuelve obligaciones cuando está fuera de ámbito", () => {
    const r = evaluarNis2({ sectorId: "energia", empleados: 10, facturacionMEur: 1 });
    expect(r.obligaciones).toHaveLength(0);
  });

  it("calcula una exposición creciente con el tamaño", () => {
    const pequena = evaluarNis2({ sectorId: "energia", empleados: 60, facturacionMEur: 12 });
    const grande = evaluarNis2({ sectorId: "energia", empleados: 240, facturacionMEur: 12 });
    expect(grande.exposicionEur).toBeGreaterThan(pequena.exposicionEur);
  });

  it("ancla la exposición mínima en el coste medio publicado de 75.000 €", () => {
    const r = evaluarNis2({ sectorId: "energia", empleados: 50, facturacionMEur: 11 });
    expect(r.exposicionEur).toBeGreaterThanOrEqual(75000);
  });

  it("da exposición 0 fuera de ámbito", () => {
    const r = evaluarNis2({ sectorId: "otro", empleados: 5, facturacionMEur: 1 });
    expect(r.exposicionEur).toBe(0);
  });

  it("trata las entradas negativas como cero en lugar de romper", () => {
    const r = evaluarNis2({ sectorId: "energia", empleados: -10, facturacionMEur: -5 });
    expect(r.enAmbito).toBe(false);
    expect(r.exposicionEur).toBe(0);
  });
});

describe("NIS2_SECTORS", () => {
  it("expone sectores con id, etiqueta y anexo", () => {
    expect(NIS2_SECTORS.length).toBeGreaterThan(5);
    for (const s of NIS2_SECTORS) {
      expect(s.id).toBeTruthy();
      expect(s.label).toBeTruthy();
      expect(["I", "II", "ninguno"]).toContain(s.anexo);
    }
  });

  it("incluye siempre una opción de escape para sector no listado", () => {
    expect(NIS2_SECTORS.some((s) => s.anexo === "ninguno")).toBe(true);
  });
});

describe("FUENTES_NIS2", () => {
  it("toda cifra publicada tiene fuente con url", () => {
    expect(FUENTES_NIS2.length).toBeGreaterThan(0);
    for (const f of FUENTES_NIS2) {
      expect(f.url).toMatch(/^https:\/\//);
      expect(f.titulo).toBeTruthy();
    }
  });
});
