---
description: Deliberación multi-rol con tensiones explícitas para decisiones de arquitectura y trade-offs
i18n: true
---

# /dc:debate

## Objetivo

Invocar una deliberación entre múltiples perspectivas en conflicto sobre una decisión técnica, de producto o de negocio. Diferente de brainstorming (generar ideas) y de mesa-redonda (explorar opciones): el debate busca TENSIÓN entre roles senior para sacar a la luz riesgos que un solo agente no genera.

Inspirado en el "Party Mode" del framework BMAD.

## Uso

```
/dc:debate "¿Monolito o microservicios para el MVP?"
/dc:debate "¿PostgreSQL o MongoDB para este caso de uso?"
/dc:debate --roles "CPO,Arquitecto,UX,Negocio"
```

## Comportamiento

1. **Definir** la pregunta y los roles participantes (default: CPO, Arquitecto, UX)
2. **Cada rol presenta** su posición con argumentos concretos, datos y experiencia
3. **Cada rol critica** las posiciones de los demás (adversarial)
4. **Se identifican** los puntos de tensión irresolubles
5. **Se documenta** la decisión con trade-offs explícitos
6. **Se guarda** en `.especdev/decisiones.md`

## Roles Disponibles

### Roles de Negocio y Producto (Senior)

| Rol | Perspectiva | Prioriza |
|-----|-------------|----------|
| **CPO** (Chief Product Officer) | Visión de producto, estrategia y mercado | Product-market fit, roadmap, priorización basada en impacto, métricas de adopción |
| **UX Lead** | Experiencia de usuario y diseño | Usabilidad, accesibilidad (WCAG), research con usuarios, design systems, conversion funnels |
| **Negocio** (VP/Director) | Viabilidad comercial y estrategia | ROI, unit economics, time to revenue, ventaja competitiva, riesgos regulatorios |

### Roles Técnicos (Senior)

| Rol | Perspectiva | Prioriza |
|-----|-------------|----------|
| **Arquitecto** | Sistema y escalabilidad | Mantenibilidad, performance, extensibilidad, deuda técnica |
| **QA Lead** | Calidad y testing | Testability, edge cases, regression, automatización |
| **Seguridad** (CISO) | Protección y compliance | OWASP, datos sensibles, auth, regulaciones (GDPR, SOC2) |
| **DevOps** | Operaciones y deploy | Observabilidad, CI/CD, costos infra, SLAs |
| **DBA** | Datos y persistencia | Consistencia, queries, migraciones, backup/recovery |

### Presets de Roles

| Preset | Roles incluidos | Mejor para |
|--------|----------------|------------|
| `--preset tech` | Arquitecto, QA Lead, Seguridad, DevOps | Decisiones puramente técnicas |
| `--preset product` | CPO, UX Lead, Negocio | Decisiones de producto y estrategia |
| `--preset full` | CPO, UX Lead, Negocio, Arquitecto, QA Lead, Seguridad | Decisiones cross-funcionales |
| (default) | CPO, Arquitecto, UX Lead | Balance producto-técnico |

## Reglas de Engagement

### Regla Adversarial
Cada rol DEBE encontrar al menos un problema con cada propuesta de los demás. "No tengo objeciones" no es una respuesta válida — obliga a buscar más profundo.

### Regla de Evidencia
Cada argumento DEBE estar respaldado por al menos uno de:
- **Dato concreto**: métrica, benchmark, caso de estudio real
- **Experiencia**: patrón observado en proyectos similares con resultado conocido
- **Principio establecido**: ley, heurística o framework reconocido en la industria

Opiniones sin respaldo se marcan como `[sin evidencia]` y tienen menor peso en la decisión.

### Regla de Impacto
Cada rol DEBE cuantificar el impacto de su posición cuando sea posible:
- Negocio: revenue, costos, timeline
- Técnico: latencia, throughput, horas de desarrollo
- UX: tasa de conversión, NPS, task completion rate
- Producto: adoption rate, churn, time to value

## Output

```markdown
## Debate: ¿Monolito o microservicios?

### CPO dice: Monolito
- Time to market es 2-3x más rápido para MVP (dato: empresas en etapa seed con monolito lanzan en promedio 40% antes — Startup Genome Report)
- Un solo producto coherente para los primeros 1000 usuarios
- ⚠️ Riesgo: si product-market fit requiere pivotar rápido, un monolito acoplado frena los cambios

### Arquitecto dice: Monolito modular
- Shopify procesó $5.1B en Black Friday 2023 con un monolito Ruby — la escala no requiere microservicios
- Módulos bien definidos permiten extraer servicios después con datos reales de carga
- ⚠️ Riesgo: sin disciplina en boundaries, los módulos se acoplan y la extracción futura se vuelve rewrite

### UX Lead dice: Monolito
- UI consistente es más fácil con un solo codebase y design system centralizado
- Latencia percibida menor sin hops entre servicios (p95 < 200ms vs 400ms+ con microservicios)
- ⚠️ Riesgo: si el monolito crece, el frontend se acopla al backend y los cambios de UX requieren deploys full

### Negocio dice: Monolito con plan de migración
- Costo operativo de microservicios para un equipo < 10 personas: +$3-5K/mes en infra + 30% más tiempo en DevOps
- Inversores en Serie A quieren ver tracción, no arquitectura — priorizar velocidad
- ⚠️ Riesgo: si se escala sin plan, la deuda técnica se convierte en deuda financiera (caso: Segment revirtió microservicios a monolito en 2018)

### Tensiones irresolubles
1. Velocidad ahora (CPO/Negocio) vs Flexibilidad futura (Arquitecto)
2. Consistencia de UX (UX Lead) vs Independencia de deploy (Arquitecto)
3. Costo operativo (Negocio) vs Escalabilidad técnica (Arquitecto)

### Decisión: Monolito modular con boundaries explícitos
Monolito con módulos bien separados, contratos internos entre módulos, y métricas de acoplamiento. Revisión de arquitectura al llegar a 10K usuarios o 10 developers.

### Trade-offs aceptados
- ✅ Time to market agresivo (CPO + Negocio satisfechos)
- ✅ UX consistente (UX Lead satisfecho)
- ✅ Testability simple (QA satisfecho)
- ⚠️ Requiere disciplina de boundaries desde día 1 (Arquitecto advierte)
- ⚠️ Punto de revisión obligatorio al escalar (Negocio + Arquitecto acuerdan)
```
