---
description: Verificación con Sub-LLMs
i18n: true
---

# /razonar:rlm-verificacion

🧠 **Modelo RLM: Verificación con Sub-LLMs**

Basado en el paradigma **Recursive Language Model (RLM)** de PrimeIntellect. En vez de procesar todo en un solo contexto, el LLM principal actúa como orquestador: usa un REPL de Python para inspeccionar datos, delega trabajo a sub-LLMs frescos en paralelo, y construye la respuesta de forma iterativa sin contaminar su propio contexto.

## Uso

```
/razonar:rlm-verificacion [problema con criterios verificables]
```

## Descripción

El RLM no ingiere directamente toda la información. En su lugar:

1. El LLM principal (el **RLM**) recibe el problema en su contexto
2. Los datos de entrada se cargan en un **entorno externo** (REPL Python)
3. El RLM escribe código Python para inspeccionar, filtrar y transformar los datos
4. Delega trabajo pesado a **sub-LLMs frescos** usando `llm_batch()`
5. Las herramientas (tests, linters, etc.) solo las usan los sub-LLMs
6. La respuesta se construye iterativamente en una **variable `respuesta`**
7. Solo cuando `respuesta["lista"] = True` se finaliza el proceso

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  RLM Principal                       │
│                  (Orquestador)                        │
│                                                      │
│  Contexto limpio — NO usa herramientas directamente  │
│  Solo escribe código Python en el REPL               │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │           REPL Python (Entorno)              │    │
│  │                                              │    │
│  │  # Inspeccionar datos de entrada             │    │
│  │  datos = cargar_contexto("specs/feature.md") │    │
│  │  print(datos[:500])  # Ver fragmento         │    │
│  │                                              │    │
│  │  # Delegar verificación a sub-LLMs           │    │
│  │  resultados = llm_batch([                    │    │
│  │    "Ejecuta los tests y reporta resultados", │    │
│  │    "Revisa el código contra la spec",        │    │
│  │    "Analiza cobertura de edge cases"         │    │
│  │  ])                                          │    │
│  │  # Los sub-LLMs SÍ tienen herramientas:     │    │
│  │  # ejecutar tests, leer archivos, etc.       │    │
│  │                                              │    │
│  │  # Construir respuesta iterativamente        │    │
│  │  respuesta["contenido"] = sintetizar(res)    │    │
│  │  respuesta["lista"] = True  # Finalizar      │    │
│  └─────────────────────────────────────────────┘    │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ Sub-LLM  │  │ Sub-LLM  │  │ Sub-LLM  │          │
│  │ (fresco) │  │ (fresco) │  │ (fresco) │          │
│  │          │  │          │  │          │          │
│  │ + tests  │  │ + leer   │  │ + buscar │          │
│  │ + lint   │  │   specs  │  │   código │          │
│  └──────────┘  └──────────┘  └──────────┘          │
│   EN PARALELO                                        │
└─────────────────────────────────────────────────────┘
```

## Conceptos Clave

### 1. Contexto como Recurso Escaso

El RLM trata el contexto del LLM principal como un recurso escaso. En vez de volcar toda la información en el contexto:

- Los datos de entrada se cargan al **entorno externo** (Python REPL)
- El RLM solo ve lo que explícitamente `print()` en el REPL (limitado a 8192 caracteres por turno)
- Esto **fuerza** al modelo a ser selectivo con la información que procesa

### 2. Sub-LLMs con Herramientas

Las herramientas que producen muchos tokens (tests, lectura de archivos, búsquedas web) **solo las usan los sub-LLMs**, no el RLM principal. Así:

- El RLM mantiene su contexto limpio y corto
- Los sub-LLMs procesan el contenido pesado y devuelven resúmenes concisos
- Cada sub-LLM tiene **contexto fresco** → sin context rot

### 3. Variable `respuesta` (Diffusion-style)

```python
respuesta = {"contenido": "", "lista": False}

# El RLM puede escribir, editar y reescribir
# la respuesta múltiples veces a lo largo del proceso
respuesta["contenido"] = "Resultado parcial..."
# ... más procesamiento ...
respuesta["contenido"] = "Resultado refinado con más datos..."
# Solo cuando está satisfecho:
respuesta["lista"] = True  # Finaliza el rollout
```

### 4. Llamadas Paralelas con `llm_batch()`

```python
# Despachar múltiples sub-LLMs en paralelo
resultados = llm_batch([
    "Ejecuta test_auth.py y reporta qué tests pasan y cuáles fallan",
    "Lee la spec CrearUsuario.feature y lista los escenarios",
    "Revisa el código de AuthService.ts contra los criterios"
])

# Cada sub-LLM trabaja independientemente con contexto fresco
# y herramientas propias (test runner, file reader, etc.)
```

## Proceso para Verificación de Código

```
1. CARGAR contexto en entorno Python
   - Specs, criterios de aceptación, código fuente
   - NO en el contexto del RLM → en variables Python

2. INSPECCIONAR selectivamente
   - print() solo las partes relevantes
   - Filtrar y transformar datos con Python

3. DELEGAR verificación a sub-LLMs en paralelo
   - Sub-LLM 1: Ejecutar tests → reportar pasan/fallan
   - Sub-LLM 2: Comparar código vs spec → reportar cumplimiento
   - Sub-LLM 3: Analizar edge cases → reportar cobertura
   (Los sub-LLMs SÍ tienen las herramientas)

4. SINTETIZAR resultados
   - Combinar y cruzar hallazgos de los sub-LLMs
   - Identificar inconsistencias que requieran más investigación

5. ITERAR si es necesario
   - Si hay gaps → despachar más sub-LLMs focalizados
   - Si hay contradicciones → verificación cruzada

6. FINALIZAR
   - Escribir respuesta["contenido"] con resultado sintetizado
   - Establecer respuesta["lista"] = True
```

## Cuándo Usar

| Situación | ¿Usar RLM-Verificación? |
|-----------|------------------------|
| Verificar código contra specs | ✅ Sí |
| Tests que producen mucho output | ✅ Sí (sub-LLMs manejan el output) |
| Código simple sin specs | ❌ No |
| Exploración abierta | ❌ No (usar RLM-Investigación) |

## Principios (del paradigma PrimeIntellect)

1. **El RLM nunca usa herramientas directamente** — Delega a sub-LLMs
2. **Contexto fresco para cada sub-LLM** — Sin acumulación de context rot
3. **Los datos van al entorno, no al contexto** — Python REPL como buffer
4. **La respuesta se construye por difusión** — Escritura iterativa, no de una vez
5. **Paralelización siempre que sea posible** — `llm_batch()` para eficiencia

## Referencia

- [PrimeIntellect: Recursive Language Models](https://www.primeintellect.ai/blog/rlm)
- [Paper original RLM (Alex Zhang, Oct 2025)](https://alexzhang13.github.io/blog/2025/rlm/)
- [Implementación en verifiers](https://github.com/PrimeIntellect-ai/verifiers/)
