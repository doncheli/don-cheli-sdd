---
description: Mostrar el estado actual del proyecto Don Cheli
i18n: true
---

# /dc:estado

## Objetivo

Mostrar un resumen del estado actual del proyecto según los archivos de `.dc/`.

## Uso

```
/dc:estado
```

## Comportamiento

1. **Leer** `.dc/config.yaml` — nombre y tipo de proyecto
2. **Leer** `.dc/estado.md` — fase actual y progreso
3. **Leer** `.dc/plan.md` — fases restantes
4. **Generar** resumen visual

## Output

```
=== Estado del Proyecto ===

📋 Proyecto: api-pagos (servicio)
📍 Fase: 3/7 (Diseño)
📊 Progreso: 40%
🕐 Última actualización: 2026-03-21 15:30

Tareas pendientes: 5
Hallazgos: 3 registrados
Sesiones: 4 completadas

Velocidad:
- Sesiones completadas: 4
- Duración promedio: 2.5h
- Fases completadas: 2/7
- Tiempo restante estimado: ~15h

Próximo paso: Completar diseño de base de datos
```
