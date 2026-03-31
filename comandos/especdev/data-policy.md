---
description: Documentar qué datos toca el framework, qué sale a APIs externas y generar política de privacidad del proyecto
i18n: true
---

# /dc:data-policy

## Objetivo

Escanear el proyecto para identificar qué datos se procesan, qué fluye hacia proveedores externos (LLMs, APIs, telemetría) y qué se almacena localmente. Genera un documento `DATA-POLICY.md` con el mapa de flujo de datos y la política de privacidad del proyecto.

## Uso

```
/dc:data-policy                         # Escanear y generar política completa
/dc:data-policy --solo-escanear         # Solo mostrar hallazgos, sin generar doc
/dc:data-policy --formato privacy       # Generar PRIVACY.md (orientado a usuarios)
/dc:data-policy --formato data-policy   # Generar DATA-POLICY.md (técnico, default)
/dc:data-policy --actualizar            # Actualizar doc existente con nuevos hallazgos
```

## Comportamiento

```
1. ESCANEAR — Analizar código en busca de flujos de datos
   ├── Llamadas HTTP salientes (fetch, axios, requests, http.client)
   ├── Configuración de telemetría (Sentry, Datadog, Mixpanel, Segment)
   ├── Llamadas a LLM APIs (OpenAI, Anthropic, Cohere, etc.)
   ├── Almacenamiento de datos (DB, archivos, localStorage, cookies)
   ├── Variables de entorno que sugieren datos sensibles (API_KEY, TOKEN, SECRET)
   └── Campos PII en modelos (email, nombre, teléfono, dirección, IP)

2. CLASIFICAR — Categorizar cada flujo por destino y sensibilidad
   ├── LOCAL: datos que nunca salen del sistema
   ├── LLM_PROVIDER: código/specs enviados al proveedor de IA
   ├── THIRD_PARTY: otros servicios externos (pagos, analytics, email)
   └── STORAGE: qué se persiste y por cuánto tiempo

3. MAPEAR — Construir diagrama de flujo de datos (texto)

4. GENERAR — Producir documento de política
```

## Categorías de Escaneo

### Llamadas HTTP salientes
```
Patrones detectados:
  - fetch("https://...", ...)
  - axios.post / axios.get / axios.put
  - requests.get / requests.post (Python)
  - http.NewRequest (Go)
  - RestTemplate / WebClient (Java)
  → Clasificar por dominio destino
```

### Proveedores de LLM
```
Dominios monitoreados:
  - api.openai.com          → OpenAI
  - api.anthropic.com       → Anthropic / Claude
  - generativelanguage.googleapis.com → Google Gemini
  - api.cohere.ai           → Cohere
  - api.mistral.ai          → Mistral
  → Identificar qué datos se envían en el payload (prompts, código, specs)
```

### Telemetría y Analytics
```
SDKs detectados:
  - @sentry/*, sentry-sdk     → Sentry (error tracking)
  - dd-trace, datadog-lambda  → Datadog (APM)
  - mixpanel, posthog, segment → Analytics de producto
  - @vercel/analytics          → Vercel Analytics
  → Identificar eventos y propiedades enviadas
```

### Campos PII en modelos
```
Campos sospechosos:
  email, correo, mail
  nombre, name, first_name, last_name
  telefono, phone, mobile
  direccion, address, street
  fecha_nacimiento, birthdate, dob
  ip_address, user_agent
  credit_card, card_number, pan
  → Verificar que tienen cifrado en reposo y en tránsito
```

## Output — DATA-POLICY.md generado

```markdown
# Política de Datos: mi-proyecto
**Generado:** 2026-03-28 por Don Cheli /dc:data-policy
**Versión:** 1.0

---

## 1. Resumen Ejecutivo

Este documento describe qué datos procesa mi-proyecto, qué sale hacia
servicios externos, qué se almacena localmente y las garantías de privacidad.

---

## 2. Mapa de Flujo de Datos

```
Usuario → mi-proyecto → [LOCAL] PostgreSQL (usuarios, pedidos, pagos)
                      → [LLM_PROVIDER] api.anthropic.com
                          Datos enviados: código fuente, specs (NO datos de usuario)
                      → [THIRD_PARTY] api.stripe.com
                          Datos enviados: monto, moneda, customer_id (sin PAN)
                      → [THIRD_PARTY] sentry.io
                          Datos enviados: stack traces, user_id (anonimizado)
```

---

## 3. Datos que se quedan locales

| Dato | Almacén | Cifrado en reposo | Retención |
|------|---------|-------------------|-----------|
| Email de usuario | PostgreSQL | ✅ AES-256 | Hasta eliminación de cuenta |
| Hash de contraseña | PostgreSQL | ✅ argon2id | Indefinido |
| Historial de pedidos | PostgreSQL | ✅ | 5 años (legal) |
| Logs de aplicación | archivos locales | ❌ | 30 días |
| Sesiones de usuario | Redis | ✅ | Expiración: 24h |

---

## 4. Datos enviados al proveedor LLM (Anthropic)

**Propósito:** Asistencia de desarrollo (generación de specs, tests y código)

| Tipo de dato | ¿Se envía? | Notas |
|--------------|-----------|-------|
| Código fuente | ✅ Sí | Solo durante sesiones de desarrollo |
| Especificaciones Gherkin | ✅ Sí | Solo durante sesiones de desarrollo |
| Datos de usuarios del sistema | ❌ No | Nunca se incluyen en prompts |
| Credenciales / API keys | ❌ No | Filtradas antes del envío |

**Retención por Anthropic:** Ver https://www.anthropic.com/privacy

---

## 5. Datos enviados a terceros

### Stripe (procesador de pagos)
- **Qué:** monto, moneda, customer_id, payment_method_id
- **Qué NO:** número de tarjeta (procesado directamente por Stripe.js, nunca toca nuestro servidor)
- **Base legal:** Ejecución de contrato

### Sentry (monitoreo de errores)
- **Qué:** stack traces, tipo de excepción, user_id anonimizado, URL de request
- **Qué NO:** body de requests, tokens de sesión, datos de tarjeta
- **Anonimización:** user_id enviado como hash SHA-256
- **Retención:** 90 días en Sentry

---

## 6. Campos PII Identificados

| Campo | Modelo | Cifrado | Acceso |
|-------|--------|---------|--------|
| `email` | User | ✅ en reposo | Solo el propio usuario + admin |
| `phone` | User | ✅ en reposo | Solo el propio usuario |
| `ip_address` | RequestLog | ❌ | Solo admin |
| `address` | Order | ✅ en reposo | Solo el propio usuario + admin |

⚠️ **Atención:** `ip_address` en RequestLog no está cifrada. Considerar anonimizar o cifrar.

---

## 7. Hallazgos de Riesgo

| Severidad | Hallazgo | Recomendación |
|-----------|---------|---------------|
| 🟠 Alto | `ip_address` almacenada en texto plano | Cifrar o anonimizar (hash) |
| 🟡 Medio | Logs de aplicación sin cifrado | Agregar rotación + cifrado |
| 🔵 Bajo | Retención de logs: 30 días sin política formal | Documentar y automatizar borrado |

---

## 8. Controles Implementados

- ✅ HTTPS enforced en todos los endpoints
- ✅ Datos sensibles excluidos de logs (passwords, tokens)
- ✅ Stripe.js para captura de tarjeta (sin PCI scope)
- ✅ Consentimiento explícito antes de analytics
- ❌ GDPR: endpoint de exportación de datos no implementado
- ❌ GDPR: endpoint de eliminación de cuenta no implementado
```

## Almacenamiento

```
proyecto/
├── DATA-POLICY.md           # Política técnica (generada por este comando)
├── PRIVACY.md               # Política orientada a usuarios (con --formato privacy)
└── .especdev/
    └── data-policy-scan.json  # Resultados del escaneo en crudo (para diffs)
```

## Integración con Pipeline

```
/dc:auditar-seguridad → detectar vulnerabilidades de seguridad
  → /dc:data-policy → documentar flujos de datos
  → /dc:pr-review → verificar que PRs no introducen nuevos flujos no documentados
```

Ejecutar al inicio del proyecto y cada vez que se agrega una integración externa.

## Guardrails

- **Nunca** incluir valores reales de API keys o tokens en el documento generado
- **Nunca** asumir que un campo no es PII sin verificarlo contra definición GDPR/CCPA
- **Siempre** distinguir entre datos de usuarios del sistema y datos de desarrollo (código/specs)
- **Siempre** marcar como pendiente cualquier requisito GDPR no implementado
- **Siempre** actualizar el documento cuando se agrega una nueva integración externa
