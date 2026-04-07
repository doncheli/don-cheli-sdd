---
description: Peer review estricto con análisis de rendimiento, arquitectura, seguridad y cumplimiento
i18n: true
---

# /dc:revisar

## Objetivo

Generar un peer review estricto asumiendo el rol de **Arquitecto de Software / Lead Developer**. Evalúa no solo sintaxis y tests, sino rendimiento, cumplimiento de arquitectura, seguridad y eficiencia algorítmica.

## Uso

```
/dc:revisar
/dc:revisar @specs/features/<dominio>/<Feature>.tasks.md
/dc:revisar --rigor alto                   # Review de arquitecto senior
/dc:revisar --rigor estandar               # Review estándar (default)
/dc:revisar --foco rendimiento             # Enfocarse en performance
/dc:revisar --foco seguridad               # Enfocarse en seguridad
```

## Dimensiones del Review

### 1. Corrección Funcional

```
Verificar:
  - [ ] Todos los escenarios Gherkin P1 implementados
  - [ ] Escenarios P2 implementados
  - [ ] Edge cases cubiertos con tests
  - [ ] Sin stubs detectados (habilidad detección-stubs)
  - [ ] Criterios de éxito de la spec cumplidos
```

### 2. Tests y Cobertura

```
Verificar:
  - [ ] Tests unitarios pasan
  - [ ] Tests de integración pasan
  - [ ] Tests BDD desde Gherkin pasan
  - [ ] Cobertura ≥ 85% sobre código nuevo
  - [ ] Validación Nyquist: 100% P1, 80% P2
  - [ ] Tests verifican comportamiento, no implementación
  - [ ] Sin tests frágiles (no dependen de orden, tiempo, estado global)
```

### 3. Rendimiento

```
Detectar:
  ❌ Consultas N+1 a base de datos
  ❌ Loops innecesarios sobre datasets grandes (O(n²) evitable)
  ❌ Falta de paginación en queries que pueden crecer
  ❌ Objetos grandes en memoria sin liberar
  ❌ Imports pesados que podrían ser lazy
  ❌ Re-renders innecesarios (React) o watchers excesivos (Vue)
  ❌ Falta de índices en queries frecuentes
  ❌ Serialización/deserialización redundante
```

### 4. Arquitectura y Diseño

```
Verificar:
  - [ ] Cumple con constitución (todos los artículos)
  - [ ] Principios SOLID respetados (habilidad refactorizacion-solid)
  - [ ] Contrato UI respetado (si aplica, habilidad contrato-ui)
  - [ ] Sin acoplamiento excesivo entre módulos
  - [ ] Dependencias inyectadas (no hardcoded)
  - [ ] Separación de concerns (controller thin, service con lógica)
  - [ ] Sin código duplicado significativo (>10 líneas)
```

### 5. Seguridad

```
Verificar (subset de auditar-seguridad):
  - [ ] Input validado en puntos de entrada
  - [ ] Queries parametrizadas (no concatenación)
  - [ ] Sin credenciales en código
  - [ ] Auth/authz en endpoints que lo requieren
  - [ ] Output encodado (prevención XSS)
  - [ ] Sin datos sensibles en logs
```

### 6. Estilo y Convenciones

```
Verificar:
  - [ ] Naming consistente con convenciones del proyecto
  - [ ] Sin imports no usados
  - [ ] Sin variables no usadas
  - [ ] Sin console.log/print de debugging
  - [ ] Lint y type-check sin errores
  - [ ] Comentarios que aportan valor (no ruido)
```

### 7. Diff Limpio

```
Verificar:
  - [ ] Solo cambios relacionados a la feature
  - [ ] Sin refactoring "de paso" (Art. II Constitución)
  - [ ] Sin cambios de formato no relacionados
  - [ ] Sin archivos de configuración personal (.vscode, .idea)
  - [ ] Sin archivos binarios innecesarios
```

## Output

Genera `specs/features/<dominio>/revision.md`:

```markdown
# Peer Review: CrearUsuario

**Revisor:** Don Cheli Peer Review v2.0
**Fecha:** 2026-03-21
**Rigor:** Alto (Arquitecto Senior)
**Archivos revisados:** 8

---

## Veredicto: ⚠️ APROBADO CON OBSERVACIONES

---

## 1. Corrección Funcional ✅
- P1: 3/3 escenarios implementados
- P2: 2/2 escenarios implementados
- Stubs: 0 detectados

## 2. Tests y Cobertura ✅
- Unitarios: 12/12 ✅
- Integración: 4/4 ✅
- BDD: 5/5 ✅
- Cobertura: 89% (≥ 85% ✅)
- Nyquist P1: 100% ✅

## 3. Rendimiento ⚠️

### ⚠️ PERF-001: Consulta N+1 potencial
**Archivo:** src/services/usuario_service.py:67
**Descripción:** Al listar usuarios con sus roles, se ejecuta 1 query por rol.
```python
# Actual (N+1)
for user in users:
    user.roles = await role_repo.find_by_user(user.id)

# Sugerido (1 query)
user_ids = [u.id for u in users]
roles_map = await role_repo.find_by_users(user_ids)
for user in users:
    user.roles = roles_map.get(user.id, [])
```
**Impacto:** Bajo ahora (pocos usuarios), pero escala linealmente.
**Acción:** Corregir antes de que la tabla usuarios crezca.

## 4. Arquitectura y Diseño ✅
- Constitución: todos los artículos ✅
- SOLID: sin violaciones detectadas
- Separación de concerns: controller thin ✅
- DI: todas las dependencias inyectadas ✅

## 5. Seguridad ✅
- Input validado con Pydantic ✅
- Queries parametrizadas (SQLAlchemy) ✅
- Password con argon2id ✅
- Sin credenciales en código ✅

## 6. Estilo y Convenciones ✅
- Naming consistente ✅
- Lint: 0 errores ✅
- Type-check: 0 errores ✅
- Sin console.log ✅

## 7. Diff Limpio ✅
- Solo archivos de la feature ✅
- Sin cambios de formato ✅

---

## Resumen de Hallazgos

| ID | Tipo | Severidad | Estado |
|----|------|-----------|--------|
| PERF-001 | Rendimiento | ⚠️ Medio | Pendiente |

## Recomendaciones
1. Corregir N+1 en listado de usuarios (PERF-001)
2. Considerar agregar índice en `email` si aún no existe
3. Agregar rate limiting en POST /usuarios para v2
```

## Niveles de Rigor

| Rigor | Quién simula | Dimensiones | Cuándo usar |
|-------|-------------|-------------|-------------|
| **Básico** | Developer Jr | 1, 2, 6 | Fix rápido, cambio menor |
| **Estándar** | Senior Dev | 1-4, 6, 7 | Features estándar |
| **Alto** | Arquitecto Senior | 1-7 (todas) | Features críticas, auth, pagos |

## Integración con Pipeline

```
/dc:implementar → código completo
  → /dc:revisar → reporte de review
  → ¿Aprobado?
     ├── ✅ APROBADO → listo para PR
     ├── ⚠️ CON OBSERVACIONES → corregir hallazgos → re-revisar
     └── ❌ RECHAZADO → cambios significativos necesarios
```

## Guardrails

- **Nunca** aprobar código con stubs críticos
- **Nunca** aprobar sin tests (Ley de Hierro #1)
- **Nunca** ignorar hallazgos de seguridad
- **Siempre** verificar cumplimiento de constitución
- **Siempre** documentar hallazgos con archivo + línea + sugerencia
