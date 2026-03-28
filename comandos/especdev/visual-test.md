---
description: Testing visual de componentes UI y páginas con detección de regresiones visuales
i18n: true
---

# /especdev:visual-test

## Objetivo

Ejecutar pruebas visuales de componentes UI y páginas completas, comparando capturas de pantalla antes y después de cambios para detectar regresiones visuales. Soporta niveles: página completa, componente individual y breakpoints responsive. Se integra con Computer Use de Claude para testing de interacción.

## Uso

```
/especdev:visual-test                              # Testear todos los componentes registrados
/especdev:visual-test --pagina /checkout           # Testear una página específica
/especdev:visual-test --componente Button          # Testear un componente
/especdev:visual-test --breakpoints                # Testear todos los breakpoints responsive
/especdev:visual-test --baseline                   # Capturar nuevas líneas base
/especdev:visual-test --diff-only                  # Mostrar solo cambios detectados
/especdev:visual-test --umbral 2.5                 # Tolerancia de diferencia en % (default: 1%)
```

## Comportamiento

1. **Cargar configuración** desde `.especdev/visual-test.yaml`
   - Lista de páginas y componentes a testear
   - Breakpoints definidos (mobile, tablet, desktop)
   - Umbral de tolerancia de diferencia (default: 1%)
   - Directorio de baseline: `.especdev/visual-baselines/`

2. **Modo baseline** (`--baseline`)
   - Capturar screenshots actuales como referencia
   - Almacenar en `.especdev/visual-baselines/<componente>/<breakpoint>.png`
   - Registrar hash de versión y fecha

3. **Modo comparación** (default)
   - Capturar screenshots del estado actual
   - Comparar pixel a pixel contra baseline
   - Calcular porcentaje de diferencia por componente
   - Generar imagen diff con cambios resaltados en rojo

4. **Testing de interacción** (con Computer Use)
   - Simular clicks, hover, focus, scroll
   - Capturar estado visual en cada interacción
   - Detectar regresiones en estados (hover, active, disabled)

5. **Clasificar resultados**
   - PASS: diferencia ≤ umbral configurado
   - WARN: diferencia entre umbral y 5%
   - FAIL: diferencia > 5% o componente ausente

6. **Generar reporte** con diff visual y tabla de resultados

## Configuración

```yaml
# .especdev/visual-test.yaml
breakpoints:
  mobile: 375
  tablet: 768
  desktop: 1440

umbral_diferencia: 1.0  # % máximo permitido

paginas:
  - ruta: /
    nombre: home
  - ruta: /checkout
    nombre: checkout

componentes:
  - nombre: Button
    historia: Button/Default
  - nombre: Modal
    historia: Modal/WithContent
  - nombre: Header
    historia: Header/Authenticated

interacciones:
  Button:
    - hover
    - active
    - disabled
```

## Output

```markdown
## Reporte de Testing Visual — 2026-03-28 14:32

**Proyecto:** mi-app
**Baseline:** v1.12.0 (2026-03-20)
**Comparando:** rama feature/nuevo-checkout

### Resumen

| Estado | Componentes |
|--------|-------------|
| ✅ PASS | 18 |
| ⚠️ WARN | 2 |
| ❌ FAIL | 1 |

### Resultados por Componente

| Componente | Breakpoint | Diferencia | Estado |
|------------|------------|------------|--------|
| Button     | mobile     | 0.3%       | ✅ PASS |
| Button     | desktop    | 0.1%       | ✅ PASS |
| Header     | desktop    | 3.2%       | ⚠️ WARN |
| Checkout   | mobile     | 8.7%       | ❌ FAIL |

### Detalle de Fallas

#### ❌ Checkout — mobile (375px)
**Diferencia:** 8.7% (umbral: 1%)
**Área afectada:** Sección de pago, botón CTA
**Causa probable:** Cambio en padding de `.checkout__summary`
**Diff:** .especdev/visual-diffs/checkout-mobile-diff.png

#### ⚠️ Header — desktop (1440px)
**Diferencia:** 3.2%
**Área afectada:** Avatar de usuario (esquina superior derecha)
**Causa probable:** Cambio en tamaño de imagen de perfil
**Acción:** Revisar si es intencional; actualizar baseline si lo es

### Interacciones Testeadas

| Componente | Estado   | Resultado |
|------------|----------|-----------|
| Button     | hover    | ✅ PASS   |
| Button     | disabled | ✅ PASS   |
| Modal      | open     | ✅ PASS   |
| Dropdown   | active   | ⚠️ WARN   |

### Próximos Pasos
- Corregir regresión en Checkout mobile antes de merge
- Revisar cambio en Header y actualizar baseline si es intencional
- Ejecutar `/especdev:visual-test --baseline` después de corregir
```

## Almacenamiento

```
.especdev/
├── visual-test.yaml          # Configuración
├── visual-baselines/          # Screenshots de referencia
│   ├── Button/
│   │   ├── mobile.png
│   │   └── desktop.png
│   └── Checkout/
│       └── mobile.png
└── visual-diffs/              # Diffs generados (ignorados en git)
    └── checkout-mobile-diff.png
```

## Integración con Don Cheli

```
/especdev:visual-test → detecta regresión
  → /especdev:desglosar → tarea de corrección
  → /especdev:implementar → fix con TDD
  → /especdev:visual-test --baseline → actualizar referencia
```

Ejecutar automáticamente:
- Antes de cada PR con cambios en componentes UI
- Después de actualizar librerías de diseño
- Al cambiar design tokens (colores, tipografía, espaciado)

## Modelo Recomendado

| Paso | Modelo | Razón |
|------|--------|-------|
| Comparación de imágenes | Sonnet | Capacidades multimodal |
| Generación de reporte | Haiku | Formateo simple |
| Análisis de causa raíz | Sonnet | Razonamiento sobre UI |
