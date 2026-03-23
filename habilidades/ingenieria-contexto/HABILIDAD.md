---
nombre: Ingeniería de Contexto
descripcion: "Gestionar qué información cargar en el context window para maximizar calidad de respuestas"
version: 1.0.0
autor: Don Cheli
tags: [fundamental, contexto, memoria, context-window, sesión]
activacion: "contexto", "qué archivos cargar", "context window"
---

# Habilidad: Ingeniería de Contexto

**Versión:** 1.0.0
**Categoría:** Fundamental
**Tipo:** Rígida

> **Auto-anuncio:** "Usando habilidad de Ingeniería de Contexto para mantener memoria persistente."

## Propósito

Mantener contexto persistente entre sesiones usando el Patrón de 3 Archivos.

## El Patrón de 3 Archivos

| Archivo | Propósito | Frecuencia |
|---------|-----------|------------|
| `estado.md` | ¿Dónde estoy? | Cada hito |
| `plan.md` | ¿A dónde voy? | Transiciones de fase |
| `progreso.md` | ¿Qué he hecho? | Continuamente |

## Principio

> "Ventana de Contexto = RAM, Sistema de Archivos = Disco"

Los asistentes de IA olvidan porque el contexto no se persiste. Esta habilidad trata el sistema de archivos como memoria persistente.
