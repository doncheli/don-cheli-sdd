---
description: Generar estimados de desarrollo con múltiples modelos (Planning Poker IA, Puntos de Función, COCOMO, Histórico). Usa cuando el usuario dice "estimar", "planning poker", "story points", "esfuerzo", "cuánto tiempo", "estimate effort", "t-shirt sizes", "velocity". 3 agentes independientes estiman en paralelo con fórmula PERT.
i18n: true
---

# /dc:estimar

## Objetivo

Generar estimados de desarrollo profesionales usando múltiples modelos de estimación en paralelo, produciendo un rango optimista/esperado/pesimista con análisis de riesgos.

## Uso

```
/dc:estimar <prd.md | feature | tarea>
/dc:estimar --modelo <puntos-funcion|poker|cocomo|historico>
/dc:estimar --formato <resumen|detallado|ejecutivo>
```

## Modelos de Estimación

### 1. Puntos de Función

Evalúa la complejidad funcional de cada feature:

| Componente | Simple | Medio | Complejo |
|-----------|--------|-------|----------|
| Entrada externa | 3 PF | 4 PF | 6 PF |
| Salida externa | 4 PF | 5 PF | 7 PF |
| Consulta externa | 3 PF | 4 PF | 6 PF |
| Archivo lógico | 7 PF | 10 PF | 15 PF |
| Interfaz externa | 5 PF | 7 PF | 10 PF |

**Conversión:** PF total × Factor de productividad = Horas estimadas

### 2. Planning Poker IA

Tres "agentes" independientes estiman la misma tarea:

```
Agente Optimista: Asume el mejor escenario, experiencia previa
Agente Realista: Considera complejidad típica, imprevistos menores
Agente Pesimista: Incluye riesgos, curva de aprendizaje, dependencias

Estimado final = (Optimista + 4×Realista + Pesimista) / 6
```

### 3. COCOMO Simplificado

Basado en líneas de código estimadas:

```
Esfuerzo (personas-mes) = a × (KLOC)^b

Donde:
- KLOC = Miles de líneas de código estimadas
- a, b = Coeficientes según tipo de proyecto
  - Orgánico (simple): a=2.4, b=1.05
  - Semi-empotrado: a=3.0, b=1.12
  - Empotrado (complejo): a=3.6, b=1.20
```

### 4. Estimación Histórica

Compara con tareas similares completadas previamente:

```
1. Buscar en .dc/historial/ tareas similares
2. Comparar alcance, tecnología, complejidad
3. Ajustar por diferencias
4. Aplicar factor de confianza
```

## Comportamiento

1. **Leer** el input (PRD, feature o tarea)
2. **Desglosar** en componentes estimables
3. **Aplicar** los 4 modelos de estimación
4. **Calcular** consenso y rango
5. **Identificar** riesgos que afectan la estimación
6. **Generar** documento de estimado

## Output

Genera archivo `estimado-[fecha].md`:

```markdown
# Estimado de Desarrollo: [Nombre del Proyecto]

## Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Esfuerzo total** | 15-22 días/persona |
| **Complejidad** | Media-Alta |
| **Confianza** | 70% |
| **Modelo dominante** | Planning Poker IA |

## Desglose por Feature

| Feature | Optimista | Esperado | Pesimista | Riesgo |
|---------|-----------|----------|-----------|--------|
| Autenticación | 3d | 5d | 8d | Medio |
| API REST | 2d | 3d | 5d | Bajo |
| Interfaz UI | 5d | 8d | 12d | Alto |
| Base de datos | 1d | 2d | 3d | Bajo |

## Detalle por Modelo

### Puntos de Función: 18 días
### Planning Poker IA: 16 días (consenso)
### COCOMO: 20 días
### Histórico: N/A (sin datos previos)

## Riesgos que Afectan la Estimación

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| API externa | 40% | +3 días | Mockear temprano |
| Requisitos ambiguos | 30% | +2 días | Clarificar en Fase 1 |
| Curva aprendizaje | 20% | +2 días | Spike técnico |

## Supuestos Clave

- Desarrollador con experiencia en la tecnología
- Requisitos estables durante el desarrollo
- Infraestructura disponible
- Sin dependencias externas bloqueantes

## Recomendación

Usar estimado **esperado** (18 días) con buffer de 20% para imprevistos
→ **Total recomendado: 22 días/persona**
```

## Integración

- Se puede ejecutar en cualquier fase del proyecto
- Los estimados se guardan en `.dc/estimados/`
- El modelo histórico aprende de estimaciones previas vs. tiempo real
- Se puede re-estimar cuando cambia el alcance
