---
description: Genera diseños UI/UX completos con link de Figma y flujo de aprobación. Usa cuando el usuario dice "diseño UI", "diseñar interfaz", "mockup", "wireframe", "prototipo", "Figma", "UI design", "generar diseño", "pantallas".
i18n: true
---

# /dc:diseñar-ui

## Objetivo

Generar diseños UI/UX completos desde las especificaciones del producto, con link compartible (Figma o HTML preview) y proceso de aprobación obligatorio antes de implementar.

## Uso

```
/dc:diseñar-ui                              # Genera desde specs existentes
/dc:diseñar-ui "App de pagos con QR"        # Con descripción adicional
/dc:diseñar-ui --provider figma             # Forzar Figma MCP
/dc:diseñar-ui --provider html              # Forzar HTML preview
/dc:diseñar-ui --approve                    # Aprobar diseño existente
/dc:diseñar-ui --changes "agregar dark mode" # Pedir cambios
```

## Prerequisitos

- `/dc:especificar` completado (spec.feature existe)
- `/dc:planificar-tecnico` completado (blueprint.md existe)
- (Opcional) Figma MCP configurado para diseños nativos

## Proceso

### Paso 1: Leer contexto

```
LEER:
├── .dc/specs/spec.feature        → Escenarios de usuario
├── .dc/blueprints/blueprint.md   → Arquitectura y API
├── .dc/prd/prd.md               → PRD (si existe)
└── .dc/design/approval.json     → Estado anterior (si existe)
```

### Paso 2: Detectar provider

```
SI Figma MCP está configurado Y disponible:
  → Provider = figma
  → Crear diseño nativo en Figma
  → Retornar link compartible
SINO:
  → Provider = html
  → Generar HTML/CSS en .dc/design/
  → Retornar instrucción para preview local
```

### Paso 3: Analizar y extraer pantallas

Del spec.feature y blueprint.md, extraer:

1. **Pantallas necesarias** — Cada escenario implica al menos una pantalla
2. **Componentes por pantalla** — Forms, tablas, cards, modals, etc.
3. **Datos por pantalla** — Qué información se muestra
4. **Acciones del usuario** — Botones, inputs, navegación
5. **Estados** — Loading, empty, error, success
6. **Flujo de navegación** — Cómo se conectan las pantallas

### Paso 4: Seleccionar Design System

Invocar habilidad `ui-ux-design`:

```
PRESENTAR AL USUARIO:

┌─────────────────────────────────────────────┐
│  Design System Options                       │
│                                             │
│  1. Modern SaaS                             │
│     #6c5ce7 + Inter + Clean minimal         │
│                                             │
│  2. Fintech Professional                    │
│     #0984e3 + DM Sans + Trust-focused       │
│                                             │
│  3. Consumer Friendly                       │
│     #00b894 + Nunito + Warm approachable    │
│                                             │
│  ¿Cuál prefieres? (1/2/3 o describe tu      │
│   propio estilo)                             │
└─────────────────────────────────────────────┘
```

### Paso 5: Generar diseño

#### Provider Figma (si disponible)

Usar Figma MCP tools para:
1. Crear un nuevo archivo en Figma
2. Definir Variables (colores, tipografía, espaciado)
3. Crear Frame por pantalla (Desktop 1440px + Mobile 375px)
4. Agregar componentes con Auto Layout
5. Conectar pantallas con Prototype links
6. Compartir el archivo

**Output:** Link de Figma `https://figma.com/file/...`

#### Provider HTML (fallback)

Generar en `.dc/design/`:

```
.dc/design/
├── index.html              # Hub de navegación
├── preview.html            # Preview completo
├── screens/
│   ├── 01-login.html
│   ├── 02-dashboard.html
│   ├── 03-transfer.html
│   └── ...
├── styles/
│   ├── tokens.css          # Design tokens
│   ├── components.css      # Componentes
│   └── layout.css          # Grid + responsive
├── design-system.md        # Documentación
└── approval.json           # Estado de aprobación
```

Cada HTML debe:
- Usar `<link href="https://cdn.jsdelivr.net/npm/tailwindcss@3/dist/tailwind.min.css">`
- Ser responsive con breakpoints reales
- Tener interactividad con JavaScript vanilla (modals, tabs, menus)
- Usar datos realistas del dominio del producto
- Incluir todos los estados (empty, loading, error, success)

**Output:** `npx serve .dc/design/` → `http://localhost:3000`

### Paso 6: Presentar para aprobación

```
══════════════════════════════════════════════
  DESIGN REVIEW — [Nombre del Producto]
══════════════════════════════════════════════

  📎 Link: [Figma URL o localhost URL]
  📄 Pantallas: [N]
  🎨 Estilo: [Nombre del estilo]
  🔤 Tipografía: [Heading + Body]
  🎯 Responsive: Desktop + Mobile

  Pantallas generadas:
    ✅ Login / Register
    ✅ Dashboard
    ✅ [Pantalla 3]
    ✅ [Pantalla N]

══════════════════════════════════════════════
  OPCIONES:
    • "aprobar" o "approve"  → Marca como aprobado, continúa pipeline
    • "cambios: [detalle]"   → Describe qué cambiar
    • "rechazar"             → Vuelve a especificar
══════════════════════════════════════════════
```

### Paso 7: Procesar respuesta

```
SI "aprobar":
  → Guardar approval.json con status: "approved"
  → Pipeline puede continuar a /dc:desglosar
  → Log: "✅ Diseño aprobado — listo para implementar"

SI "cambios: [detalle]":
  → Guardar approval.json con status: "changes_requested"
  → Aplicar los cambios solicitados
  → Volver a Paso 6

SI "rechazar":
  → Guardar approval.json con status: "rejected"
  → Pipeline BLOQUEADO
  → Log: "❌ Diseño rechazado — revisar especificaciones"
```

## approval.json

```json
{
  "version": 1,
  "status": "approved|in_review|changes_requested|rejected",
  "provider": "figma|html",
  "link": "https://figma.com/file/... o file://.dc/design/preview.html",
  "screens_count": 8,
  "design_system": {
    "style": "Modern SaaS",
    "primary": "#6c5ce7",
    "font_heading": "Inter",
    "font_body": "DM Sans"
  },
  "approver": null,
  "approved_at": null,
  "history": []
}
```

## Quality Gate

El pipeline verifica `approval.json` antes de `/dc:implementar`:

```
SI approval.json NO existe → WARN "No hay diseño, implementando sin UI spec"
SI status == "approved"    → PASS
SI status == "rejected"    → BLOCK "Diseño rechazado"
SI status != "approved"    → BLOCK "Diseño pendiente de aprobación"
```

## Pipeline Actualizado (10 Fases)

```
explorar → proponer → especificar → clarificar
→ planificar-tecnico → diseñar-ui → [APROBAR]
→ desglosar → implementar → revisar
```
