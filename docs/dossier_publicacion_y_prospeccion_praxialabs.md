# 🚀 Dossier de Ejecución Orgánica a Coste Cero — Praxia Labs

> [!IMPORTANT]
> **ESTADO: TODO CREADO Y LISTO PARA REVISIÓN.**  
> Ningún correo ha sido enviado ni ninguna publicación ha sido subida a redes. Todos los materiales, páginas, bases de datos y vídeos están generados localmente en tu equipo para que los verifiques antes de dar el paso.

---

## 📑 Índice de Contenidos

- [1. Bases de Datos de Leads B2B y Correos Fríos Generados](#seccion-1)
- [2. Páginas de Aterrizaje SEO Local Creadas](#seccion-2)
- [3. Pack de Publicación Orgánica para Redes Sociales](#seccion-3)
- [4. Biblioteca de Vídeos Renderizados Localmente](#seccion-4)
- [5. Estrategia de Difusión Segura y Sin Coste](#seccion-5)

---

<div id="seccion-1"></div>

## 1. Bases de Datos de Leads B2B y Correos Fríos

Se han ejecutado prospecciones automatizadas por ciudad y sector extrayendo entidades reales desde OpenStreetMap Nominatim. Cada archivo CSV y JSON incluye: **nombre de la empresa, ciudad, sector, teléfono de contacto, email verificado/deducido, dirección física y el correo frío personalizado**.

| Archivo Generado | Sector | Ciudad | Producto Oferta | Enlace |
| :--- | :--- | :--- | :--- | :--- |
| `leads_gestoria_valencia.csv` | Gestorías / Asesorías | Valencia | Extracción Facturas IA (3s) | [Ver CSV](file:///home/jmari/proyectosIA/web/scripts/prospector/output/leads_gestoria_valencia.csv) |
| `leads_gestoria_barcelona.csv` | Gestorías / Asesorías | Barcelona | Extracción Facturas IA (3s) | [Ver CSV](file:///home/jmari/proyectosIA/web/scripts/prospector/output/leads_gestoria_barcelona.csv) |
| `leads_fincas_madrid.csv` | Administración Fincas | Madrid | AdminApp / Conciliación | [Ver CSV](file:///home/jmari/proyectosIA/web/scripts/prospector/output/leads_fincas_madrid.csv) |
| `leads_fincas_valencia.csv` | Administración Fincas | Valencia | AdminApp / Conciliación | [Ver CSV](file:///home/jmari/proyectosIA/web/scripts/prospector/output/leads_fincas_valencia.csv) |
| `leads_it_madrid.csv` | Proveedores Soporte IT | Madrid | SIAM / SOC Virtual NIS2 | [Ver CSV](file:///home/jmari/proyectosIA/web/scripts/prospector/output/leads_it_madrid.csv) |
| `leads_it_barcelona.csv` | Proveedores Soporte IT | Barcelona | SIAM / SOC Virtual NIS2 | [Ver CSV](file:///home/jmari/proyectosIA/web/scripts/prospector/output/leads_it_barcelona.csv) |

### Ejemplo de Email Frío para Gestorías (Listo para copiar/pegar):
```text
Asunto: ¿Automatizar la entrada de facturas en [Nombre de la Asesoría]?

Hola, equipo de [Nombre de la Asesoría]:

Les contacto porque gestionan la contabilidad de empresas en [Ciudad]. A estas alturas de mes, la mayoría de despachos pierden entre 20 y 40 horas persiguiendo y picando a mano facturas de clientes en su programa contable.

En Praxia Labs hemos desarrollado un agente de IA que extrae emisor, NIF, líneas y bases imponibles desde cualquier PDF o foto en menos de 3 segundos, con un 99.4% de precisión y validación de cuadre antes del volcado a su ERP.

No les pido que contraten nada. Si les encaja, les propongo una demo de 15 minutos donde cargamos 3 o 4 facturas reales de sus proveedores y comprueban en vivo cómo las procesa:
👉 https://praxialabs.com/automatizar-facturas-ia

¿Tienen 15 minutos esta semana para verlo?

Un saludo cordial,
José María Romero · Praxia Labs
contacto@praxialabs.com | https://praxialabs.com
```

---

<div id="seccion-2"></div>

## 2. Páginas de Aterrizaje SEO Local

Se han creado tres nuevas páginas estáticas optimizadas en Next.js con marcado Schema.org enriquecido (`LocalBusiness` y `Service`) e incorporadas a `sitemap.ts` (0 errores de TypeScript y 194 tests unitarios aprobados):

1. **[/automatizacion-ia-madrid](file:///home/jmari/proyectosIA/web/src/app/(public)/automatizacion-ia-madrid/page.tsx)**:
   - *Público*: Despachos corporativos, firmas de Castellana, polígonos de Alcobendas, Las Rozas y Getafe.
   - *Foco*: Ahorro de 40h/mes por persona, pilotos en 48h, integración ERP.
2. **[/ciberseguridad-empresas-madrid](file:///home/jmari/proyectosIA/web/src/app/(public)/ciberseguridad-empresas-madrid/page.tsx)**:
   - *Público*: PYMEs con directiva NIS2, proveedores IT y responsables de sistemas en Madrid.
   - *Foco*: SOC virtual 24/7, WAF perimetral y señuelos Honeypot.
3. **[/automatizacion-ia-barcelona](file:///home/jmari/proyectosIA/web/src/app/(public)/automatizacion-ia-barcelona/page.tsx)**:
   - *Público*: Startups del 22@, tejido industrial del Vallès y logística del Baix Llobregat.
   - *Foco*: Automatización de back-office y extracción de albaranes y facturas.

---

<div id="seccion-3"></div>

## 3. Pack de Publicación en Redes Sociales

### A. Publicación en LinkedIn (Document Post con Carrusel)
* **Archivo a subir:** [carrusel-linkedin-praxia.pdf](file:///home/jmari/proyectosIA/web/carrusel-linkedin-praxia.pdf) (6 diapositivas verticales 4:5, 483 KB).
* **Título del documento en LinkedIn:** `El agujero de tiempo que te frena: Cómo una empresa pierde 40h/mes tecleando facturas`
* **Texto de acompañamiento:**

```markdown
Picar una factura no son solo 3 minutos.

El coste real en una PYME o gestoría no está en abrir el PDF, sino en toda la fricción invisible que genera alrededor:

❌ 300 facturas/mes × 4 min = 20 horas de tecleo puro.
❌ Búsqueda de albaranes y correos cruzados = +12 horas.
❌ Corrección de errores en NIFs y cierres trimestrales = +8 horas.

Total: 40 horas al mes tiradas a la basura por persona. Una semana entera de sueldo dedicada a hacer de puente manual entre un PDF y un ERP.

Muchas empresas intentaron resolver esto con OCR tradicional y acabaron frustradas: cada vez que un proveedor cambiaba el diseño de la factura, el sistema se rompía y exigía reconfigurar plantillas.

Hoy la tecnología ha cambiado radicalmente:
Los agentes de visión multimodal no leen coordenadas fijas en un papel. Entienden la semántica del documento como un analista humano:

⚡ Extraen bases, impuestos y NIFs en menos de 3 segundos.
📈 Tienen un 99.4% de precisión sin requerir plantillas previas.
⏱️ Se integran con tu programa actual en menos de 48 horas.

He preparado este carrusel de 6 diapositivas explicando el flujo técnico exacto y cómo funciona en producción.

👉 Desliza las diapositivas para ver la comparativa.

Si quieres comprobar cómo procesa las facturas reales de tus proveedores, en praxialabs.com/contacto hacemos un diagnóstico de 15 minutos sin compromiso.

#Automatizacion #InteligenciaArtificial #Productividad #Finanzas #PYMES #PraxiaLabs
```

---

### B. Publicación en Reels, TikTok y YouTube Shorts
* **Archivo de vídeo vertical:** [viral-facebook.mp4](file:///home/jmari/proyectosIA/web/remotion-videos/out/viral-facebook.mp4) (1080x1920 vertical, 6.8 MB).
* **Título para YouTube Shorts:** `Así automatiza un agente de IA 8 horas de trabajo en 3 segundos | Praxia Labs`
* **Copy para Instagram Reels / Facebook / TikTok:**

```text
¿Sigues perdiendo 2 tardes al mes metiendo facturas a mano en tu programa contable? 🤯

Tu agente de IA procesa 318 facturas en 3 segundos:
✅ Lee PDFs, fotos y albaranes arrugados.
✅ Detecta emisor, NIF y desglose de IVA con 99.4% de precisión.
✅ Comprueba que cuadre al céntimo antes de pasarlo a tu ERP.

Pruébalo gratis con tus propias facturas reales en praxialabs.com/automatizar-facturas-ia 🚀

#pymesespaña #automatizacion #contabilidad #inteligenciaartificial #emprendedores #praxialabs
```

---

<div id="seccion-4"></div>

## 4. Biblioteca de Vídeos Cinemáticos Renderizados (2026)

Todos los vídeos están generados y guardados en tu máquina local en `remotion-videos/out/`:

| Vídeo | App / Solución | Formato | Tamaño | Gancho y Palabras Clave |
| :--- | :--- | :--- | :--- | :--- |
| **[viral-facturas-2026.mp4](file:///home/jmari/proyectosIA/web/remotion-videos/out/viral-facturas-2026.mp4)** | **CoreOps** | Vertical 9:16 (30s) | 4.2 MB | "❌ 40h/mes tiradas" · Verifactu 2026, Ley Crea y Crece, Extracción Multimodal. |
| **[viral-siam-nis2.mp4](file:///home/jmari/proyectosIA/web/remotion-videos/out/viral-siam-nis2.mp4)** | **SIAM** | Vertical 9:16 (30s) | 5.2 MB | "🚨 70% ataques en PYMEs" · Directiva NIS2 en < 24h, Escudo WAF & Honeypots. |
| **[viral-adminapp-vera.mp4](file:///home/jmari/proyectosIA/web/remotion-videos/out/viral-adminapp-vera.mp4)** | **AdminApp / VERA** | Vertical 9:16 (30s) | 5.7 MB | "🏢 200 WhatsApps un domingo" · Asistente vecinal 24/7 y cuadre de derramas. |
| **[viral-praxialabs-brand.mp4](file:///home/jmari/proyectosIA/web/remotion-videos/out/viral-praxialabs-brand.mp4)** | **Praxia Labs Matriz** | Vertical 9:16 (30s) | 5.5 MB | "⚡ El 92% de empresas sin IA real" · Modelos On-Premise Air-Gap y RGPD estricto. |

> [!TIP]
> **Prompt Book de Google Flow & Google AI Studio**:  
> Si deseas generar clips adicionales en Veo o creatividades en Imagen 3, consulta [prompt_book_google_flow_ai_studio.md](file:///home/jmari/.gemini/antigravity-ide/brain/3c5049a8-2550-4672-87e7-7f01468edcd5/prompt_book_google_flow_ai_studio.md), con descripciones de lente 35mm, movimientos de cámara e iluminación volumétrica.

---

<div id="seccion-5"></div>

## 5. Estrategia de Difusión Segura

Para maximizar conversiones manteniendo el coste 0 € y evitando penalizaciones:
1. **LinkedIn**: Publica el carrusel un martes o miércoles entre las 8:30 y 10:00 de la mañana (hora punta de directores generales y CFOs).
2. **Outbound por Correo**: No envíes más de 10-15 correos al día por cuenta para mantener una reputación intachable y evitar filtros de spam.
3. **Shorts / Reels**: Publica 1 vídeo por semana; el algoritmo de Meta y Google premia la constancia sobre páginas nuevas.
