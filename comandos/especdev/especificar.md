---
description: Crear especificación Gherkin desde un requerimiento con schema DBML auto-generado
i18n: true
---

# /especdev:especificar

## Objetivo

Convertir un requerimiento en lenguaje natural a una especificación Gherkin estructurada (`.feature`), incluyendo auto-generación de schema DBML provisional si no existe.

> Mejorado con el ciclo de vida DBML de Specular (constitution.md §I-B)
> Alineado con spec-kit (github/spec-kit) — prioridades P1/P2/P3+, criterios de éxito y marcadores de clarificación

## Uso

```
/especdev:especificar Tipo: <COMANDO|CONSULTA|EVENTO> Feature: <dominio/Nombre> Dominio: <dominio> Requerimiento: <descripción> Contexto: @<archivo-referencia>
```

## Comportamiento

1. **Verificar** si existe `specs/db_schema/<dominio>.dbml`
   - Si **NO existe** → Auto-generar DBML `@provisional` con campos inferidos del requerimiento
   - Si **existe y está ratificado** → Usar como referencia, agregar nuevos campos como `@provisional`
2. **Analizar** el requerimiento proporcionado
3. **Identificar** actores, acciones y resultados esperados
4. **Categorizar** escenarios por prioridad (P1/P2/P3+)
5. **Generar** escenarios Gherkin con Dado/Cuando/Entonces
6. **Usar** los nombres de campo EXACTOS del DBML en los escenarios
7. **Marcar** requisitos ambiguos con `[NECESITA CLARIFICACIÓN]`
8. **Definir** criterios de éxito medibles y agnósticos de tecnología
9. **Crear** archivo `.feature` en `specs/features/<dominio>/` con tag `@borrador`
10. **Incluir** edge cases y escenarios de error
11. **Generar** checklist de requisitos vacía (`requisitos.md`)

## Output

### Schema DBML (auto-generado si no existe)

```dbml
// specs/db_schema/usuario.dbml
// @provisional — Auto-generado por /especdev:especificar

Table usuario @provisional {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  nombre varchar(100) [not null]
  created_at timestamp [not null, default: `now()`]
}
```

### Spec Gherkin

```gherkin
# specs/features/usuario/CrearUsuario.feature
# Estado: @borrador
# Rama: feature/crear-usuario
# Creado: 2026-03-21

@borrador
Feature: Crear Usuario
  Como usuario nuevo
  Quiero registrarme con email y contraseña
  Para poder acceder al sistema

  ## Prioridad P1: Camino Crítico (Must Have)

  @P1
  Escenario: Registro exitoso
    # Historia: Usuario se registra con datos válidos
    Dado que no existe un usuario con email "test@ejemplo.com"
    Cuando envío una solicitud de registro con:
      | campo    | valor            |
      | email    | test@ejemplo.com |
      | password | MiClave123!      |
      | nombre   | Test User        |
    Entonces el usuario se crea exitosamente
    Y recibo un token de autenticación

  @P1
  Escenario: Email duplicado
    Dado que existe un usuario con email "test@ejemplo.com"
    Cuando envío una solicitud de registro con email "test@ejemplo.com"
    Entonces la creación debería fallar
    Y el mensaje de error debería indicar "El email ya está registrado"

  ## Prioridad P2: Importante (Should Have)

  @P2
  Escenario: Campo obligatorio vacío
    Cuando envío una solicitud de registro con:
      | campo    | valor            |
      | email    | test@ejemplo.com |
      | password | MiClave123!      |
      | nombre   |                  |
    Entonces la creación debería fallar
    Y el mensaje de error debería indicar "El nombre es obligatorio"

  @P2
  Escenario: Contraseña débil
    # [NECESITA CLARIFICACIÓN] ¿Cuáles son los requisitos exactos de fortaleza de contraseña?
    Cuando envío una solicitud de registro con:
      | campo    | valor            |
      | email    | test@ejemplo.com |
      | password | 123              |
      | nombre   | Test User        |
    Entonces la creación debería fallar
    Y el mensaje de error debería indicar "La contraseña no cumple los requisitos"

  ## Prioridad P3+: Deseable (Nice to Have)

  @P3
  Escenario: Registro con proveedor OAuth
    # [NECESITA CLARIFICACIÓN] ¿Se soporta OAuth? ¿Qué proveedores?
    Dado que el usuario tiene una cuenta de Google
    Cuando inicia registro con Google OAuth
    Entonces el usuario se crea con los datos del proveedor
```

### Criterios de Éxito

Los criterios se incluyen al final del `.feature` como comentarios estructurados:

```gherkin
  # === CRITERIOS DE ÉXITO ===
  # Experiencia de Usuario:
  #   - El registro se completa en menos de 3 pasos
  #   - Los errores de validación son claros y accionables
  # Rendimiento:
  #   - El registro responde en < 500ms (p95)
  # Fiabilidad:
  #   - 99.9% de los registros válidos se completan exitosamente
  # Negocio:
  #   - Tasa de conversión de registro > 60%

  # === NECESITA CLARIFICACIÓN ===
  # 1. ¿Cuáles son los requisitos de fortaleza de contraseña? (min longitud, caracteres especiales)
  # 2. ¿Se soporta registro con OAuth? ¿Qué proveedores?
  # 3. ¿El email de bienvenida es síncrono o asíncrono?
```

## Categorización de Prioridades

| Prioridad | Significado | Criterio |
|-----------|-------------|----------|
| **P1** | Camino Crítico (Must Have) | Sin esto, la feature no funciona |
| **P2** | Importante (Should Have) | Necesario para calidad de producción |
| **P3+** | Deseable (Nice to Have) | Mejora la experiencia pero no bloquea |

**Regla:** Todo spec DEBE tener al menos 1 escenario P1 (happy path) y 1 escenario P1 (sad path).

## Marcadores de Clarificación

Usar `[NECESITA CLARIFICACIÓN]` inline cuando:
- Un requisito es ambiguo
- Falta información para definir el comportamiento exacto
- Hay múltiples interpretaciones posibles

Estos marcadores se resuelven durante `/especdev:clarificar` y DEBEN estar vacíos antes de avanzar a `/especdev:planificar-tecnico`.

## Artefactos Generados

| Artefacto | Ruta | Condición |
|-----------|------|-----------|
| Schema DBML | `specs/db_schema/<dominio>.dbml` | Solo si no existe |
| Spec Gherkin | `specs/features/<dominio>/<Feature>.feature` | Siempre |
| Checklist | `specs/features/<dominio>/requisitos.md` | Siempre (vacía) |

## Pipeline Completo

```
/especdev:especificar → .feature + .dbml(@provisional)
→ /especdev:clarificar → .feature(@lista) + Auto-QA
→ /especdev:planificar-tecnico → .plan.md (ratifica @provisional)
→ /especdev:desglosar → .tasks.md
→ /especdev:implementar → código + tests en Docker
→ /especdev:revisar → review.md + test-report.html
```

## Puerta de Calidad

Este comando produce el tag `@borrador`. El spec DEBE pasar por `/especdev:clarificar` para obtener el tag `@lista` antes de avanzar a la fase Plan.

**Criterios de la Puerta 1 (Completitud de Spec):**
- Cada prioridad P1 tiene al menos un happy path y un sad path
- Criterios de éxito definidos (al menos 2 medibles)
- Todos los marcadores `[NECESITA CLARIFICACIÓN]` identificados (se resuelven en clarificar)
