# Reposicionamiento Praxia Labs: de vender IA a resolver dolores

**Fecha:** 2026-07-22
**Estado:** diseño aprobado, pendiente de plan de implementación
**Autor:** José María Romero (con Claude)

---

## 1. El problema

La web de Praxia Labs vende **tecnología**, no **dolores**. La evidencia está en el propio código:

- `src/app/(public)/page.tsx` — titular real de la home: *"Automatiza tu empresa **con agentes IA**"*. Vende el método (IA), no el dolor. Bajada: *"Facturas, aprobaciones, seguimiento de clientes"* — mejor, pero disperso entre tres dolores de tres compradores distintos.
- `src/lib/projects.ts` — OLGA se vende como *"sistema multi-agente dockerizado... Remotion, FFmpeg, LangChain"*. Stack, no resultado.
- `src/components/public/hero.tsx` — **código muerto**: ningún archivo lo importa. Contiene el titular antiguo *"Tecnología que transforma tu negocio"*, el badge *"Soluciones digitales a medida"* y stats inventadas (`900+ usuarios`, `4.6 rating`). Se elimina.

**Corrección respecto a una versión anterior de este documento:** las stats de la home real (`productionCount`, `< 48h`, `A medida`) **no son inventadas** — `productionCount` se calcula desde la base de datos en `page.tsx`. Las stats sin respaldo estaban solo en el `hero.tsx` muerto. Por tanto §6.5 no aplica a la home actual.

En los 13 proyectos se comunica el *cómo* (stack) y el *qué* (producto). Nunca el *antes* (el problema que el cliente tiene hoy) ni el *después* (cómo cambia su día a día).

### Tracción real: cero

Consulta a la base de datos de producción (2026-07-22):

| Tabla | Registros |
|---|---|
| `Contact` | 5 (todos pruebas propias: `suco`, `laTuya`, `milka`, `sukolega`) |
| `CrmContact` | 0 |
| `Interaction` | 0 |
| `Campaign` | 1 |
| `Project` | 13 |

**Leads reales: 0.** Ninguna decisión de este documento puede apoyarse en datos de tracción, porque no existen.

### Actividad de desarrollo

| Proyecto | Commits | Último commit | Nodos de código |
|---|---|---|---|
| web (praxialabs) | 117 | 2026-07-04 | 913 |
| AdminApp Maestro | 27 | 2026-07-20 | 241 |
| Core OPS (CRM IT) | 22 | 2026-07-16 | 340 |
| SIAM | 1 | 2026-07-17 | 472 |
| GWS | 7 | 2026-06-19 | 1.515 |
| SaludApp | 2 | 2026-06-19 | 125 |
| landing-inmobiliaria | 3 | 2026-05-24 | 65 |

Solo AdminApp, Core OPS y SIAM tienen desarrollo reciente. El resto está congelado o es infraestructura personal (hermes-agent).

### Material descartado

La carpeta `~/proyectosIA/Empresas Dolores de cabeza` (26 documentos) **no se usa como base**. Es una plantilla de infoproducto sin rellenar (`Mi SaaS resuelve: ____`) sobre un producto ajeno al negocio (*"The 30-Minute Content Week"* para community managers). Se conserva una sola cosa: la fórmula `Dolor = (horas perdidas × tarifa/hora) + (errores × coste/error)`.

---

## 2. Restricciones de partida

| Restricción | Valor |
|---|---|
| Red de contactos aprovechable | **Ninguna** — se empieza en frío |
| Tiempo disponible | **> 15 h/semana** |
| Presupuesto (3 meses, sin contar tiempo) | **Cientos de €** |
| Equipo | 1 persona |

Estas restricciones invalidan cualquier estrategia basada en volumen, en publicidad de pago sostenida o en aprovechar contactos previos.

---

## 3. Decisiones tomadas

1. **Vertical principal: SIAM** — SOC virtual con IA para pymes.
2. **Segundo producto: AdminApp Maestro** — en mantenimiento, no en campaña.
3. **Certificación: sí**, escalonada, empezando por la personal.
4. **Canal principal: podcast-ariete** con el comprador como invitado.
5. **Los 11 proyectos restantes** bajan de oferta a prueba (laboratorio).

---

## 4. Por qué SIAM y no administradores de fincas

Se evaluaron ambos verticales. SIAM gana:

| | Administradores de fincas | SIAM (SOC para pymes) |
|---|---|---|
| Dolor | Morosidad, papeleo | Ataque = **75.000 €** de media; el **60%** cierra en 6 meses |
| Obligatoriedad legal | Ninguna | **NIS2**: multas hasta **10 M€ o 2%** de facturación |
| Responsabilidad | Profesional | **Personal**: el CEO puede ser inhabilitado |
| Presupuesto del comprador | Hay que crearlo | **44%** de empresas españolas lo sube en 2026 |
| Precio de referencia | No establecido | **300-2.000 €/mes**, ancla pública |
| Por qué existe el hueco | Inercia | Faltan **+30.000 profesionales** en España |
| Alcance del comprador en frío | Difícil | **LinkedIn** — decisivo sin red previa |

En fincas se vende **ahorro**; en SIAM se vende **riesgo con multa y responsabilidad personal**. El segundo se compra antes, más caro y con menos regateo. El **70%** de los ciberataques en España se dirigen a pymes.

Además, el `README.md` de SIAM ya contiene el posicionamiento correcto — *"SOC virtual con IA para pymes"* — y nunca se ha subido a la web.

---

## 5. ICP

> **Empresa de 50-250 empleados, en sector afectado por NIS2** (energía, sanidad, transporte, agua, residuos, alimentación, fabricación, digital, postal), **con responsable de IT pero sin equipo de seguridad.**

Justificación de la horquilla:
- **< 50 empleados**: fuera del ámbito NIS2 general y sin presupuesto.
- **> 250 empleados**: ya tienen MSSP o SOC propio, y proceso de compra con comité.
- **50-250**: obligada por ley, demasiado pequeña para que un MSSP grande la atienda bien, demasiado grande para ignorarlo.

**Persona compradora**: responsable de IT (usuario y prescriptor) → gerente/dirección (firma, y es quien asume la responsabilidad personal).

---

## 6. Posicionamiento y mensaje

### 6.1 Regla transversal

**La palabra "IA" no aparece por encima del scroll en ninguna landing.** Baja a la sección de cómo funciona. La IA es el método, no el mensaje.

### 6.2 Regla de honestidad del producto

**SIAM se posiciona como visibilidad y cumplimiento, nunca como escudo.**

- ✅ *"Sabrás qué pasó y podrás notificarlo en las 24 h que exige la ley."*
- ❌ *"No te van a atacar."*

Esto es simultáneamente: (a) lo que el producto hace de verdad, (b) lo que reduce la exposición legal del vendedor ante un incidente en un cliente, y (c) lo defendible sin credenciales todavía.

### 6.3 Copy del hero de `/siam`

```
Badge:    SOC virtual para pymes

Titular:  Si te atacan mañana, ¿sabrías qué se llevaron?

Bajada:   El 70% de los ciberataques en España caen sobre pymes.
          El coste medio es de 75.000 €, y la ley te obligará a
          notificarlo en 24 horas. SIAM te da el SOC que no puedes
          permitirte contratar.
```

### 6.4 Ángulo NIS2 — lo que se puede y no se puede decir

**Estado real a 2026-07-22:** España no ha transpuesto NIS2. Incumplió el plazo del 17-oct-2024. El Anteproyecto de Ley de Coordinación y Gobernanza de la Ciberseguridad se aprobó en Consejo de Ministros en enero de 2025 y sigue en trámite parlamentario. La Comisión Europea envió dictamen motivado en mayo de 2025 y un segundo requerimiento el 19-may-2026.

- ❌ **PROHIBIDO**: *"tienes hasta el día X"*. No hay fecha. Inventarla y que el comprador lo verifique cuesta la venta y la credibilidad.
- ✅ **Ángulo válido**: *"Llegará con retraso y de golpe. Quien empiece cuando se publique en el BOE, llega tarde."*

### 6.5 Stats

Las stats de la home actual se **conservan**: `productionCount` se calcula desde la base de datos y `A medida` no es una cifra. Las stats inventadas (`900+ usuarios`, `4.6 rating`) viven solo en `hero.tsx`, que es código muerto y se elimina — con lo que desaparecen sin más trabajo.

Única revisión pendiente: `< 48h` ("de idea a agente operativo") es una **promesa de plazo**, no un dato. Se mantiene en la home genérica, pero **no se replica en `/siam`**: un SOC no se despliega en 48 h y prometerlo destruye credibilidad ante un responsable de IT.

En `/siam` no hay bloque de stats hasta que exista el primer cliente. Su lugar lo ocupa la calculadora de exposición (§7.2).

---

## 7. Arquitectura de la web

### 7.1 Rutas

```
praxialabs.com/              Home de estudio. Ligera. Tres productos + laboratorio.
praxialabs.com/siam          Landing dedicada. Todo el peso de conversión.
praxialabs.com/core-ops      Landing dedicada. Hero de operaciones IT. Estática.
praxialabs.com/adminapp      Landing dedicada. Hero de morosidad. Estática.
praxialabs.com/laboratorio   Los 10 proyectos restantes, como prueba de entrega.
```

**Regla:** el tráfico de campaña **nunca** aterriza en la home. Va directo a `/siam`. Cada audiencia entra por su dolor y no ve el mensaje de la otra. La home solo la ve quien busca a Praxia Labs por su nombre.

Infraestructura ya existente y sin usar: `src/app/c/` y el modelo `Campaign` en `prisma/schema.prisma`.

### 7.2 Calculadora de exposición NIS2

Reconversión de `src/components/public/diagnostico.tsx`. El componente es reutilizable; **sus datos actuales son inventados** (6 sectores genéricos, horas a ojo: `facturas: 24h`, `email: 40h`, `informes: 32h`).

Nueva versión:

- **Entradas**: nº de empleados, sector, facturación anual.
- **Salidas**: si está dentro del ámbito NIS2, exposición económica estimada, obligaciones concretas que le aplicarán (notificación en 24 h / informe en 72 h).
- **Todas las cifras con fuente citada a pie.** Sin excepción.
- **Conversión**: informe PDF personalizado a cambio del email.

Ese informe es además el mejor pretexto de contacto en frío disponible: *"he preparado el análisis de exposición de tu empresa"*.

### 7.3 Los 11 proyectos restantes

No se borran: **se degradan de oferta a prueba**. `/proyectos` pasa a `/laboratorio` ("cosas que he construido"). SIAM y AdminApp salen de esa lista y suben a producto.

**Consecuencia aceptada:** quien entre buscando una web para su club de fútbol se irá. Es el precio del foco.

Efecto favorable: VIGIA y Core OPS son de seguridad y operaciones — en el vertical SIAM refuerzan en vez de diluir.

---

## 8. Líneas de producto

Revisión posterior a la decisión inicial: de los 13 proyectos, cuatro tienen potencial declarado — Core OPS, SIAM, domhome y VIGIA. **No forman una sola línea: forman dos, con compradores incompatibles.**

### Línea A — Seguridad y operaciones B2B  ✅ viable ahora

| Producto | Comprador | Rol |
|---|---|---|
| **SIAM** | Responsable de IT, pyme 50-250 | **Foco de campaña** |
| **Core OPS** | El mismo responsable de IT | Segundo producto, visible sin campaña |

Comparten comprador, canal (LinkedIn) y mensaje (riesgo operativo). Core OPS refuerza a SIAM en lugar de diluirlo: quien te compra visibilidad de seguridad es quien ya sufre falta de visibilidad de operaciones.

### Línea B — Domótica y seguridad física B2C  ⚠️ no viable a corto plazo

| Producto | Estado real |
|---|---|
| **domhome** | Producto de software real: FastAPI + MQTT + WebSockets, automatizaciones, multiusuario con roles |
| **VIGIA** | **No existe como producto.** La carpeta contiene un estudio de competencia y una app generada con Kimi, no un sistema en marcha |

**Por qué no es viable ahora, según el propio estudio de competencia que ya tienes:**

- El mercado con cuota está en manos de un oligopolio: **Verisure con ~1,8 M de alarmas activas**, más Movistar Prosegur, Sector Alarm, ADT, Segurma y SICOR.
- El modelo que da margen exige **CRA con aviso a Policía**, y eso requiere licencia de empresa de seguridad — no es un problema de software.
- Sin CRA, compites en el segmento DIY contra Ajax, Ring y eufy por hardware, con capital intensivo.
- Como software puro, domhome compite contra **Alexa, Google Home, Apple HomeKit y Home Assistant**, que son gratuitos.

**La oportunidad detectada en el estudio es real** — nadie integra seguridad 24/7 con domótica completa a precio público y sin permanencia, y las cuatro quejas estructurales del sector (precios opacos, subidas de cuota, dificultad de baja, atención lenta) están bien identificadas. Pero atacarla exige licencia, hardware y capital. **Con una persona y cientos de euros, no.**

**Decisión:** domhome y VIGIA quedan en el laboratorio con etiqueta explícita de *explorando*. El estudio de competencia se conserva como activo: si algún día entra capital o un socio con licencia de seguridad, el análisis de mercado ya está hecho y no caduca del todo.

### Orden de prioridad resultante

```
1. SIAM        → campaña completa
2. Core OPS    → landing, sin campaña
3. AdminApp    → landing, sin campaña
4. domhome     → laboratorio, etiqueta "explorando"
5. VIGIA       → laboratorio, etiqueta "explorando"
6. Los otros 8 → laboratorio
```

---

## 8.1 Convivencia entre productos

Con una persona, dos productos avanzan **en secuencia, no en paralelo**:

| | SIAM | Core OPS | AdminApp |
|---|---|---|---|
| Estado | **Foco activo** | Mantenimiento | Mantenimiento |
| Campaña | Sí, completa | No | No |
| Podcast | Sí | Aparece como tema, no como pitch | No |
| Landing | Sí, prioritaria | Sí, digna y estática | Sí, digna y estática |
| Desarrollo | Todo el tiempo de producto | Solo si entra un cliente | Solo si entra un cliente |

Core OPS tiene una ventaja sobre AdminApp: **comparte comprador con SIAM**. En una conversación de podcast sobre seguridad, los problemas de visibilidad operativa salen solos. Cuando ocurra, `/core-ops` ya existe y se enlaza. No requiere campaña propia para monetizarse.

AdminApp queda **listo para vender si aparece la oportunidad**, sin gastar esfuerzo de captación. Cuando SIAM tenga 3 clientes de pago, se replica el motor (landing + podcast + outbound) sobre AdminApp. El motor es reutilizable; lo caro es construirlo la primera vez.

**Copy de referencia para `/adminapp`** (dolor cuantificado, sin campaña detrás):

> Tu despacho tiene ~300.000 € en derramas sin cobrar y los persigues a mano.

Base: **14,3%** de viviendas con deuda pendiente, **1.847 €** de deuda media por vivienda morosa, **>2.800 M€** de coste anual al sector.

---

## 9. La campaña SIAM

### 9.1 Principio rector

**"Brutal" significa quirúrgico, no masivo.** Sin presupuesto, sin red y sin marca, el volumen no es una palanca disponible. **50 cuentas objetivo trabajadas a fondo baten a 5.000 emails fríos**, y no queman el dominio.

### 9.2 Pieza 1 — El podcast-ariete

No es un podcast de ciberseguridad. Es **una excusa legítima para sentarse con el comprador**.

| Parámetro | Valor |
|---|---|
| Invitado | Responsable de IT o gerente de pyme de 50-250 empleados en sector NIS2 — el ICP exacto |
| Formato | 25-30 min, videollamada grabada |
| Tema | *"Cómo lleváis la seguridad en una empresa de vuestro tamaño"* |
| Cadencia | 1 episodio/semana |
| Por qué aceptan | Se les ofrece protagonismo, no una demo: bajo riesgo, alto valor para ellos |

**Regla de oro: en la grabación no se vende nada.** La conversación comercial ocurre después, cuando ya te conoce.

**Números de referencia** (fuentes en §13): conversión media invitado→cliente del **10%** en podcasts B2B; un caso documentado alcanzó el **48%** con invitados de cuentas objetivo; una firma de ciberseguridad atribuyó **2,3 M$** de pipeline en 9 meses a relaciones de podcast. A 1 episodio/semana: 40 invitados/año ≈ **4 clientes** con la media, sin contar audiencia.

**Advertencia de expectativas:** el podcast como *audiencia* que genera leads tarda **6-12 meses**. El podcast como *acceso al comprador* funciona desde la semana 1. Esta campaña se apoya en lo segundo.

### 9.3 Pieza 2 — Lead magnet

La calculadora de exposición NIS2 (§7.2) + informe PDF personalizado.

### 9.4 Pieza 3 — LinkedIn como único canal social

Es donde está el responsable de IT. Es también la razón por la que este vertical es viable sin red: el administrador de fincas no está ahí, el responsable de IT sí.

**Competencia identificada** — todos juegan a artículos SEO: `ciax.es`, `upliora.es`, `igerasolutions.com`, `systemforge.es`. **Ninguno pone a un responsable de IT delante de un micrófono.** Ese es el hueco.

Nota: no es posible medir leads ni ventas de terceros — son datos privados. Lo medible es la ocupación del espacio de contenido.

### 9.5 Producción — activos ya construidos

La campaña es viable para una persona porque las herramientas ya existen y no hay que comprarlas:

- **Motor de podcasts con Remotion dentro de OLGA** — producción de episodios.
- **Generación de voz y herramientas de vídeo** — cortes verticales y clips para LinkedIn.

---

## 10. Certificación (escalonada)

Costes verificados de ISO 27001 en España (2026): consultoría + auditoría de **8.000 a 25.000 €** para pyme pequeña; auditoría de primera certificación sola entre **3.000 y 8.000 €**; plazo de **3-6 meses**.

| Fase | Cuándo | Coste | Objeción que resuelve |
|---|---|---|---|
| **0. Posicionamiento honesto** | Ahora | 0 € | Reduce exposición legal: visibilidad y cumplimiento, nunca escudo |
| **1. Certificación personal técnica** | Meses 1-4 | Cientos de € | **"¿Tú quién eres para hablarme de seguridad?"** — la objeción real del mes 1 |
| **2. ISO 27001 de la empresa** | Mes 6-12, **solo si SIAM ya factura** | 8.000-25.000 € | "¿Puedo comprarte como proveedor?" — abre licitaciones |
| **Alt. Alianza con consultora certificada** | Oportunista | Reparto de margen | Ambas, sin desembolso |

**Restricción dura: no invertir en ISO 27001 antes del primer cliente de pago.** Con el presupuesto declarado (cientos de €), la fase 2 no es alcanzable en los próximos 3 meses y no debe intentarse.

**Tarea concreta para la fase de plan (fase 1):** comparar al menos tres certificaciones personales de seguridad reconocidas en el mercado español, verificando en cada una coste actual, temario, duración y si es reconocible por un responsable de IT de pyme. Decidir con esa tabla delante. **No contratar ninguna sin verificar precio y vigencia en la fuente oficial** — los importes que circulan en blogs están desactualizados con frecuencia.

---

## 11. Calendario

Ajustado a >15 h/semana y presupuesto de cientos de €.

| Semana | Acción |
|---|---|
| 1-2 | Landing `/siam` + calculadora NIS2 + lista de 50 cuentas objetivo |
| 3 | Primeras 15 invitaciones al podcast. Primera grabación |
| 4-8 | 1 episodio/semana. Clips a LinkedIn. Certificación personal en marcha |
| 6-8 | Landing `/adminapp` (estática, sin campaña) — cabe por disponer de >15 h/semana |
| 9-12 | Primeras conversaciones comerciales con ex-invitados |
| Mes 3-4 | **Primer cliente de pago esperable** |
| Mes 6-12 | Con ingresos: evaluar ISO 27001 y replicar el motor sobre AdminApp |

**No se esperan leads antes del mes 3.** Cualquier promesa de resultados en 30 días con esta base de partida es falsa.

---

## 12. Métricas y criterios de éxito

Métricas reales, no de vanidad. Todas verificables en la base de datos o en el calendario.

| Métrica | Objetivo mes 3 |
|---|---|
| Invitaciones enviadas | 50 |
| Episodios grabados | 8-10 |
| Tasa de aceptación de invitación | > 20% |
| Emails capturados por la calculadora | 30 |
| Conversaciones comerciales con ex-invitados | 5 |
| **Clientes de pago** | **1** |

**Criterio de fracaso declarado por adelantado:** si al mes 3 la tasa de aceptación de invitaciones está por debajo del 10%, el problema no es la ejecución sino el mensaje de invitación o el ICP. Revisar antes de seguir produciendo episodios.

---

## 13. Riesgos

| Riesgo | Mitigación |
|---|---|
| **Credibilidad**: nadie compra seguridad a un desarrollador solo | Certificación personal (fase 1) + posicionamiento de visibilidad, no de escudo |
| **Responsabilidad**: incidente en un cliente con SIAM instalado | No prometer protección. Vender visibilidad y cumplimiento. Revisar condiciones contractuales antes del primer cliente |
| **NIS2 sin fecha**: no hay plazo legal que citar | Prohibido inventar fechas. Usar el ángulo del retraso acumulado |
| **Dos productos, una persona** | Secuencia estricta: AdminApp en mantenimiento hasta 3 clientes de SIAM |
| **El podcast no arranca** | Criterio de fracaso del §12: revisar mensaje/ICP al mes 3, no seguir por inercia |
| **Cifras del sector desactualizadas** | Toda cifra publicada lleva fuente citada y fecha. Revisar antes de cada campaña |

---

## 14. Fuera de alcance

- Publicidad de pago (incompatible con el presupuesto declarado).
- ISO 27001 en los próximos 3 meses.
- Campaña para Core OPS y para AdminApp (solo landing).
- Podcasts independientes por proyecto — descartado de común acuerdo: 13 audiencias desde cero y ninguna alcanza masa crítica sin red previa.
- **Línea B (domhome / VIGIA)**: requiere licencia de empresa de seguridad, hardware y capital. Fuera del alcance con una persona y cientos de euros. El estudio de competencia se conserva como activo para cuando cambien las condiciones.
- Reactivación de los 10 proyectos restantes del laboratorio.

---

## 15. Descomposición para implementación

Esta spec contiene dos tipos de trabajo que **no deben ir en el mismo plan**:

1. **Trabajo de código** (§6, §7, §8) — landings `/siam`, `/adminapp`, `/laboratorio`, reconversión de `diagnostico.tsx`, nuevo copy, eliminación de stats, uso de `src/app/c/` y `Campaign`. Es lo que cubrirá el plan de implementación.
2. **Trabajo de ejecución comercial** (§9, §10, §11) — invitaciones, grabaciones, LinkedIn, certificación. No es código: necesita un runbook y un calendario, no un plan de tareas de desarrollo.

**El plan de implementación cubre únicamente el punto 1.** El punto 2 se documenta aparte, y depende del 1 (no se puede invitar a nadie sin una landing a la que enviarlo).

---

## 16. Fuentes

**NIS2 y normativa**
- [NIS2 España 2026: transposición, plazos y sanciones — Legiscope](https://www.legiscope.com/blog/nis2-espana-transposicion.html)
- [NIS2 en España: qué obligaciones llegan en 2026 — a3sec](https://a3sec.com/blog/nis2-en-espana-)
- [Transposición española de NIS2 en 2026 — Audidat](https://www.audidat.com/blog/ciberseguridad/nis2/transposicion-espanola-de-nis2-en-2026-obligaciones-plazos/)
- [Directiva NIS2 para pymes: obligaciones y checklist 2026 — Fase Consulting](https://www.faseconsulting.es/articulos/directiva-nis2-ciberseguridad-empresas-espana-pymes-2026)

**Mercado de ciberseguridad pyme**
- [Ciberseguridad para pymes 2026: retos, IA y normativa NIS2 — Afianza](https://www.afianza.es/sala-prensa/ciberseguridad-pymes-empresas-espanolas/)
- [El 44% de empresas españolas aumenta su presupuesto en ciberseguridad en 2026 — Digital Perito](https://digitalperito.es/blog/presupuesto-ciberseguridad-empresas-espana-2026/)
- [Ciberseguridad en España, Q1 2026 — Cosmikal](https://www.cosmikal.es/cybersecurity-in-spain-q1-2026-real-threats-a-pending-regulatory-framework-and-a-sector-in-full-effervescence/)
- [2026, año decisivo para la ciberseguridad de las pymes — Seven Sector](https://www.sevensector.com/2026-ano-decisivo-para-la-ciberseguridad-de-las-pymes/)

**Certificación**
- [Certificación ISO 27001 en España: precios 2026 — Vulnerabbit](https://vulnerabbit.com/blog/06-04-2026_iso-27001-certificacion-espana-precio)
- [Consultoría ISO 27001 para pymes: proceso, coste y plazos — Cibersafety](https://cibersafety.com/consultoria-iso-27001-pyme/)
- [Cuánto cuesta la certificación ISO 27001 en 2026 — Novaciber](https://www.novaciber.com/cuanto-cuesta-iso-27001/)

**Podcast como canal B2B**
- [B2B podcasting for lead generation: how it actually works — Resonate Recordings](https://resonaterecordings.com/podcast-for-businesses/b2b-podcasting-for-lead-generation-how-it-actually-works/)
- [How to use a B2B podcast as a sales & lead generation machine in 2026 — Content Allies](https://contentallies.com/learn/b2b-podcast-sales-lead-generation)
- [Podcasting for lead generation: a practical B2B playbook — ThePod.fm](https://thepod.fm/resources/blog/podcasting-for-lead-generation)

**Mensaje B2B**
- [8 B2B messaging framework examples to win deals in 2026 — BigMoves](https://www.bigmoves.marketing/blog/messaging-framework-examples)
- [B2B pain points in 2026 — Prospeo](https://prospeo.io/s/b2b-pain-points)

**Interno**
- `~/proyectosIA/VIGIA Domotica y seguridad/Kimi_Agent_Competencia y Web/Estudio de competencia - Seguridad y domótica España.md` (julio 2026) — mapa del oligopolio de alarmas, precios reales a 24 meses y las cuatro quejas estructurales del sector. Base del análisis de la Línea B en §8.

**Vertical descartado (administradores de fincas)**
- [Morosidad en comunidades de propietarios en 2026 — Guía Administradores de Fincas](https://guiaadministradoresfincas.com/noticias/morosidad-en-comunidades-de-propietarios-en-2026-todo-lo-que-el-administrador-de-fincas-debe-saber-tras-la-sentencia-del-tribunal-supremo-y-la-nueva-ley-de-mediacion-obligatoria/)
- [IA para administradores de fincas en España 2026 — Upliora](https://www.upliora.es/blog/ia-para-administradores-fincas-comunidades-propietarios-espana-2026)
