# Auditoria Tecnica y de Contenido — praxialabs.com
**Fecha:** 2026-06-25 | **Auditor:** Consultor Senior Producto

---

## Estructura del proyecto

```
src/
  app/
    (public)/          layout.tsx, page.tsx, contacto/, acerca-de/, proyectos/
    admin/             dashboard/, proyectos/, crm/, analytics/, seguridad/, login/
    demo/              dashboard/, crm/, analytics/, proyectos/, seguridad/
    api/               auth/, contact/, projects/, dashboard/, analytics/, crm/
  components/
    public/            navbar.tsx, project-card.tsx, theme-toggle.tsx, agent-flow (pendiente)
    admin/             projects-manager.tsx, add-project-dialog.tsx, edit-project-dialog.tsx
    ui/                shadcn components
  lib/
    projects.ts        seed estatico de proyectos
    repositories/      projects.repository.ts
    auth.ts, prisma.ts, security-logger.ts
```

---

## 1. CREDIBILIDAD

### C1 — Dominio incorrecto en sitemap
**Archivo:** `src/app/sitemap.ts` linea 4
`BASE_URL = "https://jmrplatform.com"` — el dominio produccion es `praxialabs.com`.
Todas las URLs del sitemap apuntan a un dominio que no existe o no corresponde.
**Impacto:** SEO nulo para praxialabs.com. Google indexa jmrplatform.com.

### C2 — Metricas de usuarios no verificables
**Archivo:** `src/lib/projects.ts`
Los valores `metricsUsers` son estimaciones sin respaldo verificable:
95 (OLGA), 150 (AdminApp), 85 (CoreOPS), 340 (Generador Ideas), 210 (Campo Abierto)...
La pagina publica los muestra como datos reales.
**Impacto:** Cualquier cliente que pregunte como se midieron no tendra respuesta.

### C3 — Rating con estrella sin fuente
`metricsRating: 4.7`, `4.8`, `4.9` se muestran en las tarjetas publicas con icono de estrella.
No hay ninguna plataforma de reviews que los respalde (no es Google, Trustpilot, G2...).
**Impacto:** Un comprador B2B lo detecta inmediatamente como dato inventado.

### C4 — Revenue expuesto publicamente
`metricsRevenue: 3200, 2400, 1800` se muestra en la pagina de proyectos publica.
Exponer ingresos por cliente especifico en una pagina publica es un problema comercial y de confidencialidad.
**Impacto:** Clientes actuales pueden ver cuanto paga otro cliente. Competidores ven pricing real.

---

## 2. POSICIONAMIENTO

### P1 — Portfolio mezcla proyectos que destruyen el foco en IA
**Archivo:** `src/lib/projects.ts`
La pagina `/proyectos` muestra 11 proyectos. De ellos, 4 no tienen ninguna relacion con IA ni automatizacion:
- `cf-jaramal`: App gestion futbol (HTML/CSS/JS, localStorage)
- `cd-rivas-jarama`: Web club deportivo (HTML/CSS/JS)
- `frajamo`: Web adiestramiento canino (HTML/CSS/JS/Glassmorphism)
- `campo-abierto`: PWA ayudas PAC (sin IA, solo cruce de datos estaticos)
- `landing-inmobiliaria`: Landing inmobiliaria (Vite/JS, IA mencionada en copy pero no implementada)

Un responsable IT que llega buscando automatizacion ve que tambien haces webs de futbol.
**Impacto directo:** Destruye la propuesta "estudio de agentes IA especializado". Se convierte en freelance generalista.

### P2 — Tagline en ingles para audiencia espanola
**Archivo:** `src/app/(public)/page.tsx` (corregido parcialmente, pero subsiste en otras refs)
"AI Agents Studio" en la navbar. "From Prompt to Praxis" en metadata title anterior.
La audiencia objetivo (responsables IT en PYMEs espanolas) no identifica la propuesta en ingles.

### P3 — Seccion "De la teoria a la praxis" es demasiado filosofica
La seccion "como funciona" explica la diferencia entre teoria e IA abstracta.
Un responsable de operaciones no compra filosofia, compra resultados concretos.
**Impacto:** La seccion no convierte. El visitante no entiende que hace exactamente Praxia Labs.

---

## 3. UX

### U1 — /proyectos carga proyectos de la BD sin filtro
**Archivo:** `src/app/(public)/proyectos/page.tsx`
`findAllProjects()` devuelve TODOS los proyectos, incluidos los no relacionados con IA.
No hay filtro de categoria, no hay seleccion curada.

### U2 — ProjectCard expone revenue por proyecto a visitantes publicos
**Archivo:** `src/components/public/project-card.tsx` lineas 128-132
`{project.metrics.revenue.toLocaleString("es")}€/mes` visible publicamente.

### U3 — El hero visual es un bloque de codigo generico
**Archivo:** `src/app/(public)/page.tsx` seccion hero decorativa
Tres tarjetas flotantes con `const agente = new Praxia Agent()` son identicas a cualquier template de SaaS tech.
No comunica lo que hace Praxia Labs realmente.

### U4 — CTA "Ir al Dashboard" visible en hero publico
El componente `DashboardLink` aparece en el hero de la homepage publica.
Para un visitante no autenticado muestra "Ir al Dashboard" — esto confunde: el visitante no tiene dashboard.
(El componente comprueba sesion y redirige a /demo/dashboard, pero la etiqueta crea expectativa erronea.)

### U5 — Pagina /contacto: texto "Te responderemos en menos de 24 horas"
**Archivo:** `src/app/(public)/contacto/page.tsx` linea 87
El resto del site dice "menos de 2 horas". Inconsistencia de promesa de soporte.

---

## 4. VISUAL

### V1 — Glassmorphism como elemento visual primario
`.glass` y `.glass-strong` se usan en mas de 15 componentes como estilo principal de tarjetas.
El efecto blur sobre fondo oscuro es el patron visual dominante de toda la web.
El glassmorphism es un trend de 2021-2022, ahora asociado a templates genericos.
**Impacto:** La web no tiene personalidad propia. Podria ser cualquier SaaS oscuro.

### V2 — Una sola familia tipografica
**Archivo:** `src/app/layout.tsx`
Solo Geist Sans + Geist Mono. No hay distincion entre display/heading y body.
Los titulos y el texto de parrafo usan el mismo tipo con distinto peso.
**Impacto:** La jerarquia visual se basa solo en size, no en ritmo tipografico.

### V3 — Emojis como iconos en secciones de producto (restos)
Algunos componentes heredados y el admin aun usan emojis para categorias y estados.

### V4 — Elemento hero es un template stock
El panel derecho del hero con tarjetas de codigo flotantes aparece en decenas de templates.
No hay ningun visual especifico de Praxia Labs que muestre su producto real.

---

## 5. SEO TECNICO

### S1 — BASE_URL incorrecto en sitemap
`https://jmrplatform.com` — debe ser `https://praxialabs.com` (ver C1).

### S2 — Sin og:image
**Archivo:** `src/app/layout.tsx`
El metadata no incluye `openGraph.images`. Cualquier compartir en LinkedIn/Slack/Twitter
mostrara un preview vacio o el favicon.

### S3 — /acerca-de no incluida en sitemap
**Archivo:** `src/app/sitemap.ts`
La pagina existe pero no esta en el sitemap. Google no la descubrira por esta via.

### S4 — Title template inconsistente
Layout dice `template: "%s | Praxia Labs"`.
Algunos pages no definen `title` propio: la pagina de proyectos tiene `title: "Proyectos"` — aparece como "Proyectos | Praxia Labs" pero sin keyword principal.

### S5 — Sin .env.example
No hay archivo `.env.example` documentando las variables necesarias.
Cualquier desarrollador nuevo o deploy en nuevo entorno no sabe que configurar.

---

## Resumen de prioridades

| # | Problema | Impacto | Urgencia |
|---|----------|---------|----------|
| C1 | Dominio incorrecto en sitemap | SEO nulo | CRITICA |
| P1 | Portfolio no curado | Posicionamiento | CRITICA |
| U3 | Hero visual generico | Conversion | ALTA |
| U1 | /proyectos sin filtro | Posicionamiento | ALTA |
| C3/C4 | Ratings y revenue expuestos | Credibilidad | ALTA |
| V1 | Glassmorphism dominante | Identidad visual | MEDIA |
| V2 | Una sola familia tipografica | Jerarquia | MEDIA |
| S2 | Sin og:image | SEO social | MEDIA |
| U5 | Inconsistencia promesa soporte | Confianza | BAJA |
