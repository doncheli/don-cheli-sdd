---
description: Generar blueprint técnico desde una especificación Gherkin
i18n: true
---

# /especdev:planificar-tecnico

## Objetivo

Generar un blueprint técnico (contratos API, modelos, arquitectura de servicios) desde una especificación Gherkin, incluyendo verificación de constitución y contexto técnico estructurado.

> Alineado con spec-kit (github/spec-kit) — Constitution Check, Technical Context y Complexity Tracking

## Uso

```
/especdev:planificar-tecnico @specs/features/<dominio>/<Feature>.feature
```

## Comportamiento

1. **Verificar Puerta 2** — El `.feature` debe tener tag `@lista` (pasó `/especdev:clarificar`)
2. **Verificar** que no hay marcadores `[NECESITA CLARIFICACIÓN]` pendientes
3. **Ejecutar Chequeo de Constitución** — Validar contra los principios de `reglas/constitucion.md`
4. **Documentar Contexto Técnico** — Stack, dependencias, restricciones
5. **Ratificar DBML** — Convertir campos `@provisional` a ratificados
6. **Generar** contratos API, modelos, arquitectura de servicios
7. **Registrar Complejidad** — Justificar desviaciones de simplicidad
8. **Crear** archivo `.plan.md` en `specs/features/<dominio>/`

## Output

Genera `specs/features/<dominio>/<Feature>.plan.md`:

```markdown
# Blueprint Técnico: CrearUsuario

**Rama:** feature/crear-usuario
**Spec:** specs/features/usuario/CrearUsuario.feature
**Fecha:** 2026-03-21
**Estado:** Borrador

---

## Resumen

Implementar registro de usuarios con email/contraseña, incluyendo
validación, hashing de contraseña y generación de JWT.
Enfoque técnico: API REST con patrón Controller → Service → Repository.

---

## Chequeo de Constitución

Verificación obligatoria contra `reglas/constitucion.md`:

| Artículo | Principio | Estado | Notas |
|----------|-----------|--------|-------|
| I | Gherkin es Rey | ✅ | Spec @lista aprobada |
| I-B | Schema como Verdad Viva | ✅ | DBML ratificado |
| II | Precisión Quirúrgica | ✅ | Cambio mínimo, 1 feature |
| III | Arquitectura Plug-and-Play | ✅ | Nuevo módulo, no infla existentes |
| IV | Regla Las Vegas | ✅ | Tests herméticos planificados |
| IV-B | Punto de Entrada | ✅ | Validación en Controller |
| V | Estándares Modernos | ✅ | Type hints + Pydantic/Zod |
| VI | Adaptabilidad | ✅ | Stack detectado: FastAPI |
| VII | Codificación Defensiva | ✅ | Excepciones custom planificadas |

**Resultado: ✅ PASA** — El plan es compatible con la constitución.

---

## Contexto Técnico

| Aspecto | Valor |
|---------|-------|
| **Lenguaje** | Python 3.12 / TypeScript 5.x |
| **Framework** | FastAPI 0.115 / Next.js 15 |
| **Dependencias** | bcryptjs, python-jose, pydantic |
| **Almacenamiento** | PostgreSQL 16 + Prisma/SQLAlchemy |
| **Testing** | pytest + pytest-asyncio / vitest |
| **Plataforma** | Docker + Linux |
| **Rendimiento** | < 500ms p95 (de criterios de éxito) |
| **Escala** | ~1,000 registros/día (estimado) |
| **Restricciones** | Sin OAuth en v1 (definido en clarificación) |

---

## Contrato API

POST /api/v1/usuarios
Content-Type: application/json

Request:
{
  "email": "string (required, email format)",
  "password": "string (required, min 8 chars)",
  "nombre": "string (required, max 100 chars)"
}

Response 201:
{
  "id": "uuid",
  "email": "string",
  "nombre": "string",
  "token": "jwt-string",
  "createdAt": "datetime"
}

Response 400:
{
  "error": "string",
  "field": "string (optional)"
}

Response 409:
{
  "error": "El email ya está registrado"
}

---

## Modelo de Datos

Usuario (ratificado desde DBML):
  - id: UUID (PK, auto-gen)
  - email: String (unique, indexed, NOT NULL)
  - password_hash: String (NOT NULL)
  - nombre: String (max 100, NOT NULL)
  - created_at: DateTime (default: now())

---

## Arquitectura de Servicios

Controller → Service → Repository → Database
                 ↓
           EmailService (async)

---

## Dependencias

- bcryptjs (hash de contraseña)
- python-jose / jsonwebtoken (generación JWT)
- pydantic / zod (validación de DTOs)

---

## Tracking de Complejidad

Justificar cualquier decisión que añade complejidad por encima de la alternativa más simple:

| Decisión | Alternativa Simple | Por Qué Se Rechazó |
|----------|--------------------|---------------------|
| JWT con refresh token | Solo JWT simple | Requerimiento de seguridad: tokens de corta duración |
| Email async con cola | Email síncrono | Bloquea respuesta al usuario, riesgo de timeout |
| Repository pattern | Queries directas | Testabilidad: inyección de dependencias para mocks |

Si la tabla está vacía, no hay desviaciones de simplicidad.
```

## Secciones Obligatorias del Plan

| Sección | Propósito | Falla si falta |
|---------|-----------|----------------|
| **Resumen** | Qué y cómo en 2-3 líneas | Sí |
| **Chequeo de Constitución** | Validar contra principios | Sí |
| **Contexto Técnico** | Stack y restricciones | Sí |
| **Contrato API** | Interfaces públicas | Sí (si hay API) |
| **Modelo de Datos** | Entidades y relaciones | Sí (si hay datos) |
| **Arquitectura** | Componentes y flujo | Sí |
| **Dependencias** | Librerías externas | Sí |
| **Tracking de Complejidad** | Justificar desviaciones | Sí (puede estar vacía) |

## Puerta de Calidad

Este comando implementa la **Puerta 4 (Aprobación de Plan)**:

- Chequeo de constitución pasa (todos ✅)
- Sin `[NECESITA CLARIFICACIÓN]` pendiente
- Contexto técnico completo
- DBML ratificado (sin campos `@provisional`)
- Tracking de complejidad documentado

Si algún artículo de la constitución no pasa → **NO-AVANZAR** hasta resolver.
