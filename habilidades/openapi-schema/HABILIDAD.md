---
name: openapi-schema
description: Complemento OPCIONAL — Auto-genera contratos OpenAPI y JSON Schema desde Gherkin y DBML. Gherkin sigue siendo la fuente de verdad principal. Solo se activa cuando se detectan endpoints HTTP en los escenarios.
version: 1.0.0
tags: [openapi, json-schema, spec, contract, api, validation]
grado_libertad: medio
---

# OpenAPI + JSON Schema — Complemento Opcional

## Qué hace

Complementa la fuente de verdad principal (**Gherkin**) con contratos derivados automáticamente:

1. **Gherkin** (.feature) — **FUENTE DE VERDAD PRINCIPAL** (siempre)
2. **OpenAPI** (openapi.yaml) — Contratos de API derivados del Gherkin (opcional, solo si hay endpoints HTTP)
3. **JSON Schema** (schemas/*.json) — Estructura de datos derivada del DBML (opcional)

> **Regla:** Gherkin es Rey. OpenAPI y JSON Schema se generan DESDE el Gherkin, nunca al revés. Si hay conflicto entre las fuentes, Gherkin siempre gana.

## Cómo funciona

```
/dc:especificar genera:
  ├── .dc/specs/auth.feature        ← Gherkin (comportamiento)
  ├── .dc/specs/openapi.yaml        ← OpenAPI 3.1 (contratos API)
  └── .dc/specs/schemas/
      ├── user.schema.json           ← JSON Schema (datos)
      └── auth-response.schema.json
```

### Auto-generación

Cuando `/dc:especificar` detecta endpoints HTTP en los escenarios Gherkin:

1. **Extrae endpoints** de los steps (POST /auth/login, GET /users/:id)
2. **Genera OpenAPI 3.1** con paths, methods, request/response bodies
3. **Genera JSON Schemas** desde el DBML existente o desde los escenarios
4. **Cross-valida:** cada endpoint en OpenAPI debe tener un escenario Gherkin que lo cubra

### Sincronización

Si el usuario modifica una fuente, las otras se mantienen sincronizadas:

- Nuevo escenario Gherkin con endpoint → agrega path a OpenAPI + schema
- Nuevo field en DBML → actualiza JSON Schema
- Drift entre fuentes → alerta en `/dc:drift`

## Output

```yaml
# .dc/specs/openapi.yaml (auto-generado)
openapi: "3.1.0"
info:
  title: Mi API
  version: "1.0.0"
paths:
  /auth/login:
    post:
      summary: Login con credenciales
      requestBody:
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/LoginRequest"
      responses:
        "200":
          description: Login exitoso
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthResponse"
        "401":
          description: Credenciales inválidas
components:
  schemas:
    LoginRequest:
      $ref: "./schemas/login-request.schema.json"
    AuthResponse:
      $ref: "./schemas/auth-response.schema.json"
```

## Integración con pipeline

- `/dc:especificar` → genera las 3 fuentes automáticamente
- `/dc:clarificar` → verifica consistencia entre las 3 fuentes
- `/dc:planificar-tecnico` → usa OpenAPI para generar blueprint de API
- `/dc:implementar` → valida código contra JSON Schemas
- `/dc:drift` → detecta desviaciones entre las 3 fuentes
