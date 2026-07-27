import { describe, expect, it } from "vitest";
import { filtrarLaboratorio, CON_LANDING } from "./laboratorio";

const proyectos = [
  { id: "siam" },
  { id: "crm-it" },
  { id: "admin-app" },
  { id: "olga-ai" },
  { id: "saludapp" },
];

describe("filtrarLaboratorio", () => {
  it("excluye los productos que tienen landing propia", () => {
    expect(filtrarLaboratorio(proyectos).map((p) => p.id)).toEqual(["olga-ai", "saludapp"]);
  });

  it("no modifica el array recibido", () => {
    const copia = [...proyectos];
    filtrarLaboratorio(proyectos);
    expect(proyectos).toEqual(copia);
  });

  it("devuelve una lista vacía si todo tiene landing", () => {
    expect(filtrarLaboratorio([{ id: "siam" }, { id: "crm-it" }])).toEqual([]);
  });

  it("conserva el resto de propiedades del proyecto", () => {
    const [p] = filtrarLaboratorio([{ id: "olga-ai", name: "OLGA" }]);
    expect(p.name).toBe("OLGA");
  });
});

describe("CON_LANDING", () => {
  it("contiene los tres productos con landing", () => {
    expect([...CON_LANDING].sort()).toEqual(["admin-app", "crm-it", "siam"]);
  });
});
