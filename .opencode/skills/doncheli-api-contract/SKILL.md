---
name: doncheli-api-contract
description: Design complete API contracts covering endpoints, auth, rate limiting, error handling, retries, circuit breaker and idempotency. Activate when user mentions "api contract", "api design", "endpoint", "webhook", "REST", "GraphQL", "OpenAPI", "design the API".
---

# Don Cheli: API Contract Designer

## Instructions

1. Identify the API style: REST, GraphQL, gRPC, Webhook, or mixed
2. For each resource/operation, define:
   - Method + path (REST) or operation name (GraphQL/gRPC)
   - Request schema: headers, path params, query params, body
   - Response schemas: success + all error cases
3. Design cross-cutting concerns:
   - **Auth**: mechanism (JWT, OAuth2, API Key, mTLS), scopes, token lifetime
   - **Rate limiting**: strategy (token bucket / leaky bucket), limits per tier, headers exposed
   - **Error handling**: standard error envelope, HTTP status mapping, error codes catalog
   - **Retries**: which operations are safe to retry, backoff strategy, max attempts
   - **Circuit breaker**: thresholds, half-open probe, fallback behavior
   - **Idempotency**: which operations require idempotency keys, TTL, conflict semantics
4. Define versioning strategy (URL path, header, or content negotiation)
5. Flag breaking vs. non-breaking changes policy

## Output Format

```
## API Contract: <service/feature name>

### Style & Version
- Protocol: REST / GraphQL / gRPC / Webhook
- Base URL: …
- Version: v1 (strategy: <path/header/content-negotiation>)

### Endpoints / Operations

#### <METHOD> <path>
**Purpose:** …
**Auth required:** yes/no — scope: …
**Request:**
```json
{
  "field": "type — description"
}
```
**Response 200:**
```json
{ … }
```
**Error responses:**
| Status | Code          | Meaning              |
|--------|---------------|----------------------|
| 400    | INVALID_INPUT | …                    |
| 409    | CONFLICT      | …                    |

**Idempotency:** required / not required — key: <header name>

---

### Cross-Cutting Concerns

**Auth:** …
**Rate Limiting:** X req/min per API key; headers: X-RateLimit-Remaining, X-RateLimit-Reset
**Retry Policy:** safe methods (GET, PUT, DELETE) — exponential backoff, max 3 attempts
**Circuit Breaker:** open at 50% error rate over 10s window; half-open probe after 30s
**Error Envelope:**
```json
{ "error": { "code": "…", "message": "…", "trace_id": "…" } }
```

### Breaking Change Policy
- Breaking: removing fields, changing types, removing endpoints → requires major version bump
- Non-breaking: adding optional fields, new endpoints → compatible within same version
```

## Quality Gate

- Every endpoint must have at least one documented error response
- Idempotency policy must be explicit (required or not required) for every mutating operation
- Auth scopes must be listed for every endpoint that requires authentication
- Rate limit headers must be named consistently across all endpoints

## Do not use this skill when

- The API already exists and the user wants to review it (use doncheli-review instead)
- The user only wants implementation, not contract design (use doncheli-implement instead)
