---
nombre: Detección de Stubs
descripcion: "Detectar código stub (TODO, placeholder, mock sin implementar) antes de marcar una tarea como completa"
version: 1.0.0
autor: Don Cheli
tags: [calidad, stubs, TODOs, placeholders, completitud]
activacion: "detectar stubs", "buscar TODOs", "código incompleto", "placeholders"
---

# Habilidad: Detección de Stubs (Código Placeholder)

**Versión:** 1.0.0
**Categoría:** Calidad
**Tipo:** Rígida

> Adaptado de Get Shit Done (gsd-build/get-shit-done) — Stub Detection Patterns.

## Cómo Mejora el Framework

Un problema frecuente del desarrollo asistido por IA: el agente genera código placeholder (stubs) y lo reporta como "implementado". Don Cheli tiene revisión de código, pero no un sistema específico para detectar stubs que pasan como código completo.

## El Problema

```
Agente: "✅ Implementé el servicio de pagos"
Código real:
  async processPayment(data) {
    // TODO: implement payment processing
    return { success: true };
  }
```

El agente "completó" la tarea, pero el código es un stub.

## Patrones de Detección

### Indicadores Universales

| Patrón | Ejemplo | Severidad |
|--------|---------|-----------|
| **TODO/FIXME/HACK** | `// TODO: implement this` | ❌ Crítico |
| **Return vacío o hardcoded** | `return {};`, `return true;`, `return []` | ❌ Crítico |
| **Throw no implementado** | `throw new Error('Not implemented')` | ❌ Crítico |
| **Console.log como lógica** | `console.log('called')` sin más lógica | ⚠️ Alto |
| **Valores hardcoded** | `return 42;`, `return "test"` | ⚠️ Alto |
| **Lorem ipsum** | `"Lorem ipsum dolor sit amet"` | ⚠️ Alto |
| **Pass/noop** | `pass` (Python), `{}` (cuerpo vacío) | ⚠️ Alto |
| **Placeholder de config** | `"your-api-key-here"`, `"xxx"`, `"changeme"` | ❌ Crítico |

### Patrones por Tipo de Artefacto

#### React/Frontend
```
❌ Componente que solo renderiza <div>placeholder</div>
❌ Handler onClick vacío: onClick={() => {}}
❌ Estilos inline con valores mágicos sin design token
❌ Imágenes placeholder sin src real
⚠️ Componente sin props tipados (any)
```

#### API/Backend
```
❌ Endpoint que retorna data mockeada/hardcoded
❌ Middleware que no hace nada (next() directo)
❌ Validación que acepta todo (return true)
❌ Error handler que traga excepciones silenciosamente
⚠️ Service con un solo método implementado de N declarados
```

#### Base de Datos
```
❌ Migración vacía (up/down sin operaciones)
❌ Seed con datos obviamente falsos ("test@test.com", "John Doe")
❌ Query que retorna SELECT * sin filtro ni paginación
⚠️ Índices declarados pero sin justificación de uso
```

#### Tests
```
❌ Test que siempre pasa: expect(true).toBe(true)
❌ Test sin assertions
❌ Test que solo verifica que no lanza error (sin verificar output)
⚠️ Test con un solo caso (falta edge cases)
```

### Verificación de Cableado (Wiring)

Detectar que los componentes están realmente conectados:

| Conexión | Verificación |
|----------|-------------|
| **Componente → API** | Componente hace fetch/call real, no datos hardcoded |
| **API → Base de Datos** | Endpoint ejecuta query real, no retorna mock |
| **Form → Handler** | Submit ejecuta lógica, no solo console.log |
| **Error → UI** | Errores se muestran al usuario, no solo se loggean |

## Cuándo Ejecutar

| Momento | Trigger |
|---------|---------|
| **Post-implementación** | Después de cada tarea GREEN en `/dc:implementar` |
| **Pre-revisión** | Antes de `/dc:revisar` |
| **Pre-merge** | Como parte de la Puerta 6 (Merge de Código) |

## Flujo de Detección

```
1. Escanear archivos modificados/creados
2. Aplicar patrones universales
3. Aplicar patrones por tipo de artefacto
4. Verificar cableado entre capas
5. Generar reporte

¿Stubs encontrados?
├── SÍ → ⛔ BLOQUEAR tarea como incompleta
│   └── Listar cada stub con ubicación y severidad
└── NO → ✅ Tarea genuinamente completa
```

## Reporte de Stubs

```markdown
## Detección de Stubs: CrearUsuario

Archivos escaneados: 8
Stubs detectados: 3

### ❌ Crítico

1. **src/services/email_service.py:15**
   Patrón: Return hardcoded
   ```python
   async def send_welcome_email(user):
       return True  # No envía email real
   ```
   Acción: Implementar envío con servicio de email

2. **src/controllers/usuario_controller.py:42**
   Patrón: TODO pendiente
   ```python
   # TODO: add rate limiting
   ```
   Acción: Implementar rate limiting o remover TODO si no aplica

### ⚠️ Alto

3. **tests/unit/test_email.py:8**
   Patrón: Test sin assertion real
   ```python
   def test_send_email():
       result = send_welcome_email(mock_user)
       assert result is not None  # No verifica comportamiento
   ```
   Acción: Verificar que el servicio de email fue llamado con los parámetros correctos

### Resultado: ❌ NO-AVANZAR (2 críticos, 1 alto)
```

## Integración con Pipeline

```
/dc:implementar (cada tarea GREEN)
  → [DETECCIÓN STUBS] ← automática
  → ¿Stubs encontrados?
     ├── SÍ → Tarea regresa a RED (implementar de verdad)
     └── NO → Tarea completa, siguiente tarea

/dc:revisar
  → [DETECCIÓN STUBS] ← segunda pasada
  → Reporte incluido en review
```

## Integración con Puertas de Calidad

Se integra como verificación en la **Puerta 6** (Merge de Código):

```
Puerta 6: Merge de Código
├── Tests verdes ✅
├── Lint limpio ✅
├── Type-check pasa ✅
├── Coverage ≥ 85% ✅
├── Sin diff no relacionado ✅
└── Sin stubs detectados ✅ ← NUEVA
```

## Excepciones

Hay casos legítimos donde un "stub" es intencional:

| Caso | Cómo marcar | Ejemplo |
|------|------------|---------|
| Feature flag deshabilitado | `// STUB:feature-flag:nombre-flag` | Funcionalidad para release futuro |
| Mock en test | No aplica (stubs en tests de mock son válidos) | `jest.fn()` |
| Interface/abstract | No aplica (declaraciones sin cuerpo son válidas) | `abstract class` |

Usar el comentario `// STUB:razón` para excluir de detección.

## Guardrails

- **Nunca** marcar una tarea como completa si tiene stubs críticos
- **Nunca** ignorar stubs silenciosamente — siempre reportar
- **Siempre** verificar cableado entre capas (no solo código individual)
- **Siempre** respetar excepciones marcadas con `// STUB:razón`
