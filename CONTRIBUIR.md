# Contribuir a Don Cheli

¡Gracias por tu interés en contribuir a Don Cheli! 🎉

## Cómo Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature: `git checkout -b feature/mi-mejora`
3. **Implementa** tus cambios siguiendo las convenciones del framework
4. **Prueba** que todo funcione correctamente
5. **Commit** con mensajes descriptivos en español
6. **Push** a tu fork: `git push origin feature/mi-mejora`
7. **Abre** un Pull Request describiendo tus cambios

## Convenciones

- **Idioma:** Todo el código, documentación y comentarios en **español**
- **Formato:** Markdown con YAML frontmatter para comandos y habilidades
- **Nombrado:** kebab-case para archivos, camelCase para JSON
- **Commits:** Mensajes descriptivos en español, ej: `feat: agregar modelo de estimación por puntos de función`

## Estructura de un Comando

```markdown
---
description: Descripción breve del comando
---

# /especdev:nombre

## Objetivo
[Qué hace el comando]

## Uso
[Cómo usarlo]

## Comportamiento
[Pasos que sigue]
```

## Estructura de una Habilidad

```
habilidades/nombre-habilidad/
├── HABILIDAD.md          # Documentación principal
├── modelos/              # Sub-componentes (opcional)
└── plantillas/           # Templates (opcional)
```

## Reportar Problemas

Abre un Issue describiendo:
- **Qué esperabas** que ocurriera
- **Qué ocurrió** realmente
- **Pasos** para reproducir
- **Versión** del framework
