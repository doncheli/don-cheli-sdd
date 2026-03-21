---
description: Lanzar bucle autónomo para ejecutar historias del PRD
---

# /bucle

## Objetivo

Lanzar el bucle autónomo que ejecuta las historias de usuario una por una hasta completar o agotar iteraciones.

## Uso

```
/bucle [max_iteraciones]
```

- `max_iteraciones`: Número máximo de iteraciones (default: 10)

## Prerrequisitos

- Archivo `.especdev/sesion/prd.json` existente
- Al menos una historia con `pasa: false`

## Comportamiento

1. **Verificar** que prd.json existe
2. **Contar** historias restantes
3. **Lanzar** el script `bucle.sh`
4. **Para cada iteración:**
   - Seleccionar historia prioritaria no completada
   - Ejecutar en **contexto fresco** (aislado)
   - Verificar criterios de aceptación
   - Actualizar prd.json
   - Registrar en progreso.md
5. **Terminar** cuando:
   - Todas las historias pasan → `COMPLETO`
   - Máximo iteraciones alcanzado → fallo
   - Historia bloqueada 2 veces → saltar y continuar

## Output

```
=== Bucle Don Cheli Iniciado ===
Historias: 5 pendientes, 0 completadas
Máximo iteraciones: 10

--- Iteración 1/10 ---
Historia: HU-001 [P1] Estructura de archivos
Estado: PASÓ ✅

--- Iteración 2/10 ---
Historia: HU-002 [P2] Comando historias-generar
Estado: PASÓ ✅

...

=== COMPLETO ===
Las 5 historias pasaron en 5 iteraciones.
Ver progreso: .especdev/progreso.md
```

## Gestión de Errores

| Situación | Comportamiento |
|-----------|---------------|
| prd.json faltante | Error + sugerir /historias-generar |
| Sin historias pendientes | Mensaje "Nada que hacer" |
| Historia falla 1x | Reintentar en siguiente iteración |
| Historia falla 2x | Saltar + registrar |
| Máximo iteraciones | Salir con mensaje |

## Contexto Fresco

Cada historia se ejecuta en su propio contexto aislado. El agente NO acumula confusión de sesiones anteriores. Investigaciones muestran que las respuestas de LLM degradan notablemente en contextos largos. **Contexto fresco = agente más inteligente.**
