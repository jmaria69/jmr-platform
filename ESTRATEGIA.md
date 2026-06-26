# Estrategia de Marketing y Contenido — Praxia Labs
**Fecha:** 2026-06-25 | Revision completa

---

## 1. Propuesta de valor

### Frase principal
**"Praxia Labs automatiza los procesos manuales de tu empresa con agentes IA — sin codigo, sin consultor, operativo en menos de 48 horas."**

### Bullets de soporte (audiencia IT/operaciones PYME)
- **Conectado a tus sistemas:** los agentes se integran con tu ERP, email, Google Workspace o CRM — no sustituyen tus herramientas, las automatizan.
- **Sin dependencia tecnologica:** tus equipos no necesitan saber programar. El agente corre solo; si algo falla, lo gestionamos nosotros.
- **Retorno medible:** los clientes actuales ahorran entre 20h y 60h/mes en tareas repetitivas. El coste de implantacion se recupera en el primer mes.

### Audiencia objetivo primaria
Responsables de IT, operaciones o gerencia en PYMEs espanolas de 10-100 empleados que:
- Tienen procesos manuales repetitivos (facturas, aprobaciones, seguimiento, informes)
- Han oido hablar de IA pero no saben como implantarla sin riesgo
- Desconfian de los grandes consultores (coste, tiempo, dependencia)
- Buscan resultados rapidos y soporte cercano

---

## 2. Curacion de portfolio publico

### Proyectos que SE MUESTRAN en /proyectos
Solo los que demuestran capacidad real en IA o automatizacion:

| ID | Nombre | Argumento |
|----|--------|-----------|
| `olga-ai` | OLGA.ai | Sistema multi-agente en produccion. Referencia maxima. |
| `admin-app` | AdminApp Maestro | Agentes VERA y QUENTIN. IA en property management. |
| `crm-it` | Core OPS | Centro de mando IT con agente conversacional. |
| `generador-ideas` | Agente Emprendedor IA | IA accesible. Demuestra capacidad de LLM en producto. |
| `app-voz` | AppVoz | IA en mobile. Amplitud sin salir del foco. |
| `app-mejores-productos` | MejoresProductos | ML aplicado. Demuestra capacidad en datos. |

### Proyectos que SE OCULTAN del portfolio publico
No aportan al posicionamiento de estudio de agentes IA:

| ID | Nombre | Razon |
|----|--------|-------|
| `cf-jaramal` | Club Futbol Rivas 2016 B | HTML/CSS/JS. Sin IA. Perfil de freelance generalista. |
| `cd-rivas-jarama` | CD Rivas Jarama | Web corporativa basica. Sin relacion con IA. |
| `frajamo` | Frajamo Madrid | Web de adiestramiento canino. Dania el posicionamiento. |
| `campo-abierto` | Campo Abierto | PWA sin IA real (cruce de datos estaticos). |
| `landing-inmobiliaria` | InmoTech | Stack Vite/JS. La IA mencionada en copy no esta implementada. |

---

## 3. Metricas de credibilidad

### Metricas que se eliminan (no verificables publicamente)
- `metricsUsers` — estimaciones sin fuente auditada
- `metricsRating` — estrellas sin plataforma de reviews que las respalde
- `metricsRevenue` — dato confidencial que no debe ser publico

### Alternativas creibles

**Hero / estadisticas:**
- `{productionCount} proyectos en produccion` — real, obtenido de la BD
- `40h+ ahorradas/mes` — afirmacion conservadora, respaldable con clientes reales
- `< 48h de implantacion` — promesa de servicio, no un dato estadistico

**Tarjetas de proyecto:**
- Sustituir users/rating/revenue por: tipo de automatizacion, tech stack, estado
- Si hay URL publica, mostrar "Ver en vivo" como prueba de existencia

**Elemento hero (Signature Element):**
- AgentFlowWidget: visualizacion animada de un proceso automatizado real
- Cicla entre 3 casos de uso reales de Praxia Labs
- Muestra exactamente lo que hace el agente en cada paso

---

## 4. Estructura de navegacion

### Navbar publica
```
[Logo Praxia Labs]   Proyectos  Acerca de  Contacto   [Reservar demo]
```

### Sitemap de paginas publicas
```
/                  Homepage principal
/proyectos         Portfolio curado (solo AI/tech/automation)
/proyectos/[id]    Detalle de proyecto
/acerca-de         Pagina about
/contacto          Formulario + info de contacto
```

---

## 5. CTA principal

**Accion:** Reservar demo gratuita de 15 minutos
**Destino:** `/contacto`
**Friccion eliminada:** sin tarjeta, sin registro previo, sin pitch comercial en la primera llamada
**Promesa:** respuesta en < 2 horas (no "en breve")

**Copy del CTA:**
- Boton primario: "Reservar demo gratuita"
- Subtexto: "15 min. Sin compromiso. Te respondemos en < 2h."

**Jerarquia:**
1. Primario: "Reservar demo gratuita" → `/contacto`
2. Secundario: "Ver proyectos" → `/proyectos`
3. Footer: `jmaria.romero@praxialabs.com`

## Propuesta de valor (reformulada)

**Antes (actual):** "From Prompt to Praxis — Agentes de IA que no solo hablan, ejecutan."  
→ Posicionamiento técnico en inglés para developers. No es el cliente.

**Después (propuesta):**
> **Praxia Labs automatiza los procesos de tu empresa.**  
> Facturas, aprobaciones, seguimiento de clientes — en automático, sin código, sin consultor.  
> Soporte real en menos de 2 horas.

**Por qué funciona:**
- Habla en español al cliente real (pyme española)
- Nombra problemas concretos (facturas, aprobaciones)
- Elimina objeciones inmediatas (sin código, sin consultor)
- Añade diferenciador de soporte (escaso en el mercado)

---

## Posicionamiento por audiencia

### Small Business (audiencia primaria)
**Mensaje:** Ahorra tiempo. Empieza el lunes.  
**Tono:** Directo, coloquial, con métricas de tiempo/dinero  
**CTA:** "Reservar demo gratuita" (no "Solicitar información")

### Design / Claude (audiencia secundaria)
**Mensaje:** Integraciones pensadas para encajar en tu flujo, no para reemplazarlo  
**Tono:** Refinado, con intención, menciona el stack real  
**CTA:** "Ver proyectos en producción"

### Customer Support
**Mensaje:** Respondemos en menos de 2 horas. Sin bots.  
**Canal:** No es audiencia de landing — es audiencia de email/soporte  

---

## Estructura de navegación (propuesta)

```
Logo PraxiaLabs
├── Inicio       (/)
├── Proyectos    (/proyectos)
├── Acerca de    (/acerca-de)
└── Contacto     (/contacto)
[CTA] Reservar demo  → /contacto
```

**Eliminado:** "Admin" — nunca debe aparecer en la nav pública.  
**Lógica CTA:** El `DashboardLink` ("🚀 Ir al Dashboard") en el hero sirve para el flujo de usuario autenticado. La navbar tiene su propio CTA de conversión.

---

## Arquitectura de la homepage

### Bloque 1 — Hero (conversión primaria)
- H1: "Praxia Labs automatiza tu empresa." (directo, español)
- Subtítulo: Qué automatiza (procesos concretos), cómo (sin código), soporte
- CTAs: "Reservar demo gratuita" (primario) + "Ver proyectos" (secundario)
- Prueba social: 8 proyectos en producción, X usuarios activos

### Bloque 2 — Cómo funciona (educación)
- 3 pasos con iconos vectoriales (lucide-react), no emojis
- Iconos: MessageSquare, Cpu, Zap (o similar) — consistentes con el design system

### Bloque 3 — Proyectos destacados (credibilidad)
- Los 3 proyectos más sólidos (OLGA.ai, AdminApp Maestro, Core OPS)
- Con URL real, métricas reales, tech stack visible

### Bloque 4 — Formulario de contacto (conversión final)
- Campos: Nombre, Email, Empresa (opcional), Proyecto de interés, Mensaje
- Llama a `POST /api/contact`
- Confirmación visible tras envío
- Texto de apoyo: email directo como fallback

### Bloque 5 — Footer
- Logo + copyright
- Links: Inicio, Proyectos, Acerca de, Contacto
- Email: jmaria.romero@praxialabs.com

---

## Sistema de diseño (mantener, refinar)

### Lo que se mantiene
- Paleta: Violet `#7c3aed` + Cyan `#00d4ff` + fondo `#070714`
- Utilidades: `.glass`, `.glow`, `.text-gradient`, `.shimmer-btn`, `.grain`
- Tipografía: Geist Sans (ya instalada)
- Animaciones: `float`, `slide-up`, `gradient-x` (ya en globals.css)

### Lo que se refina
- **Eliminar emojis como iconos** → reemplazar con lucide-react en secciones de producto
- **Iconos de proceso:** `MessageSquare`, `Bot`, `Zap` (más precisos que 💬⚙️🚀)
- **El `DashboardLink`** mantiene su emoji 🚀 en el botón hero — es un CTA de acción, no un icono de sección, es aceptable

### Regla de oro
Los emojis están bien como decoración puntual (badge "✨ Praxia Labs en Producción") pero NO como iconos principales en secciones de producto o nav.
