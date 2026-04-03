---
description: Bloquear estándares visuales antes de codear frontend (UI Design Contract). Usa cuando el usuario dice "UI contract", "diseño UI", "frontend standards", "visual contract", "CSS standards", "UI design", "design system", "componentes UI", "mockups", "wireframes", "bloquear UI antes de codear". Define spacing, colors, typography y component specs antes del desarrollo.
i18n: true
---

# /dc:contrato-ui

## Objetivo

Definir y bloquear los estándares visuales de una feature frontend **antes** de escribir código. Previene el problema más común del desarrollo frontend con IA: inconsistencia visual entre componentes porque no hay un contrato de diseño.

> Adaptado de Get Shit Done (gsd-build/get-shit-done) — UI Design Contracts: "lock visual standards before coding to prevent visually inconsistent AI-generated components."

## Uso

```
/dc:contrato-ui                          # Crear contrato para el proyecto
/dc:contrato-ui @specs/features/ui/      # Crear para un módulo específico
/dc:contrato-ui --desde @figma-export    # Derivar de un export de Figma
/dc:contrato-ui --extender               # Extender contrato existente
```

## Por Qué Existe

| Sin Contrato UI | Con Contrato UI |
|-----------------|-----------------|
| Componente A usa `padding: 16px`, B usa `padding: 1rem`, C usa `padding: 20px` | Todos usan `--spacing-md: 1rem` |
| Cada componente elige sus propios colores | Paleta definida, tokens de diseño |
| Tipografía inconsistente entre páginas | Escala tipográfica fija |
| Copywriting variable ("Click here" vs "Continuar" vs "Submit") | Voz y tono definidos |
| IA genera componentes "bonitos" pero incompatibles entre sí | Todos los componentes siguen el mismo contrato |

## Comportamiento

### Paso 1: Detectar Stack Frontend

```
Detectando stack frontend...
├── Framework: React 19 / Next.js 15
├── Estilos: TailwindCSS 4.x
├── Componentes: shadcn/ui
├── Iconos: Lucide Icons
└── Design system existente: No detectado
```

### Paso 2: Definir Contrato

El contrato cubre 6 dimensiones:

#### 1. Espaciado (Spacing)

```yaml
spacing:
  base: 4px  # Unidad mínima
  scale:
    xs: 4px    # 1 unidad
    sm: 8px    # 2 unidades
    md: 16px   # 4 unidades (default)
    lg: 24px   # 6 unidades
    xl: 32px   # 8 unidades
    2xl: 48px  # 12 unidades
  regla: "Todo espaciado DEBE ser múltiplo de 4px"
```

#### 2. Tipografía (Typography)

```yaml
typography:
  familia:
    primaria: "Inter, system-ui, sans-serif"
    monospace: "JetBrains Mono, monospace"
  escala:
    xs: "0.75rem / 1rem"     # 12px, captions
    sm: "0.875rem / 1.25rem"  # 14px, labels
    base: "1rem / 1.5rem"     # 16px, body
    lg: "1.125rem / 1.75rem"  # 18px, lead
    xl: "1.25rem / 1.75rem"   # 20px, h4
    2xl: "1.5rem / 2rem"      # 24px, h3
    3xl: "1.875rem / 2.25rem" # 30px, h2
    4xl: "2.25rem / 2.5rem"   # 36px, h1
  peso:
    normal: 400
    medium: 500
    semibold: 600
    bold: 700
```

#### 3. Color (Palette)

```yaml
color:
  brand:
    primary: "#2563EB"      # Acciones principales
    primary-hover: "#1D4ED8"
    secondary: "#64748B"     # Acciones secundarias
  semantic:
    success: "#16A34A"
    warning: "#D97706"
    error: "#DC2626"
    info: "#2563EB"
  neutral:
    background: "#FFFFFF"
    surface: "#F8FAFC"
    border: "#E2E8F0"
    text-primary: "#0F172A"
    text-secondary: "#64748B"
    text-muted: "#94A3B8"
  modo_oscuro: true  # Si aplica, definir variantes
```

#### 4. Componentes (Patterns)

```yaml
componentes:
  botones:
    primario: "bg-primary text-white rounded-md px-4 py-2 font-medium"
    secundario: "bg-white border border-border text-secondary rounded-md px-4 py-2"
    destructivo: "bg-error text-white rounded-md px-4 py-2"
    fantasma: "text-secondary hover:bg-surface rounded-md px-4 py-2"
    tamanos: [sm, md, lg]
  inputs:
    estilo: "border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary"
    error: "border-error focus:ring-error"
    label: "text-sm font-medium text-text-primary mb-1"
  cards:
    estilo: "bg-white border rounded-lg p-6 shadow-sm"
  modales:
    overlay: "bg-black/50 backdrop-blur-sm"
    contenido: "bg-white rounded-xl shadow-xl max-w-md mx-auto p-6"
```

#### 5. Layout

```yaml
layout:
  contenedor: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  grid: "12 columnas"
  breakpoints:
    sm: "640px"
    md: "768px"
    lg: "1024px"
    xl: "1280px"
  sidebar: "w-64 fixed"
  navbar: "h-16 fixed top-0"
```

#### 6. Voz y Tono (Copywriting)

```yaml
copywriting:
  idioma_ui: "es"  # Del config.yaml
  voz: "Profesional pero cercano"
  reglas:
    - "Usar 'tú' (no 'usted') para el usuario"
    - "Botones: verbos en infinitivo ('Crear', 'Guardar', 'Cancelar')"
    - "Errores: explicar qué pasó Y qué hacer ('El email ya existe. Intenta con otro.')"
    - "Éxito: confirmar la acción completada ('Usuario creado exitosamente')"
    - "Vacíos: guiar al usuario ('Aún no tienes proyectos. Crea el primero.')"
  prohibido:
    - "Click here / Haga clic aquí"
    - "Error genérico sin contexto"
    - "Jerga técnica en mensajes al usuario"
```

### Paso 3: Generar Artefacto

```
Contrato UI generado:
  → specs/ui/contrato-ui.yaml (contrato completo)
  → specs/ui/tokens.css (custom properties generadas)
```

## Output

### Archivo de Contrato (`specs/ui/contrato-ui.yaml`)

YAML completo con las 6 dimensiones definidas arriba.

### Tokens CSS generados (`specs/ui/tokens.css`)

```css
:root {
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Colors */
  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-success: #16A34A;
  --color-error: #DC2626;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  --color-surface: #F8FAFC;

  /* Typography */
  --font-primary: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## Integración con Pipeline

```
/dc:contrato-ui → contrato-ui.yaml + tokens.css
  → /dc:especificar → escenarios referencian tokens
  → /dc:planificar-tecnico → plan incluye contrato como dependencia
  → /dc:implementar → agente usa tokens, NO inventa estilos
  → /dc:revisar → verifica cumplimiento del contrato
```

## Verificación de Cumplimiento

Durante `/dc:revisar`, se verifica:

| Verificación | Criterio | Severidad |
|--------------|----------|-----------|
| Colores | Solo usa colores del contrato | ❌ Crítico |
| Espaciado | Múltiplos de la base (4px) | ⚠️ Alto |
| Tipografía | Solo usa escala definida | ⚠️ Alto |
| Copywriting | Sigue reglas de voz y tono | ℹ️ Info |
| Componentes | Usa patterns definidos | ⚠️ Alto |
| Responsive | Respeta breakpoints | ⚠️ Alto |

## Cuándo Usar

| Situación | Usar contrato |
|-----------|--------------|
| Feature con UI nueva | ✅ Sí |
| Modificación de UI existente | ✅ Sí (extender contrato existente) |
| API/backend sin UI | ❌ No |
| Fix de bug visual | ❌ No (contrato ya existe) |
| Prototipo/POC | ⚠️ Opcional (contrato mínimo) |

## Guardrails

- **Nunca** generar componentes frontend sin contrato UI vigente
- **Nunca** usar valores hardcoded de color/spacing en código (usar tokens)
- **Siempre** verificar cumplimiento del contrato en revisión
- **Siempre** extender (no reemplazar) el contrato cuando se agregan patrones
- **Siempre** generar tokens CSS/variables junto al contrato
