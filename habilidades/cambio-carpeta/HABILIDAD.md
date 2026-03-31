---
nombre: Cambio como Carpeta (Change-as-Folder)
descripcion: "Gestionar cambios de directorio de trabajo del agente de forma segura con validación de contexto"
version: 1.0.0
autor: Don Cheli
tags: [cambio, carpeta, directorio, organizacion]
activacion: "cambiar carpeta", "ir a directorio", "cambiar proyecto"
---

# Habilidad: Cambio como Carpeta (Change-as-Folder)

**Versión:** 1.0.0
**Categoría:** Organización
**Tipo:** Rígida

> Adaptado de OpenSpec (Fission-AI/OpenSpec) — sistema de cambios como carpetas.

## Cómo Mejora el Framework

Cada cambio (feature, bugfix, refactor) se empaqueta como una **carpeta autocontenida** con todo lo necesario para entenderlo e implementarlo.

## Estructura

```
.especdev/
└── cambios/
    ├── agregar-oauth/                    # Cambio activo
    │   ├── propuesta.md                  # POR QUÉ este cambio
    │   ├── specs/                        # QUÉ cambia (delta specs)
    │   │   └── auth-oauth.delta.md
    │   ├── diseño.md                     # CÓMO se construye
    │   └── tareas.md                     # Plan de implementación
    │
    ├── corregir-timeout-login/           # Otro cambio activo
    │   ├── propuesta.md
    │   ├── specs/
    │   └── tareas.md                     # (sin diseño — era simple)
    │
    └── archivo/                          # Cambios completados
        └── 2026-03-21-agregar-logout/
            ├── propuesta.md
            ├── specs/
            ├── diseño.md
            ├── tareas.md
            └── metadata.json
```

## Ventajas

| Sin carpetas | Con carpetas |
|-------------|-------------|
| Artefactos sueltos por todo el repo | Todo agrupado por cambio |
| No se sabe qué pertenece a qué | Cada cambio es autocontenido |
| Difícil trabajar en paralelo | Múltiples cambios activos |
| No se puede "pausar" un cambio | Context switching natural |

## Cambios Paralelos

Puedes tener múltiples cambios activos simultáneamente:

```
.especdev/cambios/
├── agregar-oauth/      ← en progreso (70%)
├── corregir-timeout/   ← listo para implementar
└── mejorar-performance/ ← en exploración
```

### Context Switching

```bash
# Trabajando en oauth...
/dc:aplicar agregar-oauth

# Interrupción urgente
/dc:aplicar corregir-timeout

# Volver a oauth
/dc:aplicar agregar-oauth
# → Retoma donde se quedó (tarea 3/5)
```

## Archivado Masivo

Cuando tienes múltiples cambios completados:

```bash
/dc:archivar --masivo

# Detecta conflictos si múltiples cambios tocan las mismas specs
# Resuelve en orden cronológico
```

## Ciclo de Vida

```
PROPUESTO → EN PROGRESO → IMPLEMENTADO → ARCHIVADO
    │            │              │              │
propuesta.md  diseño.md    código listo   metadata.json
  specs/      tareas.md    tests pasan    → archivo/
```
