---
description: Dividir blueprint técnico en tareas ejecutables con marcadores de paralelismo. Usa cuando el usuario dice "desglosar", "dividir en tareas", "breakdown", "task breakdown", "WBS", "dividir feature", "plan de tareas", "decompose", "story to tasks", "task planning", "subtareas". Aplica TDD markers (RED→GREEN) e indica tareas paralelizables.
i18n: true
---

# /dc:desglosar

## Objetivo

Convertir un blueprint técnico en una lista de tareas ordenadas con enfoque TDD (RED → GREEN → REFACTOR), marcadores de paralelismo `[P]` y fases de ejecución estandarizadas.

> Alineado con spec-kit (github/spec-kit) — formato `[ID] [P?] [Story] Descripción` y 5 fases de ejecución

## Uso

```
/dc:desglosar @specs/features/<dominio>/<Feature>.plan.md
```

## Formato de Tareas

```
[TID] [P?] [Historia] Descripción
```

| Campo | Significado | Ejemplo |
|-------|-------------|---------|
| `TID` | ID único de tarea | `T001` |
| `[P]` | Paralelizable (puede ejecutarse en paralelo con otras `[P]` de la misma fase) | `[P]` o vacío |
| `[Historia]` | Historia de usuario asociada | `[US1]` |
| Descripción | Qué hacer | Crear modelo de Usuario |

## Output

Genera `specs/features/<dominio>/<Feature>.tasks.md`:

```markdown
# Tareas: CrearUsuario

**Feature:** usuario/CrearUsuario
**Plan:** specs/features/usuario/CrearUsuario.plan.md
**Creado:** 2026-03-21

## Formato: [TID] [P?] [Historia] Descripción

---

## Fase 1: Setup (Paralelizable)

Inicialización del entorno y estructura del proyecto.

- [T001] [P] Setup: Crear estructura de directorios del módulo usuario
- [T002] [P] Setup: Inicializar configuración de testing
- [T003] [P] Setup: Configurar Docker compose para tests

---

## Fase 2: Fundación (Secuencial después de Setup)

Infraestructura crítica que el resto del código necesita.

- [T004] [US1] RED: Escribir test para modelo Usuario
- [T005] [US1] GREEN: Implementar modelo Usuario con validaciones
  - Archivos: `models/usuario.py`, `tests/unit/test_usuario.py`

- [T006] [US1] RED: Escribir test para UsuarioRepository (crear/buscar)
- [T007] [US1] GREEN: Implementar UsuarioRepository
  - Archivos: `repositories/usuario_repo.py`, `tests/unit/test_usuario_repo.py`

---

## Fase 3: Historias de Usuario (Por prioridad)

### P1: Camino Crítico

- [T008] [US1] RED: Test para registro exitoso (happy path)
- [T009] [US1] RED: Test para email duplicado (sad path)
- [T010] [US1] GREEN: Implementar UsuarioService.crear()
  - Archivos: `services/usuario_service.py`, `tests/unit/test_usuario_service.py`
- [T011] [P] [US1] RED: Test de integración para POST /usuarios
- [T012] [P] [US1] RED: Test BDD desde escenarios Gherkin P1
- [T013] [US1] GREEN: Implementar UsuarioController
  - Archivos: `controllers/usuario_controller.py`, `tests/integration/test_crear_usuario.py`

### P2: Importante

- [T014] [US2] RED: Test para campo obligatorio vacío
- [T015] [US2] RED: Test para contraseña débil
- [T016] [US2] GREEN: Implementar validaciones adicionales
- [T017] [P] [US2] RED: Test BDD desde escenarios Gherkin P2

---

## Fase 4: Polish (Paralelizable)

Refinamientos transversales.

- [T018] [P] Refactor: Extraer validaciones a módulo compartido (si aplica)
- [T019] [P] Docs: Actualizar API docs con nuevo endpoint
- [T020] [P] Lint: Ejecutar linter y corregir warnings

---

## Fase 5: Verificación Final

- [T021] Ejecutar suite completa de tests
- [T022] Verificar coverage ≥ 85% sobre código nuevo
- [T023] Verificar lint y type-check sin errores
- [T024] Verificar build exitoso

---

## Orden de Ejecución

```
Fase 1: T001 ║ T002 ║ T003  (paralelo)
              ↓
Fase 2: T004 → T005 → T006 → T007  (secuencial)
              ↓
Fase 3: T008 → T009 → T010 → T011 ║ T012 → T013  (mixto)
         T014 → T015 → T016 → T017  (secuencial)
              ↓
Fase 4: T018 ║ T019 ║ T020  (paralelo)
              ↓
Fase 5: T021 → T022 → T023 → T024  (secuencial)
```

**Leyenda:** `→` secuencial | `║` paralelo
```

## Las 5 Fases de Ejecución

| Fase | Nombre | Tipo | Propósito |
|------|--------|------|-----------|
| 1 | **Setup** | Paralelo | Inicialización de entorno y estructura |
| 2 | **Fundación** | Secuencial | Modelos, repos, infraestructura base |
| 3 | **Historias de Usuario** | Por prioridad | Features P1 → P2 → P3+ con TDD |
| 4 | **Polish** | Paralelo | Refactoring, docs, limpieza |
| 5 | **Verificación Final** | Secuencial | Tests, coverage, lint, build |

## Reglas de Paralelismo

- Tareas marcadas con `[P]` pueden ejecutarse en paralelo con otras `[P]` **de la misma fase**
- Tareas sin `[P]` son secuenciales y dependen de la tarea anterior
- **Nunca** ejecutar tareas de fases diferentes en paralelo
- Las fases 1 y 4 son predominantemente paralelas
- Las fases 2 y 5 son predominantemente secuenciales
- La fase 3 es mixta: secuencial dentro de cada historia, potencialmente paralelo entre historias independientes

## Ciclo TDD por Tarea

```
RED:   Escribir test que FALLA
       → Ejecutar: verificar que falla por la razón correcta

GREEN: Implementar el código MÍNIMO para que el test pase
       → Ejecutar: verificar que PASA

REFACTOR: Limpiar sin cambiar comportamiento (solo en Fase 4)
       → Ejecutar: verificar que sigue pasando
```

## Puerta de Calidad

Este comando implementa la **Puerta 5 (Preparación de Tareas)**:

- Todas las tareas tienen IDs únicos (`T###`)
- Todas las tareas de implementación tienen rutas exactas de archivos
- Tareas paralelizables marcadas con `[P]`
- Historias asociadas con `[US#]`
- Las 5 fases están presentes
- Orden de ejecución documentado
