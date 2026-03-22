# Habilidad: Brainstorming Estructurado

**Versión:** 1.0.0
**Categoría:** Descubrimiento
**Tipo:** Flexible

> Adaptado de [superpowers](https://github.com/obra/superpowers) — Ideación visual con companion.

## Propósito

Sesión de ideación estructurada con descubrimiento visual. En vez de preguntas abstractas, se muestran opciones concretas para que el usuario elija.

## Principio

> "Show, don't tell" — Mostrar 3 opciones concretas en vez de hacer preguntas abiertas.

## Flujo (4 fases)

### Fase 1: Encuadre (2 min)

```
¿Qué problema resolvemos?
¿Para quién?
¿Qué restricciones existen?
```

### Fase 2: Divergencia (10 min)

Generar ideas sin filtrar:
- Mínimo 5 ideas por ronda
- Sin juicio ni evaluación
- Combinar ideas libremente
- Provocar con inversión ("¿qué pasa si hacemos lo contrario?")

### Fase 3: Convergencia (5 min)

Evaluar cada idea en 3 dimensiones:

| Dimensión | Pregunta |
|-----------|----------|
| **Viabilidad** | ¿Se puede construir con los recursos actuales? |
| **Impacto** | ¿Resuelve el problema central? |
| **Riesgo** | ¿Qué puede salir mal? |

### Fase 4: Decisión (3 min)

Presentar las top 3 ideas con:
- Nombre descriptivo
- 1 oración de resumen
- Pro/contra principal
- Siguiente paso concreto

## Output

```markdown
## Sesión de Brainstorming: [tema]
**Fecha:** YYYY-MM-DD
**Participantes:** [usuario + agentes]

### Problema
[definición]

### Ideas Generadas (N)
1. [idea] — viabilidad: alta/media/baja
2. ...

### Top 3 Seleccionadas
1. **[nombre]** — [resumen]. Pro: [x]. Contra: [y].

### Decisión
[idea elegida] → Siguiente paso: [acción]
```

## Guardrails

- Nunca evaluar durante divergencia
- Mínimo 5 ideas antes de converger
- Siempre cerrar con acción concreta
- Registrar en `.especdev/hallazgos.md`
