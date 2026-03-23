# Checklist de Requisitos

## Feature: [nombre]
## Dominio: [dominio]
## Estado: @borrador

---

### Verificación de Completitud

| # | Check | Estado | Evidencia |
|---|-------|--------|-----------|
| 1 | Cada Regla tiene al menos un escenario happy path | [ ] | |
| 2 | Cada Regla tiene al menos un escenario sad path | [ ] | |
| 3 | Campos del Gherkin coinciden con DBML | [ ] | |
| 4 | Campos NOT NULL tienen escenario de validación | [ ] | |
| 5 | Convención de nombres correcta (COMMAND/QUERY) | [ ] | |
| 6 | Sin escenarios @auto_generated redundantes | [ ] | |

### Puerta de Auditoría

| # | Item | Estado |
|---|------|--------|
| 1 | Mejoras de cobertura identificadas | [ ] |
| 2 | Riesgos de boundary identificados | [ ] |
| 3 | Todos los items de auditoría resueltos | [ ] |

### Resultado

- [ ] ✅ AVANZAR → Marcar spec como `@lista`
- [ ] ❌ NO-AVANZAR → Resolver issues pendientes
