---
description: Generar documento de traspaso estructurado para retomar en la próxima sesión
i18n: true
---

# /especdev:traspasar

## Objetivo

Generar un documento de traspaso estructurado que permite a la **siguiente sesión** (o agente) retomar exactamente donde se dejó. Diferente de `/especdev:cerrar-sesion` que es un checklist para ti — el traspaso es un documento escrito para **el siguiente lector**.

> Adaptado de `session-handoff` de Pro-Workflow.

## Uso

```
/especdev:traspasar
```

## Output

```markdown
# Traspaso de Sesión — 2026-03-21 16:45

## Estado
- **Branch:** feature/oauth-login
- **Commits esta sesión:** 3
- **Cambios sin commit:** 2 archivos
- **Tests:** ✅ pasando

## ✅ Completado
- Endpoint POST /api/auth/google
- Endpoint POST /api/auth/github
- 12 unit tests para ambos endpoints
- Middleware de validación de tokens OAuth

## 🔄 En Progreso
- Refresh token (src/services/auth/refresh.ts:23)
  → Falta implementar rotación de tokens
  → El test skeleton ya existe en tests/auth/refresh.test.ts

## ⬜ Pendiente
- [ ] Vincular OAuth a cuenta existente por email
- [ ] Revocar token al logout
- [ ] BLOQUEADO: Endpoint de callback necesita URL de producción

## 🧠 Decisiones Tomadas
- Elegido Strategy Pattern para providers (Google, GitHub)
  → Razón: extensible para Apple/Microsoft después
- Tokens JWT con 15min de vida + refresh de 7 días
  → Razón: balance seguridad/UX

## 📄 Archivos Tocados
- `src/services/auth/google.ts` — Provider de Google OAuth
- `src/services/auth/github.ts` — Provider de GitHub OAuth
- `src/middleware/oauth-validate.ts` — Validación de tokens
- `tests/auth/google.test.ts` — 6 tests
- `tests/auth/github.test.ts` — 6 tests

## ⚠️ Gotchas
- NextAuth v5 cambia la API: `getSession()` ahora es async
- El mock de Google no devuelve `refresh_token` en primer login

## ▶️ Comando de Retomar

> Continuar en branch `feature/oauth-login`. Implementar refresh token
> (src/services/auth/refresh.ts). El test skeleton ya está. Siguiente
> paso: implementar rotación de tokens en el endpoint POST /api/auth/refresh.
```

## Guardrails

- **Escribir para el lector** — No para ti
- **Incluir paths y líneas** — Ser específico
- **Comando de retomar copy-pasteable** — 1-2 oraciones de contexto
- **Solo hechos** — Describir cambios funcionalmente, no inferir motivación
