# Puertas de Calidad (Quality Gates)

## Cómo Mejoran el Framework

Las puertas de calidad son **puntos de verificación obligatorios** entre fases del pipeline.
Sin ellas, el pipeline avanza aunque haya problemas. Con ellas, cada fase DEBE cumplir
criterios formales antes de pasar a la siguiente. Esto es clave para la **trazabilidad**.

> Adaptado de Specular (pei9564/Specular → constitution.md §Quality Gates)
> Alineado con spec-kit (github/spec-kit) — criterios de completitud y constitution check

---

## Las 6 Puertas

| # | Puerta | Fase | Criterios |
|---|--------|------|-----------|
| 1 | **Completitud de Spec** | Después de `/especdev:especificar` | P1 tiene happy + sad path. Criterios de éxito definidos (≥2 medibles). Marcadores `[NECESITA CLARIFICACIÓN]` identificados |
| 2 | **Estado de Spec** | Antes de `/especdev:planificar-tecnico` | Tag `@lista` presente. Specs `@borrador` NO pueden entrar a fase Plan |
| 3 | **Verificación Clarify** | Después de `/especdev:clarificar` | Reporte Auto-QA sin ❌ FALLA. Todos los `[NECESITA CLARIFICACIÓN]` resueltos. Auditoría completada |
| 4 | **Aprobación de Plan** | Después de `/especdev:planificar-tecnico` | Chequeo de constitución pasa (todos ✅). Contexto técnico completo. DBML ratificado. Tracking de complejidad documentado |
| 5 | **Preparación de Tareas** | Después de `/especdev:desglosar` | Todas las tareas con IDs (`T###`). Rutas de archivos en tareas de implementación. Marcadores `[P]` de paralelismo asignados. 5 fases presentes |
| 6 | **Merge de Código** | Después de `/especdev:implementar` | Tests verdes, lint limpio, type-check pasa, coverage ≥85%, sin diff no relacionado, regresión cross-fase pasa |

## Verificación Automática

Cada puerta se verifica automáticamente. Si falla, el framework **bloquea** el avance:

```
/especdev:especificar → [Puerta 1: ¿Completitud?]
    ├── ✅ PASA → Continuar
    └── ❌ FALLA → "Faltan escenarios sad path en P1" o "Criterios de éxito no definidos"

/especdev:clarificar → [Puerta 2+3: ¿Estado? ¿Auto-QA?]
    ├── ✅ PASA → Marcar @lista
    └── ❌ FALLA → "Quedan 2 [NECESITA CLARIFICACIÓN] sin resolver"

/especdev:planificar-tecnico → [Puerta 4: ¿Aprobación?]
    ├── ✅ PASA → Continuar a tareas
    └── ❌ FALLA → "Artículo III de constitución no cumplido" o "DBML provisional no ratificado"

/especdev:desglosar → [Puerta 5: ¿Preparación?]
    ├── ✅ PASA → Listo para implementar
    └── ❌ FALLA → "Tarea T008 sin ruta de archivo" o "Falta Fase 5 (Verificación)"

/especdev:implementar → [Puerta 6: ¿Merge?]
    ├── ✅ PASA → Feature completa
    └── ❌ FALLA → "3 tests fallan" o "Coverage 72% < 85%"
```

## Reporte de Puerta

Cada puerta genera un reporte estructurado:

```markdown
## Puerta de Calidad: Completitud de Spec

✅ PASS: P1 tiene happy path (Registro exitoso)
✅ PASS: P1 tiene sad path (Email duplicado)
✅ PASS: Criterios de éxito definidos (4 medibles)
⚠️ WARNING: P2 solo tiene 1 escenario (recomendado: ≥2)
✅ PASS: 3 marcadores [NECESITA CLARIFICACIÓN] identificados
❌ FAIL: P3+ tiene escenario sin criterio de aceptación

**Resultado: NO-AVANZAR (1 FAIL)**
→ Acción requerida: Agregar Given/When/Then al escenario P3+ "Registro OAuth"
```

## Regresión Cross-Fase

Al completar la Puerta 6 de una feature, se ejecuta **regresión automática** sobre features anteriores:

```
Feature actual: CrearUsuario (Puerta 6)
  │
  ├── Tests de CrearUsuario: ✅ 21/21
  ├── Regresión: ListarProductos (feature anterior): ✅ 15/15
  ├── Regresión: GestionarCarrito (feature anterior): ✅ 18/18
  └── Resultado: ✅ SIN REGRESIÓN

  ¿Algún test de feature anterior falla?
  ├── NO → ✅ Puerta 6 pasa
  └── SÍ → ❌ REGRESIÓN DETECTADA
       └── Identificar qué test rompió y en qué feature
```

**Regla:** No se puede mergear código que rompe features anteriores. La regresión cross-fase es parte obligatoria de la Puerta 6.
