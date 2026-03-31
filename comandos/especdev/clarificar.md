---
description: Detectar ambigüedades en una especificación, ejecutar Auto-QA y registrar respuestas
i18n: true
---

# /dc:clarificar

## Objetivo

Analizar una especificación Gherkin actuando como **Ingeniero QA Estricto**: detectar ambigüedades, ejecutar verificaciones automáticas de consistencia Schema↔Spec, y registrar las respuestas en el archivo `.feature`.

> Mejorado con el protocolo Auto-QA de Specular (constitution.md §VIII)

## Uso

```
/dc:clarificar @specs/features/<dominio>/<Feature>.feature
```

## Comportamiento

### Fase 1: Análisis de Ambigüedades (Original)

1. **Leer** el archivo `.feature`
2. **Analizar** cada escenario buscando:
   - Términos ambiguos o no definidos
   - Casos límite no cubiertos
   - Validaciones implícitas
   - Dependencias no mencionadas
3. **Formular** hasta 5 preguntas dirigidas
4. **Registrar** las respuestas en el archivo `.feature` como comentarios

### Fase 2: Verificación Auto-QA (De Specular)

Ejecutar automáticamente **SIN pedir instrucciones adicionales**:

#### 2.1 Verificación de Consistencia Schema-Spec (DBML)

- Escanear todos los campos mencionados en el Gherkin
- Comparar contra el schema DBML en `specs/db_schema/<dominio>.dbml`
- ❌ Error si nombres de campos no coinciden exactamente (ej: `user_id` vs `userId`)
- ❌ Error si un campo `NOT NULL` en DBML no tiene escenario de validación en Gherkin

#### 2.2 Verificación de Convención de Nombres

- **Feature COMMAND:** Usar patrón de precondición + postcondición
- **Feature QUERY:** Usar patrón de precondición + éxito

#### 2.3 Auditoría de Escenarios Auto-Generados

- Revisar escenarios tagueados `@auto_generado`
- Marcar los que sean redundantes o lógicamente imposibles

### Fase 3: Generar Checklist de Requisitos

Generar automáticamente `requisitos.md` con evidencia citada para cada item.

## Output

```markdown
=== Reporte Auto-QA ===

Feature: CrearUsuario.feature

## Ambigüedades Detectadas: 3
1. ¿Qué longitud mínima/máxima debe tener la contraseña?
2. ¿Se permite registro con proveedores OAuth (Google, GitHub)?
3. ¿El email de bienvenida es síncrono o asíncrono?

## Verificación Schema-Spec
✅ PASS: Campo "email" coincide con usuario.dbml
✅ PASS: Campo "password_hash" tiene escenario de validación
❌ FAIL: Campo "nombre" en DBML es NOT NULL pero no tiene escenario de validación

## Verificación de Convenciones
✅ PASS: Feature COMMAND usa patrón precondición/postcondición
⚠️ WARNING: Escenario "Contraseña débil" no verifica postcondición

## Auditoría Auto-Generado
✅ PASS: Sin escenarios redundantes

## Resultado
NO-AVANZAR (1 FAIL)
→ Acción requerida: Agregar escenario de validación para campo "nombre"
```

## Transición de Estado

```
@borrador → (clarificar pasa Auto-QA) → @lista
@borrador → (clarificar falla Auto-QA) → @borrador (corregir y re-clarificar)
```

## Puerta de Calidad Asociada

Esta comando implementa la **Puerta 2+3** del pipeline:
- Puerta 2: El header contiene `@lista` (solo si pasa)
- Puerta 3: Reporte Auto-QA sin ❌ FALLA
