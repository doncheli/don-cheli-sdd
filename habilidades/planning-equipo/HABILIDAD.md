---
nombre: Planning de Equipo Semanal
descripcion: "Facilitar plannings semanales: revisión de RFCs, priorización WSJF, asignación por responsable/pareja/squad, seguimiento de avance"
version: 1.0.0
autor: Don Cheli
tags: [planning, sprint, rfcs, priorización, equipo, asignación, WSJF, parejas, squads]
activacion: "planning semanal", "planificar sprint", "revisar RFCs", "asignar tareas", "priorizar backlog"
---

# Habilidad: Planning de Equipo Semanal

**Versión:** 1.0.0
**Categoría:** Gestión de Equipo
**Tipo:** Interactivo

## Propósito

Orquestar el planning semanal de un equipo de desarrollo de forma estructurada: desde la revisión de RFCs hasta la asignación de tareas con compromisos medibles.

## Capacidades

### 1. Cálculo de capacidad del equipo
Calcula la capacidad efectiva considerando:
- Días disponibles por persona (vacaciones, feriados, soporte)
- Factor de foco (meetings, interrupciones, on-call)
- Carry-over de la semana anterior

**Fórmula:**
```
Capacidad efectiva = Σ(días_disponibles_i) × factor_foco
```

Factores de foco recomendados:
| Tipo de equipo | Factor |
|----------------|--------|
| Pocas reuniones, sin on-call | 0.8 |
| Promedio | 0.7 |
| Mucho soporte/on-call | 0.5-0.6 |

### 2. Evaluación de RFCs
Cada RFC se evalúa en 5 dimensiones (1-5):

| Dimensión | Peso |
|-----------|------|
| Impacto de negocio | 1.5x |
| Urgencia | 1.3x |
| Reducción de riesgo/deuda | 1.0x |
| Riesgo técnico (inverso) | 0.8x |
| Tamaño (inverso) | 0.7x |

**Score compuesto:** `(impacto×1.5 + urgencia×1.3 + riesgo×1.0) / (tamaño×0.7 + riesgo_tecnico×0.8)`

### 3. Priorización WSJF
Weighted Shortest Job First: maximizar valor entregado por unidad de tiempo.

```
WSJF = (Valor_negocio + Time_criticality + Risk_reduction) / Job_size
```

Orden de ejecución:
1. **Bugs en producción** (siempre primero, sin WSJF)
2. **Carry-over** (completar WIP antes de empezar nuevo)
3. **WSJF descendente** (mayor score primero)

### 4. Asignación inteligente
Tres modalidades de asignación:

#### Individual
- Tareas bien definidas con un solo dominio
- Persona con expertise y disponibilidad
- Máximo 2 items activos por persona (regla WIP)

#### Pareja (Pair Programming)
- Tareas que cruzan dominios (backend + frontend)
- Mentoring: senior + junior obligatorio
- Conocimiento crítico que debe distribuirse (reducir bus factor)
- **Rotación:** las parejas DEBEN cambiar cada semana

#### Squad (3+ personas)
- Iniciativas que necesitan diseño + implementación + integración
- Lead designado + daily sync propio
- Timebox: máximo 1 semana, luego evaluar

### 5. Gestión de RFCs

#### Estados de un RFC
```
Draft → En revisión → Aprobado → En progreso → Completado
                    ↘ Rechazado
                    ↘ Postergado (con fecha de revisión)
```

#### Plantilla de RFC
```markdown
# RFC-XXX: Título

**Autor:** Nombre | **Fecha:** YYYY-MM-DD | **Estado:** Draft
**Reviewers:** Persona1, Persona2

## Problema
Qué problema resuelve y por qué es importante ahora.

## Propuesta
Solución propuesta con suficiente detalle para estimar.

## Alternativas consideradas
Al menos 1 alternativa y por qué fue descartada.

## Impacto
- Usuarios afectados: X
- Sistemas afectados: Y
- Riesgo de no hacerlo: Z

## Estimado preliminar
- Tamaño: S/M/L/XL
- Personas necesarias: N
- Dependencias: lista

## Decisión
(se completa después de la revisión en planning)
```

### 6. Seguimiento mid-week
Comparar plan vs realidad:
- Items completados vs comprometidos
- Capacidad utilizada vs planificada
- Bloqueos detectados
- Ajustes necesarios para el resto de la semana

### 7. Retrospectiva de planning
Después de 4 plannings acumulados, generar patrones:
- Precisión de estimaciones (estimado vs real)
- Items que se arrastran recurrentemente
- Distribución de carga por persona
- Parejas que mejor funcionan
- RFCs que se postergan sin razón clara

## Reglas de la habilidad

### No negociables
1. **Nunca 100% de capacidad** — siempre aplicar factor de foco
2. **WIP limit: 2** — nadie tiene más de 2 tareas activas
3. **Juniors en pareja** — siempre con un senior
4. **Carry-over de 3 semanas → decisión** — replantear, escalar, o cancelar
5. **Parejas rotan** — ningún par se repite 2 semanas seguidas

### Heurísticas
- Si un RFC no tiene reviewers asignados, no puede entrar al planning
- Si la capacidad < 50%, priorizar solo bugs y carry-over
- Si hay más de 3 items en carry-over, dedicar la primera mitad de la semana solo a cerrar WIP
- Si un RFC tiene score WSJF > 8 y tamaño > L, dividirlo antes de asignar

## Archivos generados

| Archivo | Contenido |
|---------|-----------|
| `.especdev/plannings/YYYY-WNN.md` | Planning semanal completo |
| `.especdev/plannings/_retrospectiva.md` | Patrones entre plannings |
| `.especdev/rfcs/RFC-XXX.md` | RFC individual |
| `.especdev/rfcs/_indice.md` | Índice de RFCs con estado |

## Integración

| Habilidad | Uso |
|-----------|-----|
| `estimacion` | Estimar RFCs antes del planning |
| `reflexion` | Retrospectiva post-sprint |
| `trazabilidad` | Vincular RFCs con PRs y specs |
| `orquestacion-autonoma` | Ejecutar tareas asignadas en bucle |
