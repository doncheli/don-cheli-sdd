---
description: Planning semanal de equipo con revisión de RFCs, priorización, asignación por responsable/pareja/squad y seguimiento
i18n: true
---

# /dc:planning

## Objetivo

Facilitar el planning semanal de un equipo de desarrollo: revisar RFCs pendientes, priorizar trabajo, asignar tareas a responsables individuales, parejas o squads, y generar un plan accionable con compromisos claros.

A diferencia de `/dc:estimar` (esfuerzo por tarea) o `/dc:debate` (decisiones técnicas), el planning opera a **nivel de equipo y sprint**: qué se hace, quién lo hace, en qué orden, y qué se deja fuera.

## Uso

```
/dc:planning                                    # Planning completo (interactivo)
/dc:planning --semana "2026-03-24"              # Planning para semana específica
/dc:planning --equipo "Ana,Carlos,Luis,María"   # Definir equipo
/dc:planning --capacidad "Ana:4d,Carlos:3d"     # Capacidad por persona (días disponibles)
/dc:planning --rfcs "RFC-012,RFC-015,RFC-018"   # RFCs a revisar
/dc:planning --modo revision                    # Solo revisión de RFCs (sin asignación)
/dc:planning --modo asignacion                  # Solo asignación (RFCs ya priorizados)
/dc:planning --modo seguimiento                 # Revisar avance del planning anterior
```

## Proceso (4 Fases)

### Fase 1: Contexto del equipo

Recopilar información del equipo antes de planificar:

```markdown
## Contexto del equipo

### Miembros y disponibilidad
| Miembro | Rol | Disponibilidad | Notas |
|---------|-----|----------------|-------|
| Ana | Sr. Backend | 4/5 días | Lunes feriado |
| Carlos | Sr. Frontend | 5/5 días | — |
| Luis | Fullstack | 3/5 días | 2 días en soporte rotativo |
| María | Sr. Backend | 5/5 días | — |
| Diego | Jr. Frontend | 5/5 días | Necesita mentoring |

### Capacidad total del equipo
- Días disponibles: 22/25 (88%)
- Factor de foco (reuniones, interrupciones): 0.7
- **Capacidad efectiva: 15.4 días-persona**

### Arrastre de la semana anterior
- [ ] RFC-010: Migración de auth — 60% completado (María, bloqueo en revisión de seguridad)
- [x] RFC-011: Endpoint de reportes — completado
- [ ] BUG-234: Memory leak en worker — pendiente (Luis no tuvo disponibilidad)
```

### Fase 2: Revisión de RFCs

Evaluar cada RFC pendiente con criterios estructurados:

```markdown
## Revisión de RFCs

### RFC-012: Cache distribuido con Redis
- **Autor:** María | **Estado:** Aprobado | **Tamaño:** L
- **Dependencias:** Infra debe provisionar Redis cluster
- **Riesgo técnico:** Medio (equipo no tiene experiencia con Redis Cluster)
- **Impacto de negocio:** Alto (reduce latencia de catálogo de 800ms a 200ms)
- **Deuda técnica:** Baja (solución limpia, bien diseñada)
- **Veredicto:** ✅ Priorizar esta semana

### RFC-015: Migración de Styled Components a Tailwind
- **Autor:** Carlos | **Estado:** En discusión | **Tamaño:** XL
- **Dependencias:** Ninguna técnica, pero necesita buy-in del equipo de diseño
- **Riesgo técnico:** Bajo (migración incremental posible)
- **Impacto de negocio:** Bajo (mejora DX, no impacta usuario final)
- **Deuda técnica:** Media (reduce deuda futura pero introduce churn ahora)
- **Veredicto:** ⏸️ Postergar — no justifica el costo de oportunidad esta semana

### RFC-018: API de notificaciones push
- **Autor:** Ana | **Estado:** Aprobado | **Tamaño:** M
- **Dependencias:** RFC-012 (necesita Redis para pub/sub)
- **Riesgo técnico:** Bajo
- **Impacto de negocio:** Alto (feature pedido por 3 clientes enterprise)
- **Veredicto:** ✅ Priorizar después de RFC-012
```

### Fase 3: Priorización y asignación

Usar matriz de priorización y asignar por modalidad:

```markdown
## Priorización (Eisenhower + WSJF)

| # | Item | Urgente | Importante | WSJF Score | Decisión |
|---|------|---------|------------|------------|----------|
| 1 | BUG-234: Memory leak | ✅ | ✅ | — | **Primero** (producción) |
| 2 | RFC-010: Auth (arrastre) | ✅ | ✅ | 8.5 | **Completar** (WIP) |
| 3 | RFC-012: Redis cache | ❌ | ✅ | 7.2 | **Esta semana** |
| 4 | RFC-018: Push notifications | ❌ | ✅ | 6.8 | **Iniciar si hay capacidad** |
| 5 | RFC-015: Tailwind migration | ❌ | ❌ | 3.1 | **Backlog** |

### WSJF (Weighted Shortest Job First)
Score = (Valor de negocio + Urgencia + Reducción de riesgo) / Tamaño del trabajo
- Valor: 1-5 | Urgencia: 1-5 | Riesgo: 1-5 | Tamaño: 1-5 (Fibonacci: 1,2,3,5,8)

## Asignación

### Modalidad: Individual
Para tareas bien definidas donde una persona puede avanzar sola.

| Tarea | Responsable | Estimado | Entregable | Deadline |
|-------|-------------|----------|------------|----------|
| BUG-234: Memory leak | Luis | 1d | Fix + test + post-mortem | Lunes |
| RFC-010: Auth (completar) | María | 2d | PR listo para merge | Miércoles |

### Modalidad: Pareja (Pair Programming)
Para tareas que requieren conocimiento cruzado o mentoring.

| Tarea | Pareja | Razón | Estimado | Entregable |
|-------|--------|-------|----------|------------|
| RFC-012: Redis cache (setup) | María + Luis | María diseñó el RFC, Luis aprende Redis | 2d | Infra + tests de integración |
| RFC-012: Redis cache (frontend) | Carlos + Diego | Diego aprende patterns de caching en frontend, Carlos mentora | 1.5d | Cache invalidation UI + tests |

### Modalidad: Squad
Para iniciativas que necesitan esfuerzo coordinado multi-disciplina.

| Iniciativa | Squad | Roles | Estimado | Sync |
|------------|-------|-------|----------|------|
| RFC-018: Push notifications | Ana (lead) + Carlos + María | Ana: API, Carlos: UI, María: pub/sub | 3d | Daily 15min a las 10:00 |
```

### Fase 4: Plan semanal consolidado

```markdown
## Plan Semanal: 2026-03-24 → 2026-03-28

### Compromisos (lo que prometemos entregar)
1. ✅ BUG-234 resuelto en producción (Lunes)
2. ✅ RFC-010: Auth migración completada y mergeada (Miércoles)
3. ✅ RFC-012: Redis cache funcional en staging (Viernes)

### Stretch goals (si hay capacidad)
4. 🎯 RFC-018: Push notifications — diseño de API + spike de pub/sub

### Lo que NO hacemos esta semana (y por qué)
- RFC-015: Tailwind migration — WSJF bajo, sin urgencia de negocio
- TECH-089: Upgrade Node 22 — esperamos que el equipo de plataforma publique guía

### Riesgos y mitigaciones
| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Redis provisioning se demora | Media | Alto | María hace spike con Docker local primero |
| Luis no termina BUG-234 el lunes | Baja | Alto | Ana como backup (conoce el worker) |
| Revisión de seguridad de auth bloquea a María | Alta | Medio | Escalar a Tech Lead el martes si no hay review |

### Ceremonias
| Ceremonia | Día | Hora | Duración | Quién |
|-----------|-----|------|----------|-------|
| Planning (este documento) | Lunes | 09:00 | 45min | Todo el equipo |
| Daily standup | L-V | 09:30 | 15min | Todo el equipo |
| RFC-018 sync | M-J | 10:00 | 15min | Squad de push |
| Demo/Review | Viernes | 16:00 | 30min | Todo el equipo + PM |

### Métricas de la semana
- Capacidad utilizada: 15.4 / 15.4 días-persona (100%)
- Items comprometidos: 3
- Stretch: 1
- Carry-over anterior: 2 (BUG-234, RFC-010)
```

## Criterios de evaluación de RFCs

Al revisar un RFC, evaluar cada dimensión con 1-5:

| Dimensión | 1 (Bajo) | 5 (Alto) |
|-----------|----------|----------|
| **Impacto de negocio** | Nice-to-have interno | Bloquea revenue o cliente enterprise |
| **Riesgo técnico** | Tecnología conocida, patrón probado | Stack nuevo, sin experiencia en el equipo |
| **Tamaño** | < 1 día, 1-2 archivos | > 1 semana, cross-cutting |
| **Urgencia** | Sin deadline, puede esperar | SLA comprometido o dependencia bloqueante |
| **Deuda técnica** | Solución limpia | Workaround que acumula deuda |

## Reglas del Planning

### Regla de capacidad
**NUNCA planificar al 100% de capacidad.** Factor de foco:
- Equipo maduro con pocos meetings: **0.8**
- Equipo promedio: **0.7**
- Equipo con mucho soporte/on-call: **0.5-0.6**

### Regla de WIP
Máximo **2 items en progreso por persona**. Si alguien tiene 2 tareas activas, no se le asigna una tercera hasta que cierre una.

### Regla de arrastre
Si un item se arrastra **3 semanas consecutivas**, se debe tomar una decisión:
1. **Replantear**: dividir en partes más pequeñas
2. **Escalar**: pedir ayuda o más recursos
3. **Cancelar**: admitir que no es prioridad y sacarlo del backlog

### Regla de parejas
Las parejas DEBEN rotar cada semana. Objetivo: ningún conocimiento queda en una sola persona.

### Regla de juniors
Todo junior DEBE estar asignado en pareja con un senior. Nunca asignar tareas críticas a un junior solo.

## Almacenamiento

```
.especdev/
├── plannings/
│   ├── 2026-W13.md        # Planning semana 13
│   ├── 2026-W14.md        # Planning semana 14
│   └── _retrospectiva.md  # Patrones observados entre plannings
└── rfcs/
    ├── RFC-012.md          # RFC individual
    ├── RFC-015.md
    └── _indice.md          # Índice de todos los RFCs con estado
```

## Modos especiales

### `--modo revision`
Solo ejecuta Fases 1 y 2 (contexto + revisión de RFCs). Útil para sesiones de refinamiento mid-week.

### `--modo asignacion`
Solo ejecuta Fases 3 y 4 (priorización + plan). Asume que los RFCs ya fueron revisados.

### `--modo seguimiento`
Lee el planning de la semana actual (`.especdev/plannings/`) y genera reporte de avance:
```markdown
## Seguimiento: Semana 2026-W13 (Jueves)

### Avance
| Item | Estado | Progreso | Notas |
|------|--------|----------|-------|
| BUG-234 | ✅ Completado | 100% | Mergeado lunes, post-mortem hecho |
| RFC-010: Auth | 🟡 En progreso | 80% | Review de seguridad pendiente |
| RFC-012: Redis | 🟢 En progreso | 40% | Setup OK, tests de integración en progreso |
| RFC-018: Push | ⬜ No iniciado | 0% | Depende de RFC-012, se inicia viernes si hay tiempo |

### Alerta
- RFC-010 lleva 2 semanas de carry-over. Si no se completa esta semana → regla de arrastre.
- Capacidad real utilizada: 12/15.4 días (78%) — 2 días perdidos en incidente no planificado.
```

## Integración con otros comandos

| Comando | Cuándo usarlo junto con planning |
|---------|----------------------------------|
| `/dc:estimar` | Para estimar RFCs grandes antes del planning |
| `/dc:debate` | Para resolver desacuerdos técnicos sobre un RFC |
| `/dc:mesa-tecnica` | Para profundizar en la implementación de un RFC priorizado |
| `/dc:desglosar` | Para dividir un RFC priorizado en tareas TDD |
| `/dc:contrato-api` | Para definir interfaces antes de asignar a parejas/squads |

## Modelo recomendado

| Paso | Modelo | Razón |
|------|--------|-------|
| Contexto y capacidad | Haiku | Cálculos y formateo |
| Revisión de RFCs | Sonnet | Juicio técnico para evaluar riesgo/impacto |
| Priorización WSJF | Sonnet | Razonamiento sobre trade-offs |
| Asignación | Haiku | Matcheo persona-tarea según datos |
| Plan consolidado | Haiku | Formateo y consolidación |
