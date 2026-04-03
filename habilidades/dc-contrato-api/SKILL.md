---
name: dc-contrato-api
description: Diseñar contratos de API, webhooks e integraciones con manejo de errores y reintentos. Usa cuando el usuario dice "contrato API", "API contract", "diseñar API", "webhook", "API design", "contrato de integración", "OpenAPI", "REST contract", "request/response spec". Define request/response schemas, error handling y retry policies.
i18n: true
---

## Objetivo
Diseñar contratos de API completos (REST o GraphQL), definir webhooks, planificar manejo de errores y reintentos para asegurar la resiliencia de integraciones con plataformas externas.
## Uso
```
/dc:contrato-api <descripción de la integración>
/dc:contrato-api --tipo rest "Integración con Stripe para pagos"
/dc:contrato-api --tipo graphql "API de catálogo de productos"
/dc:contrato-api --tipo webhook "Recibir eventos de Shopify"
```
## Diferencia con `/dc:planificar-tecnico`
| Aspecto | `planificar-tecnico` | `contrato-api` |
|---------|---------------------|----------------|
| **Alcance** | Blueprint completo de una feature | Solo el contrato de API/integración |
| **Profundidad** | Contrato básico (request/response) | Contrato completo (errores, reintentos, webhooks, idempotencia) |
| **Cuándo** | Después de spec | Cuando la integración es el foco principal |
## Output para API REST
```markdown
## Contrato API: Integración de Pagos con Stripe
#### Endpoints
#### POST /api/v1/pagos
**Propósito:** Crear un cobro
**Auth:** Bearer token (JWT)
**Rate limit:** 100 req/min por usuario
**Idempotencia:** Sí (header `Idempotency-Key`)
**Request:**
```json
{
  "monto": 5000,          // centavos, min: 100, max: 99999900
  "moneda": "USD",        // ISO 4217
  "cliente_id": "uuid",
  "metodo_pago_id": "pm_xxx",
  "descripcion": "Pedido #1234",
  "metadata": {}          // opcional, max 50 keys
}
```
**Responses:**
| Status | Significado | Body |
|--------|------------|------|
| 201 | Cobro creado | `{ id, status, monto, stripe_id, created_at }` |
| 400 | Datos inválidos | `{ error, field, message }` |
| 402 | Pago rechazado | `{ error, decline_code, message }` |
| 409 | Idempotency conflict | `{ error, original_id }` |
| 429 | Rate limit | `{ error, retry_after }` |
| 500 | Error interno | `{ error, request_id }` |
**Headers de respuesta:**
```
X-Request-Id: uuid          // Para soporte/debugging
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1616544000
```
#### Webhooks (recibir desde Stripe)
#### POST /api/v1/webhooks/stripe
**Verificación:** HMAC-SHA256 con `Stripe-Signature` header
**Tolerancia de timestamp:** 300 segundos (5 min)
**Respuesta esperada:** 200 OK (body vacío) en < 5s
**Eventos soportados:**
| Evento | Acción | Idempotente |
|--------|--------|-------------|
| `payment_intent.succeeded` | Marcar pedido como pagado | Sí |
| `payment_intent.payment_failed` | Notificar al usuario | Sí |
| `charge.refunded` | Procesar reembolso | Sí |
| `charge.dispute.created` | Alertar al equipo | Sí |
**Procesamiento:**
```
1. Verificar firma HMAC
2. Parsear evento
3. Verificar idempotencia (event.id en tabla processed_events)
4. Responder 200 INMEDIATAMENTE
5. Procesar en cola async (no bloquear respuesta)
6. Registrar en audit log
```
#### Manejo de Errores
**Errores del cliente (4xx):**
```json
{
  "error": {
    "tipo": "validation_error",
    "mensaje": "El monto debe ser mayor a $1.00",
    "campo": "monto",
    "codigo": "MONTO_INVALIDO"
  }
}
```
**Errores del servidor (5xx):**
```json
{
  "error": {
    "tipo": "internal_error",
    "mensaje": "Error procesando el pago",
    "request_id": "req_abc123"
  }
}
```
**Códigos de error consistentes:**
| Código | Significado | HTTP |
|--------|------------|------|
| `MONTO_INVALIDO` | Monto fuera de rango | 400 |
| `MONEDA_NO_SOPORTADA` | Moneda no en whitelist | 400 |
| `PAGO_RECHAZADO` | Tarjeta rechazada | 402 |
| `DUPLICADO` | Idempotency conflict | 409 |
| `RATE_LIMIT` | Demasiadas requests | 429 |
| `STRIPE_ERROR` | Error de comunicación con Stripe | 502 |
#### Política de Reintentos
```
Estrategia: Exponential backoff con jitter
Intento 1: inmediato
Intento 2: 1s + jitter (0-500ms)
Intento 3: 2s + jitter (0-1000ms)
Intento 4: 4s + jitter (0-2000ms)
Max intentos: 4
Reintentar en:
  ✅ 429 (rate limit) — respetar Retry-After header
  ✅ 500, 502, 503, 504 (errores transitorios)
  ❌ 400, 401, 402, 403, 404, 409 (errores definitivos)
Circuit breaker:
  - Abrir después de 5 fallos consecutivos
  - Half-open después de 30 segundos
  - Cerrar después de 2 éxitos consecutivos
```
#### Timeouts
| Operación | Timeout | Acción si timeout |
|-----------|---------|-------------------|
| Crear cobro | 10s | Reintentar (idempotente) |
| Verificar webhook | 2s | Rechazar (400) |
| Procesar evento async | 30s | Cola de dead-letter |
```
## Output para GraphQL
```markdown
#### Schema GraphQL
```graphql
type Mutation {
  crearPago(input: CrearPagoInput!): PagoResult!
  reembolsar(pagoId: ID!, monto: Int): ReembolsoResult!
}
type Query {
  pago(id: ID!): Pago
  pagos(filtro: PagoFiltro, paginacion: Paginacion): PagoConnection!
}
input CrearPagoInput {
  monto: Int!          # centavos
  moneda: Moneda!
  clienteId: ID!
  metodoPagoId: String!
  descripcion: String
}
type PagoResult {
  pago: Pago
  error: APIError
}
```
```
## Almacenamiento
```
specs/api/
├── openapi.yaml            # Spec completa (auto-generada)
├── contratos/
│   ├── pagos.contrato.md   # Contrato de pagos
│   ├── webhooks.contrato.md
│   └── catalogo.contrato.md
└── postman/
    └── coleccion.json      # Colección Postman exportada
```
## Integración con Pipeline
```
/dc:contrato-api → contrato + OpenAPI parcial
  → /dc:planificar-tecnico → incorpora contrato al plan
  → /dc:desglosar → tareas incluyen implementación del contrato
  → Documentación Viva → actualiza OpenAPI global
```
## Guardrails
- **Nunca** diseñar API sin definir manejo de errores
- **Nunca** omitir idempotencia en operaciones de escritura
- **Nunca** confiar en input externo sin validación
- **Siempre** definir timeouts y política de reintentos
- **Siempre** incluir `request_id` en respuestas de error
- **Siempre** verificar firma de webhooks antes de procesar
- **Siempre** responder rápido a webhooks (< 5s), procesar async
