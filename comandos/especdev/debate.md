---
description: Deliberación multi-rol con tensiones explícitas para decisiones de arquitectura y trade-offs
i18n: true
---

# /especdev:debate

## Objetivo

Invocar una deliberación entre múltiples perspectivas en conflicto sobre una decisión técnica o de producto. Diferente de brainstorming (generar ideas) y de mesa-redonda (explorar opciones): el debate busca TENSIÓN entre roles para sacar a la luz riesgos que un solo agente no genera.

Inspirado en el "Party Mode" del framework BMAD.

## Uso

```
/especdev:debate "¿Monolito o microservicios para el MVP?"
/especdev:debate "¿PostgreSQL o MongoDB para este caso de uso?"
/especdev:debate --roles "PM,Arquitecto,QA,Seguridad"
```

## Comportamiento

1. **Definir** la pregunta y los roles participantes (default: PM, Arquitecto, QA)
2. **Cada rol presenta** su posición con argumentos concretos
3. **Cada rol critica** las posiciones de los demás (adversarial)
4. **Se identifican** los puntos de tensión irresolubles
5. **Se documenta** la decisión con trade-offs explícitos
6. **Se guarda** en `.especdev/decisiones.md`

## Roles Disponibles

| Rol | Perspectiva | Prioriza |
|-----|-------------|----------|
| **PM** | Producto y usuario | Time to market, UX, scope |
| **Arquitecto** | Sistema y escalabilidad | Mantenibilidad, performance, extensibilidad |
| **QA** | Calidad y testing | Testability, edge cases, regression |
| **Seguridad** | Protección y compliance | OWASP, datos sensibles, auth |
| **DevOps** | Operaciones y deploy | Observabilidad, CI/CD, costos infra |
| **DBA** | Datos y persistencia | Consistencia, queries, migraciones |

## Regla Adversarial

Cada rol DEBE encontrar al menos un problema con cada propuesta de los demás. "No tengo objeciones" no es una respuesta válida — obliga a buscar más profundo.

## Output

```markdown
## Debate: ¿Monolito o microservicios?

### PM dice: Monolito
- Más rápido de entregar el MVP
- Un solo deploy, menos complejidad operativa
- ⚠️ Riesgo: si el monolito crece mucho, el equipo se frena

### Arquitecto dice: Microservicios
- Mejor separación de concerns
- Cada servicio escala independiente
- ⚠️ Riesgo: over-engineering para un MVP con 1 developer

### QA dice: Monolito
- Más fácil de testear end-to-end
- Sin complejidad de contratos entre servicios
- ⚠️ Riesgo: tests lentos si el monolito crece

### Tensiones irresolubles
1. Velocidad (PM) vs Escalabilidad (Arquitecto)
2. Simplicidad (QA) vs Independencia de deploy (Arquitecto)

### Decisión: Monolito modular
Monolito con módulos bien separados internamente. Si un módulo necesita escalar, se extrae a servicio.

### Trade-offs aceptados
- ✅ Velocidad de MVP (PM satisfecho)
- ✅ Testability (QA satisfecho)
- ⚠️ Riesgo de acoplamiento si no se respetan boundaries (Arquitecto advierte)
```
