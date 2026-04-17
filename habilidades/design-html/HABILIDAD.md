---
nombre: Design HTML
descripcion: "Motor de HTML production-ready que convierte mockups y DESIGN.md en páginas HTML completas de máximo 30KB sin dependencias. Zero-framework, zero-build."
version: 1.0.0
autor: Don Cheli (adaptado de gstack)
tags: [design, html, css, production, prototype, zero-dependency]
activacion: "design html", "convertir a HTML", "HTML production", "generar HTML", "mockup to code", "prototype HTML"
grado_libertad: medio
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep]
---

# Design HTML — Motor de Producción HTML

Convierte el design system (DESIGN.md) y mockups en páginas HTML production-ready. Single-file, máximo 30KB, zero dependencies, zero build step.

## Principios

1. **Zero dependencies** — Sin React, sin Tailwind CDN, sin nada externo excepto Google Fonts
2. **Single file** — Todo el CSS inline en `<style>`, JS minimal en `<script>`
3. **30KB max** — Si pasa de 30KB, está sobre-engineered
4. **Computed layout** — CSS Grid y Flexbox, no frameworks de layout
5. **Progressive enhancement** — Funciona sin JavaScript, JS solo para interactividad
6. **Performance** — First paint < 200ms

## Flujo

### 1. Leer Contexto

```
LEER EN ORDEN:
1. DESIGN.md — source of truth del design system
2. .dc/design/approval.json — diseño aprobado
3. .dc/design/pages/ — mockups HTML existentes
4. .dc/specs/spec.feature — escenarios para entender las pantallas
```

### 2. Generar CSS Custom Properties

Desde DESIGN.md, crear las variables CSS:

```css
:root {
  /* Typography */
  --font-display: 'Satoshi', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem;
  --text-lg: 1.125rem; --text-xl: 1.25rem; --text-2xl: 1.5rem;
  --text-3xl: 1.875rem; --text-4xl: 2.25rem;
  --weight-regular: 400; --weight-medium: 500;
  --weight-semibold: 600; --weight-bold: 700;

  /* Colors */
  --color-primary: #6c5ce7; --color-primary-hover: #5a4bd4;
  --color-bg: #ffffff; --color-surface: #f8f9fa;
  --color-text: #212529; --color-text-muted: #868e96;
  --color-border: #e9ecef;
  --color-success: #00b894; --color-warning: #fdcb6e;
  --color-error: #e17055; --color-info: #74b9ff;

  /* Spacing */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem; --space-6: 1.5rem; --space-8: 2rem;
  --space-12: 3rem; --space-16: 4rem;

  /* Layout */
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --max-width: 1200px;

  /* Motion */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms; --duration-normal: 250ms;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111418; --color-surface: #1C2127;
    --color-text: #e9ecef; --color-text-muted: #868e96;
    --color-border: #2F343C;
  }
}
```

### 3. Componentes Base

Generar componentes como CSS classes puras:

```css
/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; }
body { font-family: var(--font-body); color: var(--color-text); background: var(--color-bg); line-height: 1.5; }

/* Button */
.btn { display: inline-flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-4); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--text-sm); font-weight: var(--weight-medium); cursor: pointer; transition: all var(--duration-fast) var(--ease-out); }
.btn-primary { background: var(--color-primary); color: white; border-color: var(--color-primary); }
.btn-primary:hover { background: var(--color-primary-hover); }

/* Input */
.input { width: 100%; padding: var(--space-2) var(--space-3); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--text-sm); background: var(--color-bg); color: var(--color-text); transition: border-color var(--duration-fast); }
.input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(108,92,231,0.1); }

/* Card */
.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); }

/* Grid */
.grid { display: grid; gap: var(--space-4); }
.cols-2 { grid-template-columns: repeat(2, 1fr); }
.cols-3 { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 768px) { .cols-2, .cols-3 { grid-template-columns: 1fr; } }
```

### 4. Generar Páginas

Cada pantalla del producto como un HTML single-file:

```
.dc/design/production/
├── login.html
├── dashboard.html
├── detail.html
├── settings.html
└── ...
```

**Cada HTML debe:**
- Cargar fuentes de Google Fonts via `<link>`
- Incluir TODOS los CSS custom properties y componentes inline
- Usar HTML semántico (`<nav>`, `<main>`, `<header>`, `<footer>`)
- Tener toggle de dark/light mode con JavaScript vanilla
- Ser responsive (mobile-first)
- Usar datos realistas del dominio
- Incluir estados: normal, empty, loading (skeleton), error
- Incluir interactividad básica: modals, tabs, dropdowns con JS vanilla
- Pasar < 30KB

### 5. Quality Check

Antes de entregar, verificar:

- [ ] Todos los colores usan CSS variables (no hardcoded)
- [ ] Todas las fuentes usan CSS variables
- [ ] Todo el spacing usa CSS variables
- [ ] HTML semántico correcto
- [ ] Responsive en 375px y 1440px
- [ ] Dark mode funciona
- [ ] Sin `Lorem ipsum` — datos reales
- [ ] < 30KB por archivo
- [ ] No dependencias externas (excepto Google Fonts)

## Reglas

1. **Un archivo = una pantalla** — nunca SPA, siempre multi-page
2. **CSS Variables para todo** — colores, fuentes, spacing, radii
3. **Mobile-first** — breakpoints de menor a mayor
4. **HTML semántico** — accessibility gratis
5. **30KB max** — si pasa, refactorizar
6. **Zero build** — abrir archivo = funciona
7. **Datos reales** — del dominio del producto, nunca placeholder
