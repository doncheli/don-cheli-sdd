---
description: Ritual de cierre de sesión con auditoría, calidad, aprendizajes y contexto para la próxima sesión
---

# /especdev:cerrar-sesion

## Objetivo

Ritual de fin de sesión que audita cambios, ejecuta checks de calidad, captura aprendizajes y produce un resumen para la próxima sesión. Evita el anti-patrón de cerrar el editor sin guardar contexto.

> Adaptado de `wrap-up` de Pro-Workflow (rohitg00/pro-workflow).

## Uso

```
/especdev:cerrar-sesion
```

## Checklist (obligatorio — no saltar pasos)

### 1. 📋 Auditoría de Cambios
- ¿Qué archivos se modificaron?
- ¿Hay cambios sin commit?
- ¿Quedaron TODOs en el código?
- ¿Hay archivos temporales que limpiar?

### 2. ✅ Check de Calidad
- Ejecutar lint
- Ejecutar typecheck
- Ejecutar tests
- ¿Todo pasa? ¿Hay warnings?

### 3. 🧠 Captura de Aprendizajes
- ¿Qué errores se cometieron?
- ¿Qué patrones funcionaron bien?
- Formatear como: `[APRENDER] Categoría: Regla`

### 4. 🔮 Contexto para Próxima Sesión
- ¿Cuál es la siguiente tarea lógica?
- ¿Hay bloqueantes?
- ¿Qué contexto preservar?

### 5. 📝 Resumen
- Un párrafo: qué se logró, estado actual, qué sigue

## Output

```markdown
# Cierre de Sesión — 2026-03-21 16:45

## Auditoría
- Archivos modificados: 8
- Commits: 3
- Sin commit: 2 archivos (src/auth.ts, tests/auth.test.ts)
- TODOs encontrados: 1 (src/auth.ts:45 — "TODO: handle refresh token")

## Calidad
- Lint: ✅ sin errors | ⚠️ 2 warnings
- TypeCheck: ✅ pasa
- Tests: ✅ 47/47
- Coverage: 87%

## Aprendizajes
- [APRENDER] Testing: Siempre mockear el servicio de email en tests de auth
- [APRENDER] Git: Hacer commits más pequeños — 3 archivos max

## Próxima Sesión
- Tarea: Implementar refresh token (TODO en auth.ts:45)
- Bloqueante: Ninguno
- Contexto: Branch feature/oauth, PR #23 abierto

## Resumen
Se completó el login con Google OAuth: 3 endpoints nuevos, 12 tests,
integración con NextAuth v5. Falta el refresh token (TODO en auth.ts:45).
PR #23 listo para review excepto por el refresh token.

---
🛑 ¿Cambios sin commit? Stash o commit antes de cerrar.
✅ ¿Listo para cerrar sesión?
```

## Si Tests Fallan

⚠️ **NO cerrar sesión con tests fallando.** Opciones:
1. Corregir antes de cerrar
2. Documentar el fallo en el handoff
3. Crear issue para el próximo que lo agarre
