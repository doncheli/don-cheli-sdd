---
description: Guardar insights importantes para referencia futura en memoria persistente. Usa cuando el usuario dice "memorizar", "remember this", "guardar insight", "save for later", "memorize", "remember", "keep track", "guardar aprendizaje", "store insight". Guarda en memoria persistente del workspace para recall en sesiones futuras.
i18n: true
---

# /dc:memorizar

## Objetivo

Guardar un insight o aprendizaje importante en `.dc/hallazgos.md` para que persista entre sesiones.

## Uso

```
/dc:memorizar <insight>
```

## Ejemplo

```bash
/dc:memorizar "Los índices compuestos en MongoDB mejoran 10x las consultas de búsqueda con filtros múltiples"
```

Agrega al archivo `.dc/hallazgos.md`:

```markdown
### 2026-03-21 15:30
**Insight:** Los índices compuestos en MongoDB mejoran 10x las consultas de búsqueda con filtros múltiples
**Contexto:** Implementación de API de búsqueda en Fase 4
**Categoría:** Rendimiento
```
