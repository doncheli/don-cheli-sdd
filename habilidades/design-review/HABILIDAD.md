---
nombre: Design Review
descripcion: "Auditoría de diseño con scoring 0-10 en 10 dimensiones. Detecta AI slop, inconsistencias con DESIGN.md, problemas de accesibilidad, y genera reporte actionable."
version: 1.0.0
autor: Don Cheli (adaptado de gstack)
tags: [design, review, audit, quality, accessibility, scoring]
activacion: "design review", "auditoría de diseño", "review visual", "design audit", "revisar diseño", "UI quality check"
grado_libertad: bajo
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, WebSearch]
---

# Design Review — Auditoría Visual con Scoring

Revisión exhaustiva de UI/UX con scoring cuantitativo en 10 dimensiones. Detecta problemas de accesibilidad, inconsistencias con el design system, y AI slop anti-patterns.

## Flujo

### 1. Leer Contexto

```
LEER:
1. DESIGN.md — source of truth (OBLIGATORIO)
2. .dc/design/ — mockups y diseños generados
3. src/ o app/ — componentes implementados
4. public/ o dist/ — HTML generado
```

Si no existe DESIGN.md: "No hay design system definido. Sin un source of truth, no puedo evaluar consistencia. Ejecuta `/dc:design-consultation` primero."

### 2. Scoring: 10 Dimensiones

Cada dimensión se puntúa de 0 a 10:

| # | Dimensión | Qué Evalúa | Peso |
|---|-----------|------------|------|
| 1 | **Typography Consistency** | ¿Todos los textos usan las fuentes de DESIGN.md? ¿La escala tipográfica es consistente? | 10% |
| 2 | **Color Adherence** | ¿Todos los colores vienen de la paleta en DESIGN.md? ¿Hay colores hardcodeados? | 10% |
| 3 | **Spacing Discipline** | ¿El spacing sigue la escala definida? ¿Hay valores arbitrarios? | 10% |
| 4 | **Layout Coherence** | ¿El layout sigue el enfoque en DESIGN.md? ¿Grid consistente? | 10% |
| 5 | **Component Consistency** | ¿Los componentes similares se ven igual? ¿Botones, inputs, cards consistentes? | 10% |
| 6 | **Accessibility (WCAG AA)** | Contraste 4.5:1, focus visible, semántica HTML, touch targets 44px | 15% |
| 7 | **Responsive Quality** | ¿Funciona en 375px, 768px, 1440px? ¿Sin scroll horizontal? | 10% |
| 8 | **Motion & Interaction** | ¿Las transiciones siguen el enfoque de DESIGN.md? ¿Feedback en acciones? | 5% |
| 9 | **AI Slop Detection** | ¿Hay anti-patrones de AI? Gradientes purple, grids genéricos, centered everything | 10% |
| 10 | **Visual Polish** | ¿Se siente terminado? ¿Detalles cuidados? ¿Nada "placeholder"? | 10% |

### 3. AI Slop Detection (Dimensión 9)

Buscar estos anti-patrones específicos:

```
ESCANEAR:
- Purple/violet gradients como accent default
- Grid de 3 columnas con iconos en círculos coloreados
- Todo centrado con spacing uniforme
- Border-radius bubbly uniforme en todo (rounded-2xl everywhere)
- Botones gradient como CTA principal
- Hero sections genéricas con stock photo
- Copy tipo "Built for X" / "Designed for Y"
- Colores que no vienen de DESIGN.md
- Fuentes que no están en DESIGN.md
- Spacing valores que no están en la escala
```

Si se detecta AI slop, score = 0 en esa dimensión con lista explícita de dónde se encontró.

### 4. Auditoría de Código

Escanear el código CSS/HTML buscando:

```bash
# Colores hardcodeados (no variables)
grep -rn "color:\s*#\|background:\s*#\|border.*#" --include="*.css" --include="*.html" --include="*.tsx" --include="*.jsx" . | grep -v "var(--" | grep -v node_modules | grep -v .dc

# Fuentes hardcodeadas
grep -rn "font-family" --include="*.css" --include="*.html" . | grep -v "var(--" | grep -v node_modules

# Spacing hardcodeado
grep -rn "margin:\s*[0-9]\|padding:\s*[0-9]\|gap:\s*[0-9]" --include="*.css" . | grep -v "var(--" | grep -v node_modules

# Accesibilidad
grep -rn "<img" --include="*.html" --include="*.tsx" --include="*.jsx" . | grep -v "alt=" | grep -v node_modules
grep -rn "onClick" --include="*.tsx" --include="*.jsx" . | grep -v "<button\|<a " | grep -v node_modules
```

### 5. Generar Reporte

```markdown
# Design Review Report

## Score: [TOTAL]/100

| Dimensión | Score | Issues |
|-----------|-------|--------|
| Typography | 8/10 | 2 headings usan font no declarada |
| Color | 6/10 | 5 colores hardcodeados |
| Spacing | 9/10 | Consistente, 1 valor arbitrario |
| Layout | 10/10 | Grid disciplinado |
| Components | 7/10 | 3 botones con estilos diferentes |
| Accessibility | 5/10 | 4 imágenes sin alt, 2 divs clickeables |
| Responsive | 8/10 | Sidebar no colapsa en mobile |
| Motion | 9/10 | Sigue el enfoque |
| AI Slop | 10/10 | No detectado |
| Polish | 7/10 | Loading states incompletos |

## Verdict: NEEDS WORK (79/100)

## Critical Issues (fix immediately)
1. [file:line] 4 imágenes sin alt text
2. [file:line] div con onClick — usar <button>

## Important Issues (fix before shipping)
3. [file:line] 5 colores hardcodeados — usar CSS variables
4. [file:line] 3 botones con estilos inconsistentes

## Minor Issues (nice to have)
5. [file:line] 1 spacing valor arbitrario (17px → usar 16px)

## AI Slop Findings
- None detected ✅ (o lista de hallazgos)

## Recommendations
1. Mover colores hardcodeados a CSS custom properties
2. Agregar alt text a todas las imágenes
3. Unificar estilos de botón usando .btn classes
```

### 6. Guardar Reporte

```
.dc/reviews/design-review.md — reporte completo
.dc/reviews/design-score.json — score numérico para tracking
```

```json
{
  "date": "2026-04-16",
  "total_score": 79,
  "dimensions": {
    "typography": 8, "color": 6, "spacing": 9, "layout": 10,
    "components": 7, "accessibility": 5, "responsive": 8,
    "motion": 9, "ai_slop": 10, "polish": 7
  },
  "critical_issues": 2,
  "important_issues": 2,
  "minor_issues": 1,
  "ai_slop_detected": false
}
```

## Scoring Guide

| Score | Meaning |
|-------|---------|
| 90-100 | **Ship It** — production ready |
| 80-89 | **Almost There** — fix critical issues |
| 70-79 | **Needs Work** — several issues to address |
| 60-69 | **Significant Issues** — major rework needed |
| < 60 | **Start Over** — fundamental design problems |

## Reglas

1. **DESIGN.md es la verdad** — todo se mide contra lo que dice DESIGN.md
2. **Ser específico** — nombre de archivo, número de línea, valor exacto
3. **No puntos gratis** — si no hay DESIGN.md, no puedes dar puntos de adherencia
4. **AI slop es grave** — si se detecta, llamar la atención claramente
5. **Accesibilidad no es opcional** — siempre incluir en el review
6. **Score honesto** — no inflar para hacer sentir bien al usuario
