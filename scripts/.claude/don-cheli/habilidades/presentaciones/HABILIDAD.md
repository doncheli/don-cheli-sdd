# Habilidad: Presentaciones Interactivas (HTML Slides)

**Versión:** 1.0.0
**Categoría:** Documentación
**Tipo:** Flexible

> Adaptado de frontend-slides (zarazhangrui/frontend-slides) — Generación de presentaciones HTML sin dependencias.

## Cómo Mejora el Framework

Permite generar presentaciones interactivas de proyectos, demos, pitches y documentación técnica como archivos HTML autocontenidos — sin PowerPoint, sin Figma, sin dependencias externas.

## Uso

```
/dc:presentar <tema o archivo>
/dc:presentar --tema "bold-signal"     # Elegir tema visual
/dc:presentar --desde pptx input.pptx  # Convertir desde PowerPoint
```

## Tecnología

- HTML5/CSS3/JavaScript puro (sin frameworks)
- Un solo archivo `.html` autocontenido
- Navegación por teclado, mouse y touch
- Animaciones con Intersection Observer
- Responsive con `clamp()` para todos los tamaños
- 12 temas de diseño disponibles

## Temas Disponibles

| Tema | Estilo | Ideal para |
|------|--------|-----------|
| **bold-signal** | Dark, alto contraste, acentos vibrantes | Demos técnicas |
| **electric-studio** | Dark, profesional, minimalista | Pitches |
| **neon-cyber** | Dark, futurista, cyan/magenta | Devtools |
| **terminal-green** | Dark, hacker, monospace | Conferencias dev |
| **notebook-tabs** | Light, editorial, tabs de color | Workshops |
| **pastel-geometry** | Light, amigable, redondeado | Onboarding |
| **swiss-modern** | Bauhaus, geométrico, precisión | Arquitectura |

## Output

Archivo HTML autocontenido con:
- Slides de 100vh (una pantalla por slide)
- Navegación: flechas, espacio, scroll, swipe
- Barra de progreso
- Animaciones de entrada

## Guardrails

- Cada slide debe caber en 100vh (sin scroll interno)
- Imágenes con max-height relativo al viewport
- Máximo ~15 slides para mantener engagement
