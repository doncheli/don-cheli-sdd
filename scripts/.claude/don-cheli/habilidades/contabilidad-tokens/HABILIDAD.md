# Habilidad: Contabilidad de Tokens

**Versión:** 1.0.0
**Categoría:** Observabilidad
**Tipo:** Flexible

> Adaptado de OpenAI Symphony §13.5 — Session Metrics and Token Accounting.

## Cómo Mejora el Framework

Sin contabilidad de tokens, se pierde visibilidad sobre:
- Cuánto cuesta cada feature
- Qué tareas consumen más recursos
- Dónde optimizar el uso de tokens
- Si se está rompiendo el presupuesto

## Métricas por Sesión

```json
{
  "sesion_id": "sess_20260321_163000",
  "tarea": "PROJ-42",
  "inicio": "2026-03-21T16:30:00",
  "fin": "2026-03-21T16:37:23",
  "duracion_segundos": 443,
  "tokens": {
    "input": 45230,
    "output": 12890,
    "total": 58120,
    "cache_hit": 8200
  },
  "turnos": 15,
  "reintentos": 0,
  "modelo": "sonnet",
  "costo_estimado_usd": 0.14,
  "archivos_modificados": 8,
  "lineas_agregadas": 234,
  "lineas_eliminadas": 45,
  "tests_ejecutados": 47,
  "tests_pasaron": 47
}
```

## Métricas Acumulativas

```markdown
# Dashboard de Tokens — Marzo 2026

## Totales del Mes
| Métrica | Valor |
|---------|-------|
| Sesiones | 34 |
| Tokens totales | 1,245,890 |
| Costo estimado | $3.42 |
| Tiempo total | 4h 12m |
| Features completadas | 8 |
| Bugs corregidos | 12 |

## Costo por Feature (Top 5)
| Feature | Tokens | Costo | Duración |
|---------|--------|-------|----------|
| OAuth login | 158,000 | $0.42 | 32m |
| Dashboard UI | 234,000 | $0.65 | 48m |
| Email service | 89,000 | $0.24 | 18m |
| DB migrations | 45,000 | $0.12 | 9m |
| API pagination | 67,000 | $0.18 | 14m |

## Eficiencia
- Costo promedio por feature: $0.43
- Costo promedio por bug: $0.08
- Ratio tokens/línea de código: 42
- Tasa de reintentos: 8%
```

## Alertas de Presupuesto

```yaml
# .especdev/config.yaml
tokens:
  presupuesto_diario: 500000
  presupuesto_mensual: 5000000
  alertar_al: 80  # % del presupuesto
  modelo_preferido_bajo_presupuesto: "haiku"
  pausar_al_exceder: false  # true = pausar, false = advertir
```

## Integración con Prueba de Trabajo

Cada `prueba-trabajo.md` incluye automáticamente la sección de tokens,
vinculando costo con resultado para análisis ROI.

## Archivo de Métricas

```
.especdev/metricas/
├── 2026-03/
│   ├── sesiones.jsonl      # Una línea JSON por sesión
│   ├── resumen-diario.md   # Generado automáticamente
│   └── resumen-mensual.md  # Generado al final del mes
```
