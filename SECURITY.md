# Política de Seguridad

## Reportar una vulnerabilidad

Si encontrás una vulnerabilidad de seguridad en Don Cheli, por favor **no la reportes públicamente** como un issue.

En su lugar, enviá un email a: **[tu-email@ejemplo.com]**

Incluí:
- Descripción de la vulnerabilidad
- Pasos para reproducirla
- Impacto potencial

Responderemos dentro de 48 horas.

## Alcance

Don Cheli es un framework de metodología (archivos Markdown, YAML, scripts Bash). No ejecuta servicios ni expone endpoints. Los riesgos de seguridad principales son:

- Scripts de instalación (`scripts/instalar.sh`)
- Comandos que ejecutan herramientas del sistema
- Plantillas que generan archivos de configuración

## Versiones soportadas

| Versión | Soportada |
|---------|-----------|
| 1.x.x   | ✅        |
| < 1.0   | ❌        |
