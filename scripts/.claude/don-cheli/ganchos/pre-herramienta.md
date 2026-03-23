# Hook: Pre-Herramienta

**Disparador:** Antes de cualquier acción de escritura/edición/bash

## Comportamiento

1. Leer `.especdev/plan.md` para refrescar metas actuales
2. Verificar que la acción está alineada con el plan
3. Si hay archivos adicionales configurados, leerlos también

## Configuración

```json
{
  "disparador": "preHerramienta",
  "archivos": [".especdev/plan.md", ".especdev/estado.md"],
  "archivosAdicionales": []
}
```
