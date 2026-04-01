# Tareas TDD — Python Task API

## Mapa de dependencias

```
T1 [P] + T2 [P]  →  T3  →  T4  →  T5 [P] + T6 [P]  →  T7
(modelo)  (schemas)  (repo)  (service)  (routes) (auth)   (integración)
```

## Fases de ejecución

### Fase 1: Fundamentos (paralelo)

**T1 — Modelo SQLAlchemy** `[P]`
- Test: verificar que Task model tiene campos correctos y defaults
- Código: `models/task.py` con SQLAlchemy 2.0 declarative
- Cobertura esperada: 100%

**T2 — Schemas Pydantic** `[P]`
- Test: verificar validación de TaskCreate, TaskUpdate, TaskResponse
- Código: `schemas/task.py` con Pydantic v2
- Cobertura esperada: 100%

### Fase 2: Datos

**T3 — TaskRepository**
- Depende de: T1
- Test: CRUD contra SQLite in-memory
- Código: `repos/task_repo.py` (create, list, get_by_id, update, delete)
- Cobertura esperada: 95%

### Fase 3: Lógica

**T4 — TaskService**
- Depende de: T3
- Test: lógica de negocio (validación de estados, filtros)
- Código: `services/task_service.py`
- Cobertura esperada: 90%

### Fase 4: HTTP (paralelo)

**T5 — Routes** `[P]`
- Depende de: T4
- Test: endpoints con TestClient, status codes, response bodies
- Código: `routes/tasks.py` (5 endpoints)
- Cobertura esperada: 90%

**T6 — Auth Middleware** `[P]`
- Depende de: T4
- Test: API key válido, inválido, ausente
- Código: `middleware/auth.py`
- Cobertura esperada: 100%

### Fase 5: Integración

**T7 — Tests de integración**
- Depende de: T5, T6
- Test: flujo completo CRUD con auth, coincide con escenarios Gherkin
- Cobertura esperada: 91% global
