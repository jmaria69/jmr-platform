# Rediseño "Casos reales": capturas reales + tubería en S — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir el icono pequeño + línea recta de la sección "Casos reales" de la home por (A) una captura real de la home de cada proyecto, disparada a mano desde `/admin/proyectos`, y (B) un conector en forma de S por fila que se ilumina al entrar en scroll, reutilizando el sistema de reveal ya existente.

**Architecture:** Bloque B es solo plantilla HTML (extraída a una función pura testeable) + CSS — sin JS nuevo, reutiliza el `IntersectionObserver` de `home-fx.tsx`. Bloque A añade una ruta API (`PATCH /api/projects/[id]/screenshot`) que lanza Chromium headless server-side, sube el PNG a Vercel Blob y actualiza `project.image` — mismo patrón de auth y de hook optimista que el resto de `/api/projects/*`.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Prisma + Neon Postgres, Vitest + Testing Library, `puppeteer-core` + `@sparticuz/chromium` (nuevas), `@vercel/blob` (ya en uso).

## Global Constraints

- Spec de referencia: `docs/superpowers/specs/2026-08-02-casos-reales-timeline-design.md` — cualquier duda de alcance se resuelve ahí, no inventar alcance nuevo.
- Sin recorte manual de capturas, sin recaptura programada/cron, sin versionado histórico de capturas (spec §5 — fuera de alcance).
- El zigzag izquierda/derecha de las tarjetas (`.nrow:nth-child(odd/even)`) no se toca — solo cambian el conector central y el tamaño de imagen.
- Todo el HTML de `.neural` sigue generándose server-side en `src/app/(public)/page.tsx` (Server Component, `dynamic = "force-dynamic"` ya presente) — no convertir a Client Component.
- Tests con Vitest (`npm test` → `vitest run`), estilo `describe/it/expect` + `vi.mock`, colocados junto al fichero que testean (`*.test.ts(x)`) — es el patrón ya usado en todo el repo, no introducir otro.
- Auth de API: mismo patrón en las 3 rutas de `/api/projects/*` — `verifyToken(request.cookies.get(SESSION_COOKIE)?.value)`, 401 JSON si no hay sesión. La ruta nueva lo replica, no lo reinventa.

---

## Bloque B — Trazado en S + iluminación por scroll

### Task 1: Extraer la plantilla de cada fila a una función pura testeable

**Files:**
- Create: `src/app/(public)/neural-timeline.ts`
- Create: `src/app/(public)/neural-timeline.test.ts`

**Interfaces:**
- Consumes: `Project` de `@/types` (campos usados: `id`, `name`, `description`, `category`, `status`, `image`, `url`, `color`).
- Produces: `safeUrl(s: string | null | undefined): string`, `buildNeuralRowHtml(p: Project, index: number): string` — los consume Task 2 desde `page.tsx`.

- [ ] **Step 1: Escribir los tests (fallarán — el módulo no existe todavía)**

```typescript
// src/app/(public)/neural-timeline.test.ts
import { describe, it, expect } from "vitest";
import { buildNeuralRowHtml, safeUrl } from "./neural-timeline";
import type { Project } from "@/types";

const baseProject: Project = {
  id: "olga-ai",
  name: "OLGA.ai",
  description: "Sistema multi-agente de operaciones.",
  longDescription: "",
  tech: ["Python"],
  status: "production",
  category: "ai",
  url: "https://olga.praxialabs.com",
  image: "/projects/gws.svg",
  color: "#8b5cf6",
};

describe("safeUrl", () => {
  it("deja pasar http(s)", () => {
    expect(safeUrl("https://example.com/a")).toBe("https://example.com/a");
  });

  it("deja pasar rutas relativas", () => {
    expect(safeUrl("/projects/gws.svg")).toBe("/projects/gws.svg");
  });

  it("bloquea esquemas peligrosos", () => {
    expect(safeUrl("javascript:alert(1)")).toBe("");
  });

  it("devuelve vacío para null/undefined", () => {
    expect(safeUrl(null)).toBe("");
    expect(safeUrl(undefined)).toBe("");
  });
});

describe("buildNeuralRowHtml", () => {
  it("incluye un segmento SVG con id de gradiente único por proyecto", () => {
    const html = buildNeuralRowHtml(baseProject, 0);
    expect(html).toContain('<svg class="nseg"');
    expect(html).toContain(`id="neuralGrad-${baseProject.id}"`);
    expect(html).toContain(`url(#neuralGrad-${baseProject.id})`);
  });

  it("dos proyectos distintos generan ids de gradiente distintos (sin colisión)", () => {
    const htmlA = buildNeuralRowHtml(baseProject, 0);
    const htmlB = buildNeuralRowHtml({ ...baseProject, id: "siam" }, 1);
    expect(htmlA).toContain("neuralGrad-olga-ai");
    expect(htmlB).toContain("neuralGrad-siam");
    expect(htmlA).not.toContain("neuralGrad-siam");
  });

  it("escapa el nombre y la descripción", () => {
    const html = buildNeuralRowHtml({ ...baseProject, name: "<script>alert(1)</script>" }, 0);
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it('usa la insignia con inicial cuando no hay imagen válida', () => {
    const html = buildNeuralRowHtml({ ...baseProject, image: "" }, 0);
    expect(html).toContain("nimg-fb");
    expect(html).not.toContain("<img");
  });

  it('no genera enlace "Ver proyecto" si la URL es javascript:', () => {
    const html = buildNeuralRowHtml({ ...baseProject, url: "javascript:alert(1)" }, 0);
    expect(html).not.toContain("nlink");
  });

  it("envuelve el texto en ncard-body para que el CSS lo distinga de la imagen", () => {
    const html = buildNeuralRowHtml(baseProject, 0);
    expect(html).toContain('<div class="ncard-body">');
  });
});
```

- [ ] **Step 2: Ejecutar y confirmar que falla**

Run: `npm test -- src/app/\(public\)/neural-timeline.test.ts`
Expected: FAIL — `Cannot find module './neural-timeline'`

- [ ] **Step 3: Implementar el módulo**

```typescript
// src/app/(public)/neural-timeline.ts
import type { Project } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  production: "EN PRODUCCIÓN",
  beta: "BETA",
  development: "EN DESARROLLO",
};

function esc(s: string): string {
  return (s || "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string,
  );
}

/** Solo deja pasar http(s) y rutas relativas — evita esquemas tipo javascript: en campos editables desde admin. */
export function safeUrl(s: string | null | undefined): string {
  if (!s) return "";
  try {
    const u = new URL(s, "https://praxialabs.com");
    return u.protocol === "http:" || u.protocol === "https:" ? s : "";
  } catch {
    return "";
  }
}

/**
 * Segmento SVG en S de una fila. Id de gradiente por fila (namespaced con el
 * id del proyecto) para no colisionar cuando varias filas comparten página.
 * viewBox -30..30 de ancho = amplitud de ±30, escalada por --neural-amp en
 * CSS (se reduce a casi 0 en móvil).
 */
function neuralSegmentSvg(rowId: string): string {
  const gradId = `neuralGrad-${esc(rowId)}`;
  return `<svg class="nseg" viewBox="-30 0 60 200" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--seg-c1, #ff8a3c)" />
          <stop offset="50%" stop-color="var(--seg-c2, #d946ef)" />
          <stop offset="100%" stop-color="var(--seg-c3, #00f2ff)" />
        </linearGradient>
      </defs>
      <path d="M 0,0 C 30,50 30,50 0,100 C -30,150 -30,150 0,200" stroke="url(#${gradId})" fill="none" stroke-width="3" stroke-linecap="round" />
    </svg>`;
}

export function buildNeuralRowHtml(p: Project, _index: number): string {
  const status = STATUS_LABELS[p.status] || "EN PRODUCCIÓN";
  const safeImage = safeUrl(p.image);
  const safeLink = safeUrl(p.url);
  const initial = esc((p.name.trim().charAt(0) || "?").toUpperCase());
  const fallback = `<span class="nimg-fb" style="color:${esc(p.color)};background:${esc(p.color)}20">${initial}</span>`;
  const img = safeImage
    ? `<div class="nimg">${fallback}<img src="${esc(safeImage)}" alt="${esc(p.name)}" loading="lazy" onerror="this.style.display='none'"></div>`
    : `<div class="nimg">${fallback}</div>`;
  const link = safeLink
    ? `<a class="nlink" href="${esc(safeLink)}" target="_blank" rel="noopener noreferrer">Ver proyecto &rarr;</a>`
    : "";
  return `
        <div class="nrow rev">
          ${neuralSegmentSvg(p.id)}
          <div class="nnode"></div>
          <div class="ncard">
            ${img}
            <div class="ncard-body">
              <div class="ntag">${esc(p.category)}<span class="nst">&#9679; ${status}</span></div>
              <h3>${esc(p.name)}</h3>
              <p>${esc(p.description)}</p>
              ${link}
            </div>
          </div>
        </div>`;
}
```

- [ ] **Step 4: Ejecutar y confirmar que pasa**

Run: `npm test -- src/app/\(public\)/neural-timeline.test.ts`
Expected: PASS (10 tests)

- [ ] **Step 5: Commit**

```bash
git add src/app/\(public\)/neural-timeline.ts src/app/\(public\)/neural-timeline.test.ts
git commit -m "feat(home): extraer plantilla de fila de Casos reales a función testeable"
```

---

### Task 2: Usar la función extraída en `page.tsx`

**Files:**
- Modify: `src/app/(public)/page.tsx`

**Interfaces:**
- Consumes: `buildNeuralRowHtml` de `./neural-timeline` (Task 1).
- Produces: sin cambios de interfaz — `page.tsx` sigue exportando el mismo `Home()` Server Component.

- [ ] **Step 1: Sustituir la construcción inline por la función extraída**

Reemplazar en `src/app/(public)/page.tsx` (el bloque `esc`/`safeUrl` locales y el `.map()` de `prods`, aprox. líneas 22-63 según el estado actual tras las correcciones de `/verify`):

```typescript
// Quitar de page.tsx: function esc(...), function safeUrl(...), y todo el
// cuerpo del .map() que construye `prods` a mano.
// Añadir el import:
import { buildNeuralRowHtml } from "./neural-timeline";

// Y sustituir el bloque `const prods = featured.map(...).join("")` por:
const prods = featured.map((p, i) => buildNeuralRowHtml(p, i)).join("");
```

Mantener sin cambios: `STATUS` (ya no se usa fuera de `neural-timeline.ts`, se puede borrar de `page.tsx` si quedó duplicado), el resto de `Home()` (hero, secciones, footer, `<ContactSection>`).

- [ ] **Step 2: Verificar que el proyecto compila**

Run: `npm run build`
Expected: build sin errores de tipos (si falla por `STATUS` duplicado sin usar, borrarlo de `page.tsx`).

- [ ] **Step 3: Verificar manualmente en dev**

Run: `npm run dev`, abrir `http://localhost:3001/` (o el puerto que asigne), bajar hasta "Casos reales". Debe verse exactamente igual que antes de este task (mismo HTML, ahora generado desde el módulo extraído) — este task es un refactor puro, sin cambio visual todavía.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(public)/page.tsx"
git commit -m "refactor(home): usar buildNeuralRowHtml en vez de construir el HTML inline"
```

---

### Task 3: CSS del conector en S + iluminación ligada al scroll

**Files:**
- Modify: `src/app/(public)/home-redesign.css`

**Interfaces:**
- Consumes: clases ya emitidas por `buildNeuralRowHtml` (Task 1): `.nrow`, `.nseg`, `.nseg path`, `.rev`/`.rev.in` (ya gestionadas por `home-fx.tsx`, sin cambios ahí).
- Produces: nada que otro task consuma — es la capa visual final de este bloque.

- [ ] **Step 1: Quitar el conector recto anterior**

Eliminar de `home-redesign.css` las reglas actuales:

```css
.lx .neural::before { content: ""; position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%);
  background: linear-gradient(180deg, transparent, rgba(0,242,255,.55) 20%, rgba(0,255,204,.55) 80%, transparent);
  background-size: 100% 260%; animation: nflow 5.5s linear infinite; }
@keyframes nflow { from { background-position: 0 130%; } to { background-position: 0 -130%; } }
```

- [ ] **Step 2: Añadir el conector en S por fila**

Añadir en su lugar:

```css
.lx .nrow { position: relative; }
.lx .nseg {
  position: absolute;
  left: 50%;
  top: -30px;
  width: 60px;
  height: calc(100% + 60px);
  transform: translateX(-50%) scaleX(var(--neural-amp, 1));
  z-index: 0;
  pointer-events: none;
  overflow: visible;
}
.lx .nseg path {
  stroke-dasharray: 260;
  stroke-dashoffset: 260;
  transition: stroke-dashoffset 0.9s ease;
}
.lx .nrow.rev.in .nseg path {
  stroke-dashoffset: 0;
}
@media (max-width: 760px) {
  .lx { --neural-amp: 0.15; }
}
```

`stroke-dasharray: 260` es una longitud de sobra para la curva de 200 de alto por ±30 de ancho (arco real ≈ 210-230) — con un valor mayor que el trazo real, un solo guión cubre todo el `path` sin huecos, así que sirve igual sin calcular la longitud exacta.

- [ ] **Step 3: Verificar visualmente**

Run: `npm run dev`, abrir la home, bajar lentamente por "Casos reales". Cada segmento debe permanecer invisible hasta que su tarjeta entra en viewport, y entonces "dibujarse" con el degradado naranja→magenta→cian en ~0.9 s, a la vez que la tarjeta hace fade-in (mismo instante, ambos disparados por `.rev.in`). Reducir la ventana a <760px de ancho: la curva debe verse casi recta.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(public)/home-redesign.css"
git commit -m "style(home): conector en S iluminado por scroll en Casos reales"
```

---

### Task 4: Tarjetas con imagen de cabecera a ancho completo

**Files:**
- Modify: `src/app/(public)/home-redesign.css`

**Interfaces:**
- Consumes: `.ncard-body` (ya emitido por `buildNeuralRowHtml`, Task 1).
- Produces: nada — última pieza visual del bloque B.

- [ ] **Step 1: Cambiar `.ncard` de fila horizontal a columna con imagen de cabecera**

Sustituir en `home-redesign.css`:

```css
.lx .ncard { position: relative; background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 20px 22px;
  display: flex; gap: 18px; align-items: center; transition: border-color .2s, transform .2s; }
```

por:

```css
.lx .ncard { position: relative; background: var(--panel); border: 1px solid var(--line); border-radius: 16px;
  display: flex; flex-direction: column; align-items: stretch; overflow: hidden; transition: border-color .2s, transform .2s; }
.lx .ncard-body { padding: 20px 22px; }
```

- [ ] **Step 2: Ampliar `.nimg` a cabecera de ancho completo**

Sustituir:

```css
.lx .ncard .nimg { width: 62px; height: 62px; border-radius: 13px; flex-shrink: 0; display: grid; place-items: center;
  background: rgba(0,242,255,.06); border: 1px solid var(--line); }
.lx .ncard .nimg img { grid-area: 1 / 1; width: 38px; height: 38px; object-fit: contain; }
.lx .ncard .nimg .nimg-fb { grid-area: 1 / 1; width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center;
  font-weight: 800; font-size: 15px; }
```

por:

```css
.lx .ncard .nimg { width: 100%; height: 180px; flex-shrink: 0; display: grid; place-items: center;
  background: rgba(0,242,255,.06); border: none; border-bottom: 1px solid var(--line); }
.lx .ncard .nimg img { grid-area: 1 / 1; width: 100%; height: 100%; object-fit: cover; }
.lx .ncard .nimg .nimg-fb { grid-area: 1 / 1; width: 64px; height: 64px; border-radius: 50%; display: grid; place-items: center;
  font-weight: 800; font-size: 24px; }
```

- [ ] **Step 3: Verificar visualmente**

Run: `npm run dev`, comprobar que cada tarjeta muestra la imagen (o la insignia con inicial, más grande, si no hay imagen) como cabecera de 180px de alto, con el texto debajo. Confirmar en móvil (<760px, layout de una columna) que no se ve desproporcionado.

- [ ] **Step 4: Commit**

```bash
git add "src/app/(public)/home-redesign.css"
git commit -m "style(home): imagen de cabecera a ancho completo en tarjetas de Casos reales"
```

---

## Bloque A — Captura de pantalla real por proyecto

### Task 5: Añadir dependencias de captura headless

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `puppeteer-core` y `@sparticuz/chromium` disponibles para Task 6.

- [ ] **Step 1: Instalar**

```bash
npm install puppeteer-core@^25.5.0 @sparticuz/chromium@^149.0.0
```

- [ ] **Step 2: Verificar compatibilidad de versiones**

Abrir `node_modules/@sparticuz/chromium/README.md` (o la página del paquete en npm) y confirmar la tabla de versiones compatibles de `puppeteer-core` para la versión de `@sparticuz/chromium` instalada — ambos paquetes suben de versión al ritmo de Chromium y una combinación desacoplada falla en runtime, no en build. Si no coinciden, fijar `puppeteer-core` a la versión que el README de `@sparticuz/chromium` indique.

- [ ] **Step 3: Confirmar instalación**

Run: `npm ls puppeteer-core @sparticuz/chromium`
Expected: ambos listados sin `UNMET DEPENDENCY`.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: añadir puppeteer-core y @sparticuz/chromium para capturas server-side"
```

---

### Task 6: Utilidad de captura de pantalla

**Files:**
- Create: `src/lib/screenshot.ts`
- Create: `src/lib/screenshot.test.ts`

**Interfaces:**
- Consumes: `puppeteer-core` (Task 5), `@sparticuz/chromium` (Task 5).
- Produces: `captureProjectScreenshot(url: string): Promise<{ buffer: Buffer; contentType: "image/png" }>` — lo consume Task 7.

- [ ] **Step 1: Escribir los tests (fallarán)**

```typescript
// src/lib/screenshot.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const launchMock = vi.fn();
vi.mock("puppeteer-core", () => ({
  default: { launch: (...args: unknown[]) => launchMock(...args) },
}));
vi.mock("@sparticuz/chromium", () => ({
  default: {
    args: ["--no-sandbox"],
    executablePath: vi.fn().mockResolvedValue("/fake/chromium"),
  },
}));

import { captureProjectScreenshot } from "./screenshot";

beforeEach(() => {
  launchMock.mockReset();
});

describe("captureProjectScreenshot", () => {
  it("devuelve el PNG capturado y cierra el navegador", async () => {
    const screenshotMock = vi.fn().mockResolvedValue(Buffer.from("fake-png"));
    const gotoMock = vi.fn().mockResolvedValue(undefined);
    const closeMock = vi.fn().mockResolvedValue(undefined);
    const newPageMock = vi.fn().mockResolvedValue({ goto: gotoMock, screenshot: screenshotMock });
    launchMock.mockResolvedValue({ newPage: newPageMock, close: closeMock });

    const result = await captureProjectScreenshot("https://example.com");

    expect(result.contentType).toBe("image/png");
    expect(result.buffer).toEqual(Buffer.from("fake-png"));
    expect(gotoMock).toHaveBeenCalledWith("https://example.com", expect.objectContaining({ timeout: 8000 }));
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it("cierra el navegador incluso si falla la navegación", async () => {
    const closeMock = vi.fn().mockResolvedValue(undefined);
    const gotoMock = vi.fn().mockRejectedValue(new Error("timeout"));
    const newPageMock = vi.fn().mockResolvedValue({ goto: gotoMock, screenshot: vi.fn() });
    launchMock.mockResolvedValue({ newPage: newPageMock, close: closeMock });

    await expect(captureProjectScreenshot("https://example.com")).rejects.toThrow("timeout");
    expect(closeMock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Ejecutar y confirmar que falla**

Run: `npm test -- src/lib/screenshot.test.ts`
Expected: FAIL — `Cannot find module './screenshot'`

- [ ] **Step 3: Implementar**

```typescript
// src/lib/screenshot.ts
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export interface ScreenshotResult {
  buffer: Buffer;
  contentType: "image/png";
}

const VIEWPORT = { width: 1280, height: 800 };
const NAV_TIMEOUT_MS = 8000;

/**
 * Captura la home de un proyecto en PNG. Lanza y cierra su propio Chromium
 * por invocación (sin pool) — el volumen de uso (botón manual en admin) no
 * lo justifica, y evita mantener estado de navegador entre invocaciones
 * serverless.
 */
export async function captureProjectScreenshot(url: string): Promise<ScreenshotResult> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
    defaultViewport: VIEWPORT,
  });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: NAV_TIMEOUT_MS });
    const buffer = (await page.screenshot({ type: "png" })) as Buffer;
    return { buffer, contentType: "image/png" };
  } finally {
    await browser.close();
  }
}
```

- [ ] **Step 4: Ejecutar y confirmar que pasa**

Run: `npm test -- src/lib/screenshot.test.ts`
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/lib/screenshot.ts src/lib/screenshot.test.ts
git commit -m "feat: utilidad de captura de pantalla server-side con puppeteer-core"
```

---

### Task 7: Ruta API `PATCH /api/projects/[id]/screenshot`

**Files:**
- Create: `src/app/api/projects/[id]/screenshot/route.ts`
- Create: `src/app/api/projects/[id]/screenshot/route.test.ts`

**Interfaces:**
- Consumes: `captureProjectScreenshot` (Task 6), `findProjectById`/`updateProject`/`ProjectNotFoundError` de `@/lib/repositories`, `verifyToken`/`SESSION_COOKIE` de `@/lib/auth/session`, `apiSuccess`/`apiNotFound`/`apiServerError`/`apiBadRequest` de `@/lib/api-response`, `put` de `@vercel/blob`.
- Produces: endpoint HTTP — lo consume Task 8 (hook cliente) vía `fetch`.

- [ ] **Step 1: Escribir los tests (fallarán)**

```typescript
// src/app/api/projects/[id]/screenshot/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const verifyTokenMock = vi.fn();
vi.mock("@/lib/auth/session", () => ({
  SESSION_COOKIE: "jmr_session",
  verifyToken: (...a: unknown[]) => verifyTokenMock(...a),
}));

const findProjectByIdMock = vi.fn();
const updateProjectMock = vi.fn();
class ProjectNotFoundError extends Error {}
vi.mock("@/lib/repositories", () => ({
  findProjectById: (...a: unknown[]) => findProjectByIdMock(...a),
  updateProject: (...a: unknown[]) => updateProjectMock(...a),
  ProjectNotFoundError,
}));

const captureMock = vi.fn();
vi.mock("@/lib/screenshot", () => ({
  captureProjectScreenshot: (...a: unknown[]) => captureMock(...a),
}));

const putMock = vi.fn();
vi.mock("@vercel/blob", () => ({
  put: (...a: unknown[]) => putMock(...a),
}));

import { NextRequest } from "next/server";
import { PATCH } from "./route";

function req() {
  return new NextRequest("https://praxialabs.com/api/projects/olga-ai/screenshot", {
    method: "PATCH",
    headers: { cookie: "jmr_session=valid-token" },
  });
}
const params = (id: string) => ({ params: Promise.resolve({ id }) });

beforeEach(() => {
  verifyTokenMock.mockReset();
  findProjectByIdMock.mockReset();
  updateProjectMock.mockReset();
  captureMock.mockReset();
  putMock.mockReset();
});

describe("PATCH /api/projects/[id]/screenshot", () => {
  it("401 sin sesión válida", async () => {
    verifyTokenMock.mockResolvedValue(null);
    const res = await PATCH(req(), params("olga-ai"));
    expect(res.status).toBe(401);
    expect(captureMock).not.toHaveBeenCalled();
  });

  it("404 si el proyecto no existe", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue(null);
    const res = await PATCH(req(), params("no-existe"));
    expect(res.status).toBe(404);
  });

  it("400 si el proyecto no tiene URL", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue({ id: "olga-ai", url: undefined });
    const res = await PATCH(req(), params("olga-ai"));
    expect(res.status).toBe(400);
    expect(captureMock).not.toHaveBeenCalled();
  });

  it("captura, sube a Blob y actualiza project.image — 200 con el proyecto actualizado", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue({ id: "olga-ai", url: "https://olga.praxialabs.com" });
    captureMock.mockResolvedValue({ buffer: Buffer.from("png"), contentType: "image/png" });
    putMock.mockResolvedValue({ url: "https://blob.vercel-storage.com/projects/olga-ai-123.png" });
    updateProjectMock.mockResolvedValue({ id: "olga-ai", image: "https://blob.vercel-storage.com/projects/olga-ai-123.png" });

    const res = await PATCH(req(), params("olga-ai"));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.image).toBe("https://blob.vercel-storage.com/projects/olga-ai-123.png");
    expect(putMock).toHaveBeenCalledWith(
      expect.stringMatching(/^projects\/olga-ai-\d+\.png$/),
      expect.any(Buffer),
      expect.objectContaining({ access: "public", contentType: "image/png" }),
    );
    expect(updateProjectMock).toHaveBeenCalledWith("olga-ai", { image: "https://blob.vercel-storage.com/projects/olga-ai-123.png" });
  });

  it("502 si la captura falla, sin tocar project.image", async () => {
    verifyTokenMock.mockResolvedValue({ id: "admin-1" });
    findProjectByIdMock.mockResolvedValue({ id: "olga-ai", url: "https://olga-caida.example.com" });
    captureMock.mockRejectedValue(new Error("timeout"));

    const res = await PATCH(req(), params("olga-ai"));

    expect(res.status).toBe(502);
    expect(updateProjectMock).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Ejecutar y confirmar que falla**

Run: `npm test -- src/app/api/projects/\[id\]/screenshot/route.test.ts`
Expected: FAIL — `Cannot find module './route'`

- [ ] **Step 3: Implementar la ruta**

```typescript
// src/app/api/projects/[id]/screenshot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth/session";
import { findProjectById, updateProject, ProjectNotFoundError } from "@/lib/repositories";
import { captureProjectScreenshot } from "@/lib/screenshot";
import { apiSuccess, apiBadRequest, apiNotFound, apiServerError } from "@/lib/api-response";

interface RouteParams {
  params: Promise<{ id: string }>;
}

async function requireSession(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/**
 * PATCH /api/projects/:id/screenshot (requiere sesión admin)
 * Captura la home real del proyecto y actualiza su `image`. Si falla
 * cualquier paso (captura o subida), no se toca la imagen anterior.
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireSession(request);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { id } = await params;
  const project = await findProjectById(id);
  if (!project) return apiNotFound("Proyecto");
  if (!project.url) return apiBadRequest("El proyecto no tiene URL configurada");

  let shot: Awaited<ReturnType<typeof captureProjectScreenshot>>;
  try {
    shot = await captureProjectScreenshot(project.url);
  } catch {
    return NextResponse.json(
      { error: { code: "CAPTURE_FAILED", message: "No se pudo capturar la web del proyecto (¿está caída o tarda demasiado?)" } },
      { status: 502 },
    );
  }

  try {
    const blob = await put(`projects/${id}-${Date.now()}.png`, shot.buffer, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
      access: "public",
      contentType: shot.contentType,
      addRandomSuffix: false,
    });
    const updated = await updateProject(id, { image: blob.url });
    return apiSuccess(updated);
  } catch (err) {
    if (err instanceof ProjectNotFoundError) return apiNotFound("Proyecto");
    return apiServerError();
  }
}
```

- [ ] **Step 4: Ejecutar y confirmar que pasa**

Run: `npm test -- src/app/api/projects/\[id\]/screenshot/route.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 5: Commit**

```bash
git add src/app/api/projects/\[id\]/screenshot/
git commit -m "feat(api): PATCH /api/projects/[id]/screenshot — captura real y sube a Blob"
```

---

### Task 8: Función cliente `captureScreenshot` en `useProjects`

**Files:**
- Modify: `src/hooks/use-projects.ts`

**Interfaces:**
- Consumes: `PATCH /api/projects/:id/screenshot` (Task 7).
- Produces: `captureScreenshot(id: string): Promise<void>` en el objeto que devuelve `useProjects()` — lo consume Task 9.

- [ ] **Step 1: Añadir la función al hook**

Añadir a `src/hooks/use-projects.ts`, junto a `updateProject`/`deleteProject` (mismo estilo: intenta, y en éxito reemplaza el proyecto en el estado con la respuesta del servidor; en error, relanza para que quien llame pueda mostrar el mensaje):

```typescript
const captureScreenshot = useCallback(async (id: string) => {
  const res = await fetch(`/api/projects/${id}/screenshot`, { method: "PATCH" });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.error?.message || "No se pudo capturar la pantalla");
  }
  const json = await res.json();
  setProjects((prev) => prev.map((p) => (p.id === id ? json.data : p)));
}, []);
```

Añadir `captureScreenshot` a `UseProjectsReturn` (la interfaz al principio del fichero) y al objeto que devuelve el hook al final.

- [ ] **Step 2: Verificar tipos**

Run: `npx tsc --noEmit`
Expected: sin errores nuevos relacionados con `use-projects.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/use-projects.ts
git commit -m "feat: captureScreenshot en useProjects"
```

---

### Task 9: Botón "Actualizar captura" en `/admin/proyectos`

**Files:**
- Modify: `src/components/admin/projects-manager.tsx`
- Test: `src/components/admin/projects-manager.test.tsx` (nuevo — hoy no existe test para este componente)

**Interfaces:**
- Consumes: `captureScreenshot` de `useProjects()` (Task 8).
- Produces: nada — última pieza de la cadena, UI terminal.

- [ ] **Step 1: Escribir el test (fallará)**

```typescript
// src/components/admin/projects-manager.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const captureScreenshotMock = vi.fn();
vi.mock("@/hooks/use-projects", () => ({
  useProjects: () => ({
    projects: [
      {
        id: "olga-ai",
        name: "OLGA.ai",
        description: "desc",
        longDescription: "",
        tech: [],
        status: "production",
        category: "ai",
        url: "https://olga.praxialabs.com",
        image: "/projects/gws.svg",
        color: "#8b5cf6",
      },
    ],
    isLoading: false,
    error: null,
    addProject: vi.fn(),
    updateProject: vi.fn(),
    deleteProject: vi.fn(),
    toggleStatus: vi.fn(),
    captureScreenshot: (...a: unknown[]) => captureScreenshotMock(...a),
  }),
}));

import { ProjectsManager } from "./projects-manager";

beforeEach(() => captureScreenshotMock.mockReset());

describe("ProjectsManager — captura de pantalla", () => {
  it("dispara captureScreenshot con el id del proyecto al pulsar el botón", async () => {
    captureScreenshotMock.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ProjectsManager />);

    await user.click(screen.getByRole("button", { name: /actualizar captura/i }));

    expect(captureScreenshotMock).toHaveBeenCalledWith("olga-ai");
  });

  it("muestra un estado de carga mientras captura y lo quita al terminar", async () => {
    let resolveCapture: () => void = () => {};
    captureScreenshotMock.mockReturnValue(new Promise<void>((r) => { resolveCapture = r; }));
    const user = userEvent.setup();
    render(<ProjectsManager />);

    await user.click(screen.getByRole("button", { name: /actualizar captura/i }));
    expect(screen.getByRole("button", { name: /actualizar captura/i })).toBeDisabled();

    resolveCapture();
    await waitFor(() => expect(screen.getByRole("button", { name: /actualizar captura/i })).not.toBeDisabled());
  });

  it("no muestra el botón en modo solo lectura", () => {
    render(<ProjectsManager isReadOnly />);
    expect(screen.queryByRole("button", { name: /actualizar captura/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Ejecutar y confirmar que falla**

Run: `npm test -- src/components/admin/projects-manager.test.tsx`
Expected: FAIL — no existe el botón "Actualizar captura"

- [ ] **Step 3: Añadir el botón y el estado de carga**

En `src/components/admin/projects-manager.tsx`:

1. Añadir `Camera` a los imports de `lucide-react` (ya importa `Trash2, Users, Star, DollarSign, AlertCircle, Loader2, GripVertical, Eye`).
2. Extraer `captureScreenshot` del hook: `const { projects, isLoading, error, addProject, updateProject, deleteProject, toggleStatus, captureScreenshot } = useProjects();`
3. Añadir estado para saber qué proyecto está capturando ahora mismo:

```typescript
const [capturingId, setCapturingId] = useState<string | null>(null);

async function handleCapture(id: string) {
  setCapturingId(id);
  try {
    await captureScreenshot(id);
  } catch (err) {
    console.error("[captureScreenshot] failed:", err instanceof Error ? err.message : String(err));
  } finally {
    setCapturingId(null);
  }
}
```

4. Añadir el botón dentro del bloque `{!isReadOnly && (<> <EditProjectDialog .../> <Button ...Trash2.../> </>)}`, antes de `EditProjectDialog`:

```tsx
{!isReadOnly && (
  <>
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-cyan-400"
      title="Actualizar captura"
      aria-label="Actualizar captura"
      disabled={capturingId === project.id}
      onClick={() => handleCapture(project.id)}
    >
      {capturingId === project.id ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Camera className="h-4 w-4" />
      )}
    </Button>
    <EditProjectDialog project={project} onSave={updateProject} />
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={() => setDeleteTarget(project)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </>
)}
```

El texto accesible del botón es "Actualizar captura" (vía `aria-label`/`title`) — el test lo localiza por `getByRole("button", { name: /actualizar captura/i })`, que en Testing Library resuelve el nombre accesible también desde `aria-label`.

- [ ] **Step 4: Ejecutar y confirmar que pasa**

Run: `npm test -- src/components/admin/projects-manager.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Verificación manual end-to-end**

Run: `npm run dev`, entrar en `/admin/proyectos` con sesión, pulsar "Actualizar captura" en un proyecto con URL real y viva. Confirmar: el icono cambia a spinner, tras unos segundos vuelve a cámara, y la imagen de esa tarjeta cambia (recargar `/` para verla en Casos reales). Probar también con un proyecto de URL caída/inexistente: debe fallar sin romper la UI y sin cambiar la imagen anterior (ver consola del navegador para el `console.error`).

- [ ] **Step 6: Commit**

```bash
git add src/components/admin/projects-manager.tsx src/components/admin/projects-manager.test.tsx
git commit -m "feat(admin): botón para actualizar la captura de un proyecto"
```

---

## Self-Review

**Cobertura de la spec:**
- §3.1 (disparo manual por proyecto) → Task 9. "Actualizar todas" (botón bulk) de §3.1 **no está en este plan** — ver nota abajo.
- §3.2 (motor de captura, corrección respecto a `/verify`) → Tasks 5-6.
- §3.3 (errores sin tocar `image` anterior) → Task 7 (tests de 502 y 400).
- §4.1 (segmentos SVG por fila, sin JS de coordenadas) → Task 1, 3.
- §4.2 (iluminación reutilizando el reveal existente) → Task 3.
- §4.3 (responsive, amplitud reducida en móvil) → Task 3 (`--neural-amp`).
- §4.4 (tarjetas con imagen grande) → Task 4.
- §5 (fuera de alcance) → respetado: no hay recorte, ni cron, ni versionado, ni cambio de orden de tarjetas.

**Nota de alcance — botón "Actualizar todas":** la spec (§3.1) lo menciona junto al botón por proyecto. Este plan solo implementa el botón individual (Task 9); el bulk es un bucle sobre el mismo endpoint con más superficie de UI (progreso, cancelación, rate-limiting de llamadas a Chromium en serie) que merece su propio task una vez el botón individual esté verificado en uso real — añadir como Task 10 en un plan de seguimiento si se confirma que hace falta.

**Escaneo de placeholders:** sin `TBD`/`TODO`/"añadir manejo de errores" genérico — cada paso de código tiene el código real. El único punto marcado explícitamente como abierto (timeout serverless según plan de Vercel, ya señalado en la spec) queda como verificación manual en Task 5 Step 2, no bloquea la implementación.

**Consistencia de tipos:** `buildNeuralRowHtml(p: Project, index: number)` (Task 1) — mismo tipo `Project` de `@/types` que ya usa `findAllProjects()`. `captureProjectScreenshot(url: string): Promise<ScreenshotResult>` (Task 6) consumido tal cual en Task 7. `captureScreenshot(id: string): Promise<void>` (Task 8) consumido tal cual en Task 9. Sin discrepancias de nombres entre tasks.
