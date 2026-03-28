---
description: Generar y consultar el log de auditoría de decisiones asistidas por IA
i18n: true
---

# /especdev:audit-trail

## Objetivo

Registrar, almacenar y consultar todas las decisiones asistidas por IA durante el ciclo de vida del proyecto: qué se generó, qué se aprobó, qué se modificó y por quién. Proporciona trazabilidad completa para auditorías, revisiones y post-mortems.

## Uso

```
/especdev:audit-trail                            # Ver entradas recientes (últimas 20)
/especdev:audit-trail --registrar                # Registrar acción actual
/especdev:audit-trail --filtro accion=generate   # Filtrar por tipo de acción
/especdev:audit-trail --filtro artefacto=spec    # Filtrar por tipo de artefacto
/especdev:audit-trail --filtro fecha=2026-03-28  # Filtrar por fecha
/especdev:audit-trail --exportar csv             # Exportar como CSV
/especdev:audit-trail --resumen                  # Estadísticas del proyecto
```

## Comportamiento

```
1. REGISTRAR — Capturar entrada en el log
   ├── Timestamp UTC con timezone local
   ├── Tipo de acción: generate | approve | modify | reject | review
   ├── Artefacto afectado: spec | test | code | review | plan | config
   ├── Resumen (≤ 120 chars) de qué se hizo
   ├── Actor: ia | human | ci
   └── Referencia a archivo o PR si aplica

2. ALMACENAR — Persistir en .especdev/audit-trail.md
   ├── Formato Markdown + YAML front-matter por entrada
   ├── Append-only (nunca modificar entradas existentes)
   └── Rotar archivo cuando supere 5,000 líneas → audit-trail-archive/

3. CONSULTAR — Filtrar y mostrar entradas
   ├── Soportar filtros combinables por fecha, acción y artefacto
   ├── Paginación: 20 entradas por página
   └── Modo resumen: estadísticas agregadas
```

## Estructura de Entrada

```yaml
---
id: AT-0047
timestamp: 2026-03-28T14:32:11-03:00
action: generate        # generate | approve | modify | reject | review
artifact: spec          # spec | test | code | review | plan | config
actor: ia               # ia | human | ci
summary: "Generado spec Gherkin para feature ReembolsosParciales (3 escenarios)"
ref: specs/features/pagos/reembolsos.feature
session: dc-session-2026-03-28-a
---
```

## Tipos de Acción

| Acción | Cuándo registrar |
|--------|-----------------|
| `generate` | IA crea un artefacto nuevo (spec, test, código) |
| `approve` | Humano acepta un artefacto sin modificaciones |
| `modify` | Humano o IA edita un artefacto existente |
| `reject` | Humano descarta un artefacto generado por IA |
| `review` | IA realiza una revisión (PR, código, spec) |

## Output — Vista de Log

```markdown
## Audit Trail: mi-proyecto
**Rango:** últimas 20 entradas
**Filtro:** ninguno

| # | Timestamp | Acción | Artefacto | Actor | Resumen |
|---|-----------|--------|-----------|-------|---------|
| AT-0051 | 2026-03-28 14:45 | `approve` | spec | human | Aprobado spec ReembolsosParciales sin cambios |
| AT-0050 | 2026-03-28 14:41 | `modify` | spec | human | Ajustado escenario "cupón expirado" con nueva precondición |
| AT-0049 | 2026-03-28 14:38 | `generate` | spec | ia | Generado spec Gherkin para ReembolsosParciales (3 escenarios) |
| AT-0048 | 2026-03-28 14:20 | `generate` | test | ia | Generados 5 tests unitarios para PaymentService.refund() |
| AT-0047 | 2026-03-28 13:55 | `review` | code | ia | PR #42 revisado: 2 blocking, 1 suggestion, 3 nitpick |
| AT-0046 | 2026-03-28 13:30 | `approve` | code | human | Implementación CrearUsuario aprobada tras verificación manual |
| ...     | ...              | ...      | ...       | ...   | ... |

→ Página 1 de 3 — `/especdev:audit-trail --pagina 2`
```

## Output — Resumen Estadístico

```markdown
## Resumen Audit Trail: mi-proyecto
**Período:** 2026-03-01 → 2026-03-28

| Artefacto | Generados | Aprobados | Modificados | Rechazados | Tasa aprobación |
|-----------|-----------|-----------|-------------|------------|-----------------|
| spec      | 24        | 18        | 5           | 1          | 75%             |
| test      | 61        | 55        | 6           | 0          | 90%             |
| code      | 38        | 29        | 8           | 1          | 76%             |
| review    | 14        | —         | —           | —          | —               |
| **Total** | **137**   | **102**   | **19**      | **2**      | **82%**         |

### Ratio de Modificación por Artefacto
Spec: 21% modificadas → Considerar mejorar prompts de especificación
Test: 10% modificados → Calidad alta
Code: 21% modificado  → Normal para código de negocio complejo
```

## Almacenamiento

```
.especdev/
├── audit-trail.md              # Log activo (append-only)
└── audit-trail-archive/
    ├── audit-trail-2026-01.md  # Archivos por mes al rotar
    └── audit-trail-2026-02.md
```

## Integración con Pipeline

El audit trail se actualiza automáticamente al ejecutar:
- `/especdev:especificar` → registra `generate:spec`
- `/especdev:implementar` → registra `generate:code` y `generate:test`
- `/especdev:revisar` → registra `review:code`
- Aprobación humana de cualquier artefacto → registra `approve`

## Guardrails

- **Nunca** modificar entradas existentes; solo append
- **Nunca** almacenar contenido de artefactos en el log, solo referencias
- **Siempre** incluir referencia a archivo o PR cuando exista
- **Siempre** distinguir actor `ia` vs `human` vs `ci` con precisión
- **Siempre** rotar el archivo antes de llegar a 5,000 líneas para mantener performance
