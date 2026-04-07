---
description: Generar Product Requirement Document (PRD) completo desde múltiples fuentes — Figma, briefs, docs, research. Incluye análisis de riesgos, priorización RICE, user stories Gherkin y timeline. Usa cuando el usuario dice "PRD", "product requirements", "documento de producto", "requirements document", "generar PRD", "crear PRD", "product spec", "figma to PRD", "brief a PRD", "requirements from figma".
i18n: true
---

# /dc:prd — Generador de PRD

## Objetivo

Generar un **Product Requirement Document** profesional desde múltiples fuentes de input, listo para alimentar el pipeline SDD.

## Uso

```
/dc:prd                                    # Modo interactivo — pregunta fuentes
/dc:prd "Descripción del producto"         # Desde descripción en lenguaje natural
/dc:prd --figma <link>                     # Desde diseño en Figma
/dc:prd --brief docs/brief.md              # Desde brief de producto
/dc:prd --figma <link> --brief brief.md    # Múltiples fuentes combinadas
/dc:prd --template saas                    # Usar template específico (saas, mobile, ecommerce, api, internal, landing)
/dc:prd --version 1.1                      # Crear nueva versión de PRD existente
```

## Comportamiento

Lee la habilidad `habilidades/generador-prd/HABILIDAD.md` para el proceso completo.

### Proceso resumido:

```
1. DESCUBRIR — Leer todas las fuentes (Figma, docs, conversación, codebase)
2. ESTRUCTURAR — Organizar en 13 secciones con priorización MoSCoW + RICE
3. ANALIZAR — Riesgos (7 categorías), dependencias, estimación de esfuerzo
4. REDACTAR — PRD completo con user stories Gherkin, diagramas Mermaid, timeline
5. VALIDAR — ¿Requirements verificables? ¿Métricas definidas? ¿Scope claro?
6. ENTREGAR — Markdown + Gherkin + diagrama + matriz de riesgos
```

### Análisis de Figma

Cuando se proporciona un link de Figma:

1. **Reconocer** — Identificar pantallas, flujos, componentes
2. **Extraer** — Textos, formularios, interacciones, estados
3. **Analizar gaps** — Estados faltantes (loading, error, empty, offline)
4. **Convertir** — Cada pantalla → user stories → criterios de aceptación

### Análisis de riesgos

Para cada feature evalúa automáticamente:

| Categoría | Qué evalúa |
|-----------|-----------|
| Técnico | Complejidad, integraciones, deuda técnica |
| Producto | Market fit, adopción, competencia |
| UX | Usabilidad, accesibilidad, learning curve |
| Negocio | Revenue, costo, time-to-market |
| Legal | GDPR, compliance, términos |
| Seguridad | OWASP, datos sensibles, auth |
| Operacional | Soporte, escalabilidad, monitoring |

### Priorización

Cada feature se prioriza con MoSCoW + RICE automáticamente:

```
Feature: Autenticación JWT
  MoSCoW: Must Have
  RICE Score: 180
    Reach: 10,000 users/quarter
    Impact: 3 (massive)
    Confidence: 90%
    Effort: 1.5 person-weeks
```

## Output

```
.dc/prd/
├── prd-v1.0.md              # PRD completo (13 secciones)
├── prd-risks.md             # Matriz de riesgos expandida
├── prd-figma-analysis.md    # Análisis detallado de Figma (si aplica)
└── prd-history.json         # Historial de versiones
```

## Templates disponibles

| Template | Optimizado para |
|----------|----------------|
| `saas` | Plataformas B2B, dashboards, multi-tenant |
| `mobile` | Apps nativas iOS/Android, PWA |
| `ecommerce` | Tiendas online, marketplaces, checkout |
| `api` | APIs públicas, SDKs, developer platform |
| `internal` | Herramientas internas de equipo |
| `landing` | Landing pages, funnels, campañas |

## Integración con pipeline SDD

```
/dc:prd → genera PRD completo
  ↓
/dc:especificar → convierte user stories del PRD en Gherkin
  ↓
/dc:planificar-tecnico → blueprint desde el PRD
  ↓
/dc:desglosar → tareas TDD desde las stories
  ↓
/dc:implementar → código verificado
```

## Subcomandos

```
/dc:prd revisar              # Peer review del PRD (completitud, claridad, riesgos)
/dc:prd comparar v1.0 v1.1   # Diff visual entre versiones del PRD
/dc:prd exportar --pdf        # Exportar como PDF (genera HTML imprimible)
/dc:prd stakeholders          # Generar resumen ejecutivo para stakeholders
```

## Ejemplo de output

```
/dc:prd --figma https://figma.com/file/abc123 --brief docs/brief.md --template saas

═══════════════════════════════════════════
  Don Cheli — PRD Generator
═══════════════════════════════════════════

  Fuentes detectadas:
    📐 Figma: 12 pantallas, 3 flujos
    📄 Brief: docs/brief.md (2,400 palabras)
    💻 Codebase: Node.js + React (detectado)

  Generando PRD...

  ✅ 13 secciones completadas
  ✅ 24 user stories con criterios de aceptación
  ✅ 8 riesgos identificados (2 altos, 4 medios, 2 bajos)
  ✅ Features priorizadas: 6 Must, 4 Should, 3 Could, 2 Won't
  ✅ Timeline: 3 fases, 6 semanas estimadas
  ✅ Gherkin specs generadas (listas para /dc:especificar)

  📁 Guardado en: .dc/prd/prd-v1.0.md
  📊 Riesgos en: .dc/prd/prd-risks.md
  📐 Análisis Figma: .dc/prd/prd-figma-analysis.md

  Siguiente: /dc:especificar para convertir en specs Gherkin
```
