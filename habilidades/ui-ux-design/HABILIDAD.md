---
nombre: UI/UX Design System
descripcion: "Aplicar sistema de diseño con 67 estilos y 161 paletas de colores para interfaces consistentes"
version: 1.0.0
autor: Don Cheli
tags: [diseño, ui, ux, design-system, colores]
activacion: "diseño UI", "paleta de colores", "design system", "estilos", "UX"
---

# Habilidad: UI/UX Design System

**Versión:** 1.0.0
**Categoría:** Diseño
**Tipo:** Flexible

> Adaptado de [ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — Motor de razonamiento multi-dominio para diseño.

## Propósito

Generar sistemas de diseño completos (estilos, colores, tipografía, patrones) a partir de la descripción del producto. Complementa `/dc:contrato-ui` que **bloquea** estándares — esta habilidad **genera** las opciones.

## Relación con contrato-ui

```
ui-ux-design (GENERAR)  →  contrato-ui (BLOQUEAR)  →  implementar (CODEAR)
     ↑                          ↑                          ↑
  "¿Qué estilo?"         "Este es el estándar"      "Codear con estándar"
```

## Dominios de Búsqueda (5 paralelos)

| Dominio | Qué evalúa | Datos |
|---------|-----------|-------|
| **Estilo** | Tendencia visual | 67 estilos UI |
| **Color** | Paleta por industria | 161 paletas |
| **Tipografía** | Par de fuentes | 57 pares Google Fonts |
| **Patrones** | Componentes y layouts | Por stack técnico |
| **UX** | Accesibilidad y usabilidad | 99 guidelines |

## Flujo

```
1. Describir producto (tipo, audiencia, tono)
2. Ejecutar búsqueda multi-dominio (5 en paralelo)
3. Presentar 3 opciones de sistema de diseño
4. Usuario elige
5. Generar tokens CSS + guía de componentes
6. (Opcional) Bloquear con /dc:contrato-ui
```

## Output

```
specs/ui/
├── design-system.md       # Documento del sistema elegido
├── tokens.css             # Variables CSS generadas
└── componentes.md         # Guía de componentes
```

## Estilos Más Usados

| Estilo | Cuándo Usar |
|--------|------------|
| Glassmorphism | Apps modernas, dashboards |
| Neumorphism | Interfaces suaves, settings |
| Brutalism | Portfolios, creativos |
| Material 3 | Apps Android, consistencia |
| Flat Design | SaaS, enterprise |
| Skeuomorphism | Apps de nicho, juegos |

## Guardrails

- Siempre verificar contraste WCAG AA (4.5:1 texto, 3:1 UI)
- Google Fonts únicamente (disponibilidad garantizada)
- Tokens CSS con custom properties (`--color-primary`, `--font-heading`)
- Si existe `contrato-ui.yaml` → respetar como constraint, no sobreescribir
