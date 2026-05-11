---
nombre: Design Shotgun
descripcion: "Explorador visual que genera 4-6 variantes de mockup HTML para iterar rápidamente sobre dirección visual. Incluye taste memory para mantener consistencia estética."
version: 1.0.0
autor: Don Cheli (adaptado de gstack)
tags: [design, mockup, variants, exploration, visual, iteration]
activacion: "design shotgun", "mostrar variantes", "explorar diseño", "design variants", "visual exploration", "show me options"
grado_libertad: alto
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, WebSearch]
---

# Design Shotgun — Exploración Visual Rápida

Generador de variantes visuales para iterar rápidamente sobre dirección de diseño. Genera 4-6 mockups HTML side-by-side para que el usuario compare y elija.

## Propósito

Cuando no sabes qué dirección visual tomar, necesitas VER opciones. Design Shotgun genera múltiples variantes HTML completas de la misma pantalla con estilos radicalmente diferentes, y las muestra en un comparison board.

## Flujo

### 1. Leer Contexto

```
LEER EN ORDEN:
1. DESIGN.md — si existe, usar como base
2. .dc/specs/spec.feature — entender el producto
3. .dc/blueprints/blueprint.md — entender la arquitectura
4. README.md — entender el proyecto
```

### 2. Taste Memory

Antes de generar, buscar preferencias previas del usuario:

```
LEER: .dc/design/taste.json (si existe)
{
  "preferred_aesthetics": ["minimal", "dark"],
  "rejected_aesthetics": ["playful", "maximalist"],
  "preferred_fonts": ["Satoshi", "DM Sans"],
  "preferred_colors": ["dark backgrounds", "accent blue"],
  "notes": "usuario prefiere clean, no fancy"
}
```

Usar taste memory para informar las variantes pero siempre incluir al menos 1 variante que rompa con las preferencias — exponer nuevas posibilidades.

### 3. Generar Variantes

Generar 4-6 variantes HTML, cada una en su propio archivo:

```
.dc/design/variants/
├── variant-A-minimal.html     → Brutally minimal, tipo + whitespace
├── variant-B-editorial.html   → Editorial con jerarquía tipográfica fuerte
├── variant-C-dark-luxury.html → Dark mode elegante, serifs, alto contraste
├── variant-D-playful.html     → Colores vivos, rounded, bouncy
├── variant-E-industrial.html  → Data-dense, monospace, utilitarian
├── variant-F-wild.html        → La opción arriesgada, rompe convenciones
└── comparison.html            → Board comparativo lado a lado
```

**Cada variante debe:**
- Ser un HTML single-file con CSS inline (sin dependencias externas excepto Google Fonts)
- Mostrar la MISMA pantalla/feature del producto (no diferentes pantallas)
- Usar datos realistas del dominio del producto
- Incluir: header/nav, contenido principal, al menos un form o data display
- Ser responsive
- Incluir toggle dark/light mode
- Tener máximo 30KB (sin frameworks)

**El comparison board debe:**
- Mostrar thumbnails de las 6 variantes en un grid 2x3
- Cada thumbnail clickeable para ver en full screen
- Indicar nombre de la dirección estética
- Campo de notas por variante para que el usuario escriba feedback

### 4. Criterios de Variación

Cada variante DEBE diferenciarse en AL MENOS 3 de estos 6 ejes:

| Eje | Opciones |
|-----|----------|
| **Estética** | Minimal, Editorial, Luxury, Playful, Industrial, Brutalist |
| **Tipografía** | Sans clean, Serif elegante, Mono technical, Display bold |
| **Paleta** | Restrained (1 accent), Balanced (2-3), Expressive (bold) |
| **Densidad** | Spacious (mucho breathing room), Comfortable, Compact (data-dense) |
| **Mood** | Professional, Warm, Technical, Creative, Premium |
| **Decoración** | None, Subtle texture, Full creative direction |

### 5. Presentar al Usuario

Abrir el comparison board en el browser:

```bash
open .dc/design/variants/comparison.html
```

Preguntar: "He generado 6 direcciones visuales diferentes. Ábrelas en tu browser para compararlas. ¿Cuál te atrae más? Puedo combinar elementos de diferentes variantes."

### 6. Actualizar Taste Memory

Después de la elección del usuario:

```json
// .dc/design/taste.json
{
  "preferred_aesthetics": ["minimal", "dark"],
  "rejected_aesthetics": ["playful"],
  "preferred_fonts": ["Satoshi"],
  "session_history": [
    { "date": "2026-04-16", "chosen": "variant-A", "notes": "le gustó la limpieza" }
  ]
}
```

## Anti-patrones

1. **Nunca generar variantes que se vean iguales** — si 2 variantes son similares, una sobra
2. **Nunca usar Lorem Ipsum** — datos realistas del dominio
3. **Nunca usar las fuentes sobreusadas** (Inter, Roboto, Poppins) — explorar opciones frescas
4. **Nunca generar solo variantes "seguras"** — siempre incluir al menos 1 opción wild
5. **Evitar AI slop** — no gradientes purple, no grids de 3 columnas con iconos en círculos

## Output

- `comparison.html` — board comparativo con thumbnails
- `variant-{A-F}-{name}.html` — cada variante como HTML standalone
- `taste.json` — preferencias actualizadas del usuario
