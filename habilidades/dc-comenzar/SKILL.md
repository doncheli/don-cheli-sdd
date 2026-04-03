---
name: dc-comenzar
description: Iniciar tarea nueva SDD con complejidad auto-detectada (0-4). Usa cuando el usuario dice "quiero iniciar tarea", "empezar feature", "nueva historia", "comenzar desarrollo", "start a new task/feature/story", "iniciar un feature". Detecta si es tarea rápida (nivel 1), normal (nivel 2) o compleja (nivel 3-4) y adapta el flujo TDD. No usar para código existente.
i18n: true
---

## Objetivo
Iniciar una tarea detectando automáticamente el nivel de complejidad (0-4) y ejecutando el flujo apropiado.
## Uso
```
/dc:comenzar <descripción de la tarea>
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
**Detección de PoC:** Si la tarea es una pregunta ("¿se puede...?", "¿funciona...?", "¿vale la pena...?") o incluye palabras como "probar", "viabilidad", "validar", "explorar opción" → sugerir `/dc:poc`.
## Comportamiento
1. **Analizar** la descripción de la tarea
2. **Evaluar** las 4 dimensiones (alcance, incógnitas, riesgo, duración)
3. **Determinar** nivel de complejidad
4. **Mostrar** evaluación al usuario
5. **Preguntar** si está de acuerdo o desea ajustar
6. **Iniciar** flujo del nivel correspondiente
## Ejemplo
```bash
/dc:comenzar Implementar autenticación JWT con refresh tokens
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
## Heurística de Scale-Adaptive Planning
Inspirada en el framework BMAD: el nivel de planificación se ajusta automáticamente según la complejidad detectada.
| Nivel detectado | Fases que se ejecutan | Fases que se SALTAN |
|-----------------|----------------------|---------------------|
| **0 — Atómico** | implementar → verificar | spec, clarificar, planificar, desglosar |
| **1 — Micro** | especificar (light) → implementar → revisar | clarificar, planificar, desglosar, pseudocódigo |
| **P — PoC** | hipótesis → construir → evaluar → veredicto | todo el pipeline formal |
| **2 — Estándar** | especificar → clarificar → planificar → desglosar → implementar → revisar | pseudocódigo (opcional) |
| **3 — Complejo** | especificar → clarificar → pseudocódigo → planificar → diseñar → desglosar → implementar → revisar | nada se salta |
| **4 — Producto** | constitución → proponer → especificar → clarificar → pseudocódigo → planificar → diseñar → desglosar → implementar → revisar | nada se salta |
**Principio:** No aplicar el mismo proceso a un micro-fix que a una migración de plataforma. La fricción innecesaria es tan dañina como la falta de estructura.
#### Señales de detección automática
| Señal | Sube nivel | Baja nivel |
|-------|-----------|------------|
| Archivos afectados > 10 | +1 | |
| Archivos afectados ≤ 2 | | -1 |
| Cambio cruza módulos | +1 | |
| Solo 1 módulo | | -1 |
| Toca auth/pagos/seguridad | +1 | |
| Solo wording/config | | -1 |
| Dependencias externas nuevas | +1 | |
| Sin dependencias nuevas | | 0 |
