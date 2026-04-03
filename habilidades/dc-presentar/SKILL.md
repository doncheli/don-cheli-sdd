---
name: dc-presentar
description: Generar presentación interactiva HTML desde contenido del proyecto. Usa cuando el usuario dice "presentar", "presentación", "slides", "presentation", "generar slides", "HTML presentation", "demo", "present project", "showcase", "pitch". Genera presentación HTML interactiva desde specs, docs o código del proyecto.
i18n: true
---

## Objetivo
Generar presentaciones interactivas como archivos HTML autocontenidos — sin PowerPoint, sin Figma, sin dependencias externas.
## Uso
```
/dc:presentar <tema o descripción>
/dc:presentar --tema "bold-signal"
/dc:presentar --desde pptx input.pptx
/dc:presentar --actualizar docs/presentacion/mi-presentacion.html
```
## Parámetros
| Parámetro | Descripción | Default |
|-----------|-------------|---------|
| `<tema>` | Descripción del contenido a presentar | — |
| `--tema` | Tema visual (ver tabla abajo) | `bold-signal` |
| `--desde` | Formato de entrada (`pptx`, `md`, `texto`) | — |
| `--actualizar` | Ruta a presentación existente para actualizar | — |
| `--slides` | Número máximo de slides | `10` |
## Temas Disponibles
| Tema | Estilo | Ideal para |
|------|--------|-----------|
| `bold-signal` | Dark, alto contraste, acentos vibrantes | Demos técnicas |
| `electric-studio` | Dark, profesional, minimalista | Pitches |
| `neon-cyber` | Dark, futurista, cyan/magenta | Devtools |
| `terminal-green` | Dark, hacker, monospace | Conferencias dev |
| `notebook-tabs` | Light, editorial, tabs de color | Workshops |
| `pastel-geometry` | Light, amigable, redondeado | Onboarding |
| `swiss-modern` | Bauhaus, geométrico, precisión | Arquitectura |
## Tecnología
- HTML5/CSS3/JavaScript puro (sin frameworks)
- Un solo archivo `.html` autocontenido
- Navegación: flechas, espacio, scroll, swipe
- Animaciones con Intersection Observer
- Responsive con `clamp()` para todos los tamaños
## Proceso
1. **Analizar contenido** — Leer el tema/archivo de entrada
2. **Estructurar slides** — Dividir en secciones lógicas (máx. ~15 slides)
3. **Aplicar tema** — Usar el tema visual seleccionado
4. **Generar HTML** — Archivo autocontenido con CSS + JS inline
5. **Verificar** — Cada slide cabe en 100vh, sin scroll interno
## Guardrails
- Cada slide debe caber en 100vh (sin scroll interno)
- Imágenes con max-height relativo al viewport
- Máximo ~15 slides para mantener engagement
- Google Fonts vía CDN (Inter + JetBrains Mono por defecto)
- Fuentes, colores y estilos consistentes con el tema elegido
## Habilidad Asociada
Lee `habilidades/presentaciones/HABILIDAD.md` para la referencia técnica completa.
## Ejemplo
```
/dc:presentar "Demo de Don Cheli para conferencia de devs" --tema terminal-green --slides 12
```
