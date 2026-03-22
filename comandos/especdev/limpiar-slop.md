---
description: Eliminar slop de código generado por IA antes de commits
i18n: true
---

# /especdev:limpiar-slop

## Objetivo

Detectar y eliminar **slop** — código innecesario, verbose, o sobre-ingenierizado que los modelos de IA generan frecuentemente. Se ejecuta sobre el diff del branch actual vs main.

> Adaptado de `deslop` de Pro-Workflow (rohitg00/pro-workflow).

## Uso

```
/especdev:limpiar-slop                    # Limpiar branch actual
/especdev:limpiar-slop --preview          # Solo mostrar, no editar
/especdev:limpiar-slop --archivo archivo  # Limpiar un solo archivo
```

## Qué es Slop

Código que la IA genera pero que un dev senior eliminaría:

| Patrón de Slop | Ejemplo | Corrección |
|----------------|---------|------------|
| **Comentarios obvios** | `// Get the user` antes de `getUser()` | Eliminar |
| **Try/catch defensivo** | Try/catch en código interno confiable | Eliminar si no es boundary |
| **Cast a `any`** | `(data as any).name` | Tipar correctamente |
| **Abstracciones prematuras** | Factory para un solo uso | Inlinear |
| **Nesting profundo** | 4+ niveles de if/else | Early returns |
| **Re-exports innecesarios** | `export { thing } from './thing'` solo para "limpiar" | Eliminar |
| **Scope creep** | Refactors no solicitados | Revertir |
| **Docstrings en código no tocado** | JSDoc nuevo en funciones existentes | Eliminar |
| **Error handling imposible** | Catch de errores que no pueden ocurrir | Eliminar |

## Comportamiento

1. **Obtener diff** contra main
2. **Escanear** los 9 patrones de slop
3. **Proponer** edits mínimos y focalizados
4. **Verificar** que el comportamiento no cambia (tests)
5. **Resumir** lo limpiado

## Output

```
=== Limpieza de Slop ===

Archivos escaneados: 8
Patrones encontrados: 12

🧹 Comentarios obvios: 5
  - src/services/auth.ts:24 — "// Authenticate the user"
  - src/services/auth.ts:38 — "// Return the token"
  - src/utils/format.ts:12 — "// Format the date"
  ...

🧹 Try/catch defensivo: 3
  - src/services/payment.ts:45 — try/catch en helper interno
  - src/db/queries.ts:23 — catch vacío
  ...

🧹 Abstracciones prematuras: 2
  - src/utils/createHandler.ts — Factory usado 1 sola vez
  - src/helpers/wrapResponse.ts — Wrapper innecesario
  ...

🧹 Scope creep: 2
  - src/middleware/cors.ts — Refactor no solicitado
  ...

Tests después de limpieza: ✅ 47/47 pasan
Líneas eliminadas: 34
Comportamiento: sin cambios

Resumen: Eliminados 5 comentarios obvios, 3 try/catch defensivos,
         2 abstracciones prematuras, y 2 cambios fuera de scope.
```

## Guardrails

- **NO cambiar comportamiento** — Solo eliminar ruido
- **Edits mínimos** — No reescribir, solo limpiar
- **3 líneas similares > abstracción prematura** — Duplicar es ok
- **Verificar antes de borrar** — Confirmar que no se usa
- **Ejecutar tests** — Si fallan, revertir
