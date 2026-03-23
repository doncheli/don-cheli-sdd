---
nombre: Integración MCP
descripcion: "Conectar y orquestar servidores MCP para extender las capacidades del agente con herramientas externas"
version: 1.0.0
autor: Don Cheli
tags: [mcp, herramientas, integracion, protocolo]
activacion: "MCP", "conectar servidor", "herramientas externas", "model context protocol"
---

# Habilidad: Integración MCP

**Versión:** 1.0.0
**Categoría:** Herramientas
**Tipo:** Flexible

> Inspirado en la integración MCP de Gentle-AI.

## Cómo Mejora el Framework

MCP (Model Context Protocol) permite a los agentes de IA conectarse a herramientas y fuentes de datos externas. Sin MCP, el agente solo tiene acceso al codebase local. Con MCP:

- 📚 **Documentación viva** de frameworks/librerías (Context7)
- 📋 **Gestión de proyectos** (Notion, Jira, Linear)
- 🔍 **Búsqueda semántica** en repositorios
- 🗄️ **Acceso a bases de datos** para queries ad-hoc

## Servidores MCP Recomendados

| Servidor | Tipo | Propósito | Prioridad |
|----------|------|-----------|-----------|
| **Context7** | Remote HTTP | Documentación viva de librerías | P0 |
| **Filesystem** | Local | Acceso a archivos del proyecto | P0 |
| **Git** | Local | Operaciones Git avanzadas | P1 |
| **Notion** | Remote HTTP | Gestión de proyectos | P1 |
| **Jira** | Remote HTTP | Issue tracking | P1 |
| **Sequential Thinking** | Local | Razonamiento paso a paso | P2 |

## Configuración

```yaml
# .especdev/config.yaml
mcp:
  servidores:
    context7:
      tipo: "remote"
      url: "https://context7.com/api"
      habilitado: true
    notion:
      tipo: "remote"
      url: "https://notion-mcp.example.com"
      habilitado: false
      nota: "Requiere auth token — configurar por separado"
```

## Seguridad MCP

- Los servidores MCP **NUNCA** manejan credenciales del framework
- Tokens de autenticación se configuran **por separado** por el usuario
- El framework solo indica las rutas de configuración y documentación
