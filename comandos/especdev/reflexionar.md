---
description: Reflexionar sobre una tarea para mejorar calidad (+8-21%)
---

# /especdev:reflexionar

## Objetivo

Aplicar reflexión estructurada sobre una tarea completada para mejorar la calidad del output. La investigación muestra **+8-21% de mejora** en calidad de tareas.

## Uso

```
/especdev:reflexionar [tema]
```

## Las 4 Preguntas

1. **¿Qué funcionó bien?** → Identificar patrones exitosos
2. **¿Qué se puede mejorar?** → Encontrar brechas de calidad
3. **¿Qué aprendí?** → Extraer insights
4. **¿Qué haría diferente?** → Considerar alternativas

## Cuándo Reflexionar

| Disparador | Acción |
|-----------|--------|
| Tarea compleja completada | Siempre reflexionar |
| Usuario solicita revisión | Siempre reflexionar |
| "reflexionar" en el prompt | Auto-activado |
| Tarea mecánica simple | Omitir (costo > beneficio) |

## Ejemplo

```markdown
## Reflexión: Implementación de API

### Qué Funcionó Bien ✅
- Separación de responsabilidades limpia
- Buena cobertura de tests (87%)

### Qué Se Puede Mejorar 🔧
- Tiempo de respuesta en búsqueda (800ms → meta 200ms)
- Falta documentación de rate limiting

### Qué Aprendí 💡
- Índices de base de datos tienen 10x impacto en búsquedas
- Testing de rendimiento temprano previene sorpresas tardías

### Qué Haría Diferente 🔄
- Agregar benchmarks de rendimiento desde el día 1
```
