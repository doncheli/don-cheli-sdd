---
description: Diseño técnico con decisiones de arquitectura documentadas
---

# /especdev:diseñar

## Objetivo

Crear un documento de diseño técnico entre la planificación y el desglose de tareas. Documenta decisiones de arquitectura, trade-offs evaluados, y el diseño detallado del sistema.

> Adaptado de `sdd-design` de Gentle-AI — separa la planificación del diseño técnico.

## Uso

```
/especdev:diseñar @specs/features/<dominio>/<Feature>.plan.md
```

## Diferencia con planificar-tecnico

| `/especdev:planificar-tecnico` | `/especdev:diseñar` |
|-------------------------------|---------------------|
| Blueprint: contratos API, modelos, servicios | Decisiones de arquitectura y trade-offs |
| QUÉ vamos a construir | CÓMO y POR QUÉ así |
| Rápido, estructurado | Profundo, con análisis |

## Output

```markdown
# Diseño Técnico: Sistema de Autenticación OAuth

## Decisiones de Arquitectura

### ADR-001: Strategy Pattern para Providers
- **Estado:** Aceptada
- **Contexto:** Necesitamos soportar Google, GitHub, y posiblemente más
- **Opciones evaluadas:**
  1. If/else por provider → No extensible
  2. Strategy Pattern → Extensible, testeable ✅
  3. Plugin system → Over-engineering para esta fase
- **Consecuencias:** Cada provider es una clase independiente

### ADR-002: Tokens en BD vs Redis
- **Estado:** Aceptada
- **Decisión:** BD con TTL automático
- **Razón:** No queremos agregar Redis como dependencia solo para tokens

## Diagramas

### Flujo de Autenticación
```
Usuario → Redirect a Google → Callback → Verificar Token
    → Buscar/Crear usuario local → Generar JWT interno → Responder
```

## Complejidad
| Componente | Complejidad | Notas |
|-----------|-------------|-------|
| OAuthProvider interface | Baja | Strategy pattern simple |
| GoogleProvider | Media | API de Google bien documentada |
| Account linking | Alta | Lógica de merge de cuentas |
| Token refresh | Media | Background job necesario |

## Estado: APROBADO PARA IMPLEMENTACIÓN
```

## Pipeline Actualizado (9 Fases)

```
explorar → proponer → especificar → clarificar
→ planificar-tecnico → diseñar → desglosar
→ implementar → revisar
```
