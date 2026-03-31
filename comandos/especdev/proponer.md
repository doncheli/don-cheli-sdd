---
description: Crear propuesta de cambio con intención, alcance y enfoque antes de especificar
i18n: true
---

# /dc:proponer

## Objetivo

Crear una propuesta de cambio estructurada ANTES de escribir la especificación Gherkin. Define la intención (WHY), el alcance (WHAT) y el enfoque (HOW) del cambio.

> Adaptado de `sdd-propose` de Gentle-AI — fase intermedia entre explorar y especificar.

## Uso

```
/dc:proponer <descripción del cambio>
```

## Por Qué Existe

Sin una propuesta formal, los developers saltan directo a escribir specs sin
alinear la intención con el stakeholder. La propuesta:
- Fuerza a pensar en el **POR QUÉ** antes del **QUÉ**
- Define el alcance explícito (qué SÍ, qué NO)
- Identifica riesgos antes de invertir tiempo en specs

## Output

```markdown
# Propuesta: Implementar Autenticación OAuth

## Intención (POR QUÉ)
Los usuarios piden login social. El 60% abandona el registro manual.

## Alcance (QUÉ)
### Incluido
- Login con Google y GitHub
- Vinculación de cuenta OAuth a cuenta existente
- Token refresh automático

### Excluido
- Login con Facebook (baja demanda)
- 2FA con OAuth (fase posterior)

## Enfoque (CÓMO)
- Usar passport.js para providers
- Almacenar tokens encriptados en BD
- Flujo: redirect → callback → JWT interno

## Riesgos
- Dependencia de APIs externas de Google/GitHub
- Complejidad de vinculación de cuentas existentes

## Estimado Preliminar
- Complejidad: Nivel 2 (Estándar)
- Tiempo: 3-5 días
- Archivos afectados: ~8-12

## Estado: PENDIENTE APROBACIÓN
```

## Integración

```
/dc:explorar → hallazgos.md
→ /dc:proponer → propuesta.md (ESTE COMANDO)
→ /dc:especificar → .feature (solo después de aprobar propuesta)
```
