---
description: Archivar specs completadas y sincronizar delta specs con specs principales
i18n: true
---

# /especdev:archivar

## Objetivo

Sincronizar las specs delta (cambios incrementales) con las specs principales y archivar las features completadas para referencia futura.

> Adaptado de `sdd-archive` de Gentle-AI — fase de cierre que Don Cheli no tenía.

## Uso

```
/especdev:archivar @specs/features/<dominio>/<Feature>.feature
/especdev:archivar --todo   # Archivar todas las features @implementada
```

## Comportamiento

1. **Verificar** que la feature tiene tag `@implementada` (todos los tests pasan)
2. **Mover** artefactos completados a `specs/archivo/`
3. **Actualizar** la spec principal del dominio si existe
4. **Registrar** en `.especdev/memoria/decisiones.md`
5. **Limpiar** archivos temporales de la feature

## Estructura de Archivo

```
specs/
├── features/          # Features ACTIVAS
│   └── usuario/
│       └── EditarPerfil.feature  (en progreso)
├── archivo/           # Features COMPLETADAS
│   └── usuario/
│       └── CrearUsuario/
│           ├── CrearUsuario.feature
│           ├── CrearUsuario.plan.md
│           ├── CrearUsuario.tasks.md
│           ├── review.md
│           └── metadata.json  # Fechas, métricas, estimado vs real
└── db_schema/         # Schemas (no se archivan)
```

## metadata.json

```json
{
  "feature": "CrearUsuario",
  "dominio": "usuario",
  "archivada": "2026-03-21",
  "iniciada": "2026-03-18",
  "duracion_real_dias": 3,
  "estimado_dias": 5,
  "precision_estimado": "60%",
  "escenarios_gherkin": 5,
  "tests_totales": 12,
  "archivos_modificados": 8
}
```

## Valor para el Framework

Los datos archivados alimentan:
- `/especdev:estimar` → datos históricos para estimados más precisos
- `/especdev:analizar-sesiones` → patrones de desarrollo
- Memoria persistente → decisiones y convenciones aprendidas
