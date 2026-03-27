# Tareas TDD — jwt-auth-api
Generado por `/dc:breakdown` | Orden: RED → GREEN → REFACTOR

## Mapa de paralelismo

```
[T1] ──┐
       ├── paralelo (sin dependencias entre sí)
[T2] ──┘
       │
      [T3] ── secuencial (depende de T1 + T2)
       │
      [T4] ── secuencial (depende de T3)
       │
[T5] ──┐
       ├── paralelo (dependen de T4, independientes entre sí)
[T6] ──┘
```

---

## T1 — UserRepository: crear y buscar usuario
**Paralelo con T2**

- Test primero: `createUser` retorna usuario sin `password`; `findByEmail` retorna `null` si no existe
- Implementar: `repositories/user.repository.ts` con Kysely
- Cobertura esperada: creación, búsqueda existente, búsqueda inexistente

## T2 — Utilidades JWT: firmar y verificar token
**Paralelo con T1**

- Test primero: `signToken(payload)` retorna string JWT; `verifyToken(token)` retorna payload; token expirado lanza `TokenExpiredError`
- Implementar: `utils/jwt.ts` wrapeando jsonwebtoken
- Cobertura esperada: sign, verify válido, verify expirado, verify inválido

## T3 — AuthService: register
**Secuencial, requiere T1 + T2**

- Test primero: password se hashea con bcrypt; duplicado de email lanza `ConflictError`; retorna `{ token, user }` sin `password`
- Implementar: `services/auth.service.ts` método `register`
- Mock: `UserRepository`, `bcrypt`, `signToken`

## T4 — AuthService: login
**Secuencial, requiere T3**

- Test primero: credenciales correctas retornan `{ token, user }`; password incorrecto lanza `UnauthorizedError`; email inexistente lanza `UnauthorizedError` (mismo mensaje, sin enumerar usuarios)
- Implementar: `services/auth.service.ts` método `login`
- Nota: mismo mensaje de error para email y password inválidos (seguridad)

## T5 — Rutas POST /auth/register y POST /auth/login
**Paralelo con T6, requiere T4**

- Test primero: body inválido retorna 400 con errores zod; register exitoso retorna 201; login exitoso retorna 200; login fallido retorna 401
- Implementar: `routes/auth.routes.ts` con validación zod
- Usar supertest + mocks de AuthService

## T6 — Middleware `requireAuth` + ruta GET /auth/me
**Paralelo con T5, requiere T4**

- Test primero: sin header retorna 401 `"Token requerido"`; token expirado retorna 401 `"Token expirado"`; token válido llama `next()` e inyecta `req.user`; GET /auth/me retorna perfil sin `password`
- Implementar: `middleware/auth.middleware.ts` + ruta GET en `routes/auth.routes.ts`
