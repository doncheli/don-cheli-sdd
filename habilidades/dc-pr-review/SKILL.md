---
name: dc-pr-review
description: Revisión automatizada de Pull Requests con análisis de coverage, seguridad y conformidad con specs. Usa cuando el usuario dice "revisar PR", "PR review", "pull request review", "review this PR", "analizar PR", "GitHub PR", "merge request", "code review PR", "checar PR antes de merge". Analiza coverage diff, security hotspots y drift contra specs Gherkin.
i18n: true
---

## Objetivo
Revisar automáticamente un Pull Request de GitHub analizando el diff, delta de cobertura, implicaciones de seguridad, conformidad con specs y calidad de código. Genera comentarios de revisión con severidad y puede auto-aprobar si todos los checks pasan (configurable).
## Uso
```
/dc:pr-review                       # Revisar PR del branch actual
/dc:pr-review 42                    # Revisar PR #42
/dc:pr-review --repo owner/repo 42  # PR de otro repositorio
/dc:pr-review --dimensiones tests,security  # Solo dimensiones específicas
/dc:pr-review --auto-aprobar        # Aprobar si todos los checks pasan
/dc:pr-review --seco                # Mostrar análisis sin publicar comentarios
```
## Pre-requisitos
```
gh auth login          # Autenticación con GitHub CLI
gh --version           # gh >= 2.30 recomendado
```
## Comportamiento
```
1. OBTENER — Descargar diff y metadata del PR
   ├── gh pr view <numero> --json title,body,author,additions,deletions,files
   ├── gh pr diff <numero>
   └── gh pr checks <numero>
2. ANALIZAR — 5 dimensiones de revisión
   ├── Correctness: lógica, edge cases, manejo de errores
   ├── Tests: delta de cobertura, tests faltantes, calidad de asserts
   ├── Performance: N+1 queries, operaciones O(n²), memory leaks
   ├── Security: OWASP Top 10, exposición de datos, auth bypass
   └── Style: convenciones del proyecto, naming, complejidad ciclomática
3. GENERAR — Comentarios con severidad por línea o general
   ├── blocking:    Debe corregirse antes de aprobar
   ├── suggestion:  Mejora importante pero no bloqueante
   └── nitpick:     Preferencia de estilo, opcional
4. PUBLICAR — Subir revisión a GitHub
   └── gh pr review <numero> --comment --body "..."
       ├── Si --auto-aprobar y cero blocking → gh pr review --approve
       └── Si hay blocking → gh pr review --request-changes
```
## Las 5 Dimensiones
#### 1. Correctness
```
Verificar:
  - Lógica de negocio implementada correctamente vs spec
  - Manejo de casos borde (null, vacío, límites)
  - Race conditions en código concurrente
  - Manejo de errores explícito (no catch vacíos)
  - Invariantes de datos respetados
```
#### 2. Tests
```
Verificar:
  - Delta de cobertura ≥ 0% (el PR no baja cobertura)
  - Cobertura de líneas nuevas ≥ 85%
  - Tests cubren happy path + al menos 1 error path
  - Asserts verifican comportamiento, no implementación
  - Sin tests hardcodeados o frágiles
```
#### 3. Performance
```
Verificar:
  - Sin queries N+1 en loops (ORM lazy loading)
  - Operaciones costosas fuera del hot path
  - Paginación en endpoints que retornan listas
  - Índices de DB para campos filtrados/ordenados
  - Sin llamadas HTTP síncronas en el request lifecycle
```
#### 4. Security
```
Verificar (subset de /dc:auditar-seguridad):
  - Sin credenciales o tokens en el diff
  - Input validado antes de usarse en queries o comandos
  - Auth/authz verificado en endpoints nuevos
  - Datos sensibles no logueados
  - Dependencias nuevas sin CVEs conocidos
```
#### 5. Style
```
Verificar:
  - Naming consistente con el proyecto (idioma, convención)
  - Funciones con más de 30 líneas → candidato a extraer
  - Complejidad ciclomática > 10 → refactorizar
  - Comentarios explican el "por qué", no el "qué"
  - Sin código comentado o console.log/print de debug
```
## Output
```markdown
## PR Review: #42 — feat: implementar reembolsos parciales
**Autor:** @mperez | **Diff:** +287 / -43 líneas en 8 archivos
**Checks CI:** ✅ build | ✅ lint | ❌ coverage (81% < 85%)
#### Resumen de Revisión
| Dimensión | Estado | Hallazgos |
|-----------|--------|-----------|
| Correctness | ⚠️ | 1 blocking |
| Tests | ❌ | 2 blocking (cobertura insuficiente) |
| Performance | ✅ | 0 hallazgos |
| Security | ✅ | 1 suggestion |
| Style | ✅ | 2 nitpick |
**Decisión:** REQUEST CHANGES (3 blocking)
#### Comentarios por Archivo
#### 🔴 BLOCKING — src/services/payment_service.py:89
```python
## Línea actual:
if amount > original_amount:
    raise ValueError("Monto excede el original")
## ❌ Falta validar amount <= 0. Un reembolso de $0 o negativo pasa silenciosamente.
## Fix:
if amount <= 0 or amount > original_amount:
    raise ValueError(f"Monto de reembolso inválido: {amount}")
```
**Severidad:** blocking | **Dimensión:** Correctness
#### 🔴 BLOCKING — tests/unit/test_payment_service.py
Cobertura de `refund()` al 60% (umbral: 85%).
Faltan tests para: monto negativo, monto cero, reembolso cuando pago ya fue reembolsado.
#### 🟡 SUGGESTION — src/models/refund.py:15
Considerar agregar índice en `refund.payment_id` — este campo se usa en la query
de verificación de reembolso duplicado. Sin índice, la query es O(n) en la tabla.
#### 💬 NITPICK — src/services/payment_service.py:102
`process_ref` → nombre ambiguo. Considerar `process_refund_request` para mayor claridad.
#### 💬 NITPICK — src/services/payment_service.py:115
Console.log de debug olvidado: `print(f"DEBUG refund amount: {amount}")`. Eliminar.
#### Checklist para Aprobación
- [ ] Agregar validación `amount <= 0` en `refund()`
- [ ] Completar tests hasta ≥ 85% de cobertura en `refund()`
- [ ] Considerar índice en `refund.payment_id` (suggestion)
```
## Configuración en `.dc/config.yaml`
```yaml
pr_review:
  auto_aprobar: false              # Aprobar automáticamente si cero blocking
  cobertura_minima: 85             # % mínimo para pasar check de tests
  dimensiones:
    - correctness
    - tests
    - performance
    - security
    - style
  publicar_comentarios: true       # false = solo mostrar en terminal
  max_nitpicks: 5                  # Limitar nitpicks para no saturar la revisión
```
## Integración con Pipeline
```
/dc:tea → validar cobertura local
  → /dc:pr-review → revisión completa
  → gh pr review --approve → merge
```
También se puede configurar como pre-merge check en GitHub Actions:
```yaml
## .github/workflows/dc-pr-review.yml
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx don-cheli pr-review --ci --seco
```
## Guardrails
- **Nunca** auto-aprobar un PR con hallazgos de seguridad blocking
- **Nunca** publicar comentarios sin confirmación si `--seco` no fue especificado en CI
- **Siempre** incluir contexto de código en comentarios, no solo el problema
- **Siempre** distinguir entre blocking (debe corregirse) y suggestion (puede ignorarse)
- **Siempre** verificar que el branch está actualizado con `main` antes de revisar
