---
nombre: Prueba de Trabajo
descripcion: "Generar evidencia verificable de que el código funciona: tests pasando, screenshots, logs"
version: 1.0.0
autor: Don Cheli
tags: [verificación, evidencia, proof-of-work, ci]
activacion: "prueba de trabajo", "evidencia", "proof of work", "demostrar que funciona"
---

# Habilidad: Prueba de Trabajo (Proof of Work)

**Versión:** 1.0.0
**Categoría:** Verificación
**Tipo:** Rígida

> Adaptado de OpenAI Symphony — evidencia verificable de que el trabajo fue completado correctamente.

## Cómo Mejora el Framework

Sin prueba de trabajo, el equipo debe revisar TODO el código manualmente para verificar que funciona. Con prueba de trabajo, el agente **demuestra** que su implementación es correcta con evidencia verificable.

## Componentes de la Prueba de Trabajo

### 1. Estado de CI ✅

```markdown
## CI Status
- Lint: ✅ PASS (0.8s)
- Type Check: ✅ PASS (2.1s)
- Unit Tests: ✅ PASS (47/47, 3.2s)
- Integration Tests: ✅ PASS (12/12, 8.5s)
- Build: ✅ PASS (5.1s)
- Coverage: 87% (umbral: 85%) ✅
```

### 2. Análisis de Complejidad 📊

```markdown
## Análisis de Complejidad
- Archivos modificados: 8
- Líneas agregadas: 234
- Líneas eliminadas: 45
- Complejidad ciclomática promedio: 3.2 (bajo)
- Archivo más complejo: auth_service.py (cc: 7)
- Dependencias nuevas: 1 (python-jose)
- Riesgo de regresión: BAJO
```

### 3. Revisión de PR 📋

```markdown
## Checklist de PR
- [x] Specs seguidas: auth-oauth.delta.md
- [x] Tests unitarios para lógica nueva
- [x] Tests de integración para endpoints
- [x] No hay TODO/FIXME sin resolver
- [x] Documentación actualizada
- [x] No hay secrets en el código
- [x] Backward compatible
```

### 4. Video Walkthrough 🎥 (Opcional)

Grabación del agente ejecutando los tests y mostrando que la funcionalidad opera correctamente. Especialmente útil para cambios de UI.

### 5. Contabilidad de Tokens 💰

```markdown
## Consumo de Recursos
- Tokens input: 45,230
- Tokens output: 12,890
- Tokens total: 58,120
- Sesiones: 2
- Tiempo total: 7m 23s
- Reintentos: 0
- Costo estimado: $0.14
```

## Output Completo

Cada PR o tarea completada incluye un archivo `prueba-trabajo.md`:

```markdown
# Prueba de Trabajo: PROJ-42 — Agregar OAuth

## Resumen
Feature implementada según spec auth-oauth.delta.md.
3 endpoints nuevos, 12 tests, 0 bugs.

## CI Status
✅ Lint | ✅ Types | ✅ Tests (47/47) | ✅ Build | ✅ Coverage (87%)

## Complejidad
8 archivos | +234 -45 líneas | CC promedio: 3.2 | Riesgo: BAJO

## Trazabilidad
| Escenario Gherkin | Test | Estado |
|-------------------|------|--------|
| Login Google exitoso | test_google_login_success | ✅ |
| Tarjeta rechazada | test_card_declined | ✅ |
| Vincular OAuth a existente | test_link_oauth | ✅ |

## Tokens
58,120 tokens | 2 sesiones | 7m 23s | ~$0.14

## Aprobación
Estado: LISTO PARA REVISIÓN HUMANA
Solicitante: Don Cheli Agent
Fecha: 2026-03-21T16:30:00-05:00
```

## Integración con Pipeline

```
implementar → stop hooks → generar prueba-trabajo.md
    → crear PR con prueba adjunta
    → solicitar revisión humana
    → si aprobada → archivar
```

## Configuración

```yaml
# WORKFLOW.md
prueba_trabajo:
  ci_status: true          # Siempre
  complejidad: true         # Siempre
  trazabilidad: true        # Siempre
  walkthrough_video: false  # Opcional
  tokens: true              # Siempre
```
