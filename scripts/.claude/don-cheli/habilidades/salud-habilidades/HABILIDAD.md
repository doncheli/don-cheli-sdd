---
nombre: Salud de Habilidades
descripcion: Monitorear el rendimiento y uso de habilidades del framework
version: 1.0.0
autor: Don Cheli
tags: [observabilidad, optimizacion, telemetria]
---

# Salud de Habilidades

## Propósito

Trackear qué habilidades se usan, su tasa de éxito, consumo de tokens, y detectar instruction drift. Permite optimizar el framework basándose en datos reales.

## Métricas Trackeadas

| Métrica | Cómo se mide | Umbral |
|---------|--------------|--------|
| Success rate | Resultado exitoso / intentos totales | < 70% → review |
| Token consumption | Tokens por invocación (promedio) | > 20K → optimizar |
| Usage frequency | Invocaciones por sesión | 0 en 10 sesiones → considerar deprecar |
| Instruction drift | Desviación del comportamiento esperado | Cualquier desviación → queue |

## Implementación

### Registro de telemetría

Después de cada uso de habilidad, registrar en `.dc/metricas.json`:

```json
{
  "habilidad": "deteccion-stubs",
  "timestamp": "2026-03-22T14:30:00Z",
  "exito": true,
  "tokens_consumidos": 3200,
  "duracion_ms": 8500,
  "contexto": "implementar fase 3"
}
```

### Reporte de salud

```
📊 Salud de Habilidades — Últimas 10 sesiones

| Habilidad | Usos | Éxito | Tokens/uso | Estado |
|-----------|------|-------|------------|--------|
| deteccion-stubs | 12 | 92% | 3.2K | ✅ Saludable |
| optimizacion-tokens | 8 | 75% | 8.1K | ⚠️ Review (tokens altos) |
| brainstorming | 2 | 100% | 5.0K | ✅ Saludable |
| code-rag | 0 | — | — | 📉 Sin uso |

Recomendaciones:
- optimizacion-tokens: reducir contexto cargado (actualmente carga 3 archivos completos)
- code-rag: considerar activar automáticamente en /dc:minar-referencias
```

## Integración

- Se activa automáticamente si `metricas.habilitado: true` en config.yaml
- Los datos se guardan en `.dc/metricas.json`
- Se reporta con `/dc:diagnostico --habilidades` o `/dc:doctor`
- Las habilidades con < 70% success rate se agregan a `.dc/skill-review-queue.md`
