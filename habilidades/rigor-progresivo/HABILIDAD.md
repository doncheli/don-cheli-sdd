---
nombre: Rigor Progresivo
descripcion: "Ajustar automáticamente el nivel de rigor (tests, docs, review) según la complejidad de la tarea"
version: 1.0.0
autor: Don Cheli
tags: [specs, rigor, calidad, especificación]
activacion: "nivel de rigor", "cuánto testing", "qué tan estricto"
---

# Habilidad: Rigor Progresivo en Specs

**Versión:** 1.0.0
**Categoría:** Especificación
**Tipo:** Flexible

> Adaptado de OpenSpec — "Keep It Lightweight: Progressive Rigor"

## Cómo Mejora el Framework

No todos los cambios necesitan el mismo nivel de detalle en la spec. Un bugfix de una línea no necesita 3 páginas de especificación. Este concepto evita burocracia innecesaria.

## Dos Niveles de Rigor

### 📝 Spec Ligera (Default — la mayoría de cambios)

```markdown
# Spec: Corregir timeout en login

## Propósito
El login falla con timeout después de 30 segundos en conexiones lentas.

## Requisito
El sistema DEBE esperar hasta 60 segundos antes de timeout.

## Aceptación
- Login funciona en conexión de 3G
- No hay timeout antes de 60 segundos
- Se muestra spinner durante la espera
```

**Usar para:** Bugfixes, features pequeñas, refactors internos, mejoras de UI.

### 📋 Spec Completa (Para cambios de alto riesgo)

```markdown
# Spec: Migrar sistema de pagos a Stripe

## Propósito
Reemplazar el procesador de pagos actual por Stripe para soportar
pagos internacionales y suscripciones.

## Requisitos

### Requisito: Procesamiento de Pagos
El sistema DEBE procesar pagos via Stripe API v3.

#### Escenario: Pago exitoso
- DADO un usuario con tarjeta válida
- CUANDO confirma el pago de $50 USD
- ENTONCES se crea un PaymentIntent en Stripe
- Y el pedido cambia a estado "pagado"
- Y se envía receipt por email

#### Escenario: Tarjeta rechazada
- DADO un usuario con tarjeta expirada
- CUANDO intenta pagar
- ENTONCES recibe error "Tarjeta rechazada"
- Y el pedido permanece en "pendiente"
- Y NO se cobra nada

### Requisito: Suscripciones
El sistema DEBE soportar planes mensuales y anuales.

(... más requisitos detallados ...)

## No-Objetivos
- NO migrar pagos históricos
- NO soportar crypto en esta fase

## Restricciones
- PCI-DSS compliance obligatorio
- No almacenar datos de tarjeta en BD propia
```

**Usar para:** Cambios cross-equipo, APIs contractuales, migraciones, seguridad/privacidad, cambios donde la ambigüedad causa retrabajo costoso.

## Palabras Clave RFC 2119

En specs, usar keywords formales para comunicar intensidad:

| Keyword | Significado | Ejemplo |
|---------|------------|---------|
| **DEBE** (MUST/SHALL) | Requisito absoluto | "El sistema DEBE encriptar passwords" |
| **DEBERÍA** (SHOULD) | Recomendado, excepciones posibles | "El response DEBERÍA incluir paginación" |
| **PUEDE** (MAY) | Opcional | "El usuario PUEDE agregar avatar" |
| **NO DEBE** (MUST NOT) | Prohibición absoluta | "NO DEBE almacenar tokens en plain text" |

## Auto-Detección de Rigor

Don Cheli auto-detecta el rigor necesario:

| Indicador | Rigor |
|-----------|-------|
| Nivel 0-1 (Atómico/Micro) | 📝 Ligera |
| Nivel 2 (Estándar) | 📝 Ligera o 📋 Completa |
| Nivel 3-4 (Complejo/Producto) | 📋 Completa |
| Toca seguridad/pagos/auth | 📋 Completa siempre |
| Cambia API pública | 📋 Completa siempre |
| Refactor interno | 📝 Ligera |
