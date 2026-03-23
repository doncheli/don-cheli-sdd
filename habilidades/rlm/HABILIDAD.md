---
nombre: RLM — Modelo de Lenguaje Recursivo
descripcion: "Recursive Language Model: verificar, razonar en cadena y descomponer problemas con sub-LLMs"
version: 1.0.0
autor: Don Cheli
tags: [rlm, razonamiento, sub-llm, recursivo]
activacion: "RLM", "verificar con otro modelo", "razonamiento recursivo", "sub-LLM"
---

# Habilidad: RLM — Modelo de Lenguaje Recursivo

**Versión:** 1.0.0
**Categoría:** Razonamiento Avanzado
**Tipo:** Flexible

> Basado en el paradigma **Recursive Language Model** de [PrimeIntellect](https://www.primeintellect.ai/blog/rlm) (2026)

## Qué es el RLM

El RLM permite a un LLM **gestionar activamente su propio contexto**. En vez de ingerir directamente datos potencialmente enormes, el modelo usa un **REPL Python persistente** para:

1. **Inspeccionar y transformar** datos de entrada programáticamente
2. **Llamar sub-LLMs** frescos desde el REPL via `llm_batch()`
3. **Delegar herramientas** solo a los sub-LLMs (mantener el contexto principal limpio)
4. **Construir la respuesta** iterativamente via variable `respuesta`

## Arquitectura Central

```
┌──────────────────────────────────────────┐
│            RLM Principal                  │
│         (Orquestador — contexto limpio)   │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │         REPL Python Persistente    │  │
│  │                                     │  │
│  │  datos = env.input_data             │  │
│  │  resultados = llm_batch([...])      │  │
│  │  respuesta["contenido"] = ...       │  │
│  │  respuesta["lista"] = True          │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │SubLLM│  │SubLLM│  │SubLLM│  FRESCOS  │
│  │+tools│  │+tools│  │+tools│  PARALELO │
│  └──────┘  └──────┘  └──────┘           │
└──────────────────────────────────────────┘
```

## Principios Clave

| Principio | Descripción |
|-----------|-------------|
| **Datos al entorno, no al contexto** | Los datos van al REPL Python, no al prompt del LLM |
| **Herramientas solo para sub-LLMs** | El RLM principal NO usa herramientas directamente |
| **Context folding > summarization** | Delegar ≠ resumir. No se pierde información |
| **Contexto fresco por sub-LLM** | Cada sub-LLM es una instancia nueva sin context rot |
| **Respuesta por difusión** | Se construye y edita iterativamente |
| **`llm_batch()` paralelo** | Sub-tareas independientes se despachan en paralelo |

## Los 3 Modelos RLM

| Modelo | Comando | Caso de Uso |
|--------|---------|-------------|
| Verificación | `/razonar:rlm-verificacion` | Verificar código contra specs con sub-LLMs |
| Cadena de Pensamiento | `/razonar:rlm-cadena-pensamiento` | Razonamiento multi-paso con context folding |
| Descomposición | `/razonar:rlm-descomposicion` | Codebases grandes, inputs masivos |

## Árbol de Decisión

```
¿El problema involucra inputs masivos o contexto muy largo?
├── SÍ → rlm-descomposicion (Map-Reduce / Divide-Conquista)
└── NO → ¿Necesita verificación contra criterios?
          ├── SÍ → rlm-verificacion (sub-LLMs con tests/tools)
          └── NO → ¿Es razonamiento multi-paso?
                    ├── SÍ → rlm-cadena-pensamiento (context folding)
                    └── NO → Usar modelo de razonamiento clásico
```

## Referencia

- [PrimeIntellect: Recursive Language Models](https://www.primeintellect.ai/blog/rlm)
- [Alex Zhang (MIT): Paper original RLM](https://arxiv.org/abs/2512.24601)
- [Context Rot Research](https://research.trychroma.com/context-rot)
