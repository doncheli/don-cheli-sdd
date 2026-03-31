---
nombre: Validación Nyquist
descripcion: "Verificar que cada requisito de la spec tiene al menos un test que lo cubre (mapeo 1:1 spec↔test)"
version: 1.0.0
autor: Don Cheli
tags: [calidad, nyquist, tests, cobertura, requisitos]
activacion: "nyquist", "cobertura de specs", "mapeo tests requisitos"
---

# Habilidad: Validación Nyquist (Testabilidad Pre-Coding)

**Versión:** 1.0.0
**Categoría:** Calidad
**Tipo:** Rígida

> Adaptado de Get Shit Done (gsd-build/get-shit-done) — Nyquist Validation Layer.

## Cómo Mejora el Framework

Don Cheli exige TDD (Ley de Hierro #1), pero la validación ocurre **durante** la implementación (RED→GREEN). No hay verificación de que **todos** los requisitos tengan tests mapeados **antes** de empezar a codear.

La Validación Nyquist previene el problema: "lo construimos pero no podemos medir si funciona".

## El Concepto

> En teoría de señales, el Teorema de Nyquist dice que para capturar fielmente una señal, necesitas muestrearla al doble de su frecuencia. Analogía: para capturar fielmente los requisitos, necesitas al menos un test por requisito.

```
Sin Nyquist:
  Plan → Implementar → "¿funciona?" → "no sé, no hay test para eso"

Con Nyquist:
  Plan → Mapeo tests↔requisitos → ¿100% cubierto? → Implementar → Verificar
```

## Cuándo se Ejecuta

La validación Nyquist se ejecuta como **puerta de calidad** entre `/dc:desglosar` y `/dc:implementar`:

```
/dc:desglosar → .tasks.md
  → [VALIDACIÓN NYQUIST] ← aquí
  → /dc:implementar
```

## Proceso de Validación

### Paso 1: Extraer Requisitos

De la spec (`.feature`) y el plan (`.plan.md`), extraer todos los requisitos verificables:

```markdown
## Requisitos Extraídos

| ID | Requisito | Fuente | Tipo |
|----|-----------|--------|------|
| R01 | Registro exitoso crea usuario | CrearUsuario.feature:E1 | Funcional |
| R02 | Email duplicado retorna error | CrearUsuario.feature:E2 | Funcional |
| R03 | Campo vacío retorna error | CrearUsuario.feature:E3 | Validación |
| R04 | Respuesta en < 500ms (p95) | CrearUsuario.feature:CE | Rendimiento |
| R05 | Password se almacena hasheado | CrearUsuario.plan.md:Modelo | Seguridad |
```

### Paso 2: Mapear Tests

Para cada requisito, identificar qué tarea del `.tasks.md` lo verifica:

```markdown
## Mapeo Nyquist

| Requisito | Tarea que lo verifica | Comando de verificación | Estado |
|-----------|----------------------|------------------------|--------|
| R01 | T008 (test registro exitoso) | `pytest tests/unit/test_service.py::test_crear_exitoso` | ✅ Cubierto |
| R02 | T009 (test email duplicado) | `pytest tests/unit/test_service.py::test_email_duplicado` | ✅ Cubierto |
| R03 | T014 (test campo vacío) | `pytest tests/unit/test_service.py::test_campo_vacio` | ✅ Cubierto |
| R04 | — | — | ❌ Sin test |
| R05 | — | — | ❌ Sin test |
```

### Paso 3: Evaluar Cobertura

```markdown
## Resultado Nyquist

Requisitos totales: 5
Cubiertos por tests: 3
Sin cobertura: 2
Cobertura Nyquist: 60% (mínimo requerido: 100% para P1, 80% para P2)

❌ NO-AVANZAR — Faltan tests para:
  - R04 (Rendimiento): Agregar test de latencia p95
  - R05 (Seguridad): Agregar test que verifique hash vs plaintext
```

### Paso 4: Resolver Brechas

Antes de implementar, se DEBEN agregar las tareas faltantes al `.tasks.md`:

```markdown
## Tareas Agregadas por Nyquist

- [T025] [P] [US1] RED: Test de latencia p95 para POST /usuarios (< 500ms)
- [T026] [P] [US1] RED: Test que verifica password hasheado en BD (no plaintext)
```

## Umbrales de Cobertura Nyquist

| Prioridad | Cobertura Mínima | Acción si no cumple |
|-----------|------------------|---------------------|
| **P1** (Camino Crítico) | 100% | ❌ NO-AVANZAR |
| **P2** (Importante) | 80% | ⚠️ WARNING (puede avanzar con justificación) |
| **P3+** (Deseable) | 50% | ℹ️ INFO (registrar deuda) |

## Tipos de Verificación

No todos los requisitos se verifican con tests automatizados:

| Tipo | Verificación | Ejemplo |
|------|-------------|---------|
| **Automatizado** | Test unitario/integración | "Email duplicado retorna 409" |
| **Visual** | Checkpoint humano | "UI se ve correctamente en mobile" |
| **Rendimiento** | Benchmark automatizado | "Respuesta < 500ms p95" |
| **Manual** | Checklist UAT | "Flujo de onboarding es intuitivo" |

Los requisitos con verificación **Visual** o **Manual** se marcan como `[checkpoint-humano]` y no bloquean la puerta Nyquist, pero se registran en la deuda de verificación.

## Deuda de Verificación

Requisitos que no pueden verificarse automáticamente se registran como **deuda**:

```markdown
## Deuda de Verificación

| Requisito | Tipo | Razón | Cuándo resolver |
|-----------|------|-------|-----------------|
| R04 | Rendimiento | Requiere entorno de carga | Antes de release |
| "UI responsive" | Visual | Requiere revisión humana | En checkpoint |
```

## Integración con Puertas de Calidad

La Validación Nyquist se integra como **sub-puerta de la Puerta 5** (Preparación de Tareas):

```
Puerta 5: Preparación de Tareas
├── Todas las tareas con IDs (T###) ✅
├── Rutas de archivos en tareas ✅
├── Marcadores [P] de paralelismo ✅
├── 5 fases presentes ✅
└── Validación Nyquist ✅ ← NUEVA
    ├── P1: 100% cubierto
    ├── P2: 80%+ cubierto
    └── P3+: 50%+ cubierto (o deuda registrada)
```

## Guardrails

- **Nunca** avanzar a implementación con P1 sin 100% de cobertura Nyquist
- **Nunca** aceptar "se probará manualmente" para requisitos automatizables
- **Siempre** registrar deuda de verificación para requisitos no automatizables
- **Siempre** agregar tareas faltantes al `.tasks.md` antes de implementar
