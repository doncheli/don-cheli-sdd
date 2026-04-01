---
description: Generar prd.json desde un PRD markdown para el bucle autónomo
---

# /historias-generar

## Objetivo

Convertir un PRD markdown en archivo `prd.json` estructurado para el bucle autónomo.

## Uso

```
/historias-generar [archivo-prd.md]
```

Si no se especifica archivo, busca en orden:
1. `.dc/prd.md`
2. `docs/prd.md`
3. `PRD.md`

## Formato PRD Markdown Esperado

```markdown
# Nombre del Proyecto

Descripción del proyecto o feature.

## Historias

### HU-001: Título de la historia

Como [rol], quiero [acción], para [beneficio].

**Criterios de aceptación:**
- [ ] Criterio 1
- [ ] Criterio 2

**Prioridad:** 1
```

## Formato prd.json Generado

```json
{
  "proyecto": "Nombre del Proyecto",
  "ramaBase": "[rama-actual]",
  "descripcion": "Descripción...",
  "historiasUsuario": [
    {
      "id": "HU-001",
      "titulo": "Título de la historia",
      "descripcion": "Como...",
      "criteriosAceptacion": ["Criterio 1", "Criterio 2"],
      "prioridad": 1,
      "pasa": false,
      "notas": ""
    }
  ]
}
```

## Output

```
Historias generadas: 5
Archivo: .dc/sesion/prd.json

HU-001 [P1] Título historia 1
HU-002 [P2] Título historia 2
...

Ejecuta /bucle para implementar las historias.
```
