---
description: Guardar insights importantes para referencia futura
---

# /especdev:memorizar

## Objetivo

Guardar un insight o aprendizaje importante en `.especdev/hallazgos.md` para que persista entre sesiones.

## Uso

```
/especdev:memorizar <insight>
```

## Ejemplo

```bash
/especdev:memorizar "Los índices compuestos en MongoDB mejoran 10x las consultas de búsqueda con filtros múltiples"
```

Agrega al archivo `.especdev/hallazgos.md`:

```markdown
### 2026-03-21 15:30
**Insight:** Los índices compuestos en MongoDB mejoran 10x las consultas de búsqueda con filtros múltiples
**Contexto:** Implementación de API de búsqueda en Fase 4
**Categoría:** Rendimiento
```
