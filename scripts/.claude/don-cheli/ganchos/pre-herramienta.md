# Hook: Pre-Herramienta

**Disparador:** Antes de cualquier acción de escritura/edición/bash

## Comportamiento

1. Leer `.dc/plan.md` para refrescar metas actuales
2. Verificar que la acción está alineada con el plan
3. Si hay archivos adicionales configurados, leerlos también

## Configuración

```json
{
  "disparador": "preHerramienta",
  "archivos": [".dc/plan.md", ".dc/estado.md"],
  "archivosAdicionales": []
}
```
