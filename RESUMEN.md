# Resumen de cambios — praxialabs.com
**Fecha:** 2026-06-25 | Auditoria + rediseno completo en 4 fases

---

## Archivos modificados o creados

### Fase 1 — Auditoria
| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| `AUDITORIA.md` | Modificado | 14 problemas documentados en 5 categorias (credibilidad, posicionamiento, UX, visual, SEO) |

### Fase 2 — Estrategia
| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| `ESTRATEGIA.md` | Modificado | Propuesta de valor B2B, curacion de portfolio (6 proyectos AI/tech vs 5 excluidos), metricas creibles, CTA, navegacion |

### Fase 3 — Sistema de diseno
| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| `src/app/layout.tsx` | Modificado | Space Grotesk (display font), `--font-space-grotesk`, metadatos og:image, og:url, keywords, robots |
| `src/app/globals.css` | Modificado | Tokens semanticos `--ds-brand/accent/surface/bg/success`, `.font-display`, `.surface-card`, `.project-card-v2`, `.badge-tech`, keyframes agent-flow |
| `src/components/public/agent-flow.tsx` | NUEVO | Signature element: AgentFlowWidget animado con 3 escenarios reales de automatizacion |
| `DESIGN_SYSTEM.md` | NUEVO | Documentacion completa: tipografia, paleta, patterns, que no usar |

### Fase 4 — Implementacion
| Archivo | Accion | Descripcion |
|---------|--------|-------------|
| `src/app/(public)/page.tsx` | Modificado | Hero con AgentFlowWidget (reemplaza bloque de codigo generico), `.font-display` en titulos, stats creibles (projectCount/40h/48h), sin emojis, grid 2 columnas en proyectos |
| `src/app/(public)/proyectos/page.tsx` | Modificado | Filtro: solo muestra 6 proyectos AI/tech (excluye futbol, canino, landings) |
| `src/app/sitemap.ts` | Modificado | BASE_URL corregido de `jmrplatform.com` a `praxialabs.com`, /acerca-de anadido, solo proyectos AI/tech indexados |
| `.env.example` | Modificado | Ampliado con RESEND_API_KEY, JWT_SECRET, NEXT_PUBLIC_GA_ID, comentarios en espanol |

### Sesiones anteriores (ya aplicados)
| Archivo | Descripcion |
|---------|-------------|
| `src/components/public/navbar.tsx` | Admin eliminado del menu, Acerca de → `/acerca-de`, ThemeToggle, Reservar demo |
| `src/app/(public)/acerca-de/page.tsx` | Pagina creada completa |
| `src/app/api/contact/route.ts` | Endpoint POST con Resend + Prisma + Zod |
| `src/components/public/theme-toggle.tsx` | Toggle dark/ivory con localStorage |
| `src/components/admin/projects-manager.tsx` | Drag & drop nativo HTML5, persistido en localStorage |

---

## Decisiones clave tomadas

### Portafolio publico
**Decision:** Filtrar `/proyectos` a solo 6 proyectos (AI/automatizacion). Los 5 excluidos (futbol, canino, PAC, inmobiliaria estatica) permanecen en la BD y admin pero NO aparecen en la web publica.
**Razon:** Un responsable IT que llega buscando automatizacion y ve una web de un club de futbol descarta la propuesta. El posicionamiento de "estudio especializado en agentes IA" requiere coherencia total en el portfolio.

### Hero visual
**Decision:** El bloque de codigo generico (`const agente = new PraxiaAgent()`) se reemplaza con `AgentFlowWidget` — un panel que muestra un proceso real de automatizacion animandose en tiempo real.
**Razon:** La diferencia entre Praxia Labs y cualquier template de SaaS oscuro debe ser visible en los primeros 3 segundos. El widget es especifico al producto.

### Metricas de credibilidad
**Decision:** Eliminar `metricsUsers` (estimaciones), `metricsRating` (sin fuente), `metricsRevenue` (confidencial).
**Decision:** Sustituir por: `{productionCount}` (real, de BD), `40h+ ahorro/mes` (conservador, respaldable), `< 48h implantacion` (SLA del servicio).
**Razon:** Un comprador B2B con presupuesto 950-3200 EUR/mes va a preguntar de donde salen los numeros. Solo los datos auditables sobreviven una due diligence.

### Tipografia
**Decision:** Anadida Space Grotesk como fuente display separada de Geist Sans.
**Razon:** Sin distincion entre display y body, la jerarquia visual depende solo de tamano. Con dos familias, los titulos tienen caracter propio aunque todo lo demas sea Geist.

### Sitemap
**Decision:** BASE_URL corregido de `jmrplatform.com` a `praxialabs.com`.
**Razon:** Error critico — Google estaba indexando (o intentando indexar) el dominio incorrecto. Todo el trabajo de SEO on-page era invisible.

---

## Proximos pasos recomendados

### Inmediatos (antes de publicar)
1. **og:image real:** Crear `/public/og-image.png` (1200x630px) con el branding de Praxia Labs. Sin ella los shares en LinkedIn/Slack no tienen preview.
2. **Verificar Resend:** Confirmar que el dominio `praxialabs.com` esta verificado en Resend y el DNS SPF/DKIM esta activo. Testear el formulario de contacto en produccion.
3. **Re-seed del admin:** Si la contrasena del admin no coincide, ejecutar `npx tsx scripts/seed.dev.ts` con `ADMIN_PASSWORD` en `.env.local`.

### Corto plazo (1-2 semanas)
4. **Testimonios reales:** Conseguir 1-2 testimonios de clientes actuales con nombre, cargo y empresa (con permiso). Anadir seccion en homepage. Es la palanca de credibilidad mas potente disponible.
5. **Caso de estudio:** Un mini-caso de uso con "Problema → Solucion → Resultado medido" para OLGA.ai o AdminApp Maestro.
6. **DNS y dominio:** Verificar que praxialabs.com apunta a Vercel y que el sitemap.xml es accesible en `https://praxialabs.com/sitemap.xml`.

### Medio plazo
7. **Pagina de precios:** Una pagina /precios con los tres planes (950/1800/3200 EUR/mes) elimina la friccion de desconfianza sobre el coste antes de la demo.
8. **Blog tecnico:** 2-3 articulos sobre casos de automatizacion reales con datos mejora la autoridad en busquedas de cola larga.
9. **Conectar GA4:** Verificar que el evento de formulario de contacto se trackea correctamente en Google Analytics.

---

## Archivos modificados

### `src/components/public/navbar.tsx`
- Eliminado botón "Admin" con enlace a `/admin/dashboard` (tanto en desktop como en mobile)
- Corregido enlace "Acerca de": `/local-galaxy/index.html` → `/acerca-de`
- Reemplazado botón "Admin" por CTA "Reservar demo" → `/contacto`
- Eliminado import de `Rocket` (ya no se usa)

### `src/app/(public)/page.tsx`
- **H1 reescrito en español:** "Praxia Labs automatiza tu empresa." (antes: "From Prompt to Praxis" en inglés)
- **Emojis-icono eliminados** en sección "Cómo funciona" → reemplazados por `lucide-react` (MessageSquare, Bot, Zap)
- **Formulario de contacto funcional:** llama a `POST /api/contact` con nombre, email, empresa, proyecto y mensaje (antes solo capturaba email y no llamaba a ninguna API)
- **Stats corregidas:** `totalUsers` calculado sobre todos los proyectos (antes solo los 3 destacados, mostraba "0k+")
- **Footer completado:** links de navegación, email de contacto, copyright
- **`<style jsx>` eliminado:** las animaciones `float` y `fade-in-up` ya están en `globals.css`

### `src/app/(public)/layout.tsx`
- Eliminados comentarios de desarrollo (`← DESCOMENTA`, `← BORRA ESTA LÍNEA`)
- Eliminado import de Footer comentado

---

## Archivos creados

### `src/app/(public)/acerca-de/page.tsx` ← NUEVO
- Página "Acerca de" completa con metadata SEO
- Secciones: quiénes somos, por qué existimos, cómo trabajamos, stack tecnológico, CTA
- Resuelve el enlace roto en la navbar

### `AUDITORIA.md` ← NUEVO
- Auditoría técnica completa con 11 problemas documentados
- Distingue entre críticos (bloquean conversión), credibilidad y UX
- Lista todos los cambios a implementar con archivo y prioridad

### `ESTRATEGIA.md` ← NUEVO
- Propuesta de valor reformulada en español para pymes
- Posicionamiento por audiencia (Small Business / Design / Customer Support)
- Arquitectura de homepage y navegación
- Reglas del sistema de diseño

---

## Lo que ya estaba bien (no se tocó)

- `src/app/api/contact/route.ts` — funcionaba correctamente con Resend + Zod + Prisma
- `src/app/(public)/contacto/page.tsx` — ya existía y ya llamaba a `/api/contact`
- `src/app/globals.css` — design system sólido, se mantiene íntegro
- `next.config.js` — headers de seguridad correctos
- Demo mode completo en `/demo/*`

---

## Próximos pasos recomendados

1. **Variable de entorno:** Verificar que `RESEND_API_KEY` esté configurada en Vercel (`Settings → Environment Variables`)
2. **Dominio de email:** Verificar que `noreply@praxialabs.com` esté autorizado en Resend (DNS records)
3. **Página /proyectos:** Si existe, revisar que use el mismo sistema de diseño
4. **Testimoniales reales:** Cuando los tengas, añadir una sección en el hero o entre proyectos y contacto
5. **Métricas reales:** Actualizar `src/lib/projects.ts` con usuarios reales cuando crezcan
