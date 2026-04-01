---
description: Testing Autónomo End-to-End — genera, ejecuta y reporta tests automáticamente
i18n: true
---

# /dc:tea

## Objetivo

Módulo de Testing Autónomo End-to-End (TEA): genera archivos de test, los ejecuta y produce un reporte de resultados y cobertura. Integra con el pipeline TDD del framework, se ejecuta tras `/dc:implementar` y auto-detecta el framework de testing del proyecto.

## Uso

```
/dc:tea                                   # Ejecutar ciclo completo
/dc:tea @specs/features/pagos/            # Solo dominio específico
/dc:tea --fase analizar                   # Solo fase 1
/dc:tea --fase generar                    # Solo fase 2
/dc:tea --fase ejecutar                   # Solo fase 3
/dc:tea --tipo unit                       # Solo tests unitarios
/dc:tea --tipo integration                # Solo tests de integración
/dc:tea --tipo contract                   # Solo tests de contrato
/dc:tea --seco                            # Mostrar plan sin ejecutar
```

## Comportamiento — 4 Fases

### Fase 1: Analizar

```
LEER spec Gherkin (.feature) del dominio objetivo
LEER código de implementación existente
IDENTIFICAR:
  ├── Funciones y métodos públicos sin tests
  ├── Escenarios Gherkin sin cobertura
  ├── Rutas de error no testeadas
  └── Contratos de integración (si hay openapi.yaml o contrato-api.md)
DETECTAR framework de testing:
  ├── package.json → Jest / Vitest / Mocha
  ├── pyproject.toml / setup.cfg → Pytest / Unittest
  ├── go.mod → Go test
  ├── Gemfile → RSpec
  └── pom.xml / build.gradle → JUnit
REPORTAR plan de generación antes de ejecutar
```

### Fase 2: Generar

```
CREAR archivos de test según framework detectado
TIPOS soportados:
  ├── unit: un test por función pública, cubre happy path + errores
  ├── integration: flujos end-to-end desde HTTP hasta DB
  └── contract: verificar que API cumple spec OpenAPI
CONVENCIONES de nombrado:
  ├── Jest/Vitest:   *.test.ts, *.spec.ts
  ├── Pytest:        test_*.py
  ├── Go:            *_test.go
  └── RSpec:         *_spec.rb
PLANTILLA mínima por test:
  ├── Arrange: estado inicial (fixtures, mocks, factories)
  ├── Act: llamada al código bajo prueba
  └── Assert: verificación del resultado esperado
```

### Fase 3: Ejecutar

```
EJECUTAR suite de tests con framework detectado
CAPTURAR:
  ├── Tests pasando / fallando / saltados
  ├── Cobertura de líneas, branches y funciones
  ├── Tiempo de ejecución por test y total
  └── Stack traces de fallos
REINTENTAR test flaky hasta 2 veces antes de marcarlo como fallo
DETENER si cobertura < umbral configurado en .dc/config.yaml (default 85%)
```

### Fase 4: Reportar

```
GENERAR reporte en .dc/tea/
MOSTRAR tabla de resultados al usuario
RECOMENDAR acciones si hay fallos o cobertura insuficiente
```

## Output

```markdown
## TEA — Testing Autónomo E2E
**Dominio:** pagos
**Framework detectado:** Pytest 7.4
**Tipos ejecutados:** unit, integration

---

### Fase 1: Análisis
- 3 funciones sin tests: `refund()`, `apply_coupon()`, `calculate_tax()`
- 2 escenarios Gherkin sin cobertura: "Reembolso parcial", "Cupón expirado"
- 0 contratos de API detectados

→ Plan: generar 8 tests unitarios + 2 tests de integración

---

### Fase 2: Generación
- ✅ tests/unit/test_payment_service.py (8 tests nuevos)
- ✅ tests/integration/test_refund_flow.py (2 tests nuevos)

---

### Fase 3: Ejecución

```
pytest tests/ -v --cov=src --cov-report=term-missing

collected 47 items

tests/unit/test_payment_service.py::test_refund_full_amount PASSED      [ 42ms]
tests/unit/test_payment_service.py::test_refund_partial_amount PASSED   [ 38ms]
tests/unit/test_payment_service.py::test_refund_invalid_amount FAILED   [ 12ms]
tests/unit/test_payment_service.py::test_apply_coupon_valid PASSED      [ 55ms]
tests/unit/test_payment_service.py::test_apply_coupon_expired PASSED    [ 44ms]
...

FAILED tests/unit/test_payment_service.py::test_refund_invalid_amount
AssertionError: Expected ValueError, got None
```

---

### Fase 4: Reporte

| Métrica | Valor | Estado |
|---------|-------|--------|
| Tests totales | 47 | — |
| Pasando | 46 | ✅ |
| Fallando | 1 | ❌ |
| Saltados | 0 | — |
| Cobertura líneas | 88% | ✅ (umbral: 85%) |
| Cobertura branches | 79% | ⚠️ (umbral: 85%) |
| Tiempo total | 3.2s | ✅ |

**Fallo detectado:**
`test_refund_invalid_amount` → `PaymentService.refund()` no lanza `ValueError`
para montos negativos. Revisar validación en `src/services/payment_service.py:47`

**Acción recomendada:**
→ `/dc:implementar` para corregir `PaymentService.refund()` (validación de monto)
→ Cobertura de branches al 79% — agregar tests para ramas `else` en `apply_coupon()`
```

## Detección de Framework

| Archivo indicador | Framework | Comando de ejecución |
|-------------------|-----------|----------------------|
| `package.json` con `jest` | Jest | `npx jest --coverage` |
| `package.json` con `vitest` | Vitest | `npx vitest run --coverage` |
| `pyproject.toml` o `setup.cfg` | Pytest | `pytest --cov --cov-report=term-missing` |
| `go.mod` | Go test | `go test ./... -cover` |
| `Gemfile` con `rspec` | RSpec | `bundle exec rspec --format documentation` |
| `pom.xml` | JUnit (Maven) | `mvn test` |

## Almacenamiento

```
.dc/tea/
├── tea-2026-03-28-pagos.md      # Reporte por dominio y fecha
├── tea-latest.md                # Último reporte global
└── coverage/
    └── lcov.info                # Datos de cobertura para CI
```

## Integración con Pipeline

```
/dc:implementar → código + tests manuales
  → /dc:tea → validar cobertura completa
  → /dc:drift → verificar cierre de brechas
  → /dc:pr-review → revisión pre-PR
```

## Guardrails

- **Nunca** generar tests que siempre pasan sin verificar comportamiento real
- **Nunca** usar `pass`, `TODO` o mocks vacíos en tests generados
- **Nunca** continuar si cobertura < umbral configurado sin avisar
- **Siempre** separar setup de tests (fixtures) del código de producción
- **Siempre** ejecutar tests en entorno aislado (preferir Docker si está disponible)
- **Siempre** preservar tests existentes; solo agregar, nunca sobreescribir
