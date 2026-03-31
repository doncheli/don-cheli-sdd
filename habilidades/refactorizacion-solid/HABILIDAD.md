---
nombre: Refactorización SOLID
descripcion: "Guiar refactoring con principios SOLID: checklist de violaciones, métricas, patrones de diseño"
version: 1.0.0
autor: Don Cheli
tags: [calidad, SOLID, refactoring, clean-code, patrones]
activacion: "refactorizar SOLID", "principios SOLID", "code smells", "refactoring"
---

# Habilidad: Refactorización SOLID y Clean Code

**Versión:** 1.0.0
**Categoría:** Calidad
**Tipo:** Flexible

## Cómo Mejora el Framework

Don Cheli tiene la Constitución (Art. II: Precisión Quirúrgica, Art. III: Plug-and-Play) que define principios, pero no provee un proceso estructurado para refactorizar código existente aplicando patrones de diseño y principios SOLID.

## Cuándo Activar

- Al detectar code smells durante `/dc:revisar`
- Cuando un módulo supera umbrales de complejidad
- Antes de agregar funcionalidad a código legacy
- Cuando el usuario solicita refactorización explícitamente

## Los 5 Principios SOLID como Checklist

### S — Single Responsibility (Responsabilidad Única)

```
Verificar: ¿Tiene la clase/módulo una sola razón para cambiar?

Smells:
  ❌ Clase con > 200 líneas
  ❌ Más de 3 dependencias inyectadas
  ❌ Nombre genérico (Manager, Helper, Utils, Handler)
  ❌ Múltiples secciones con comentarios "// --- Sección X ---"

Fix: Extraer a clases/módulos especializados
  UserService → UserCreator + UserValidator + UserNotifier
```

### O — Open/Closed (Abierto/Cerrado)

```
Verificar: ¿Se puede extender sin modificar código existente?

Smells:
  ❌ Cadenas if/else o switch crecientes
  ❌ Modificar clase existente para cada nueva variante
  ❌ Parámetros booleanos que cambian comportamiento

Fix: Strategy pattern, Plugin pattern, Registry pattern
  if (type === 'credit') {...} else if (type === 'debit') {...}
  → paymentStrategies[type].process(data)
```

### L — Liskov Substitution (Sustitución de Liskov)

```
Verificar: ¿Las subclases pueden reemplazar a la clase padre sin romper nada?

Smells:
  ❌ Subclase que lanza NotImplementedError en método heredado
  ❌ instanceof checks en código que usa la abstracción
  ❌ Override que cambia la semántica del método padre

Fix: Rediseñar jerarquía, usar composición sobre herencia
  Square extends Rectangle (rompe Liskov)
  → Shape interface con área() independiente
```

### I — Interface Segregation (Segregación de Interfaces)

```
Verificar: ¿Las interfaces son específicas o fuerzan a implementar métodos innecesarios?

Smells:
  ❌ Interfaces con > 5 métodos
  ❌ Implementaciones con métodos vacíos o throw
  ❌ "God interface" que mezcla concerns

Fix: Dividir en interfaces específicas
  IUserService (create, read, update, delete, sendEmail, generateReport)
  → IUserCRUD + IUserNotification + IUserReporting
```

### D — Dependency Inversion (Inversión de Dependencias)

```
Verificar: ¿Los módulos de alto nivel dependen de abstracciones, no de implementaciones?

Smells:
  ❌ new ConcreteService() dentro de otra clase
  ❌ Import directo de implementación concreta
  ❌ Tests que requieren infraestructura real

Fix: Inyección de dependencias
  class AuthService { db = new PostgresDB() }
  → class AuthService { constructor(private db: IDatabase) }
```

## Patrones de Diseño — Cuándo Aplicar

| Patrón | Cuándo Usar | Ejemplo |
|--------|------------|---------|
| **Factory** | Creación de objetos con lógica condicional | `createPaymentProcessor(type)` |
| **Strategy** | Algoritmos intercambiables | Múltiples métodos de envío |
| **Observer** | Notificación de cambios sin acoplamiento | Eventos de dominio |
| **Adapter** | Integrar interfaces incompatibles | Wrapper para API externa |
| **Repository** | Abstraer acceso a datos | `UserRepository` interface |
| **Decorator** | Agregar comportamiento sin modificar | Logging, caching, retry |
| **Builder** | Construir objetos complejos paso a paso | Query builder, config builder |
| **Facade** | Simplificar subsistema complejo | `PaymentFacade` sobre Stripe+Tax+Invoice |

**Regla:** Aplicar un patrón solo cuando el smell existe. Nunca aplicar preventivamente.

## Proceso de Refactorización

```
1. IDENTIFICAR — Detectar smells con análisis estático
   └── Complejidad ciclomática, acoplamiento, cohesión

2. PLANIFICAR — Definir qué principio/patrón aplicar
   └── [REGLA 4: Si cambia arquitectura → PARAR Y PREGUNTAR]

3. PROTEGER — Asegurar que hay tests antes de refactorizar
   └── Si no hay tests → escribirlos primero (Ley de Hierro #1)

4. REFACTORIZAR — Aplicar cambio mínimo viable (Art. II Constitución)
   └── Un patrón a la vez, nunca varios simultáneos

5. VERIFICAR — Ejecutar tests, verificar que pasan
   └── Cero cambio de comportamiento (Ley de Hierro #3)
```

## Métricas de Código

| Métrica | Umbral Aceptable | Umbral Refactorizar |
|---------|------------------|---------------------|
| Complejidad ciclomática | ≤ 10 | > 15 |
| Líneas por función | ≤ 30 | > 50 |
| Líneas por archivo | ≤ 300 | > 500 |
| Profundidad de anidamiento | ≤ 3 | > 4 |
| Parámetros por función | ≤ 3 | > 5 |
| Dependencias por módulo | ≤ 5 | > 7 |

## Output del Análisis

```markdown
## Análisis de Refactorización: src/services/order_service.py

### Smells Detectados

| # | Smell | Principio | Severidad | Líneas |
|---|-------|-----------|-----------|--------|
| 1 | Clase de 450 líneas con 12 métodos | S (SRP) | ❌ Alto | 1-450 |
| 2 | Switch de 8 casos para tipo de pago | O (OCP) | ⚠️ Medio | 120-180 |
| 3 | `new StripeClient()` hardcoded | D (DIP) | ⚠️ Medio | 45 |

### Plan de Refactorización

1. **Extraer** validaciones → `OrderValidator` (SRP)
2. **Extraer** cálculos → `OrderCalculator` (SRP)
3. **Strategy** para tipos de pago → `PaymentStrategy` interface (OCP)
4. **Inyectar** StripeClient via constructor (DIP)

### Impacto Estimado
- Archivos afectados: 4 (crear 3 nuevos, modificar 1)
- Tests a actualizar: 6
- Riesgo: Bajo (cambio de estructura, no de comportamiento)
```

## Guardrails

- **Nunca** refactorizar sin tests existentes — escribirlos primero
- **Nunca** aplicar múltiples patrones en un solo PR
- **Nunca** refactorizar "de paso" junto a una feature (Art. II)
- **Siempre** verificar cero cambio de comportamiento post-refactor
- **Siempre** pedir confirmación si afecta > 5 archivos (Regla 4)
- **Siempre** justificar el patrón elegido vs alternativa más simple
