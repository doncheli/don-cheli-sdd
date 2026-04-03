---
name: dc-destilar
description: Extraer especificaciones compactas desde código existente (Blueprint Distillation). Usa cuando el usuario dice "destilar", "extraer specs", "reverse specs", "code to specs", "distill", "existing code to Gherkin", "specification from code", "document existing code". Convierte código legacy en specs Gherkin compactas para enabling TDD en código existente.
i18n: true
---

## Objetivo
Analizar un codebase existente y extraer un **blueprint compacto**: especificaciones, contratos, reglas de negocio y decisiones arquitectónicas implícitas en el código. Es ingeniería inversa de specs, no de arquitectura (para eso existe `/dc:reversa`).
> Adaptado de DeepCode (HKUDS/DeepCode) — Blueprint Distillation: "comprimir código fuente para extraer especificaciones esenciales, filtrando ruido y preservando patrones críticos."
## Uso
```
/dc:destilar                             # Destilar el proyecto actual
/dc:destilar @ruta/al/modulo             # Destilar un módulo específico
/dc:destilar --formato gherkin           # Output en formato Gherkin
/dc:destilar --formato resumen           # Output como resumen ejecutivo
/dc:destilar --formato contratos         # Solo interfaces y contratos
```
## Por Qué Existe
| Situación | Sin Destilar | Con Destilar |
|-----------|-------------|--------------|
| Proyecto heredado sin docs | Leer todo el código | Blueprint de 200 líneas |
| Migración a nueva versión | Riesgo de perder reglas implícitas | Spec explícita para validar |
| Onboarding de nuevo dev | Semanas entendiendo el código | Blueprint + mapa en 1 hora |
| Rewrite parcial | ¿Qué comportamiento preservar? | Contratos explícitos |
## Diferencia con `/dc:reversa`
| Aspecto | `/dc:reversa` | `/dc:destilar` |
|---------|--------------------|--------------------|
| **Foco** | Arquitectura (componentes, conexiones) | Comportamiento (reglas, contratos) |
| **Output** | Mapa de componentes | Especificaciones compactas |
| **Pregunta** | "¿Cómo está construido?" | "¿Qué hace y por qué?" |
| **Formato** | Diagrama + tabla | Gherkin / contratos / resumen |
Se complementan: `reversa` te da el **mapa**, `destilar` te da las **reglas**.
## Comportamiento
#### Paso 1: Análisis de Superficie
```
Escaneando módulo src/services/payment/...
├── 8 archivos, 1,247 líneas de código
├── 23 funciones exportadas
├── 4 interfaces/tipos públicos
├── 12 tests encontrados
└── 3 dependencias externas (Stripe, Redis, Logger)
```
#### Paso 2: Extracción de Reglas de Negocio
El destilador busca reglas implícitas en:
| Fuente | Qué Extrae | Ejemplo |
|--------|-----------|---------|
| **Validaciones** | Reglas de dominio | "Monto mínimo: $1.00, máximo: $999,999" |
| **Condicionales** | Lógica de negocio | "Si el usuario es premium, no cobra comisión" |
| **Error handling** | Casos límite | "Reintentar 3 veces si Stripe devuelve 429" |
| **Tests** | Comportamiento esperado | "Webhook debe ser idempotente" |
| **Tipos/Interfaces** | Contratos | "PaymentIntent requiere: amount, currency, customerId" |
| **Comentarios** | Intención del dev original | "// HACK: Stripe no soporta ARS, convertir a USD" |
#### Paso 3: Compresión
Eliminar ruido, preservar esencia:
```
Código original: 1,247 líneas
├── Boilerplate eliminado: 400 líneas (imports, exports, logging)
├── Implementación interna eliminada: 500 líneas
├── Duplicación eliminada: 100 líneas
└── Blueprint resultante: ~247 líneas (ratio 5:1)
```
**Regla de compresión:** El blueprint debe ser ≤20% del código original.
#### Paso 4: Formato de Output
#### Formato Gherkin (default)
```gherkin
Feature: Procesamiento de Pagos
  El sistema procesa pagos a través de Stripe
  con reintentos automáticos y manejo de moneda.
  Reglas de Negocio:
  - Monto mínimo: $1.00 USD
  - Monto máximo: $999,999.00 USD
  - Monedas soportadas: USD, EUR, BRL
  - Usuarios premium: sin comisión de procesamiento
  - Comisión estándar: 2.9% + $0.30
  Escenario: Pago exitoso
    Dado un usuario con customerId válido en Stripe
    Y un monto de $50.00 USD
    Cuando se procesa el pago
    Entonces se crea un PaymentIntent en Stripe
    Y se registra la transacción en la base de datos
    Y se emite el evento "payment.completed"
  Escenario: Reintento por rate limit
    Dado que Stripe responde con HTTP 429
    Cuando se procesa el pago
    Entonces se reintenta hasta 3 veces con backoff exponencial
    Y si todos fallan, se marca como "payment.failed"
    Y se notifica al equipo de soporte
  Escenario: Moneda no soportada
    Dado un monto en ARS (peso argentino)
    Cuando se procesa el pago
    Entonces se convierte a USD usando el tipo de cambio del día
    Y se procesa en USD
    Y se registra el tipo de cambio usado
```
#### Formato Contratos
```typescript
// Blueprint: Contratos del Módulo de Pagos
// Extraído de: src/services/payment/ (8 archivos, 1,247 LOC)
// Fecha: 2026-03-21
interface PaymentIntent {
  amount: number;        // centavos, min: 100, max: 99999900
  currency: 'USD' | 'EUR' | 'BRL';
  customerId: string;    // Stripe customer ID
  metadata?: Record<string, string>;
}
interface PaymentResult {
  id: string;
  status: 'succeeded' | 'failed' | 'pending';
  stripePaymentIntentId: string;
  amount: number;
  fee: number;           // 0 para premium, 2.9% + 30 para estándar
  createdAt: Date;
}
// Contratos de servicio
type ProcessPayment = (intent: PaymentIntent) => Promise<PaymentResult>;
type RefundPayment = (paymentId: string, amount?: number) => Promise<RefundResult>;
type GetPaymentStatus = (paymentId: string) => Promise<PaymentResult>;
// Invariantes
// - ProcessPayment es idempotente (mismo intent = mismo resultado)
// - RefundPayment parcial: amount <= payment.amount
// - Retry policy: 3 intentos, backoff exponencial (1s, 2s, 4s)
```
#### Formato Resumen
```markdown
## Blueprint: Módulo de Pagos
#### Responsabilidad
Procesar pagos a través de Stripe con reintentos y conversión de moneda.
#### Reglas de Negocio
1. Montos: $1.00 - $999,999.00 USD
2. Monedas: USD, EUR, BRL (ARS se convierte a USD)
3. Comisión: 2.9% + $0.30 (premium: 0%)
4. Reintentos: 3x con backoff exponencial ante rate limit
5. Idempotencia: mismo PaymentIntent = mismo resultado
#### Dependencias Externas
- Stripe API v3 (pagos, reembolsos)
- Redis (cache de tipos de cambio, idempotency keys)
#### Riesgos Identificados
- Conversión ARS→USD usa hack manual (comentario en código)
- No hay circuit breaker para Stripe
- Tests no cubren reembolsos parciales
```
## Integración con Pipeline
```
/dc:destilar → blueprint
  → /dc:especificar → .feature (informada por blueprint)
  → /dc:clarificar → validar contra blueprint
  → /dc:planificar-tecnico → usar contratos como base
```
El blueprint alimenta el pipeline de specs, cerrando el ciclo:
**Código existente → Blueprint → Spec → Nuevo código validado**
## Almacenamiento
El blueprint se guarda en:
```
.dc/blueprints/
├── payment.blueprint.md      # Blueprint del módulo de pagos
├── auth.blueprint.md         # Blueprint del módulo de auth
└── _index.md                 # Índice de blueprints
```
## Guardrails
- **Nunca** incluir credenciales o secretos en el blueprint
- **Nunca** exceder 20% del tamaño del código original
- **Siempre** indicar qué archivos se analizaron
- **Siempre** marcar los "hacks" o workarounds encontrados como riesgos
- **Siempre** distinguir entre reglas de negocio confirmadas (por tests) y supuestas (por código)
