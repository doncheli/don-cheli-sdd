---
name: dc-drift
description: Detectar divergencias entre specs Gherkin e implementación (spec drift). Usa cuando el usuario dice "spec drift", "drift detection", "spec vs código", "conformance check", "spec deviation", "código no matchea specs", "implementation diverged", "spec vs implementation", "verificar specs". Compara features implementadas contra specs y reporta gaps con severity.
i18n: true
---

## Objetivo
Detectar y reportar divergencias entre las especificaciones Gherkin (`.feature`) y la cobertura de tests real. Identifica escenarios sin tests, tests sin spec, y comportamientos que difieren entre lo especificado y lo implementado.
## Uso
```
/dc:drift                             # Analizar todo el proyecto
/dc:drift @specs/features/pagos/      # Analizar dominio específico
/dc:drift --severidad critica         # Solo brechas críticas
/dc:drift --formato tabla             # Output en tabla (default)
/dc:drift --formato json              # Output en JSON (para CI)
```
## Comportamiento
```
1. DESCUBRIR — Localizar todos los archivos de spec y test
   ├── Buscar *.feature en specs/features/
   ├── Buscar *.test.*, *.spec.*, test_*.py en src/ y tests/
   └── Leer .dc/config.yaml para rutas personalizadas
2. MAPEAR — Construir mapa spec→test
   ├── Extraer escenarios de cada archivo .feature
   ├── Extraer descripciones de cada test
   ├── Correlacionar por nombre, etiqueta o convención de archivo
   └── Detectar duplicados y conflictos
3. ANALIZAR — Clasificar brechas por severidad
   ├── CRÍTICO: spec existe, cero tests asociados
   ├── WARNING: test existe, cero spec asociada
   └── INFO: cobertura parcial (escenario sin test o test sin escenario)
4. REPORTAR — Generar reporte estructurado con tabla y recomendaciones
```
## Severidades
| Nivel | Condición | Acción recomendada |
|-------|-----------|-------------------|
| `CRÍTICO` | Escenario Gherkin sin ningún test asociado | Bloquear PR, crear tests |
| `WARNING` | Test sin escenario Gherkin correspondiente | Crear spec o eliminar test huérfano |
| `INFO` | Cobertura parcial (happy path sin edge cases, o viceversa) | Completar en próximo sprint |
## Output
```markdown
## Drift Report: mi-proyecto
**Fecha:** 2026-03-28
**Specs analizadas:** 18 archivos .feature (64 escenarios)
**Tests analizados:** 142 tests en 31 archivos
#### Resumen de Cobertura
| Categoría          | Cantidad | % |
|--------------------|----------|---|
| Escenarios cubiertos | 51      | 80% |
| 🔴 Sin tests (CRÍTICO) | 7    | 11% |
| 🟡 Tests sin spec (WARNING) | 6 | 9% |
#### 🔴 CRÍTICO — Escenarios sin Tests (7)
| Feature | Escenario | Archivo .feature | Tests encontrados |
|---------|-----------|-----------------|-------------------|
| Pagos | Reembolso parcial con cupón activo | specs/features/pagos/reembolso.feature:34 | 0 |
| Auth | Login con MFA por TOTP | specs/features/auth/login.feature:67 | 0 |
| Carrito | Aplicar descuento por volumen (5+ items) | specs/features/carrito/descuentos.feature:12 | 0 |
| ... | ... | ... | ... |
#### 🟡 WARNING — Tests sin Spec (6)
| Test | Archivo | Comportamiento descrito | Spec encontrada |
|------|---------|------------------------|-----------------|
| `test_payment_retry_on_timeout` | tests/unit/test_payments.py:89 | Retry en timeout de Stripe | ninguna |
| `test_user_soft_delete` | tests/unit/test_users.py:134 | Soft delete de usuario | ninguna |
| ... | ... | ... | ... |
#### ℹ️ INFO — Cobertura Parcial (12)
| Feature | Escenario | Cobertura |
|---------|-----------|-----------|
| Checkout | Pago exitoso | happy path ✅ / error de red ❌ |
| Registro | Email duplicado | happy path ❌ / error ✅ |
| ... | ... | ... |
#### Recomendaciones
1. **Inmediato:** Crear tests para los 7 escenarios CRÍTICOS antes del próximo release
2. **Próximo sprint:** Documentar en Gherkin los 6 tests huérfanos o eliminarlos
3. **Backlog:** Completar los 12 casos de cobertura parcial
→ Ejecutar `/dc:desglosar` para convertir brechas en tareas
```
## Almacenamiento
```
.dc/drift/
├── drift-2026-03-28.md     # Reporte con timestamp
├── drift-latest.md         # Symlink al reporte más reciente
└── drift-history.json      # Histórico de métricas para trending
```
## Integración con Pipeline
```
/dc:drift → detectar brechas
  → /dc:desglosar → crear tareas para cerrar brechas
  → /dc:tea → ejecutar tests generados
  → /dc:drift → verificar que brecha se cerró
```
Ejecutar automáticamente antes de `/dc:implementar` y después de cada merge.
## Guardrails
- **Nunca** marcar como cubierto un escenario si el test solo coincide por nombre pero no por comportamiento
- **Nunca** ignorar escenarios CRÍTICOS al hacer PR
- **Siempre** considerar variantes de nomenclatura (camelCase, snake_case, español/inglés)
- **Siempre** respetar etiquetas Gherkin (`@smoke`, `@regression`) al clasificar prioridad
