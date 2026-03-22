# Habilidad: Git Worktrees

**Versión:** 1.0.0
**Categoría:** Desarrollo
**Tipo:** Rígida

> Adaptado de [superpowers](https://github.com/obra/superpowers) — Desarrollo paralelo con workspaces aislados.

## Propósito

Usar git worktrees para desarrollo en paralelo sin conflictos de branch. Cada tarea trabaja en su propia copia del repo sin afectar a las demás.

## Cuándo Usar

- Múltiples features en paralelo
- PoC que no debe contaminar `main`
- Subagentes ejecutando tareas independientes
- Code review mientras se sigue desarrollando

## Comandos

```bash
# Crear worktree para una feature
git worktree add ../mi-proyecto-feature-auth feature/auth

# Crear worktree desde branch nuevo
git worktree add -b feature/payments ../mi-proyecto-payments main

# Listar worktrees activos
git worktree list

# Eliminar worktree terminado
git worktree remove ../mi-proyecto-feature-auth
```

## Convención de Nombres

```
../<proyecto>-<tipo>-<nombre>/
```

Ejemplos:
```
../mi-api-feature-auth/
../mi-api-poc-websockets/
../mi-api-fix-timeout/
```

## Flujo con Subagentes

```
Tarea A (independiente)  →  Worktree A  →  Subagente A
Tarea B (independiente)  →  Worktree B  →  Subagente B
Tarea C (independiente)  →  Worktree C  →  Subagente C
                                              ↓
                                      Merge secuencial
```

## Reglas

1. **Un worktree = un branch** — Nunca compartir branches entre worktrees
2. **Limpiar al terminar** — `git worktree remove` después de merge
3. **No worktrees anidados** — Siempre al mismo nivel que el repo principal
4. **Commit antes de eliminar** — Verificar que todo está mergeado
5. **Nombrar descriptivamente** — El nombre debe indicar qué se trabaja

## Integración con Don Cheli

- `/especdev:implementar` puede usar worktrees para tareas `[P]` (paralelas)
- `/especdev:poc` crea worktree automáticamente en `poc/<nombre>`
- Subagentes ejecutores reciben worktree aislado por defecto
