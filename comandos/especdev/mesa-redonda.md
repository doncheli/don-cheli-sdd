---
description: Discusión multi-perspectiva exploratoria con roles senior sobre un tema
i18n: true
---

# /dc:mesa-redonda

## Objetivo

Iniciar una discusión exploratoria multi-perspectiva donde roles senior comparten su visión sobre un tema. A diferencia de `/dc:debate` (que busca tensión adversarial), la mesa redonda busca **explorar opciones** y construir sobre las ideas de los demás.

## Uso

```
/dc:mesa-redonda "<tema>"
/dc:mesa-redonda --roles "CPO,Arquitecto,Negocio" "<tema>"
```

## Roles Disponibles

| Rol | Perspectiva | Enfoque |
|-----|-------------|---------|
| **CPO** | Visión de producto | Roadmap, priorización, métricas de adopción |
| **Arquitecto** | Sistema y escalabilidad | Performance, mantenibilidad, deuda técnica |
| **UX Lead** | Experiencia de usuario | Usabilidad, accesibilidad, research, conversión |
| **Negocio** | Viabilidad comercial | ROI, unit economics, ventaja competitiva |
| **QA Lead** | Calidad y testing | Testability, edge cases, automatización |
| **Seguridad** | Protección y compliance | OWASP, regulaciones, datos sensibles |
| **DevOps** | Operaciones | Observabilidad, CI/CD, costos infra |

Default: CPO, Arquitecto, UX Lead, Negocio.

## Ejemplo

```bash
/dc:mesa-redonda "¿Deberíamos usar microservicios o monolito?"

=== Mesa Redonda ===
Tema: ¿Microservicios o monolito?

📦 CPO: Con un equipo de 5 personas y sin product-market fit confirmado,
   la velocidad de iteración es más valiosa que la escalabilidad.
   Un monolito nos deja lanzar features 2-3x más rápido...

🏗️ Arquitecto: Dado nuestro equipo de 5 personas, un monolito modular
   nos permite movernos más rápido sin la complejidad operacional.
   Shopify escala con monolito — no es limitante...

🎨 UX Lead: Un solo codebase significa design system centralizado y
   latencia consistente. La experiencia del usuario es más predecible
   cuando no hay hops entre servicios...

💼 Negocio: Microservicios agregarían ~$3-5K/mes en infra y 30% más
   tiempo en DevOps. Para pre-Serie A, cada mes de runway cuenta.
   Los inversores quieren tracción, no arquitectura...

=== Consenso ===
Monolito modular con interfaces claras. Revisión de arquitectura
al llegar a 10K usuarios o 10 developers.
```
