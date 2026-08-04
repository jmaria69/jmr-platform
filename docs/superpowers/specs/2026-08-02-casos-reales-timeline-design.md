# Rediseño "Casos reales": capturas reales + tubería neuronal en S

**Fecha:** 2026-08-02
**Estado:** diseño aprobado, pendiente de plan de implementación
**Autor:** José María Romero (con Claude)

---

## 1. Problema actual

La sección "Casos reales" de la home (`.neural` en `src/app/(public)/home-redesign.css`, generada en `src/app/(public)/page.tsx`) muestra cada proyecto con:

- Un icono de 62×62 px (`.nimg`) — hoy una insignia con la inicial en el color de marca, porque 11 de los 13 proyectos no tienen un SVG real en `public/projects/`.
- Una línea vertical recta (`.neural::before`) con un flujo de color cian/aqua en bucle continuo, sin relación con el scroll.
- Tarjetas alternadas izquierda/derecha (`.nrow:nth-child(odd/even)`) — esta parte ya funciona y se conserva.

Referencia del usuario (loofidev.com): cada tarjeta muestra una **captura real de la home del proyecto**, grande, como cabecera de la tarjeta. Pedido explícito: la línea central no debe ser recta ni un tubo liso — debe leerse como una **red neuronal enlazada** (nodos conectados) trazando una **curva en S**, que se ilumina progresivamente al bajar el scroll (no una animación en bucle ajena al scroll).

## 2. Alcance

Dos piezas independientes, un único plan de implementación:

- **A. Captura automática de pantalla** por proyecto, disparada a mano desde `/admin/proyectos`.
- **B. Trazado en S** con iluminación ligada al scroll + tarjetas con la captura grande.

## 3. A — Captura de pantalla automática

### 3.1 Disparo

Botón "Actualizar captura" por proyecto en `/admin/proyectos` (junto a Editar/Eliminar) + botón "Actualizar todas" arriba de la lista. Server-triggered, no hay captura automática al guardar ni programada — el usuario decide cuándo.

### 3.2 Motor de captura — corrección respecto a la sesión de verificación

Durante la sesión de `/verify` de esta rama usé `puppeteer-core` apuntando a un binario de Chromium cacheado manualmente en `~/.cache/ms-playwright` — **válido solo como herramienta de verificación local, no desplegable**. Vercel serverless no tiene ese caché ni tiempo/tamaño para descargar Chromium completo en cada invocación.

Para producción: `puppeteer-core` + [`@sparticuz/chromium`](https://github.com/Sparticuz/chromium) (build de Chromium comprimido para Lambda/Vercel, paquete npm real). Nuevas dependencias en `package.json`. El route handler:

1. `PATCH /api/projects/[id]/screenshot` (requiere sesión admin, mismo patrón que el resto de `/api/projects/[id]`).
2. Lanza Chromium vía `@sparticuz/chromium`, navega a `project.url`, viewport 1280×800, espera `networkidle`-equivalente con timeout corto.

   **Riesgo abierto, a confirmar en el plan:** el timeout real depende del plan de Vercel — Hobby limita funciones serverless a 10 s (justo para lanzar Chromium + navegar + capturar, puede quedarse corto con un proyecto lento), Pro permite hasta 60 s. Verificar el plan actual antes de fijar el timeout; si es Hobby, puede hacer falta `maxDuration` explícito o aceptar que algunos proyectos lentos fallen por tiempo.
3. Captura PNG, sube a Vercel Blob (`BLOB_READ_WRITE_TOKEN` ya configurado): `put(\`projects/${id}-${Date.now()}.png\`, buffer, { access: "public" })`.
4. Actualiza `project.image` con la URL del blob devuelta.

### 3.3 Errores

- Timeout o proyecto caído → 502 con mensaje claro en el admin ("no se pudo capturar, ¿la URL está viva?"), `project.image` **no se toca** (se conserva la última captura válida).
- Blob upload falla → 500, mismo criterio: no se sobreescribe `image` sin una subida exitosa.
- El fallback de insignia con inicial (ya en producción) sigue siendo la red de seguridad si `image` apunta a un blob borrado o inalcanzable más adelante.

## 4. B — Trazado en S + iluminación por scroll

### 4.1 Por qué no un `<canvas>` ni coordenadas por JS

Recalcular posiciones de tarjeta contra una curva medida por JS es frágil entre viewports y añade una capa de layout nueva. En vez de eso: **cada fila (`.nrow`) lleva su propio segmento de SVG** con una ondulación suave (amplitud pequeña, ±20-30 px) en vez de un `.neural::before` único. Los nodos (`.nnode`) y las tarjetas **no cambian de posición** — siguen centrados/alternados como hoy. La sensación de "S" la da la sucesión de curvas de cada segmento, no un recálculo de layout.

### 4.2 Iluminación ligada al scroll — reutiliza lo que ya existe

`home-fx.tsx` ya observa cada `.rev` con `IntersectionObserver` y añade `.in` cuando entra en viewport (mismo mecanismo que revela el resto de la home). Cada segmento SVG lleva `stroke-dasharray` = su longitud total y `stroke-dashoffset` = esa misma longitud (invisible); en CSS, `.rev.in svg path { stroke-dashoffset: 0; transition: stroke-dashoffset .9s ease }` lo "enciende" al mismo tiempo que su tarjeta se revela. **Cero JavaScript nuevo** para el efecto de iluminación — solo una clase CSS más sobre la infraestructura de reveal existente.

Color: gradiente (`<linearGradient>`, varios `<stop>`) que recorre naranja → magenta → violeta → cian a lo largo de toda la secuencia de segmentos, para que el conjunto lea como un degradado continuo y no cada tramo repitiendo los mismos dos colores.

### 4.3 Responsive

El breakpoint móvil ya existente (`@media max-width:760px`, columna única, nodo a la izquierda) reduce la amplitud de la onda a ~0 vía una custom property CSS (`--wave-amplitude`), quedando casi recta — una S pronunciada en una columna estrecha se vería apretada.

### 4.4 Tarjetas

`.nimg` pasa de 62×62 px a cabecera de ancho completo (~100% × 160-200 px, `object-fit: cover`) con la captura real. La insignia de inicial (ya construida) se mantiene como fallback si la imagen falla o aún no se ha capturado — mismo mecanismo `grid-area: 1/1` ya implementado, solo cambian las dimensiones del contenedor.

## 5. Fuera de alcance

- Recorte/edición manual de la captura tras subirla.
- Recaptura automática programada (cron) o al guardar el proyecto — decidido explícitamente: solo botón manual.
- Versionado histórico de capturas (cada captura nueva reemplaza a la anterior).
- Tocar la posición/orden de las tarjetas — el zigzag izquierda/derecha actual se conserva tal cual.

## 6. Verificación

- Botón de captura de un proyecto con URL real y viva → `project.image` actualizado, visible en la home tras recargar.
- Botón de captura contra una URL caída/timeout → error claro, `image` anterior intacto.
- Curva en S visible en escritorio, casi recta en móvil (viewport < 760px).
- Iluminación: cada segmento se enciende exactamente cuando su tarjeta entra en viewport, no antes ni con animación en bucle ajena al scroll.
- Fallback de insignia sigue funcionando si una captura ya subida deja de ser accesible.

## 7. Descomposición para el plan de implementación

Dos bloques independientes entre sí (no se bloquean mutuamente, pueden implementarse y verificarse por separado):

1. **Captura de pantalla** (§3): nuevas dependencias, nueva ruta API, botón en `/admin/proyectos`.
2. **Trazado en S + iluminación** (§4): solo `home-redesign.css` + la plantilla HTML generada en `page.tsx` para `.neural`/`.nrow`. Sin cambios de esquema ni de API.

El bloque 2 no depende del bloque 1 — puede entregarse primero y ya se apreciaría con las insignias de inicial actuales; el bloque 1 sustituye esas insignias por capturas reales cuando esté listo.
