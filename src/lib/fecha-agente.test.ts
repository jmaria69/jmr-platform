import { describe, it, expect } from "vitest";
import { fechaAgente, msFechaAgente } from "./fecha-agente";

describe("fechaAgente", () => {
  it("interpreta como UTC las fechas sin zona que emiten los agentes", () => {
    // datetime.utcnow().isoformat() no lleva marca de zona; sin la Z, JS lo
    // tomaba como hora local y pintaba las conversaciones desplazadas.
    expect(fechaAgente("2026-09-18T12:00:00.123456")?.toISOString()).toBe(
      "2026-09-18T12:00:00.123Z"
    );
  });

  it("respeta las fechas que ya traen zona", () => {
    expect(fechaAgente("2026-09-18T12:00:00+02:00")?.toISOString()).toBe(
      "2026-09-18T10:00:00.000Z"
    );
    expect(fechaAgente("2026-09-18T12:00:00Z")?.toISOString()).toBe(
      "2026-09-18T12:00:00.000Z"
    );
  });

  it("devuelve null ante fechas ausentes o inválidas", () => {
    expect(fechaAgente(null)).toBeNull();
    expect(fechaAgente("")).toBeNull();
    expect(fechaAgente("vaya-fecha")).toBeNull();
  });
});

describe("msFechaAgente", () => {
  it("ordena correctamente aunque los agentes mezclen formatos", () => {
    const sinZona = "2026-09-18T12:00:00.000000";
    const conZona = "2026-09-18T13:00:00+00:00";
    expect(msFechaAgente(conZona)).toBeGreaterThan(msFechaAgente(sinZona));
  });

  it("manda al final las fechas ausentes", () => {
    expect(msFechaAgente(null)).toBe(-Infinity);
  });
});
