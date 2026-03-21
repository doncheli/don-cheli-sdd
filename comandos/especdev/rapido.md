---
description: Modo rápido para tareas pequeñas y bien definidas (Nivel 1)
---

# /especdev:rapido

## Objetivo

Iniciar modo rápido (Nivel 1 - Micro) para tareas pequeñas y bien definidas.

## Uso

```
/especdev:rapido <descripción de la tarea>
```

## Cuándo Usar

- Tarea bien definida (inicio y fin claros)
- Solución conocida
- Alcance pequeño (1-3 tareas, < 1 día)
- Sin decisiones arquitectónicas
- Fácil de revertir

## Proceso (3 fases)

### Fase 1: Planear (5 min)

```markdown
## Tarea Rápida: [título]

**Meta:** [una línea]
**Enfoque:** [2-3 oraciones]
**Tareas:**
- [ ] Tarea 1
- [ ] Tarea 2
- [ ] Tarea 3

**Completado cuando:** [criterio de éxito]
```

### Fase 2: Ejecutar (trabajo principal)

1. Ejecutar tareas secuencialmente
2. Aplicar Leyes de Hierro (TDD, debugging, verificación)
3. Registrar progreso en `.especdev/progreso.md`

### Fase 3: Verificar (5 min)

```markdown
## Verificación
- [ ] Todas las tareas completadas
- [ ] Tests pasan
- [ ] Sin regresiones
- [ ] Código commitado
```

## Escalamiento Automático

Si se detecta complejidad → auto-escalar a `/especdev:completo`

```
¿Puedo resolver esto en < 5 min sin cambiar cómo las cosas trabajan juntas?
├── SÍ → Continuar en modo rápido
└── NO → ¿Necesita una decisión de diseño?
          ├── SÍ → Escalar a modo completo
          └── NO → Registrar y continuar
```
