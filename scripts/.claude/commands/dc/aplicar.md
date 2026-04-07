---
description: Aplicar (implementar) tareas de un cambio específico
i18n: true
---

# /dc:aplicar

## Objetivo

Implementar las tareas de un cambio específico, con soporte para cambios paralelos y context switching.

> Adaptado de `/opsx:apply` de OpenSpec — implementación fluida con soporte multi-cambio.

## Uso

```
/dc:aplicar                     # Implementar el cambio activo
/dc:aplicar <nombre-cambio>     # Implementar un cambio específico
/dc:aplicar --continuar         # Retomar donde se dejó
```

## Diferencia con /dc:implementar

| `/dc:implementar` | `/dc:aplicar` |
|------------------------|---------------------|
| Trabaja con .tasks.md clásico | Trabaja con carpeta de cambio |
| Un cambio a la vez | Múltiples cambios en paralelo |
| Pipeline rígido | Flujo flexible |
| Sin context switching | Con context switching |

## Comportamiento

1. **Leer** `.dc/cambios/<nombre>/tareas.md`
2. **Detectar** progreso previo (si hay tareas ya completadas)
3. **Ejecutar** tareas pendientes una por una
4. **Ejecutar** stop hooks después de cada fase
5. **Marcar** tareas como completadas
6. **Reportar** progreso

## Output

```
=== Aplicando: agregar-dark-mode ===

Progreso: retomando desde tarea 3/8

✅ 1.1 Crear ThemeContext provider (ya hecho)
✅ 1.2 Crear hook useTheme (ya hecho)
✅ 2.1 Agregar CSS custom properties (ya hecho)
🔄 2.2 Crear componente ThemeToggle ← EN PROGRESO
   → Escribiendo tests...
   → Implementando componente...
   → Tests pasan ✅
⬜ 3.1 Integrar toggle en header
⬜ 3.2 Agregar localStorage persistence
⬜ 4.1 Dark mode para todas las páginas
⬜ 4.2 Transición suave entre temas

Progreso: 4/8 tareas completadas (50%)
```

## Context Switching

```bash
# Trabajando en dark mode...
/dc:aplicar agregar-dark-mode   # tarea 4/8

# Interrumpido por bug urgente
/dc:aplicar corregir-login      # empieza desde tarea 1/3

# Bug corregido, volver a dark mode
/dc:aplicar agregar-dark-mode   # retoma en tarea 5/8
```
