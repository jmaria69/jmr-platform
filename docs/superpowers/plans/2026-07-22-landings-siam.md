# Landings de producto y calculadora NIS2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir praxialabs.com de portfolio a casa de productos, con `/siam` como landing de conversión y una calculadora de exposición NIS2 que capture emails.

**Architecture:** La lógica de negocio (ámbito NIS2, exposición económica) se extrae a un módulo puro en `src/lib/nis2.ts`, testeado con Vitest. Las landings son páginas Next dentro del route group `(public)`, y su contenido vive en un catálogo de datos separado del JSX. `/proyectos` pasa a redirigir a `/laboratorio`, conservando intactas las URLs indexadas de `/proyectos/[id]`.

**Tech Stack:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS 4, Prisma + Neon, Vitest (nuevo).

## Global Constraints

Copiadas literalmente de la spec `docs/superpowers/specs/2026-07-22-posicionamiento-siam-design.md`. Aplican a **todas** las tareas.

- **La palabra "IA" no aparece por encima del scroll en ninguna landing.** Baja a la sección de cómo funciona.
- **SIAM se posiciona como visibilidad y cumplimiento, nunca como escudo.** Permitido: *"Sabrás qué pasó y podrás notificarlo en las 24 h que exige la ley."* Prohibido: *"No te van a atacar."*
- **PROHIBIDO citar una fecha límite de NIS2.** España no ha transpuesto la directiva. Ángulo válido: *"Llegará con retraso y de golpe. Quien empiece cuando se publique en el BOE, llega tarde."*
- **Toda cifra publicada lleva fuente citada y visible en la página.** Sin excepción.
- **`< 48h` no se replica en `/siam`.** Un SOC no se despliega en 48 h.
- **`/siam` no lleva bloque de stats** hasta que exista el primer cliente.
- Idioma de todo el copy: **español de España**.
- Cifras autorizadas: coste medio de ciberataque a pyme **75.000 €**; **70%** de ciberataques dirigidos a pymes; **60%** de las atacadas gravemente cierran en 6 meses; **1.847 €** de deuda media por vivienda morosa; **14,3%** de viviendas con deuda pendiente.

---

## File Structure

| Archivo | Responsabilidad |
|---|---|
| `src/lib/nis2.ts` | **Crear.** Lógica pura: ámbito NIS2, categoría, obligaciones, exposición. Sin React. |
| `src/lib/nis2.test.ts` | **Crear.** Tests de la lógica anterior. |
| `src/content/products.ts` | **Crear.** Catálogo de los 3 productos (slug, titular, bajada, dolores, fuentes). Datos, sin JSX. |
| `src/content/products.test.ts` | **Crear.** Tests de invariantes de copy (reglas globales). |
| `src/components/public/nis2-calculator.tsx` | **Crear.** UI de la calculadora. Consume `src/lib/nis2.ts`. |
| `src/components/public/product-landing.tsx` | **Crear.** Layout de landing reutilizable por los 3 productos. |
| `src/app/(public)/siam/page.tsx` | **Crear.** Landing SIAM + calculadora. |
| `src/app/(public)/core-ops/page.tsx` | **Crear.** Landing Core OPS. |
| `src/app/(public)/adminapp/page.tsx` | **Crear.** Landing AdminApp. |
| `src/app/(public)/laboratorio/page.tsx` | **Crear.** Lista de proyectos como prueba, no como oferta. |
| `src/app/(public)/proyectos/page.tsx` | **Modificar.** Pasa a redirect 308 → `/laboratorio`. |
| `src/app/(public)/page.tsx` | **Modificar.** Titular nuevo, sección de 3 productos. |
| `src/components/public/navbar.tsx:12-17` | **Modificar.** Nuevos enlaces. |
| `src/app/sitemap.ts:19-25` | **Modificar.** Nuevas rutas. |
| `src/components/public/hero.tsx` | **Eliminar.** Código muerto. |
| `vitest.config.ts` | **Crear.** Configuración de tests. |

**Nota sobre `/proyectos/[id]`:** no se toca. Sigue existiendo y sirviendo las URLs ya indexadas. En Next.js App Router, convertir `proyectos/page.tsx` en redirect **no afecta** a `proyectos/[id]/page.tsx`.

---

### Task 1: Infraestructura de tests

No existe ningún framework de test en el repositorio. Se instala Vitest con entorno jsdom y Testing Library, para poder testear tanto lógica pura como componentes React.

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (scripts)

**Interfaces:**
- Consumes: nada.
- Produces: comando `npm test`, alias `@/` resuelto en tests, `render`/`screen` de Testing Library disponibles, `next/link` mockeado globalmente.

- [ ] **Step 1: Instalar Vitest y Testing Library**

```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 2: Crear `vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
});
```

- [ ] **Step 3: Crear `vitest.setup.ts`**

`next/link` se mockea con un `<a>` normal: los componentes de este plan solo lo usan para navegar, nunca dependen del router, y el mock evita arrastrar el runtime de Next a los tests.

```typescript
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { createElement, type ReactNode } from "react";

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: { children: ReactNode; href: string }) =>
    createElement("a", { href, ...rest }, children),
}));

afterEach(() => {
  cleanup();
});
```

- [ ] **Step 4: Añadir el script a `package.json`**

En el objeto `"scripts"`, añadir esta línea después de `"lint": "eslint",`:

```json
    "test": "vitest run",
```

- [ ] **Step 5: Verificar que el runner arranca**

Run: `npm test`
Expected: sale con el mensaje `No test files found` (aún no hay tests). El comando **no** debe fallar por configuración.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json package-lock.json
git commit -m "chore: añadir vitest con jsdom y testing library"
```

---

### Task 2: Módulo de lógica NIS2

Toda la lógica de la calculadora, sin React, para poder testearla.

Reglas implementadas (Directiva NIS2, criterio de tamaño de la Recomendación 2003/361/CE):
- **Fuera de ámbito:** sector no listado, **o** empresa con < 50 empleados **y** ≤ 10 M€ de facturación.
- **Esencial:** sector del Anexo I **y** (≥ 250 empleados **o** > 50 M€).
- **Importante:** el resto de casos dentro de ámbito.

**Files:**
- Create: `src/lib/nis2.ts`
- Test: `src/lib/nis2.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `NIS2_SECTORS: readonly Nis2Sector[]`
  - `evaluarNis2(input: Nis2Input): Nis2Result`
  - `FUENTES_NIS2: readonly Fuente[]`
  - Tipos `Nis2Sector`, `Nis2Input`, `Nis2Result`, `Fuente`.

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/lib/nis2.test.ts`:

```typescript
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
```

- [ ] **Step 2: Ejecutar los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./nis2"`.

- [ ] **Step 3: Implementar `src/lib/nis2.ts`**

```typescript
/**
 * Lógica de evaluación de ámbito NIS2.
 *
 * Criterio de tamaño: Recomendación 2003/361/CE.
 *   - Mediana empresa: >= 50 empleados O > 10 M€ de facturación.
 *   - Gran empresa:    >= 250 empleados O > 50 M€ de facturación.
 *
 * Entidades esenciales   = Anexo I + gran empresa.
 * Entidades importantes  = resto de entidades dentro de ámbito.
 *
 * IMPORTANTE: España no ha transpuesto NIS2 a fecha de 2026-07-22. Este módulo
 * no debe usarse para afirmar plazos legales concretos: no existen todavía.
 */

export type Anexo = "I" | "II" | "ninguno";

export type Nis2Sector = {
  id: string;
  label: string;
  anexo: Anexo;
};

export type Nis2Input = {
  sectorId: string;
  empleados: number;
  facturacionMEur: number;
};

export type Categoria = "esencial" | "importante" | "fuera";

export type Nis2Result = {
  enAmbito: boolean;
  categoria: Categoria;
  motivo: string;
  obligaciones: string[];
  exposicionEur: number;
};

export type Fuente = {
  titulo: string;
  url: string;
};

export const NIS2_SECTORS: readonly Nis2Sector[] = [
  { id: "energia",       label: "Energía",                          anexo: "I" },
  { id: "transporte",    label: "Transporte",                       anexo: "I" },
  { id: "banca",         label: "Banca y mercados financieros",     anexo: "I" },
  { id: "sanidad",       label: "Sanidad",                          anexo: "I" },
  { id: "agua",          label: "Agua potable y residuales",        anexo: "I" },
  { id: "digital",       label: "Infraestructura digital y TIC",    anexo: "I" },
  { id: "administracion",label: "Administración pública",           anexo: "I" },
  { id: "espacio",       label: "Espacio",                          anexo: "I" },
  { id: "postal",        label: "Servicios postales y mensajería",  anexo: "II" },
  { id: "residuos",      label: "Gestión de residuos",              anexo: "II" },
  { id: "quimica",       label: "Fabricación y distribución química",anexo: "II" },
  { id: "alimentacion",  label: "Producción y distribución de alimentos", anexo: "II" },
  { id: "manufactura",   label: "Fabricación (sanitaria, electrónica, maquinaria, vehículos)", anexo: "II" },
  { id: "proveedores",   label: "Proveedores digitales y plataformas", anexo: "II" },
  { id: "investigacion", label: "Investigación",                    anexo: "II" },
  { id: "otro",          label: "Otro sector",                      anexo: "ninguno" },
];

/** Coste medio publicado de un ciberincidente en una pyme española. */
const COSTE_MEDIO_INCIDENTE_EUR = 75_000;

export const FUENTES_NIS2: readonly Fuente[] = [
  {
    titulo: "NIS2 España: transposición, entidades esenciales, plazos y sanciones — Legiscope",
    url: "https://www.legiscope.com/blog/nis2-espana-transposicion.html",
  },
  {
    titulo: "Ciberseguridad para pymes 2026: retos, IA y normativa NIS2 — Afianza",
    url: "https://www.afianza.es/sala-prensa/ciberseguridad-pymes-empresas-espanolas/",
  },
];

const OBLIGACIONES_BASE = [
  "Notificar una alerta temprana al CSIRT nacional en menos de 24 h desde la detección.",
  "Presentar un informe formal del incidente en un plazo de 72 h.",
  "Implantar medidas de gestión de riesgos de ciberseguridad y poder demostrarlas.",
  "Responsabilidad directa de la dirección sobre el cumplimiento.",
];

function sanear(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function buscarSector(sectorId: string): Nis2Sector | undefined {
  return NIS2_SECTORS.find((s) => s.id === sectorId);
}

/**
 * Exposición económica estimada. Ancla en el coste medio publicado y escala
 * con la plantilla. Es una estimación orientativa, no una previsión.
 */
function calcularExposicion(empleados: number): number {
  const factor = 1 + Math.min(empleados, 250) / 250;
  return Math.round((COSTE_MEDIO_INCIDENTE_EUR * factor) / 1000) * 1000;
}

export function evaluarNis2(input: Nis2Input): Nis2Result {
  const empleados = sanear(input.empleados);
  const facturacion = sanear(input.facturacionMEur);
  const sector = buscarSector(input.sectorId);

  const fuera = (motivo: string): Nis2Result => ({
    enAmbito: false,
    categoria: "fuera",
    motivo,
    obligaciones: [],
    exposicionEur: 0,
  });

  if (!sector || sector.anexo === "ninguno") {
    return fuera(
      "Tu sector no figura entre los recogidos por la directiva. Eso no elimina el riesgo: solo la obligación."
    );
  }

  const esMediana = empleados >= 50 || facturacion > 10;
  if (!esMediana) {
    return fuera(
      "Por tamaño quedas por debajo del umbral general de la directiva. Eso no elimina el riesgo: solo la obligación."
    );
  }

  const esGrande = empleados >= 250 || facturacion > 50;
  const categoria: Categoria = sector.anexo === "I" && esGrande ? "esencial" : "importante";

  const motivo =
    categoria === "esencial"
      ? `${sector.label} figura en el Anexo I y tu empresa supera el umbral de gran empresa: entidad esencial.`
      : `${sector.label} está dentro del ámbito de la directiva y tu empresa supera el umbral de mediana empresa: entidad importante.`;

  return {
    enAmbito: true,
    categoria,
    motivo,
    obligaciones: [...OBLIGACIONES_BASE],
    exposicionEur: calcularExposicion(empleados),
  };
}
```

- [ ] **Step 4: Ejecutar los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — los 16 tests de `nis2.test.ts` en verde, ninguno omitido.

- [ ] **Step 5: Commit**

```bash
git add src/lib/nis2.ts src/lib/nis2.test.ts
git commit -m "feat: lógica de evaluación de ámbito NIS2 con tests"
```

---

### Task 3: Catálogo de productos y tests de invariantes de copy

Las reglas globales de copy (no citar fechas de NIS2, no prometer protección, no decir "IA" en el titular) se convierten en **tests automáticos**. Así no se pueden romper por descuido al editar textos más adelante.

**Files:**
- Create: `src/content/products.ts`
- Test: `src/content/products.test.ts`

**Interfaces:**
- Consumes: nada.
- Produces:
  - `PRODUCTS: readonly Product[]`
  - `getProduct(slug: string): Product | undefined`
  - Tipos `Product`, `Dolor`.

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/content/products.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { PRODUCTS, getProduct } from "./products";

const TITULARES = () => PRODUCTS.map((p) => p.titular);
const TEXTO_COMPLETO = () =>
  PRODUCTS.flatMap((p) => [p.titular, p.bajada, ...p.dolores.map((d) => d.texto)]).join(" ");

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

  it("toda cifra publicada lleva una fuente con url https", () => {
    for (const p of PRODUCTS) {
      for (const d of p.dolores) {
        if (d.cifra) {
          expect(d.fuente).toBeTruthy();
          expect(d.fuente!.url).toMatch(/^https:\/\//);
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
    expect(TEXTO_COMPLETO()).not.toMatch(/no te (van a )?atacar|te protege de|impide (los )?ataques/i);
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
```

- [ ] **Step 2: Ejecutar los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./products"`.

- [ ] **Step 3: Implementar `src/content/products.ts`**

```typescript
/**
 * Catálogo de copy de las landings de producto.
 *
 * Las reglas de la spec (§6) se verifican automáticamente en products.test.ts.
 * Si editas estos textos, ejecuta `npm test` antes de commitear.
 */

import type { Fuente } from "@/lib/nis2";

export type Dolor = {
  texto: string;
  /** true si el texto contiene una cifra publicada; obliga a rellenar `fuente`. */
  cifra?: boolean;
  fuente?: Fuente;
};

export type Product = {
  slug: string;
  nombre: string;
  badge: string;
  titular: string;
  bajada: string;
  promesa: string;
  dolores: Dolor[];
  ctaTexto: string;
  ctaHref: string;
  color: string;
  /** Solo SIAM lleva campaña activa: determina el peso visual en la home. */
  foco: boolean;
};

const FUENTE_INCIBE: Fuente = {
  titulo: "Ciberseguridad para pymes 2026: retos, IA y normativa NIS2 — Afianza",
  url: "https://www.afianza.es/sala-prensa/ciberseguridad-pymes-empresas-espanolas/",
};

const FUENTE_MOROSIDAD: Fuente = {
  titulo: "Morosidad en comunidades de propietarios en 2026 — Guía Administradores de Fincas",
  url: "https://guiaadministradoresfincas.com/noticias/morosidad-en-comunidades-de-propietarios-en-2026-todo-lo-que-el-administrador-de-fincas-debe-saber-tras-la-sentencia-del-tribunal-supremo-y-la-nueva-ley-de-mediacion-obligatoria/",
};

export const PRODUCTS: readonly Product[] = [
  {
    slug: "siam",
    nombre: "SIAM",
    badge: "SOC virtual para pymes",
    titular: "Si te atacan mañana, ¿sabrías qué se llevaron?",
    bajada:
      "El 70% de los ciberataques en España caen sobre pymes. El coste medio es de 75.000 €, y la ley te obligará a notificarlo en 24 horas. SIAM te da el SOC que no puedes permitirte contratar.",
    promesa:
      "Visibilidad y cumplimiento: sabrás qué ha pasado en tu red y podrás notificarlo dentro del plazo que exige la directiva.",
    dolores: [
      {
        texto: "El 70% de los ciberataques en España se dirigen a pymes.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto: "El coste medio de un ciberataque a una pyme española es de 75.000 €.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto: "El 60% de las pymes que sufren un ataque grave cierran en los seis meses siguientes.",
        cifra: true,
        fuente: FUENTE_INCIBE,
      },
      {
        texto:
          "Montar un SOC propio es inviable para una empresa de tu tamaño, y contratar un MSSP grande te deja siendo su cliente más pequeño.",
      },
    ],
    ctaTexto: "Calcular mi exposición",
    ctaHref: "#calculadora",
    color: "#dc2626",
    foco: true,
  },
  {
    slug: "core-ops",
    nombre: "Core OPS",
    badge: "Operaciones IT en un panel",
    titular: "Tu equipo se entera de que algo falla cuando llama un cliente",
    bajada:
      "Red, ERP, inventario y operaciones repartidos en seis herramientas que nadie mira a la vez. Core OPS los une en un panel único con alertas en tiempo real.",
    promesa:
      "Un solo sitio donde mirar cuando algo va mal, en lugar de seis pestañas y una llamada.",
    dolores: [
      {
        texto:
          "Monitorización de red, ERP y operaciones viven en herramientas distintas que no se hablan entre sí.",
      },
      {
        texto:
          "Cuando hay una incidencia, reconstruir qué pasó exige cruzar registros a mano de varios sistemas.",
      },
      {
        texto: "No hay una cifra fiable de disponibilidad que enseñar a dirección.",
      },
    ],
    ctaTexto: "Ver el panel en vivo",
    ctaHref: "/contacto",
    color: "#06b6d4",
    foco: false,
  },
  {
    slug: "adminapp",
    nombre: "AdminApp Maestro",
    badge: "Para administradores de fincas",
    titular: "Tu despacho tiene las derramas sin cobrar y las persigues a mano",
    bajada:
      "El 14,3% de las viviendas arrastra deuda con su comunidad, con una media de 1.847 € cada una. AdminApp reclama, concilia y documenta sin que tengas que abrir una hoja de cálculo.",
    promesa:
      "Sigues decidiendo tú qué se reclama y a quién; deja de ser tuya la parte de teclear.",
    dolores: [
      {
        texto: "El 14,3% de las viviendas en comunidades españolas tiene deuda pendiente.",
        cifra: true,
        fuente: FUENTE_MOROSIDAD,
      },
      {
        texto: "La deuda media por vivienda morosa es de 1.847 €.",
        cifra: true,
        fuente: FUENTE_MOROSIDAD,
      },
      {
        texto:
          "Actas, circulares y el mismo correo respondido cuarenta veces se llevan las tardes que deberían ser de gestión.",
      },
    ],
    ctaTexto: "Ver AdminApp",
    ctaHref: "/contacto",
    color: "#6366f1",
    foco: false,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
```

- [ ] **Step 4: Ejecutar los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — los 16 tests de `nis2.test.ts` más los 10 de `products.test.ts`, todos en verde.

- [ ] **Step 5: Commit**

```bash
git add src/content/products.ts src/content/products.test.ts
git commit -m "feat: catálogo de copy de productos con tests de invariantes"
```

---

### Task 4: Componente de la calculadora NIS2

UI que consume `evaluarNis2`. No contiene lógica de negocio.

**Files:**
- Create: `src/components/public/nis2-calculator.tsx`
- Test: `src/components/public/nis2-calculator.test.tsx`

**Interfaces:**
- Consumes: `evaluarNis2`, `NIS2_SECTORS`, `FUENTES_NIS2` de `@/lib/nis2`.
- Produces: `<Nis2Calculator />`, sin props.

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/components/public/nis2-calculator.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Nis2Calculator } from "./nis2-calculator";

describe("Nis2Calculator", () => {
  it("clasifica como entidad importante con los valores por defecto", () => {
    render(<Nis2Calculator />);
    expect(screen.getByText("Entidad importante")).toBeInTheDocument();
  });

  it("muestra las obligaciones de notificación cuando aplica la directiva", () => {
    render(<Nis2Calculator />);
    expect(screen.getByText(/24 h/)).toBeInTheDocument();
    expect(screen.getByText(/72 h/)).toBeInTheDocument();
  });

  it("pasa a fuera de ámbito al elegir un sector no listado", async () => {
    const user = userEvent.setup();
    render(<Nis2Calculator />);
    await user.selectOptions(screen.getByRole("combobox"), "otro");
    expect(screen.getByText("Fuera del ámbito")).toBeInTheDocument();
    expect(screen.queryByText(/exposición estimada/)).not.toBeInTheDocument();
  });

  it("advierte de que no hay plazo legal vigente en España", () => {
    render(<Nis2Calculator />);
    expect(screen.getByText(/no ha transpuesto todavía la directiva/i)).toBeInTheDocument();
  });

  it("cita las fuentes como enlaces externos", () => {
    render(<Nis2Calculator />);
    const fuentes = screen.getAllByRole("link", { name: /^Fuente:/ });
    expect(fuentes.length).toBeGreaterThan(0);
    for (const f of fuentes) {
      expect(f).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
    }
  });

  it("no promete impedir ataques ni despliegue en 48 h", () => {
    const { container } = render(<Nis2Calculator />);
    expect(container.textContent).not.toMatch(/48\s*h|no te (van a )?atacar/i);
  });
});
```

- [ ] **Step 2: Ejecutar los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./nis2-calculator"`.

- [ ] **Step 3: Crear el componente**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { evaluarNis2, NIS2_SECTORS, FUENTES_NIS2 } from "@/lib/nis2";

export function Nis2Calculator() {
  const [sectorId, setSectorId] = useState("energia");
  const [empleados, setEmpleados] = useState(80);
  const [facturacion, setFacturacion] = useState(15);
  const [enviado, setEnviado] = useState(false);

  const resultado = evaluarNis2({ sectorId, empleados, facturacionMEur: facturacion });

  return (
    <div
      id="calculadora"
      className="rounded-2xl border border-red-500/25 bg-white dark:bg-[#0d0d2b]/80 backdrop-blur-sm overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="h-4 w-4 text-red-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-red-400">
            Exposición NIS2
          </span>
        </div>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Tres datos y sabes si la directiva te aplica.
        </p>
      </div>

      <div className="p-6 space-y-5">
        <label className="block">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Sector</span>
          <select
            value={sectorId}
            onChange={(e) => { setSectorId(e.target.value); setEnviado(false); }}
            className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-gray-900 dark:text-white"
          >
            {NIS2_SECTORS.map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Empleados: <span className="font-bold text-red-400">{empleados}</span>
          </span>
          <input
            type="range" min={1} max={500} step={1} value={empleados}
            onChange={(e) => { setEmpleados(Number(e.target.value)); setEnviado(false); }}
            className="mt-2 w-full accent-red-500"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Facturación anual: <span className="font-bold text-red-400">{facturacion} M€</span>
          </span>
          <input
            type="range" min={0} max={100} step={1} value={facturacion}
            onChange={(e) => { setFacturacion(Number(e.target.value)); setEnviado(false); }}
            className="mt-2 w-full accent-red-500"
          />
        </label>

        <div
          className="rounded-xl p-4 border"
          style={{
            background: resultado.enAmbito ? "#dc262610" : "#6b728010",
            borderColor: resultado.enAmbito ? "#dc262640" : "#6b728040",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle
              className="h-4 w-4"
              style={{ color: resultado.enAmbito ? "#dc2626" : "#6b7280" }}
            />
            <span
              className="text-xs uppercase tracking-widest font-bold"
              style={{ color: resultado.enAmbito ? "#dc2626" : "#6b7280" }}
            >
              {resultado.categoria === "esencial"
                ? "Entidad esencial"
                : resultado.categoria === "importante"
                ? "Entidad importante"
                : "Fuera del ámbito"}
            </span>
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {resultado.motivo}
          </p>

          {resultado.enAmbito && (
            <>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-3xl font-black text-gray-900 dark:text-white">
                  {resultado.exposicionEur.toLocaleString("es-ES")} €
                </span>
                <span className="text-sm text-gray-500 pb-1">exposición estimada</span>
              </div>

              <ul className="mt-4 space-y-1.5">
                {resultado.obligaciones.map((o) => (
                  <li key={o} className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    · {o}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {resultado.enAmbito && !enviado && (
          <Link
            href={`/contacto?motivo=${encodeURIComponent("Informe NIS2")}&sector=${encodeURIComponent(sectorId)}`}
            onClick={() => setEnviado(true)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm text-white shimmer-btn transition-transform hover:scale-[1.02]"
          >
            Quiero el informe completo <ArrowRight className="h-4 w-4" />
          </Link>
        )}

        <div className="pt-4 border-t border-white/5 space-y-1">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Estimación orientativa. España no ha transpuesto todavía la directiva: no hay plazo
            legal vigente que citar. Cuando se publique en el BOE, llegará de golpe.
          </p>
          {FUENTES_NIS2.map((f) => (
            <a
              key={f.url}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[11px] text-gray-600 hover:text-gray-400 underline underline-offset-2"
            >
              Fuente: {f.titulo}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — los 6 tests de `nis2-calculator.test.tsx` en verde, además de los anteriores.

- [ ] **Step 5: Verificar que compila y pasa lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add src/components/public/nis2-calculator.tsx src/components/public/nis2-calculator.test.tsx
git commit -m "feat: calculadora de exposición NIS2 con fuentes citadas"
```

---

### Task 5: Layout reutilizable de landing y página `/siam`

**Files:**
- Create: `src/components/public/product-landing.tsx`
- Test: `src/components/public/product-landing.test.tsx`
- Create: `src/app/(public)/siam/page.tsx`

**Interfaces:**
- Consumes: `Product` de `@/content/products`.
- Produces: `<ProductLanding product={product}>{children}</ProductLanding>` — `children` se renderiza tras la sección de dolores.

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/components/public/product-landing.test.tsx`:

```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductLanding } from "./product-landing";
import { PRODUCTS, getProduct } from "@/content/products";

const siam = getProduct("siam")!;

describe("ProductLanding", () => {
  it("renderiza badge, titular, bajada y promesa del producto", () => {
    render(<ProductLanding product={siam} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(siam.titular);
    expect(screen.getByText(siam.badge)).toBeInTheDocument();
    expect(screen.getByText(siam.bajada)).toBeInTheDocument();
    expect(screen.getByText(siam.promesa)).toBeInTheDocument();
  });

  it("renderiza cada dolor del producto", () => {
    render(<ProductLanding product={siam} />);
    for (const d of siam.dolores) {
      expect(screen.getByText(d.texto)).toBeInTheDocument();
    }
  });

  it("muestra un enlace de fuente por cada dolor con cifra", () => {
    render(<ProductLanding product={siam} />);
    const conFuente = siam.dolores.filter((d) => d.fuente);
    const enlaces = screen.getAllByRole("link", { name: /^Fuente:/ });
    expect(enlaces).toHaveLength(conFuente.length);
    for (const e of enlaces) {
      expect(e).toHaveAttribute("href", expect.stringMatching(/^https:\/\//));
      expect(e).toHaveAttribute("target", "_blank");
    }
  });

  it("renderiza los hijos que se le pasan", () => {
    render(
      <ProductLanding product={siam}>
        <div data-testid="extra">calculadora</div>
      </ProductLanding>
    );
    expect(screen.getByTestId("extra")).toBeInTheDocument();
  });

  it("no menciona IA en el titular de ningún producto", () => {
    for (const p of PRODUCTS) {
      const { unmount } = render(<ProductLanding product={p} />);
      expect(screen.getByRole("heading", { level: 1 }).textContent).not.toMatch(
        /\bIA\b|inteligencia artificial/i
      );
      unmount();
    }
  });
});
```

- [ ] **Step 2: Ejecutar los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./product-landing"`.

- [ ] **Step 3: Crear `src/components/public/product-landing.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/content/products";

export function ProductLanding({
  product,
  children,
}: {
  product: Product;
  children?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{ background: `${product.color}18`, borderColor: `${product.color}40` }}
          >
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: product.color }} />
            <span className="text-sm" style={{ color: product.color }}>{product.badge}</span>
          </div>

          <h1 className="font-display text-4xl lg:text-5xl leading-[1.1] text-gray-900 dark:text-white">
            {product.titular}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            {product.bajada}
          </p>

          <Link
            href={product.ctaHref}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-105"
          >
            {product.ctaTexto} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 border-t border-purple-500/20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl text-gray-900 dark:text-white mb-8">
            Por qué esto es un problema hoy
          </h2>
          <div className="space-y-4">
            {product.dolores.map((d) => (
              <div
                key={d.texto}
                className="rounded-xl border border-white/8 surface-card p-5"
              >
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{d.texto}</p>
                {d.fuente && (
                  <a
                    href={d.fuente.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-[11px] text-gray-500 hover:text-gray-400 underline underline-offset-2"
                  >
                    Fuente: {d.fuente.titulo}
                  </a>
                )}
              </div>
            ))}
          </div>

          <div
            className="mt-8 rounded-xl p-5 border"
            style={{ background: `${product.color}10`, borderColor: `${product.color}30` }}
          >
            <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: product.color }}>
              Qué hace {product.nombre}
            </p>
            <p className="text-gray-900 dark:text-white font-semibold leading-relaxed">
              {product.promesa}
            </p>
          </div>
        </div>
      </section>

      {children}

      <section className="py-20 px-6 border-t border-purple-500/20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl text-gray-900 dark:text-white">
            Hablamos 15 minutos
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sin presentación comercial. Me cuentas cómo lo lleváis hoy y te digo si esto os sirve.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg shimmer-btn font-semibold text-white transition-transform hover:scale-105"
          >
            Reservar una llamada <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Ejecutar los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — los 5 tests de `product-landing.test.tsx` en verde.

- [ ] **Step 5: Crear `src/app/(public)/siam/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/content/products";
import { ProductLanding } from "@/components/public/product-landing";
import { Nis2Calculator } from "@/components/public/nis2-calculator";

export const metadata: Metadata = {
  title: "SIAM — SOC virtual para pymes | Praxia Labs",
  description:
    "El 70% de los ciberataques en España caen sobre pymes. SIAM te da visibilidad de lo que pasa en tu red y la capacidad de notificarlo dentro del plazo que exige NIS2.",
};

export default function SiamPage() {
  const product = getProduct("siam");
  if (!product) notFound();

  return (
    <ProductLanding product={product}>
      <section className="py-16 px-6 border-t border-purple-500/20">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-2xl text-gray-900 dark:text-white mb-3">
            ¿Te aplica la directiva?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            NIS2 no distingue por lo preparado que estés, sino por tu sector y tu tamaño.
            Compruébalo aquí.
          </p>
          <Nis2Calculator />
        </div>
      </section>
    </ProductLanding>
  );
}
```

- [ ] **Step 6: Verificar compilación y arrancar la página**

Run: `npm test && npx tsc --noEmit && npm run build`
Expected: tests en verde y build correcto, con `/siam` en la lista de rutas generadas.

- [ ] **Step 7: Commit**

```bash
git add src/components/public/product-landing.tsx src/components/public/product-landing.test.tsx "src/app/(public)/siam/page.tsx"
git commit -m "feat: landing /siam con calculadora NIS2"
```

---

### Task 6: Landings `/core-ops` y `/adminapp`

Reutilizan `ProductLanding` sin hijos. Sin campaña, sin calculadora.

**Files:**
- Create: `src/app/(public)/core-ops/page.tsx`
- Create: `src/app/(public)/adminapp/page.tsx`

**Interfaces:**
- Consumes: `getProduct` de `@/content/products`, `ProductLanding` de Task 5.
- Produces: rutas `/core-ops` y `/adminapp`.

- [ ] **Step 1: Crear `src/app/(public)/core-ops/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/content/products";
import { ProductLanding } from "@/components/public/product-landing";

export const metadata: Metadata = {
  title: "Core OPS — Operaciones IT en un panel | Praxia Labs",
  description:
    "Red, ERP, inventario y operaciones en un panel único con alertas en tiempo real, en lugar de seis herramientas que no se hablan.",
};

export default function CoreOpsPage() {
  const product = getProduct("core-ops");
  if (!product) notFound();
  return <ProductLanding product={product} />;
}
```

- [ ] **Step 2: Crear `src/app/(public)/adminapp/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/content/products";
import { ProductLanding } from "@/components/public/product-landing";

export const metadata: Metadata = {
  title: "AdminApp Maestro — Para administradores de fincas | Praxia Labs",
  description:
    "El 14,3% de las viviendas arrastra deuda con su comunidad, con una media de 1.847 € cada una. AdminApp reclama, concilia y documenta por ti.",
};

export default function AdminAppPage() {
  const product = getProduct("adminapp");
  if (!product) notFound();
  return <ProductLanding product={product} />;
}
```

- [ ] **Step 3: Verificar compilación**

Run: `npm run build`
Expected: build correcto, con `/core-ops` y `/adminapp` en la lista de rutas.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(public)/core-ops/page.tsx" "src/app/(public)/adminapp/page.tsx"
git commit -m "feat: landings /core-ops y /adminapp"
```

---

### Task 7: `/laboratorio` y redirección desde `/proyectos`

`/proyectos/[id]` **no se toca**: las URLs de detalle ya indexadas siguen sirviendo. Solo la página índice se convierte en redirección permanente.

**Files:**
- Create: `src/lib/laboratorio.ts`
- Test: `src/lib/laboratorio.test.ts`
- Create: `src/app/(public)/laboratorio/page.tsx`
- Modify: `src/app/(public)/proyectos/page.tsx` (sustitución completa)

**Interfaces:**
- Consumes: `findAllProjects` de `@/lib/repositories/projects.repository`.
- Produces: `filtrarLaboratorio<T extends { id: string }>(proyectos: T[]): T[]` y `CON_LANDING: ReadonlySet<string>` desde `@/lib/laboratorio`; ruta `/laboratorio`; `/proyectos` responde 308 hacia ella.

La lógica de filtrado vive en un módulo aparte porque la página es un Server Component asíncrono: así se puede testear sin montar React.

- [ ] **Step 1: Escribir los tests que fallan**

Crear `src/lib/laboratorio.test.ts`:

```typescript
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
```

- [ ] **Step 2: Ejecutar los tests para verificar que fallan**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./laboratorio"`.

- [ ] **Step 3: Crear `src/lib/laboratorio.ts`**

```typescript
/** Productos con landing propia: no aparecen en el laboratorio. */
export const CON_LANDING: ReadonlySet<string> = new Set(["siam", "crm-it", "admin-app"]);

/** Deja fuera del laboratorio los productos que ya tienen su propia landing. */
export function filtrarLaboratorio<T extends { id: string }>(proyectos: T[]): T[] {
  return proyectos.filter((p) => !CON_LANDING.has(p.id));
}
```

- [ ] **Step 4: Ejecutar los tests para verificar que pasan**

Run: `npm test`
Expected: PASS — los 5 tests de `laboratorio.test.ts` en verde.

- [ ] **Step 5: Crear `src/app/(public)/laboratorio/page.tsx`**

En el código de abajo, sustituye la definición local de `CON_LANDING` y el `.filter(...)` por el módulo que acabas de crear:

```tsx
import { filtrarLaboratorio } from "@/lib/laboratorio";
// ...
  const proyectos = filtrarLaboratorio(allProjects);
```

Archivo completo:

Archivo completo. Las clases `project-card-v2` y `badge-tech` ya existen en `globals.css` y se usan igual en la home, así que el estilo queda consistente sin trabajo extra.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { findAllProjects } from "@/lib/repositories/projects.repository";
import { filtrarLaboratorio } from "@/lib/laboratorio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Laboratorio | Praxia Labs",
  description:
    "Sistemas que he construido: producción, betas y experimentos. La prueba de que lo que prometo se entrega.",
};

const ETIQUETA_ESTADO: Record<string, string> = {
  production: "Producción",
  beta: "Beta",
};

export default async function LaboratorioPage() {
  const allProjects = await findAllProjects();
  const proyectos = filtrarLaboratorio(allProjects);

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <h1 className="font-display text-4xl text-gray-900 dark:text-white mb-4">
            Laboratorio
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Cosas que he construido. Algunas están en producción, otras son experimentos que
            siguen vivos. No son productos a la venta: están aquí como prueba de que lo que
            prometo se entrega.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proyectos.map((project) => (
            <div key={project.id} className="project-card-v2 group p-6 rounded-2xl transition-all">
              <div
                className="h-0.5 w-full rounded-full mb-5"
                style={{ background: `linear-gradient(90deg, ${project.color}, ${project.color}40, transparent)` }}
              />
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    {project.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: `${project.color}18`,
                        color: project.color,
                        border: `1px solid ${project.color}30`,
                      }}
                    >
                      {ETIQUETA_ESTADO[project.status] ?? "Explorando"}
                    </span>
                    <span className="badge-tech">{project.category.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-500 dark:text-gray-400 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <Link
                  href={`/proyectos/${project.id}`}
                  className="flex items-center gap-1 text-sm text-cyan-500 dark:text-cyan-400 hover:text-cyan-300 font-semibold transition"
                >
                  Ver detalles <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-purple-500 dark:text-purple-400 hover:text-purple-300 font-semibold transition"
                  >
                    Ver en vivo <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

Nota sobre el estado `Explorando`: cualquier proyecto cuyo `status` no sea `production` ni `beta` se etiqueta así. Es lo que la spec (§8) pide para domhome y VIGIA — pero **ninguno de los dos existe todavía en el catálogo**, que solo contiene 13 proyectos (`olga-ai`, `admin-app`, `crm-it`, `generador-ideas`, `campo-abierto`, `cf-jaramal`, `cd-rivas-jarama`, `frajamo`, `landing-inmobiliaria`, `app-voz`, `app-mejores-productos`, `siam`, `saludapp`). Darlos de alta es trabajo de contenido desde el panel de administración, no de este plan (ver "Fuera de este plan").

- [ ] **Step 6: Sustituir `src/app/(public)/proyectos/page.tsx` por una redirección**

Contenido completo del archivo:

```tsx
import { permanentRedirect } from "next/navigation";

export default function ProyectosPage(): never {
  permanentRedirect("/laboratorio");
}
```

- [ ] **Step 7: Verificar que la redirección funciona y que el detalle sigue vivo**

Run: `npm run build && npm run dev`

Comprobar en el navegador:
- `http://localhost:3000/proyectos` → redirige a `/laboratorio`.
- `http://localhost:3000/proyectos/olga-ai` → **sigue funcionando** (no debe redirigir).
- `http://localhost:3000/laboratorio` → lista sin SIAM, Core OPS ni AdminApp.

- [ ] **Step 8: Commit**

```bash
git add src/lib/laboratorio.ts src/lib/laboratorio.test.ts "src/app/(public)/laboratorio/page.tsx" "src/app/(public)/proyectos/page.tsx"
git commit -m "feat: /laboratorio y redirección desde /proyectos"
```

---

### Task 8: Home, navegación, sitemap y limpieza

Última tarea: la home pasa a presentar tres productos, la navegación los expone y se borra el `hero.tsx` muerto.

**Files:**
- Modify: `src/app/(public)/page.tsx`
- Modify: `src/components/public/navbar.tsx:12-17`
- Modify: `src/app/sitemap.ts:19-25`
- Delete: `src/components/public/hero.tsx`

**Interfaces:**
- Consumes: `PRODUCTS` de `@/content/products`.
- Produces: nada nuevo.

- [ ] **Step 1: Confirmar que `hero.tsx` sigue sin usarse antes de borrarlo**

Run: `grep -rn "public/hero\|<Hero" src/ --include=*.tsx | grep -v "hero.tsx:"`
Expected: **sin resultados.** Si aparece alguno, no lo borres: adapta ese uso primero.

- [ ] **Step 2: Borrar el componente muerto**

```bash
git rm src/components/public/hero.tsx
```

- [ ] **Step 3: Actualizar el titular de la home**

En `src/app/(public)/page.tsx`, sustituir el bloque `<h1>` y el `<p>` que le sigue por:

```tsx
              <h1 className="font-display text-5xl lg:text-6xl leading-[1.08] text-white">
                El trabajo que hacéis a mano{' '}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  ya no hace falta hacerlo.
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Construyo sistemas para pymes españolas: seguridad, operaciones y administración.{' '}
                <span className="text-cyan-400 font-semibold">Uno por uno, hasta que funciona.</span>
              </p>
```

- [ ] **Step 4: Añadir la sección de productos a la home**

En `src/app/(public)/page.tsx`, añadir el import al principio del archivo:

```tsx
import { PRODUCTS } from '@/content/products';
```

E insertar esta sección justo **antes** de la sección con `id="proyectos"`:

```tsx
      {/* ── PRODUCTOS ── */}
      <section className="py-24 px-6 border-t border-purple-500/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl text-white mb-4">Tres productos</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Cada uno resuelve un problema concreto de un tipo concreto de empresa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <Link
                key={p.slug}
                href={`/${p.slug}`}
                className="group relative rounded-2xl border p-6 flex flex-col transition-all hover:scale-[1.02] surface-card"
                style={{ borderColor: p.foco ? `${p.color}50` : 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="h-0.5 rounded-full mb-5"
                  style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}30, transparent)` }}
                />
                <span
                  className="self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-4"
                  style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}
                >
                  {p.badge}
                </span>
                <h3 className="font-display text-lg font-bold text-white mb-3 leading-snug">
                  {p.titular}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">{p.promesa}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: p.color }}>
                  {p.nombre} <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 5: Actualizar los enlaces del navbar**

En `src/components/public/navbar.tsx`, sustituir el array `links` (líneas 12-17):

```tsx
const links = [
  { href: "/", label: "Inicio" },
  { href: "/siam", label: "SIAM" },
  { href: "/core-ops", label: "Core OPS" },
  { href: "/laboratorio", label: "Laboratorio" },
  { href: "/precios", label: "Precios" },
];
```

- [ ] **Step 6: Actualizar el sitemap**

En `src/app/sitemap.ts`, sustituir el array `staticPages`:

```typescript
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                   lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/siam`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/core-ops`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/adminapp`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/laboratorio`,  lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/precios`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/acerca-de`,    lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/contacto`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ];
```

Nota: `/proyectos` se elimina del sitemap porque ahora redirige. Las URLs `/proyectos/[id]` siguen generándose más abajo sin cambios.

- [ ] **Step 7: Actualizar los enlaces del footer de la home**

En `src/app/(public)/page.tsx`, dentro del `<footer>`, sustituir el enlace a `/proyectos`:

```tsx
                  <Link href="/laboratorio" className="hover:text-white transition">Laboratorio</Link>
```

Y en el bloque "Ver todos los proyectos" al final de la sección `id="proyectos"`, cambiar el `href="/proyectos"` por `href="/laboratorio"`.

- [ ] **Step 8: Verificación completa**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Expected: 25 tests en verde, sin errores de tipos, sin errores de lint, build correcto.

- [ ] **Step 9: Commit**

**Nunca uses `git add -A` en este repositorio:** el árbol de trabajo contiene cambios sin commitear ajenos a este plan (panel de campañas, métricas, escalabilidad). Añade solo las rutas que has tocado.

```bash
git add "src/app/(public)/page.tsx" src/components/public/navbar.tsx src/app/sitemap.ts
git commit -m "feat: home con tres productos, navegación y sitemap actualizados

Elimina hero.tsx (código muerto con stats sin respaldo)."
```

Nota: `hero.tsx` ya está en el índice por el `git rm` del Step 2, así que entra en este commit sin necesidad de añadirlo.

---

## Verificación final

Tras completar las 8 tareas, comprobar manualmente con `npm run dev`:

- [ ] `/siam` carga, la calculadora responde y **cita fuentes visibles**.
- [ ] En `/siam` no aparece la palabra "IA" antes del primer scroll.
- [ ] En `/siam` no aparece ninguna promesa de 48 h ni de impedir ataques.
- [ ] `/core-ops` y `/adminapp` cargan con su copy propio.
- [ ] `/proyectos` redirige a `/laboratorio`.
- [ ] `/proyectos/olga-ai` **sigue funcionando** (no redirige).
- [ ] `/laboratorio` no lista SIAM, Core OPS ni AdminApp.
- [ ] La home enlaza los tres productos.
- [ ] Modo claro y modo oscuro se ven correctamente en las tres landings.

## Fuera de este plan

Trabajo de la spec que **no** es código y va en un runbook aparte (§15 de la spec):

- Invitaciones y grabación del podcast.
- Lista de 50 cuentas objetivo.
- Publicación en LinkedIn.
- Certificación personal.
- Generación del PDF del informe NIS2 (el CTA actual lleva a `/contacto`; el PDF es una fase posterior).
- **Alta de domhome en el catálogo de proyectos.** Es un producto real (FastAPI + MQTT + WebSockets), pero no está dado de alta. Es trabajo de contenido desde el panel de administración (`/admin/proyectos`), no de código: al crearlo con un `status` distinto de `production`/`beta`, la página de laboratorio ya lo etiquetará como *Explorando* sin tocar nada más.
- **VIGIA no se da de alta.** Según §8 de la spec, esa carpeta contiene un estudio de competencia y una app generada, no un sistema en marcha. Publicarlo como proyecto sería exactamente el tipo de dato inflado que este trabajo viene a eliminar.
