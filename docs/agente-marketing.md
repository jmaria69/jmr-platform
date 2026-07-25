# Agente autónomo de marketing — diseño del sistema

Objetivo: un agente que cada mañana analice, cree y optimice campañas.
Se construye en **3 fases** por una razón: los pasos que mueven dinero no
deben automatizarse hasta que las señales estén validadas.

## Fases

| Fase | Qué hace | Riesgo | Estado |
|---|---|---|---|
| **1. Observador** | Lee analítica, detecta señales, **envía informe con recomendaciones** | Ninguno (solo lectura) | ✅ **Hecho** — `scripts/marketing-report.mjs` |
| **2. Copiloto** | Genera keywords, copys, imágenes y A/B tests → los deja **pendientes de tu OK** | Bajo (nada se publica solo) | Pendiente |
| **3. Autónomo** | Pausa anuncios malos y sube presupuesto a ganadores **dentro de límites duros** | Alto (gasta dinero) | Pendiente |

## Arquitectura

```
cron diario
   └─ agente
      ├─ analytics.js    GA4 (hecho) + Vercel Analytics
      ├─ ads.js          Google Ads API / Meta Marketing API
      ├─ keywords.js     Keyword Planner (parte de Google Ads API)
      ├─ creative.js     Claude (copys) + imagen (Higgsfield/Canva/DALL·E)
      ├─ experiments.js  alta y seguimiento de A/B tests
      ├─ optimizer.js    decisiones + GUARDARRAÍLES
      └─ report.js       email vía Resend (hecho)
   └─ BD: histórico de métricas, experimentos y decisiones (auditoría)
```

## Guardarraíles de dinero (obligatorios en Fase 3)

- Cambio de presupuesto máx. **±20 %/día** por campaña.
- **Tope absoluto** de gasto diario; si se supera, el agente para.
- Máx. **N cambios/día**; el resto se acumula para revisión.
- **Kill switch** (una variable de entorno detiene toda acción).
- **Modo dry-run** por defecto en cada despliegue nuevo.
- Toda decisión **registrada con su porqué** (igual que el historial de
  reclamación de morosidad en AdminApp).

## Significancia estadística (por qué no se decide a diario)

Analizar puede ser diario; **decidir sobre dinero, no**. Un anuncio no se
pausa ni se escala hasta tener ~30-50 conversiones por variante, o 7-14 días
de datos. Con volumen bajo, decidir a diario es optimizar ruido: mata buenos
anuncios por un mal martes y escala los que tuvieron suerte.

## Accesos necesarios (el bloqueo real es papeleo, no código)

| Plataforma | Requisito | Dificultad |
|---|---|---|
| GA4 Data API | Cuenta de servicio | ✅ Ya funciona |
| Resend | API key + dominio verificado | ✅ Ya funciona |
| Google Ads API | Developer token + OAuth | Media |
| Meta Marketing API | App Review (`ads_management`) + verificación de negocio | Alta (semanas) |
| LinkedIn Ads | Marketing Developer Platform (solo partners) | Muy alta |

No existen conectores MCP para Google Ads, Meta ni LinkedIn: hay que ir por
las APIs oficiales.

## Fase 1 — implementación actual

`scripts/marketing-report.mjs` (Node, reutiliza `@google-analytics/data` y
`resend` ya instalados).

```bash
node --env-file=.env.local scripts/marketing-report.mjs --dry   # imprime
node --env-file=.env.local scripts/marketing-report.mjs         # envía
```

Env: `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64`, `GA_PROPERTY_ID`, `RESEND_API_KEY`,
`MARKETING_REPORT_TO`, `MARKETING_FROM` (por defecto `noreply@praxialabs.com`).

Compara últimos 7 días vs 7 anteriores: usuarios, sesiones, rebote, sesión
media, canales, páginas y países. Genera recomendaciones por heurística
(añadiendo `ANTHROPIC_API_KEY` se puede enriquecer con análisis de Claude).

Programar (cada mañana a las 8:00):
```
0 8 * * * cd ~/proyectosIA/web && /home/jmari/.nvm/versions/node/v24.16.0/bin/node --env-file=.env.local scripts/marketing-report.mjs >> /tmp/marketing.log 2>&1
```

## Realidad medida (2026-07-23)

Primera ejecución real: **0 usuarios en 7 días** (8 la semana anterior), sin
canales ni páginas con tráfico. Conclusión: **no hay nada que optimizar
todavía**. La prioridad no es un agente que gestione campañas, sino
**generar demanda**: contenido, canal faceless y prueba de producto (ver
mapa competitivo y el plan del canal). El agente de Fase 1 queda listo y
empezará a dar valor en cuanto haya tráfico o campañas activas.
