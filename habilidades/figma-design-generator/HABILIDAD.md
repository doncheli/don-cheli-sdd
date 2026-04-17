---
nombre: Figma Design Generator (Atomic Design)
descripcion: "Genera diseños UI/UX con metodología Atomic Design, tokens de diseño, accesibilidad WCAG AA, y flujo de aprobación. Produce componentes reutilizables desde átomos hasta páginas con link compartible."
version: 2.0.0
autor: Don Cheli
tags: [design, figma, ui, ux, atomic-design, wireframe, mockup, prototype, approval, design-tokens, accessibility]
activacion: "diseño UI", "generar diseño", "Figma", "mockup", "wireframe", "prototipo", "diseñar interfaz", "UI design", "atomic design"
grado_libertad: medio
allowed-tools: [Read, Write, Edit, WebFetch, Glob, Grep, Bash, Agent]
---

# Figma Design Generator — Atomic Design

**Versión:** 2.0.0
**Categoría:** Diseño UI/UX
**Metodología:** Atomic Design (Brad Frost)

## Propósito

Generar sistemas de diseño completos usando **Atomic Design** — desde átomos (botones, inputs) hasta páginas finales. Cada nivel se construye sobre el anterior, garantizando consistencia, reutilización y escalabilidad. Incluye **design tokens**, **accesibilidad WCAG AA**, y **flujo de aprobación** obligatorio.

## Metodología: Atomic Design

```
┌─────────────────────────────────────────────────────────────┐
│                    ATOMIC DESIGN                            │
│                                                             │
│  ⚛️ Átomos → 🧬 Moléculas → 🦠 Organismos → 📄 Templates → 📱 Páginas │
│                                                             │
│  Botón      Barra búsqueda  Header         Layout app    Login     │
│  Input      Campo form      Sidebar        Grid cards    Dashboard │
│  Label      Card precio     Footer         Form page     Checkout  │
│  Avatar     Badge estado    Modal          Table page    Profile   │
│  Icon       Tab item        Data table     Detail page   Settings  │
│  Checkbox   Breadcrumb      Navigation     Empty state   Error 404 │
└─────────────────────────────────────────────────────────────┘
```

### Nivel 1: Átomos (Elementos indivisibles)

Los bloques más básicos. No se pueden descomponer más.

| Átomo | Variantes obligatorias | Tokens que usa |
|-------|----------------------|----------------|
| **Button** | primary, secondary, ghost, danger, disabled, loading | color, radius, spacing, typography |
| **Input** | text, email, password, number, search, textarea, error, disabled | color, border, spacing |
| **Label** | default, required, optional, error, helper text | typography, color |
| **Avatar** | xs, sm, md, lg, xl, placeholder, image, initials | size, radius |
| **Badge** | success, warning, error, info, neutral, dot | color, typography, spacing |
| **Icon** | 24px grid, outlined, filled, current-color | size, color |
| **Checkbox** | unchecked, checked, indeterminate, disabled | color, size |
| **Radio** | unselected, selected, disabled | color, size |
| **Toggle** | off, on, disabled | color, size |
| **Divider** | horizontal, vertical, dashed | color, spacing |
| **Spinner** | sm, md, lg | color, size, animation |
| **Tag/Chip** | default, removable, selected | color, spacing, typography |
| **Tooltip** | top, right, bottom, left | color, spacing, typography, shadow |
| **Skeleton** | text, circle, rectangle, card | color, radius, animation |

### Nivel 2: Moléculas (Combinación de átomos)

Grupos funcionales de átomos que forman una unidad con propósito.

| Molécula | Átomos que la componen | Función |
|----------|----------------------|---------|
| **SearchBar** | Input + Icon + Button | Buscar contenido |
| **FormField** | Label + Input + HelperText + ErrorMsg | Capturar un dato |
| **CardHeader** | Avatar + Title + Subtitle + Badge | Identificar una entidad |
| **MenuItem** | Icon + Label + Badge + Chevron | Navegar |
| **Notification** | Icon + Text + Timestamp + CloseButton | Informar evento |
| **Breadcrumb** | Link + Separator + CurrentPage | Ubicar al usuario |
| **TabItem** | Icon + Label + Counter | Seccionar contenido |
| **Pagination** | Button + Text + Button | Navegar entre páginas |
| **EmptyState** | Illustration + Title + Description + CTA | Guiar cuando no hay datos |
| **Stat** | Label + Value + Trend (up/down) + Sparkline | Mostrar KPI |
| **StepIndicator** | Number + Label + Connector | Indicar progreso multi-paso |

### Nivel 3: Organismos (Secciones autónomas)

Secciones completas que combinan moléculas y átomos.

| Organismo | Moléculas/Átomos | Función |
|-----------|-----------------|---------|
| **Header/Navbar** | Logo + Navigation + SearchBar + Avatar + NotificationBell | Navegación principal |
| **Sidebar** | Logo + MenuItems + Dividers + UserSection + CollapseToggle | Navegación lateral |
| **DataTable** | TableHeader + TableRows + Pagination + Filters + BulkActions | Mostrar datos tabulares |
| **Form** | FormFields + Dividers + Buttons + ValidationSummary | Capturar datos del usuario |
| **Modal** | Overlay + Header + Content + Footer (Buttons) | Acción contextual |
| **Card** | CardHeader + Content + Footer + Actions | Unidad de información |
| **HeroSection** | Title + Subtitle + CTA + Image/Illustration | Capturar atención |
| **Footer** | Links + Logo + Social + Copyright | Información secundaria |
| **Toast/Snackbar** | Icon + Message + Action + Timer | Feedback temporal |
| **CommandPalette** | SearchBar + Results + Shortcuts | Acceso rápido |

### Nivel 4: Templates (Layouts sin datos)

Estructuras de página que definen dónde van los organismos. **Sin datos reales** — solo la estructura.

| Template | Organismos que contiene | Uso |
|----------|------------------------|-----|
| **AppShell** | Sidebar + Header + MainContent + Footer | Layout principal de la app |
| **AuthLayout** | Logo + Form + SocialAuth + Footer | Login/Register/Forgot |
| **DashboardLayout** | Header + StatCards + Charts + RecentActivity | Vista principal |
| **ListLayout** | Header + Filters + DataTable + Pagination | Listados CRUD |
| **DetailLayout** | Breadcrumb + Header + Content + Sidebar + Actions | Vista de detalle |
| **SettingsLayout** | Sidebar + Tabs + FormSections | Configuración |
| **EmptyLayout** | EmptyState + SuggestedActions | Primer uso / sin datos |
| **ErrorLayout** | Illustration + Message + Actions | 404/500/Mantenimiento |
| **OnboardingLayout** | StepIndicator + Content + Navigation | Wizard multi-paso |
| **SplitLayout** | Left (Image/Info) + Right (Form/Content) | Auth, comparación |

### Nivel 5: Páginas (Templates + datos reales)

Templates pobladas con **datos realistas del dominio** del producto. NUNCA "Lorem ipsum".

```
CADA PÁGINA DEBE INCLUIR:
├── Estado normal (con datos)
├── Estado vacío (primer uso, sin datos)
├── Estado loading (skeleton/spinner)
├── Estado error (mensaje + acción de recuperación)
└── Estado responsive (mobile 375px + tablet 768px + desktop 1440px)
```

## Design Tokens

Tokens de diseño como **único source of truth**. Todo componente referencia tokens, nunca valores hardcodeados.

### Estructura de tokens

```
.dc/design/tokens/
├── colors.json        → Paleta completa
├── typography.json    → Escalas tipográficas
├── spacing.json       → Escala de espaciado
├── shadows.json       → Elevaciones
├── borders.json       → Radii y bordes
├── motion.json        → Duraciones y easings
└── breakpoints.json   → Puntos de quiebre responsive
```

### Token de colores

```json
{
  "color": {
    "primary": {
      "50":  "#f0f0ff",
      "100": "#e0e0ff",
      "200": "#c1c1ff",
      "300": "#a2a2ff",
      "400": "#8383ff",
      "500": "#6c5ce7",
      "600": "#5a4bd4",
      "700": "#483ac1",
      "800": "#3629ae",
      "900": "#24189b"
    },
    "neutral": {
      "0":   "#ffffff",
      "50":  "#f8f9fa",
      "100": "#f1f3f5",
      "200": "#e9ecef",
      "300": "#dee2e6",
      "400": "#ced4da",
      "500": "#adb5bd",
      "600": "#868e96",
      "700": "#495057",
      "800": "#343a40",
      "900": "#212529",
      "1000": "#0a0a0f"
    },
    "semantic": {
      "success": "#00b894",
      "warning": "#fdcb6e",
      "error":   "#e17055",
      "info":    "#74b9ff"
    }
  }
}
```

### Token de tipografía

```json
{
  "typography": {
    "fontFamily": {
      "heading": "'Inter', system-ui, sans-serif",
      "body":    "'DM Sans', system-ui, sans-serif",
      "mono":    "'JetBrains Mono', monospace"
    },
    "fontSize": {
      "xs":   "0.75rem",
      "sm":   "0.875rem",
      "base": "1rem",
      "lg":   "1.125rem",
      "xl":   "1.25rem",
      "2xl":  "1.5rem",
      "3xl":  "1.875rem",
      "4xl":  "2.25rem",
      "5xl":  "3rem"
    },
    "fontWeight": {
      "regular":  "400",
      "medium":   "500",
      "semibold": "600",
      "bold":     "700"
    },
    "lineHeight": {
      "tight":   "1.25",
      "normal":  "1.5",
      "relaxed": "1.75"
    }
  }
}
```

### Token de espaciado

```json
{
  "spacing": {
    "0":  "0",
    "1":  "0.25rem",
    "2":  "0.5rem",
    "3":  "0.75rem",
    "4":  "1rem",
    "5":  "1.25rem",
    "6":  "1.5rem",
    "8":  "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem"
  },
  "borderRadius": {
    "none": "0",
    "sm":   "0.25rem",
    "md":   "0.5rem",
    "lg":   "0.75rem",
    "xl":   "1rem",
    "2xl":  "1.5rem",
    "full": "9999px"
  },
  "shadow": {
    "sm":  "0 1px 2px rgba(0,0,0,0.05)",
    "md":  "0 4px 6px rgba(0,0,0,0.07)",
    "lg":  "0 10px 15px rgba(0,0,0,0.1)",
    "xl":  "0 20px 25px rgba(0,0,0,0.1)"
  }
}
```

## Accesibilidad — WCAG 2.1 AA

Cada componente DEBE cumplir:

### Contraste

| Elemento | Ratio mínimo | Herramienta de validación |
|----------|-------------|--------------------------|
| Texto normal (< 18px) | 4.5:1 | WebAIM Contrast Checker |
| Texto grande (>= 18px bold, >= 24px normal) | 3:1 | WebAIM Contrast Checker |
| Iconos y bordes activos | 3:1 | Visual inspection |
| Focus indicators | 3:1 vs fondo | Must be visible |

### Semántica HTML

```
OBLIGATORIO:
- <nav> para navegación, con aria-label
- <main> para contenido principal
- <header>, <footer>, <aside> para landmarks
- <button> para acciones (nunca <div onClick>)
- <a> para navegación (nunca <span onClick>)
- <label for="id"> en cada campo de formulario
- <fieldset> + <legend> para grupos de radio/checkbox
- alt="" en imágenes decorativas
- alt="descripción" en imágenes informativas
```

### Teclado

```
OBLIGATORIO:
- Tab order lógico (no usar tabindex > 0)
- Focus visible en todos los elementos interactivos (outline 2px offset 2px)
- Escape cierra modals y dropdowns
- Enter/Space activa botones
- Arrow keys navega listas, tabs, menus
- Focus trap en modals (no se puede tabular fuera)
```

### Estados ARIA

```html
<!-- Ejemplo de botón loading -->
<button aria-busy="true" aria-disabled="true">
  <span class="spinner" aria-hidden="true"></span>
  <span>Procesando...</span>
</button>

<!-- Ejemplo de error en form -->
<input id="email" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" role="alert">Email inválido</p>

<!-- Ejemplo de live region para notificaciones -->
<div aria-live="polite" aria-atomic="true">
  Transferencia completada exitosamente
</div>
```

## Mejores Prácticas de Diseño

### 1. Visual Hierarchy

```
REGLA DE 3 NIVELES:
- Nivel 1 (Primary): Lo más importante de la pantalla → Grande, bold, color primary
- Nivel 2 (Secondary): Información de soporte → Medio, medium, color neutral-700
- Nivel 3 (Tertiary): Metadata, ayuda → Pequeño, regular, color neutral-500

NUNCA más de 3 niveles visuales en una misma sección.
```

### 2. Spacing System (8px grid)

```
REGLA: Todo espaciado es múltiplo de 4px (idealmente 8px).

Intra-componente: 4px - 8px (entre label e input)
Inter-componente: 16px - 24px (entre form fields)
Inter-sección:    32px - 48px (entre secciones de página)
Padding de página: 24px mobile, 32px tablet, 48px desktop
```

### 3. F-Pattern & Z-Pattern

```
F-PATTERN (para contenido de lectura):
  ┌──────────────────────────┐
  │ █████████████████████████ │ ← Barra superior (logo, nav)
  │ ████████████             │ ← Primer scan horizontal
  │ ████████                 │ ← Segundo scan (más corto)
  │ ██                       │ ← Scan vertical izquierdo
  │ ██                       │
  └──────────────────────────┘

Z-PATTERN (para landing/hero):
  ┌──────────────────────────┐
  │ Logo ──────────────► CTA │ ← Primer scan
  │         ╲                │
  │           ╲              │ ← Diagonal
  │             ╲            │
  │ Imagen ─────────► Acción │ ← Segundo scan
  └──────────────────────────┘

APLICAR: Colocar los elementos más importantes en los puntos de inicio
de cada línea del patrón.
```

### 4. Ley de Fitts

```
REGLA: Cuanto más importante es una acción, más grande y accesible debe ser el target.

Tamaños mínimos de touch target:
- Mobile: 44x44px mínimo (Apple HIG) / 48x48dp (Material)
- Desktop: 32x32px mínimo para click
- Links inline: padding vertical de al menos 8px

CTA principal: Siempre el botón más grande y contrastado de la pantalla.
```

### 5. Ley de Proximidad (Gestalt)

```
REGLA: Elementos relacionados están juntos. Elementos no relacionados están separados.

BIEN:                         MAL:
┌─────────────────┐          ┌─────────────────┐
│ [Nombre]        │          │ [Nombre]        │
│ [Apellido]      │ → Grupo  │                 │
│                 │          │ [Apellido]      │
│ [Email]         │          │ [Email]         │
│ [Teléfono]      │ → Grupo  │ [Teléfono]      │
└─────────────────┘          └─────────────────┘
   16px intra-grupo             Mismo espacio = sin agrupación
   32px inter-grupo
```

### 6. Progressive Disclosure

```
REGLA: Mostrar solo lo necesario en cada momento. Opciones avanzadas detrás de interacción.

Nivel 1: Campos esenciales visibles
Nivel 2: "Opciones avanzadas" → expandible
Nivel 3: Tooltip/ayuda contextual → hover/click

NUNCA mostrar 15 campos en un formulario sin agrupar.
Máximo 5-7 campos visibles simultáneamente.
```

### 7. Feedback & Microinteracciones

```
TODA ACCIÓN del usuario debe tener feedback:

Click botón    → Ripple + cambio de estado inmediato
Submit form    → Loading state + resultado (success/error)
Error          → Highlight campo + mensaje específico + sugerencia
Éxito          → Toast/banner + confirmación visual
Hover          → Cambio sutil (color, elevación)
Scroll         → Sticky header + back-to-top (en listas largas)
Drag           → Ghost element + drop zone highlight
```

### 8. Responsive Design

```
BREAKPOINTS:
- Mobile:  375px  (1 columna, stacked)
- Tablet:  768px  (2 columnas, sidebar collapsible)
- Desktop: 1024px (sidebar visible)
- Wide:    1440px (max-width container)

REGLAS:
- Mobile: Navegación bottom tab o hamburger
- Tablet: Sidebar collapsible, 2 columnas de cards
- Desktop: Sidebar fija, data tables completas

NUNCA: Scroll horizontal en mobile.
SIEMPRE: Touch targets 44px mínimo en mobile.
```

### 9. Dark Mode

```
REGLA: Si el producto lo soporta, diseñar dark mode desde el inicio.

PALETA DARK:
- Background:  neutral-900 → neutral-1000
- Surface:     neutral-800
- Border:      neutral-700
- Text:        neutral-100 (primary), neutral-400 (secondary)
- Primary:     Subir 1-2 stops de luminosidad vs light mode

NO invertir colores — ajustar luminosidad manteniendo hue.
Imágenes: reducir brillo al 90% en dark mode.
Elevación: usar bordes sutiles en lugar de sombras.
```

### 10. Content-First Design

```
REGLA: El contenido dicta el diseño, no al revés.

1. Inventariar TODO el contenido de cada pantalla (del spec)
2. Priorizar: ¿qué ve el usuario primero? segundo? tercero?
3. Diseñar el layout para el contenido real
4. Nunca "Lorem ipsum" — usar datos del dominio

DATOS REALISTAS por industria:
- Fintech: "María García - $2,450.00 - Transferencia a Juan"
- E-commerce: "Zapatillas Nike Air Max 90 - $129.99 - Talla 42"
- SaaS: "Proyecto Alpha - 85% completado - 3 tareas pendientes"
- Salud: "Dr. Carlos Ruiz - Cardiología - Disponible 14:00-18:00"
```

## Posición en el Pipeline

```
especificar → clarificar → planificar-tecnico
                                    ↓
                            DISEÑAR-UI (Atomic Design)
                            ├── 1. Design Tokens
                            ├── 2. Átomos
                            ├── 3. Moléculas
                            ├── 4. Organismos
                            ├── 5. Templates
                            └── 6. Páginas
                                    ↓
                            APROBAR DISEÑO ← usuario
                                    ↓
                            desglosar → implementar → revisar
```

## Output: Estructura de archivos

```
.dc/design/
├── tokens/
│   ├── colors.json
│   ├── typography.json
│   ├── spacing.json
│   ├── shadows.json
│   ├── borders.json
│   └── motion.json
├── atoms/
│   ├── button.html         → Variantes del botón
│   ├── input.html          → Variantes del input
│   ├── badge.html          → Variantes del badge
│   └── ...
├── molecules/
│   ├── search-bar.html
│   ├── form-field.html
│   ├── card-header.html
│   └── ...
├── organisms/
│   ├── header.html
│   ├── sidebar.html
│   ├── data-table.html
│   ├── form.html
│   └── ...
├── templates/
│   ├── app-shell.html
│   ├── auth-layout.html
│   ├── dashboard-layout.html
│   └── ...
├── pages/
│   ├── 01-login.html       → Con datos reales
│   ├── 02-dashboard.html
│   ├── 03-[feature].html
│   └── ...
├── index.html              → Catálogo de componentes + páginas
├── design-system.md        → Documentación del sistema
├── accessibility-report.md → Checklist WCAG AA
└── approval.json           → Estado de aprobación
```

## Providers de Diseño

| Provider | Cómo funciona | Requisito |
|----------|--------------|-----------|
| **Figma MCP** | Crea diseños nativos via MCP Server oficial | Figma account + MCP configurado |
| **HTML Preview** | Genera HTML/CSS con Tailwind + preview local | Ninguno (fallback) |
| **Penpot** | Alternativa open source via MCP | Penpot self-hosted |

## Checklist de Aprobación

```
DISEÑO:
□ ¿Las pantallas cubren todos los escenarios del spec?
□ ¿El flujo de navegación es intuitivo?
□ ¿Los formularios tienen todos los campos necesarios?
□ ¿Los estados de error están diseñados?
□ ¿Los empty states guían al usuario?

ATOMIC DESIGN:
□ ¿Los átomos son indivisibles y reutilizables?
□ ¿Las moléculas combinan átomos con propósito claro?
□ ¿Los organismos son secciones autónomas?
□ ¿Los templates definen el layout sin datos?
□ ¿Las páginas usan datos realistas del dominio?

ACCESIBILIDAD:
□ ¿Contraste WCAG AA (4.5:1 para texto normal)?
□ ¿Focus visible en todos los elementos interactivos?
□ ¿HTML semántico (nav, main, button, label)?
□ ¿Touch targets >= 44px en mobile?
□ ¿ARIA roles donde es necesario?

RESPONSIVE:
□ ¿Mobile-first (375px)?
□ ¿Tablet (768px)?
□ ¿Desktop (1440px)?
□ ¿Sin scroll horizontal?
```

## Guardrails

1. **Atomic Design obligatorio** — Todo componente sigue la jerarquía átomo → molécula → organismo → template → página
2. **Design tokens únicos** — Nunca hardcodear colores o tamaños. Siempre referenciar tokens
3. **Datos realistas** — Nunca "Lorem ipsum". Usar datos del dominio del producto
4. **Mobile-first** — Siempre diseñar mobile primero, desktop después
5. **Accesibilidad WCAG AA** — Contraste 4.5:1, semántica HTML, focus visible, touch targets 44px
6. **Estados completos** — Cada componente: default, hover, active, focus, disabled, error, loading, empty
7. **Progressive disclosure** — Máximo 5-7 campos visibles sin agrupar
8. **Feedback obligatorio** — Toda acción del usuario tiene feedback visual inmediato
9. **NO implementar sin aprobación** — Pipeline verifica `approval.json` antes de `/dc:implementar`
10. **Consistencia total** — Un solo design system. Cero excepciones.

## Configuración del Figma MCP Server

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_KEY"],
      "env": {
        "FIGMA_API_KEY": "YOUR_FIGMA_PERSONAL_ACCESS_TOKEN"
      }
    }
  }
}
```

## Ejemplo de Uso

```
/dc:diseñar-ui "App de pagos con transferencias, historial y QR"

→ Analizando spec.feature... 12 escenarios encontrados
→ Generando Design Tokens...
→ Construyendo Átomos (14 componentes)...
→ Ensamblando Moléculas (11 combinaciones)...
→ Componiendo Organismos (8 secciones)...
→ Creando Templates (5 layouts)...
→ Generando Páginas (8 pantallas con datos reales)...
→ Validando accesibilidad WCAG AA...

  ✅ 14 átomos | 11 moléculas | 8 organismos
  ✅ 5 templates | 8 páginas
  ✅ Accesibilidad: WCAG AA compliant
  ✅ Responsive: 375px + 768px + 1440px

📎 Preview: npx serve .dc/design/
📄 Catálogo: .dc/design/index.html
📋 Aprobación pendiente → responde "aprobar" o describe los cambios
```
