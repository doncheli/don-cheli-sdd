---
description: Iniciar tarea con nivel de complejidad auto-detectado (0-4)
i18n: true
---

# /especdev:comenzar

## Objetivo

Iniciar una tarea detectando automáticamente el nivel de complejidad (0-4) y ejecutando el flujo apropiado.

## Uso

```
/especdev:comenzar <descripción de la tarea>
```

## Auto-Detección de Nivel

Evaluar cada dimensión de 0 a 4:

```
Alcance:     0=1 archivo  1=2-3 archivos  2=módulo  3=multi-módulo  4=sistema
Incógnitas:  0=ninguna    1=menores       2=algunas 3=significativas 4=fundamentales
Riesgo:      0=trivial    1=bajo          2=medio   3=alto           4=crítico
Duración:    0=<30min     1=horas         2=días    3=1-2 semanas    4=semanas+

Nivel = max(puntuaciones)  // Conservador: gana la dimensión más alta
```

## Niveles

| Nivel | Nombre | Proceso |
|-------|--------|---------|
| **0** | Atómico | Ejecutar directamente |
| **P** | PoC | Hipótesis → Construir → Evaluar → Veredicto |
| **1** | Micro | Planear → Ejecutar → Verificar |
| **2** | Estándar | 5 fases (sin Descubrimiento/Crecimiento) |
| **3** | Complejo | 7 fases completas |
| **4** | Producto | 7 fases + artefactos completos |

**Detección de PoC:** Si la tarea es una pregunta ("¿se puede...?", "¿funciona...?", "¿vale la pena...?") o incluye palabras como "probar", "viabilidad", "validar", "explorar opción" → sugerir `/especdev:poc`.

## Comportamiento

1. **Analizar** la descripción de la tarea
2. **Evaluar** las 4 dimensiones (alcance, incógnitas, riesgo, duración)
3. **Determinar** nivel de complejidad
4. **Mostrar** evaluación al usuario
5. **Preguntar** si está de acuerdo o desea ajustar
6. **Iniciar** flujo del nivel correspondiente

## Ejemplo

```bash
/especdev:comenzar Implementar autenticación JWT con refresh tokens

=== Evaluación de Complejidad ===

Tarea: Implementar autenticación JWT con refresh tokens

Alcance:    3 (multi-módulo: auth, middleware, database)
Incógnitas: 2 (algunas: estrategia de refresh)
Riesgo:     3 (alto: seguridad)
Duración:   2 (días)

→ Nivel detectado: 3 (Complejo)
→ Proceso: 7 fases completas

¿Proceder con Nivel 3? (s/n/ajustar)
```

## Escalamiento y Des-escalamiento

- Si durante la ejecución se detecta mayor complejidad → escalar nivel
- Si la complejidad resulta menor → des-escalar nivel
- Regla de Desviación 4 → escalar al menos 1 nivel
