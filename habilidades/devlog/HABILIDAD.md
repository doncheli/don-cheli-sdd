---
nombre: DevLog — Bitácora de Desarrollo
descripcion: "Mantener un log de desarrollo con decisiones, cambios y contexto para referencia futura"
version: 1.0.0
autor: Don Cheli
tags: [devlog, bitacora, historial, observabilidad]
activacion: "devlog", "registrar decisión", "log de desarrollo"
---

# Habilidad: DevLog — Bitácora de Desarrollo

**Versión:** 1.0.0
**Categoría:** Observabilidad
**Tipo:** Flexible

> Adaptado de DevilDev — DevLog para historial de desarrollo.

## Cómo Mejora el Framework

El DevLog es una bitácora cronológica de TODOS los cambios significativos del proyecto. Complementa la memoria persistente con un registro temporal ordenado.

## Diferencia con Memoria Persistente

| Memoria Persistente | DevLog |
|--------------------|--------|
| Decisiones y convenciones | Historial cronológico |
| "QUÉ decidimos" | "QUÉ pasó y CUÁNDO" |
| Se actualiza (sobrescribe) | Solo se agrega (append) |
| Para contexto | Para auditoría |

## Formato

```markdown
# DevLog: mi-proyecto

## 2026-03-21

### 16:30 — Feature: OAuth Login (PROJ-42)
- **Tipo:** Feature
- **Archivos:** 8 modificados, +234 -45 líneas
- **Arquitectura:** Nuevo componente "OAuth Provider"
- **Spec:** auth-oauth.delta.md
- **Tests:** 12 nuevos (todos pasan)
- **Tokens:** 58,120 | Costo: $0.14
- **Notas:** Se eligió Strategy Pattern para extensibilidad

### 14:15 — Fix: Login timeout (PROJ-41)
- **Tipo:** Bugfix
- **Archivos:** 2 modificados, +8 -4 líneas
- **Tests:** 1 nuevo (regression test)
- **Tokens:** 12,500 | Costo: $0.03
- **Notas:** Timeout aumentado de 30s a 60s

## 2026-03-20

### 11:00 — Refactor: Separar servicio de email
- **Tipo:** Refactor
- **Archivos:** 5 modificados, +120 -180 líneas
- **Arquitectura:** Componente "Email Service" extraído de "API"
- **Tests:** Sin cambios (todos siguen pasando)
```

## Auto-Registro

El DevLog se actualiza automáticamente cuando:
1. `/dc:archivar` completa un cambio
2. `/dc:aplicar` termina una implementación
3. Se crea un commit significativo

## Ubicación

```
.especdev/devlog/
├── 2026-03.md    # Log del mes
├── 2026-02.md    # Mes anterior
└── indice.md     # Índice con conteos por mes
```

## Valor para el Equipo

- **Onboarding:** "¿Qué pasó este mes?" → DevLog
- **Retrospectivas:** Datos reales de qué se hizo
- **Debugging:** "¿Cuándo se cambió esto?" → Buscar en DevLog
- **Estimados:** Datos históricos de duración y costo por tipo de cambio
