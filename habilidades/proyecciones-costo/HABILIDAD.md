---
nombre: Proyecciones de Costo
descripcion: Estimar costo restante basándose en consumo real de tokens y slices completados
version: 1.0.0
autor: Don Cheli
tags: [costos, estimacion, tokens, observabilidad]
---

# Proyecciones de Costo

## Propósito

Después de completar 2+ slices o tareas, proyectar el costo total del proyecto basándose en el consumo real observado.

## Fórmula

```
costo_promedio_por_slice = tokens_consumidos_total / slices_completados
costo_restante_estimado = costo_promedio_por_slice × slices_pendientes
costo_total_proyectado = tokens_consumidos_total + costo_restante_estimado
```

## Factores de Ajuste

| Factor | Multiplicador | Cuándo |
|--------|---------------|--------|
| Slices iniciales (setup) | 0.7× | Los primeros 2 slices suelen ser más caros (setup) |
| Slices finales (polish) | 0.5× | Los últimos slices suelen ser más baratos |
| Re-work por review | 1.3× | Si el review detectó hallazgos que requieren cambios |
| Complejidad creciente | 1.2× | Si los slices restantes son de mayor complejidad |

## Dashboard

```
💰 Proyección de Costos — demo-sdd

Slices completados: 3/5
Tokens consumidos: 450K
Costo acumulado: ~$13.50 (@ $0.03/1K tokens)

Proyección:
  Optimista (0.7×): + $6.30  → Total $19.80
  Esperado  (1.0×): + $9.00  → Total $22.50
  Pesimista (1.3×): + $11.70 → Total $25.20

Budget máximo configurado: $30.00
Estado: ✅ Dentro del budget (75% usado)
```

## Integración

- Se calcula automáticamente al completar cada slice en `/dc:implementar`
- Se incluye en `/dc:cerrar-sesion`
- Si el costo proyectado excede el budget configurado, genera un `[checkpoint:decision]`
