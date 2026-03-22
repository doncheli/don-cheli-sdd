---
description: Discusión multi-perspectiva con varios agentes sobre un tema
i18n: true
---

# /especdev:mesa-redonda

## Objetivo

Iniciar una discusión multi-agente donde diferentes perspectivas debaten un tema.

## Uso

```
/especdev:mesa-redonda "<tema>"
```

## Ejemplo

```bash
/especdev:mesa-redonda "¿Deberíamos usar microservicios o monolito?"

=== Mesa Redonda ===
Tema: ¿Microservicios o monolito?

🏗️ Arquitecto: Dado nuestro equipo de 5 personas, un monolito modular
   nos permite movernos más rápido sin la complejidad operacional...

⚡ Ejecutor: Desde el punto de vista de implementación, un monolito
   reduce la fricción de despliegue y debugging...

🔍 Revisor: La mantenibilidad a largo plazo favorece módulos bien
   separados. Un monolito modular con interfaces claras...

📊 Estimador: Microservicios agregarían ~40% más de esfuerzo en
   infraestructura y DevOps...

=== Consenso ===
Monolito modular con interfaces claras preparadas para futura
separación si el equipo crece.
```
