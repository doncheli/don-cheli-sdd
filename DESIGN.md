# Design

## Visual Theme

Don Cheli Studio se ve como una **oficina luminosa con luz de ventana**: fondo cálido off-white, superficies claras, tinta casi negra, un único acento verde muy sutil. La atmósfera es profesional pero acogedora; no es ni oficina corporativa de banco ni hackerspace oscuro.

Escena física de referencia: un product manager o un desarrollador consultando el estado de su pipeline en un monitor externo de 27" durante la jornada laboral. Luz mixta (ventana + lámpara), café al lado, quiere saber en tres segundos si todo va bien. El Studio tiene que leerse bien en ese monitor con luz ambiente, no en una cueva a las 2 am.

## Color Strategy

**Restrained.** Neutros tintados + un único acento verde ≤10% de la superficie. El verde se reserva para estado *éxito* y para el paso en marcha en la línea de tiempo; nunca para UI genérica (botones, bordes, fondos decorativos). La tinta casi-negra hace todo el trabajo pesado.

## Color Palette

Todos los valores en OKLCH. Chroma reducido cerca de los extremos. Ningún `#000` ni `#fff`: los neutros están tintados levemente hacia el verde de marca.

### Superficies (neutros tintados)

| Token | OKLCH | Uso |
|---|---|---|
| `--bg-base` | `oklch(97% 0.003 110)` | Fondo principal del canvas. Off-white cálido. |
| `--bg-alt` | `oklch(94% 0.004 95)` | Fondo secundario para el sidebar o zonas agrupadas. |
| `--bg-panel` | `oklch(99% 0.003 155)` | Superficie de tarjetas y paneles elevados. Tintado muy levemente hacia el verde de marca. |
| `--border` | `oklch(93% 0.003 155)` | Bordes visibles (tarjetas, inputs, sidebar). |
| `--border-soft` | `oklch(96% 0.003 155)` | Bordes secundarios (separadores internos). |

### Tinta

| Token | OKLCH | Uso |
|---|---|---|
| `--text` | `oklch(17% 0.006 260)` | Cuerpo principal, títulos, cifras. |
| `--text-dim` | `oklch(48% 0.005 260)` | Texto secundario, metadatos, etiquetas. |
| `--text-faint` | `oklch(65% 0.004 260)` | Placeholders, texto deshabilitado, ayudas. |

### Acento y estados

| Token | OKLCH | Uso |
|---|---|---|
| `--success` | `oklch(58% 0.14 155)` | Paso en marcha en la línea de tiempo, pills de estado "ok", confirmaciones. |
| `--success-bg` | `oklch(96% 0.05 155)` | Fondo tenue para destacar bloques exitosos. |
| `--warn` | `oklch(55% 0.15 75)` | Presupuesto excedido, avisos no bloqueantes, retrasos. |
| `--warn-bg` | `oklch(96% 0.06 75)` | Fondo tenue para avisos. |
| `--danger` | `oklch(52% 0.18 27)` | Errores bloqueantes, fallos de gate. Usar con restricción. |
| `--danger-bg` | `oklch(96% 0.06 27)` | Fondo tenue para errores. |

### Prohibidos

- No usar gradiente en texto (`background-clip: text`).
- No usar glassmorphism como decoración por defecto.
- No usar bordes laterales acentuados (`border-left: 3px solid …`) en tarjetas o callouts.
- El dorado `#E8C547` del Studio anterior **queda descartado**.

## Typography

### Fuentes

- **Cuerpo y UI:** Inter, 300–600. Hosted vía Google Fonts.
- **Números tabulares y monospace:** Geist Mono, 400–500. Se usa en rutas de archivo, hashes, IDs de trabajo (`Trabajo #12`), ramas git, métricas técnicas.
- **Sistema fallback:** `-apple-system, "Segoe UI", system-ui, sans-serif`.

### Escala

Ratio ≥1.25 entre pasos. Jerarquía por tamaño + peso. Nunca por color solo.

| Nivel | Tamaño | Peso | `line-height` | Uso |
|---|---|---|---|---|
| Display | 32 px | 500 | 1.1 | Título de sección principal ("Gastos", "Historial"). |
| Title | 22 px | 500 | 1.2 | Encabezado de tarjeta o subsección. |
| Subtitle | 17 px | 500 | 1.3 | Encabezado menor dentro de un panel. |
| Body | 14 px | 400 | 1.5 | Texto estándar. |
| Body-sm | 13 px | 400 | 1.45 | Descripciones, hints. |
| Caption | 12 px | 400 | 1.4 | Metadatos, timestamps. |
| Micro | 11 px | 500 | 1.3 | Etiquetas en mayúsculas, tags. `letter-spacing: 0.04em`. |
| Metric | 26 px | 500 | 1 | Cifras destacadas (costo, duración). Geist Mono. |

### Reglas

- Ancho máximo de texto corrido: **65–75ch**. Documentos en la pantalla Guía cumplen esto.
- `font-feature-settings: "tnum", "cv11"` en todos los números para alineación tabular.
- Mayúsculas (`text-transform: uppercase`) solo en etiquetas micro con `letter-spacing` ≥ 0.04em. Nunca en títulos o cuerpo.
- Cursiva (`font-style: italic`) reservada para referencias o textos meta. No decorativa.

## Layout & Spacing

### Rejilla y contenedores

- Layout del shell: **sidebar 220 px fijo** + área principal fluida. Breakpoint inferior a 1024 px colapsa el sidebar a íconos.
- Ancho máximo del contenido central cuando no es tabla: **1200 px**. Márgenes laterales generosos.
- Las tablas y el timeline pueden ocupar el 100% del área disponible.

### Spacing scale (px)

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64`

- Gap entre tarjetas de un mismo grupo: **12 px**.
- Padding dentro de tarjeta estándar: **18 px** (densidad cómoda).
- Gap entre secciones distintas: **24 px**.
- Margen entre el sidebar y el contenido: **32 px**.
- Cabecera de página (padding vertical): **24 px**.

Variar el spacing dentro de una misma pantalla para generar ritmo. Padding idéntico en todo lado es monotonía.

### Radios

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm` | 6 px | Chips, pills, botones pequeños. |
| `--radius-md` | 8 px | Inputs, botones medianos, ítems del sidebar. |
| `--radius-lg` | 12 px | Tarjetas estándar. |
| `--radius-xl` | 14 px | Paneles principales (timeline hero, modal). |

Nunca pasar de 14 px: los radios demasiado redondeados se sienten cutesy y chocan con las anti-references.

### Elevación (sombras)

Solo dos niveles. Ambos en RGB tintado, muy sutiles.

- `--shadow-sm`: `0 1px 2px rgba(17, 18, 22, 0.04), 0 6px 20px -12px rgba(17, 18, 22, 0.10)`
  Tarjetas estándar, items del sidebar activos.
- `--shadow-lg`: `0 10px 30px -10px rgba(17, 18, 22, 0.30)`
  Modal de seleccionar carpeta, menús flotantes.

Sin sombra en: elementos en línea (chips, botones secundarios), bordes decorativos.

## Components

### Botones

- **Primario:** fondo `--text` (tinta casi-negra), texto `--bg-panel`, radio `--radius-md`, padding `7px 14px`, peso 500, sin sombra. Hover: `translateY(-1px)`, transición 120 ms.
- **Secundario:** fondo `--bg-panel`, texto `--text`, `--shadow-sm`. Mismo padding y radio.
- **Ghost:** fondo transparente, texto `--text-dim`. Hover sube el color a `--text` y el fondo a `--bg-alt`.
- **Tamaño sm:** padding `5px 11px`, texto 12 px.
- Iconos siempre con texto al lado o `aria-label` obligatorio.

### Chips y pills

Pill radio `999px`. Chip radio `--radius-sm`.

Tonos semánticos:
- Neutral: fondo `--bg-panel`, borde `--border`, texto `--text-dim`.
- Éxito: fondo `--success-bg`, borde `--success` al 20% alpha, texto `--success`.
- Advertencia: fondo `--warn-bg`, borde `--warn` al 20% alpha, texto `--warn`.
- Peligro: fondo `--danger-bg`, borde `--danger` al 20% alpha, texto `--danger`.
- Strong (énfasis): borde `--text`, texto `--text`, peso 500.

### Tarjetas

- Fondo `--bg-panel`, borde `--border`, radio `--radius-lg`, padding `18px`, `--shadow-sm`.
- No anidar tarjetas. Nunca. Si necesitas sub-agrupación, usa spacing o un separador sutil, no otra tarjeta.
- Evita el patrón "grid de tarjetas idénticas con ícono + título + texto" repetido. Variar tamaños y layouts para crear ritmo.

### Inputs

- Fondo `--bg-panel`, borde `--border`, radio `--radius-md`, padding `8px 12px`.
- Focus: borde `--text`, sin ring adicional.
- Placeholder: `--text-faint`.
- Label arriba del input, peso 500, caption size.

### Sidebar

- Ancho 220 px, fondo `--bg-alt`, borde derecho `--border`.
- Items agrupados en dos secciones: **Trabajar** (Ahora, Proyectos, Historial, Gastos) y **Consultar** (Arsenal, Guía, Configuración). Etiquetas de sección en Micro-size con color `--text-faint`.
- Item activo: fondo `--bg-panel`, `--shadow-sm`, texto `--text`, peso 500.
- Item inactivo: fondo transparente, texto `--text-dim`.
- Padding del item: `8px 12px`. Radio `--radius-md`.
- Badge numérico (ej. "1" en Ahora) a la derecha, en `--success` cuando hay trabajo activo.

### Barra superior (topbar)

- Alto 56 px, padding lateral 24 px, borde inferior `--border`.
- Contiene los cuatro chips de "de un vistazo" a la izquierda, un chip del editor de IA, y la cuenta del usuario a la derecha.
- Fondo `--bg-base`.

### Timeline de 7 pasos (pieza hero)

**Variante elegida: barra segmentada** (B1 del bundle de Claude Design).

- Siete segmentos horizontales de ancho proporcional al tiempo esperado, separados por 2 px.
- Terminado: fondo `--bg-panel`, texto `--text`, borde `--border`.
- En marcha: fondo `--success-bg`, borde `--success`, texto `--text`, peso 500. El borde tiene un sutil halo `box-shadow: 0 0 0 3px oklch(58% 0.14 155 / 0.15)` para atraer el ojo.
- Pendiente: fondo transparente, borde `--border-soft`, texto `--text-faint`.
- Cada segmento muestra: nombre del paso, duración (Geist Mono), costo opcional.
- Click en un segmento filtra el panel de abajo a "lo que pasó en ese paso".

### Panel de registro en vivo

- Fondo `--bg-panel`, borde `--border`, radio `--radius-lg`.
- Texto en Geist Mono 12 px, color `--text-dim` por defecto.
- Scroll automático hacia abajo cuando llega contenido nuevo; se pausa al hacer scroll manual y reanuda con un botón.
- Filtros por nivel (información, advertencia, error) como chips arriba.

### Modal

- Overlay `rgba(17, 18, 22, 0.55)`, no glass.
- Contenedor: fondo `--bg-panel`, radio `--radius-xl`, `--shadow-lg`, ancho máximo 560 px.
- Cerrar con ESC, clic fuera o botón ×.
- Solo se usa cuando inline + progressive disclosure no alcanzan.

### Estados vacíos

- Centrados, con tipografía grande (Title o Display), una frase corta en Body-sm, y 1–2 CTAs claros.
- Sin ilustraciones; un bloque de texto tipografiado comunica mejor.

## Density

Una sola densidad: **cómoda** (la densa queda descartada por decisión explícita del usuario). Valores arriba corresponden a esa densidad.

## Motion

- Duración base: **160 ms**. Hover y cambios de estado.
- Duración para transiciones entre pantallas: **240 ms**.
- Easing por defecto: `cubic-bezier(0.2, 0.9, 0.25, 1)` (aproximadamente ease-out-quart).
- Prohibido: bounce, elastic, spring visibles. Nada que "rebote".
- Nunca animar propiedades de layout (`width`, `height`, `top`, `left`). Usar `transform` y `opacity`.
- Respetar `prefers-reduced-motion`: las animaciones decorativas se desactivan; las funcionales (transición entre rutas) se simplifican a fade sin transform.

### Transiciones típicas

- Hover en botones y cards: `transform: translateY(-1px)`, 120 ms.
- Apertura de modal: fade + `scale(0.98 → 1)`, 160 ms.
- Cambio de ruta: fade-out 120 ms + fade-in 160 ms con leve `translateY(8px)`.

## Icons

- Estilo: **stroke, 1.5 px**, esquinas redondeadas. Set de referencia: Lucide.
- Tamaño base: 16 px. Grande: 20 px (para títulos de sección).
- Color: heredan `currentColor`. No usar color propio para decorar.
- Siempre con texto al lado o `aria-label`. Los íconos "decorativos" no existen en este producto.

## Anti-patrones específicos del producto

Además de los prohibidos globales de impeccable:

- **No hero con número gigante + sparkline + % de cambio + stat card.** Es el cliché SaaS. Si necesitas mostrar un KPI, hazlo parte de un contexto, no de un show.
- **Nada se comunica solo con color.** Un chip de "con error" tiene texto o ícono además del rojo.
- **Sin tooltips como muleta.** Si necesitas un tooltip para explicar qué hace algo, probablemente el label está mal. Los tooltips solo para atajos o información secundaria redundante.
- **Scrollbars invisibles no, gracias.** Un scrollbar nativo discreto es más predecible que uno custom que se oculta.
