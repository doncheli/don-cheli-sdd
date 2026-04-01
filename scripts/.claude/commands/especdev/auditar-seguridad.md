---
description: Auditoría de seguridad estática del código (OWASP Top 10, SecDevOps)
i18n: true
---

# /dc:auditar-seguridad

## Objetivo

Realizar una auditoría de seguridad estática del código, identificando vulnerabilidades basadas en OWASP Top 10, exposición de datos sensibles, fallos de autenticación y problemas de configuración.

## Uso

```
/dc:auditar-seguridad                                # Auditar proyecto completo
/dc:auditar-seguridad @src/services/auth/            # Auditar módulo específico
/dc:auditar-seguridad --foco inyeccion               # Enfocarse en un tipo
/dc:auditar-seguridad --severidad critica            # Solo hallazgos críticos
```

## Categorías de Auditoría (OWASP Top 10 + extras)

### A01: Broken Access Control

```
Buscar:
  ❌ Endpoints sin middleware de autenticación
  ❌ Rutas admin accesibles sin verificar rol
  ❌ IDOR (acceso a recursos de otros usuarios via ID)
  ❌ Falta de rate limiting en endpoints sensibles
  ❌ CORS configurado como "*" en producción

Verificar:
  - Cada ruta tiene middleware de auth
  - IDs de usuario se validan contra sesión
  - Rate limiting en login, registro, reset-password
  - CORS whitelist explícita
```

### A02: Cryptographic Failures

```
Buscar:
  ❌ Passwords en plaintext o con hash débil (MD5, SHA1)
  ❌ Tokens/secretos hardcoded en código
  ❌ HTTP en vez de HTTPS para datos sensibles
  ❌ JWT sin expiración o con secret débil
  ❌ Datos sensibles en logs (passwords, tokens, PII)

Verificar:
  - Passwords con bcrypt/argon2id (cost factor ≥ 10)
  - Secretos en variables de entorno o secret manager
  - JWT con expiración razonable (≤ 1h access, ≤ 7d refresh)
  - Logs sanitizados (sin PII)
```

### A03: Injection

```
Buscar:
  ❌ SQL sin parametrizar (string concatenation)
  ❌ NoSQL injection (operadores en queries)
  ❌ Command injection (exec, spawn sin sanitizar)
  ❌ XSS (innerHTML, dangerouslySetInnerHTML sin sanitizar)
  ❌ Path traversal (../../../etc/passwd)
  ❌ LDAP injection, XML injection

Verificar:
  - Queries parametrizadas o ORM
  - Input sanitizado antes de exec/spawn
  - Output encodado en templates
  - Paths validados contra whitelist
```

### A04: Insecure Design

```
Buscar:
  ❌ Falta de validación en puntos de entrada
  ❌ Business logic bypassable
  ❌ Sin límites en operaciones costosas
  ❌ Datos sensibles en URL (query params)

Verificar:
  - Validación con Pydantic/Zod en cada endpoint
  - Reglas de negocio en service layer (no en controller)
  - Paginación y límites en queries
  - Datos sensibles solo en body/headers
```

### A05-A10: Otras Categorías

| Categoría | Qué Buscar |
|-----------|-----------|
| **A05: Security Misconfiguration** | Debug mode en prod, headers faltantes, default credentials |
| **A06: Vulnerable Components** | Dependencias con CVEs conocidos |
| **A07: Auth Failures** | Login sin brute-force protection, session fixation |
| **A08: Data Integrity** | Deserialización insegura, falta de checksums |
| **A09: Logging Failures** | Sin audit log para operaciones sensibles |
| **A10: SSRF** | Requests a URLs proporcionadas por usuario sin validar |

### Extra: Secretos y Configuración

```
Buscar:
  ❌ .env commitado en git
  ❌ API keys en código fuente
  ❌ Credenciales en docker-compose.yml
  ❌ Private keys en el repositorio
  ❌ Tokens en comentarios o TODOs

Verificar:
  - .env en .gitignore
  - .env.example sin valores reales
  - Secrets en variable de entorno o secret manager
  - git history limpio de secretos (git-secrets, truffleHog)
```

## Proceso de Auditoría

```
1. ESCANEAR — Análisis estático del código
   ├── Patrones de vulnerabilidad por categoría
   ├── Dependencias con vulnerabilidades conocidas
   └── Configuración de seguridad

2. CLASIFICAR — Severidad de cada hallazgo
   ├── 🔴 Crítico: Explotable remotamente, impacto alto
   ├── 🟠 Alto: Explotable con condiciones, impacto medio-alto
   ├── 🟡 Medio: Requiere acceso o condiciones específicas
   └── 🔵 Bajo: Mejora de seguridad, sin riesgo inmediato

3. REPORTAR — Generar reporte estructurado

4. PRIORIZAR — Recomendar orden de remediación
```

## Output

```markdown
## Auditoría de Seguridad: mi-proyecto

**Fecha:** 2026-03-21
**Alcance:** src/ (42 archivos, 3,200 LOC)
**Auditor:** Don Cheli Security Audit v1.0

### Resumen

| Severidad | Cantidad |
|-----------|----------|
| 🔴 Crítico | 1 |
| 🟠 Alto | 3 |
| 🟡 Medio | 2 |
| 🔵 Bajo | 4 |

### Hallazgos

#### 🔴 SEC-001: SQL Injection en búsqueda de productos
**Archivo:** src/services/product_service.py:45
**Categoría:** A03 (Injection)
**Descripción:** Query construida con f-string sin parametrizar.
```python
# Vulnerable
query = f"SELECT * FROM products WHERE name LIKE '%{search_term}%'"

# Fix recomendado
query = "SELECT * FROM products WHERE name LIKE %s"
cursor.execute(query, (f"%{search_term}%",))
```
**Impacto:** Acceso total a la base de datos.
**Remediación:** Usar query parametrizada o ORM.
**Esfuerzo:** 15 min

#### 🟠 SEC-002: JWT sin expiración
**Archivo:** src/utils/jwt.py:12
**Categoría:** A02 (Cryptographic Failures)
**Descripción:** Token se genera sin campo `exp`.
**Impacto:** Token válido indefinidamente si se filtra.
**Remediación:** Agregar `exp: now() + 1h` para access token.
**Esfuerzo:** 10 min

#### ... (más hallazgos)

### Verificaciones Pasadas ✅
- Passwords hasheados con bcrypt (cost 12) ✅
- CORS configurado con whitelist ✅
- .env en .gitignore ✅
- HTTPS enforced en producción ✅
- Rate limiting en /login ✅

### Recomendaciones de Remediación (por prioridad)
1. SEC-001: SQL Injection → INMEDIATO
2. SEC-002: JWT sin expiración → ANTES DE RELEASE
3. SEC-003: ... → PRÓXIMO SPRINT
```

## Almacenamiento

```
.dc/seguridad/
├── auditoria-2026-03-21.md    # Reporte de auditoría
└── _remediaciones.md           # Tracking de fixes
```

## Integración con Pipeline

```
/dc:auditar-seguridad → reporte
  → /dc:desglosar → tareas de remediación
  → /dc:implementar → fixes con TDD
  → /dc:auditar-seguridad → verificar fixes
```

Se recomienda ejecutar **antes de cada PR** que toque:
- Autenticación/autorización
- Manejo de datos de usuario
- Endpoints públicos
- Configuración de infraestructura

## Modelo Recomendado

| Paso | Modelo | Razón |
|------|--------|-------|
| Escaneo de patrones | Sonnet | Comprensión de código |
| Clasificación de severidad | Sonnet | Juicio técnico |
| Recomendaciones de fix | Sonnet | Código seguro |

## Guardrails

- **Nunca** exponer hallazgos de seguridad en documentación pública
- **Nunca** incluir exploits funcionales en el reporte (solo describir)
- **Siempre** priorizar hallazgos críticos para remediación inmediata
- **Siempre** verificar fixes con tests específicos de seguridad
- **Siempre** re-auditar después de remediar
