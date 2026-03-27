# Blueprint Técnico — jwt-auth-api
Generado por `/dc:tech-plan` | 2026-03-11

## Decisiones de stack

| Componente | Elección | Razón |
|------------|----------|-------|
| Runtime | Node.js 20 LTS | Estabilidad y soporte activo |
| Framework | Express 4 | Mínimo overhead, bien conocido |
| Auth tokens | jsonwebtoken 9 | Estándar de facto para JWT en Node |
| Hash passwords | bcrypt 5 | Factor de coste ajustable, maduro |
| Validación | zod | Type-safe, sin decoradores |
| DB | SQLite (dev) / PostgreSQL (prod) | Portabilidad del ejemplo |
| ORM | Kysely | SQL explícito, tipo seguro |

## Arquitectura — 3 capas

```
POST /auth/register
        │
┌───────▼────────┐
│  routes/auth   │  Valida entrada con zod, delega
└───────┬────────┘
        │
┌───────▼────────┐
│ services/auth  │  Lógica de negocio, genera JWT
└───────┬────────┘
        │
┌───────▼──────────────┐
│ repositories/user    │  Acceso a DB, sin lógica
└──────────────────────┘
```

## Schema — tabla `users`

```dbml
Table users {
  id         uuid        [pk, default: `gen_random_uuid()`]
  name       varchar(100) [not null]
  email      varchar(255) [not null, unique]
  password   varchar(255) [not null, note: "bcrypt hash"]
  created_at timestamptz  [not null, default: `now()`]
}
```

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Crea usuario, retorna JWT |
| POST | `/auth/login` | No | Valida credenciales, retorna JWT |
| GET | `/auth/me` | Bearer JWT | Retorna perfil del usuario autenticado |

### Contrato de respuesta exitosa (register / login)

```json
{
  "token": "<jwt>",
  "user": { "id": "<uuid>", "name": "...", "email": "..." }
}
```

### Contrato de error

```json
{ "error": "<mensaje legible>" }
```

## Seguridad

- Passwords: bcrypt con `saltRounds = 12` en producción
- JWT: `HS256`, expiración 24h, secret en variable de entorno `JWT_SECRET`
- Headers: `helmet` activo en todos los endpoints
- Rate limiting: 10 req/min por IP en `/auth/login` y `/auth/register`
- Campos sensibles: `password` nunca se serializa en responses
