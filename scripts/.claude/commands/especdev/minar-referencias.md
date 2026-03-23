---
description: Buscar repos open-source relevantes como referencia antes de implementar
i18n: true
---

# /especdev:minar-referencias

## Objetivo

Buscar y evaluar repositorios open-source, snippets y patrones de referencia relevantes para la tarea actual. Reduce el "empezar de cero" proporcionando implementaciones probadas como guía.

> Adaptado de DeepCode (HKUDS/DeepCode) — Code Reference Mining Agent: "descubrir repositorios relevantes y construir knowledge graphs para informar la generación de código."

## Uso

```
/especdev:minar-referencias "webhook handler con verificación de firma"
/especdev:minar-referencias "rate limiter con sliding window"
/especdev:minar-referencias --stack node,typescript "auth con JWT refresh"
/especdev:minar-referencias --max 5 "graphql subscriptions"
```

## Por Qué Existe

| Sin Minar | Con Minar |
|-----------|-----------|
| Implementar desde cero | Partir de patrones probados |
| Descubrir anti-patrones tarde | Conocer pitfalls de antemano |
| Reinventar soluciones comunes | Reutilizar lo que funciona |
| Estimaciones imprecisas | Complejidad real visible |

## Comportamiento

### Paso 1: Análisis de la Query

```
Query: "webhook handler con verificación de firma"
├── Conceptos clave: webhook, handler, signature verification
├── Stack detectado: Node.js + TypeScript (de config.yaml)
├── Dominio: API integration, security
└── Complejidad estimada: Media
```

### Paso 2: Búsqueda Multi-Fuente

El comando busca en múltiples fuentes (según disponibilidad):

| Fuente | Método | Qué Busca |
|--------|--------|-----------|
| **GitHub** | API search / web search | Repos con implementaciones similares |
| **Proyecto actual** | Grep local | Código existente reutilizable |
| **CodeRAG** | Índice local | Patrones ya indexados |
| **Memoria** | Engram | Decisiones previas sobre el tema |

### Paso 3: Evaluación de Relevancia

Cada resultado se evalúa en 4 dimensiones:

| Dimensión | Peso | Criterio |
|-----------|------|----------|
| **Relevancia** | 40% | ¿Resuelve el mismo problema? |
| **Calidad** | 25% | Stars, mantenimiento, tests, docs |
| **Compatibilidad** | 20% | ¿Mismo stack/framework? |
| **Simplicidad** | 15% | ¿Es adoptable sin refactor mayor? |

Score = suma ponderada (0.0 - 1.0)

### Paso 4: Extracción de Patrones

De los top resultados, se extraen:

```
1. Patrón arquitectónico usado
2. Dependencias clave
3. Manejo de errores
4. Edge cases cubiertos
5. Snippet representativo (≤ 30 líneas)
```

## Output

```markdown
## Referencias Minadas: "webhook handler con verificación de firma"

Fecha: 2026-03-21 | Stack: Node.js + TypeScript | Resultados: 3

---

### 1. stripe/stripe-node — Webhook Verification (score: 0.91)
**Repo:** github.com/stripe/stripe-node
**Archivo:** src/Webhooks.ts
**Por qué es relevante:** Implementación de referencia de Stripe para verificar firmas HMAC-SHA256.

**Patrón:**
- Verificar firma antes de procesar
- Tolerancia de timestamp (5 min por defecto)
- Comparación timing-safe para prevenir timing attacks

**Snippet:**
```typescript
function verifySignature(payload: string, header: string, secret: string): boolean {
  const timestamp = extractTimestamp(header);
  const signature = extractSignature(header);

  if (Date.now() / 1000 - timestamp > TOLERANCE) {
    throw new WebhookSignatureError('Timestamp too old');
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

**Lecciones:**
- Usar `timingSafeEqual` (no `===`) para comparar firmas
- Validar timestamp para prevenir replay attacks
- Lanzar error específico (no genérico)

---

### 2. svix/svix-webhooks — Webhook Handler Pattern (score: 0.84)
**Repo:** github.com/svix/svix-webhooks
**Por qué es relevante:** SDK de webhooks con patrón de handler idempotente.

**Patrón:**
- Idempotency key en header
- Queue para procesamiento async
- Retry automático con backoff

**Lecciones:**
- Separar verificación de procesamiento
- Idempotencia es obligatoria para webhooks
- Responder 200 antes de procesar (async)

---

### 3. [Proyecto actual] src/utils/crypto.ts (score: 0.72)
**Archivo:** src/utils/crypto.ts:15-30
**Por qué es relevante:** Ya existe un helper de HMAC en el proyecto.

**Nota:** Reutilizar `createHmacSignature()` existente en vez de reimplementar.

---

## Resumen de Decisiones

| Decisión | Recomendación | Fuente |
|----------|--------------|--------|
| Verificación de firma | HMAC-SHA256 + timestamp | stripe/stripe-node |
| Comparación de firma | `timingSafeEqual` | stripe/stripe-node |
| Procesamiento | Async (queue) + responder 200 | svix/svix-webhooks |
| Helper de HMAC | Reutilizar existente | Proyecto actual |
| Idempotencia | Idempotency key en header | svix/svix-webhooks |

## Próximo Paso
→ `/especdev:especificar` usando estas referencias como base
→ O `/especdev:planificar-tecnico` para incorporar los patrones al blueprint
```

## Integración con Pipeline

```
/especdev:minar-referencias → referencias
  → /especdev:especificar → specs informadas
  → /especdev:planificar-tecnico → plan con patrones reales
  → CodeRAG → indexar patrones útiles para futuro

/especdev:minar-referencias → referencias
  → /especdev:estimar → estimados más precisos (complejidad real)
```

## Integración con CodeRAG

Los patrones encontrados se pueden indexar automáticamente:

```
¿Indexar los patrones encontrados en CodeRAG? (s/n)
> s
Indexados 3 patrones en .especdev/code-rag/patterns.json
```

## Almacenamiento

```
.especdev/referencias/
├── webhook-handler-2026-03-21.md    # Resultado de esta búsqueda
├── rate-limiter-2026-03-15.md       # Búsqueda anterior
└── _index.md                        # Índice de búsquedas
```

## Modelo Recomendado

| Paso | Modelo | Razón |
|------|--------|-------|
| Búsqueda | Haiku | Solo buscar y filtrar |
| Evaluación de relevancia | Haiku | Scoring simple |
| Extracción de patrones | Sonnet | Requiere comprensión de código |
| Resumen de decisiones | Haiku | Formateo |

## Guardrails

- **Nunca** copiar código con licencias incompatibles sin verificar
- **Nunca** incluir credenciales o tokens de repos de referencia
- **Siempre** priorizar código existente en el proyecto sobre externo
- **Siempre** indicar la fuente y licencia de cada referencia
- **Siempre** limitar snippets a ≤30 líneas (respetar fair use)
- **Máximo** 5 referencias por búsqueda (evitar analysis paralysis)
