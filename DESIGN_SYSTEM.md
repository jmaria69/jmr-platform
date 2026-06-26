# Design System v2 — Praxia Labs
**Fecha:** 2026-06-25

---

## Principios de diseno

1. **Especificidad sobre genericidad.** Cada elemento visual debe poder pertenecer solo a Praxia Labs, no a "cualquier SaaS oscuro".
2. **La interface es el producto.** Los componentes deben mostrar lo que el producto hace, no solo decorar.
3. **Jerarquia tipografica real.** Dos familias con roles distintos — no el mismo tipo con distintos pesos.
4. **Glassmorphism como acento, no como textura principal.** Se reserva para overlays, tooltips y elementos flotantes — no para el contenedor primario de contenido.

---

## Tipografia

### Familia 1: Space Grotesk (Display)
- **Rol:** Titulos hero (h1), secciones principales (h2), cifras destacadas
- **Cargada via:** `next/font/google` con variable `--font-space-grotesk`
- **Variable CSS:** `--ds-font-display`
- **Clase Tailwind:** `.font-display` (definida en globals.css)
- **Propiedades:** `font-feature-settings: "ss01", "cv01"`, `letter-spacing: -0.025em`
- **Por que Space Grotesk:** geometrica con terminaciones optimas para pantalla, siente "tech pero legible", diferencia de Geist claramente

### Familia 2: Geist Sans (Body)
- **Rol:** Parrafos, labels, formularios, navegacion, contenido general
- **Variable CSS:** `--ds-font-body` → `--font-geist-sans`
- **Por que Geist:** neutro, excelente legibilidad en densidades altas, ya cargado por Next.js

### Familia 3: Geist Mono (Code)
- **Rol:** Snippets de codigo, tech stack badges, datos tecnicos
- **Variable CSS:** `--ds-font-mono` → `--font-geist-mono`

### Escala tipografica
```
Hero H1:     Space Grotesk 60-72px, weight 700, tracking -0.025em
Section H2:  Space Grotesk 40-48px, weight 700, tracking -0.02em
Card H3:     Space Grotesk 18-22px, weight 600
Body large:  Geist Sans 18px, weight 400
Body:        Geist Sans 16px, weight 400
Body small:  Geist Sans 14px, weight 400
Label:       Geist Sans 11-12px, weight 600, uppercase, tracking 0.08em
Code:        Geist Mono 13px
```

---

## Paleta de colores (5 tokens semanticos)

| Token | Valor Dark | Valor Ivory | Uso |
|-------|-----------|-------------|-----|
| `--ds-brand` | `#7c3aed` | `#6d28d9` | Violet — color de marca primario, CTAs, acentos |
| `--ds-accent` | `#00d4ff` | `#0891b2` | Cyan — acento secundario, highlights, links |
| `--ds-surface` | `#0d0d2b` | `#F2F1EC` | Fondo de tarjetas y contenedores |
| `--ds-bg` | `#070714` | `#FAF9F6` | Fondo de pagina |
| `--ds-success` | `#06ffa5` | `#059669` | Verde — confirmaciones, resultados, exito |

### Paleta de texto
```
--foreground:       #e8e8f0  (dark) / #1a1a2e  (ivory)
--muted-foreground: #8888aa  (dark) / #555577  (ivory)
--text-label:       #a78bfa  (dark) / #6d28d9  (ivory)
```

---

## Elemento Signature: AgentFlowWidget

### Que es
Un panel animado en el hero que muestra un proceso de automatizacion real de Praxia Labs, con tres fases: **Entrada → Agente procesando → Resultado**. Cicla entre 3 casos de uso reales.

### Por que es el signature element
- No aparece en ningun template de SaaS
- Muestra exactamente lo que Praxia Labs vende: un agente que automatiza un proceso
- Es interactivo (anima en tiempo real) pero no gimmicky
- Cada ciclo muestra "Tiempo ahorrado: X" — refuerza la propuesta de valor

### Implementacion
**Archivo:** `src/components/public/agent-flow.tsx`
- Componente `'use client'` con estados: `input → processing → output → done → reset`
- Usa `useState`, `useEffect` — sin librerias de animacion externas
- CSS: `flow-progress`, `agent-blink`, `step-appear` definidos en globals.css
- Cicla entre 3 escenarios reales: facturas, atencion al cliente, operaciones IT

### Escenarios mostrados
1. Gestion de facturas: recepcion email → VERA analiza → aprobada + ERP
2. Atencion al cliente: email incidencia → OLGA categoriza → respondido + ticket
3. Operaciones IT: reunion → Core OPS extrae → acta + tareas

---

## Componentes

### ProjectCard v2
**Patron:** surface-card (no glassmorphism como textura principal)
- Fondo: `--ds-surface` (#0d0d2b)
- Borde: `rgba(255,255,255,0.06)` → hover `rgba(124,58,237,0.35)`
- No muestra `metricsUsers`, `metricsRating`, `metricsRevenue` (eliminados del portfolio publico)
- Clase CSS: `.project-card-v2`

### Badge
- Sin emojis — usa lucide-react icons
- Clase CSS: `.badge-tech` (violet pill)
- Shadcn Badge existente: se mantiene, se extiende

### Botones
- Primario: `.shimmer-btn` (gradiente violet animado)
- Secundario: border `ds-accent/30`, texto `ds-accent`
- Terciario: texto plano con hover underline

---

## Que NO usar

| Pattern | Alternativa |
|---------|-------------|
| Glassmorphism como contenedor principal | `.surface-card` (fondo solido semiopaco) |
| Emojis como iconos de producto | `lucide-react` icons |
| Una sola familia tipografica | `font-display` (Space Grotesk) para headings |
| Metricas inventadas con estrellas | Datos reales o KPIs de proceso |
| Bloque de codigo generico como hero visual | `AgentFlowWidget` |

---

## Archivos modificados en Fase 3

- `src/app/layout.tsx` — Space_Grotesk importado, `--font-space-grotesk` variable, og:image metadata
- `src/app/globals.css` — tokens semanticos `--ds-*`, `.font-display`, `.surface-card`, `.project-card-v2`, `.badge-tech`, keyframes agent-flow
- `src/components/public/agent-flow.tsx` — NEW: componente signature AgentFlowWidget
