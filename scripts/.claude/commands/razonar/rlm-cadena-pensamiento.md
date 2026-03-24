---
description: Razonamiento en Cadena con Context Folding
i18n: true
---

# /razonar:rlm-cadena-pensamiento

🧠 **Modelo RLM: Razonamiento en Cadena con Context Folding**

Basado en el paradigma **Recursive Language Model (RLM)** de PrimeIntellect. Aplica "context folding" (plegado de contexto) para problemas de razonamiento multi-paso: el LLM principal orquesta sub-LLMs frescos para cada paso de la cadena, manteniendo su propio contexto limpio y evitando el "context rot".

## Uso

```
/razonar:rlm-cadena-pensamiento [problema complejo multi-paso]
```

## El Problema del Context Rot

En razonamiento multi-paso tradicional, cada paso se acumula en el contexto del LLM. Después de muchos pasos, el contexto crece y la calidad de las respuestas **degrada** (context rot). Esto es un problema bien documentado en la investigación.

## La Solución: Context Folding

En vez de acumular todo en un solo contexto, el RLM:

1. **Pliega** el contexto delegando trabajo a sub-LLMs frescos
2. **Solo retiene** resúmenes concisos de los resultados
3. **Nunca resume el contexto** (lo cual pierde información) — en su lugar, **delega programáticamente**

## Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                  RLM Principal                       │
│              (Gestión de Contexto)                   │
│                                                      │
│  # El RLM descompone el problema en pasos            │
│  # y usa Python para orquestar sub-LLMs              │
│                                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │              REPL Python                     │    │
│  │                                              │    │
│  │  # Paso 1: Analizar requisitos              │    │
│  │  paso1 = llm_batch([                        │    │
│  │    "Analiza los requisitos en esta spec..."  │    │
│  │  ])[0]                                       │    │
│  │                                              │    │
│  │  # Paso 2: Diseñar (usando resultado paso1) │    │
│  │  paso2 = llm_batch([                        │    │
│  │    f"Dado estos requisitos: {paso1[:2000]}"  │    │
│  │    f"Diseña la arquitectura..."              │    │
│  │  ])[0]                                       │    │
│  │                                              │    │
│  │  # Paso 3: Validar en paralelo              │    │
│  │  validaciones = llm_batch([                 │    │
│  │    f"Valida que {paso2} cubre {paso1}",     │    │
│  │    f"Identifica gaps en el diseño {paso2}", │    │
│  │    f"Evalúa riesgos del diseño {paso2}"     │    │
│  │  ])                                          │    │
│  │                                              │    │
│  │  # El RLM principal NUNCA vio los documentos │    │
│  │  # completos — los sub-LLMs los procesaron  │    │
│  │  # y devolvieron resúmenes concisos          │    │
│  │                                              │    │
│  │  respuesta["contenido"] = sintetizar(...)    │    │
│  │  respuesta["lista"] = True                   │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## Proceso

### 1. Carga de Datos al Entorno

El problema y todo el contexto se cargan al **REPL Python**, NO al contexto del LLM principal:

```python
# Los datos están disponibles programáticamente
# pero NO en el contexto del RLM
datos_entrada = env.input_data  # spec, PRD, código, etc.

# El RLM solo ve lo que explícitamente imprime
print(datos_entrada[:500])  # Ver solo un fragmento
```

### 2. Descomposición en Pasos

El RLM escribe código Python para organizar la cadena de razonamiento:

```python
# Definir los pasos de la cadena
pasos = [
    "Analizar los requisitos funcionales y no-funcionales",
    "Identificar los componentes técnicos necesarios",
    "Diseñar las interfaces entre componentes",
    "Evaluar alternativas de implementación",
    "Validar el diseño contra los requisitos"
]
```

### 3. Ejecución con Sub-LLMs Frescos

Cada paso se ejecuta con un sub-LLM que tiene **contexto fresco** y acceso a herramientas:

```python
# Cada sub-LLM tiene contexto fresco
# → sin context rot entre pasos
resultado_paso1 = llm_batch([
    f"Solo necesitas hacer esto: {pasos[0]}. "
    f"Aquí están los datos relevantes: {datos_paso1}"
])[0]

# El paso siguiente recibe solo el RESUMEN del anterior
resultado_paso2 = llm_batch([
    f"Contexto previo (resumen): {resultado_paso1[:2000]}. "
    f"Tu tarea: {pasos[1]}. "
    f"Datos adicionales: {datos_paso2}"
])[0]
```

### 4. Paralelización donde sea Posible

Pasos independientes se ejecutan en paralelo:

```python
# Pasos independientes → paralelos
resultados_paralelos = llm_batch([
    f"Evalúa seguridad del diseño: {diseño}",
    f"Evalúa rendimiento del diseño: {diseño}",
    f"Evalúa mantenibilidad del diseño: {diseño}"
])
```

### 5. Construcción Iterativa de Respuesta

```python
# La respuesta se construye gradualmente
respuesta["contenido"] = f"""
## Análisis de Requisitos
{resultado_paso1}

## Componentes Técnicos
{resultado_paso2}
"""

# ...más pasos...

# Agregar validaciones
respuesta["contenido"] += f"""
## Validación
- Seguridad: {resultados_paralelos[0]}
- Rendimiento: {resultados_paralelos[1]}
- Mantenibilidad: {resultados_paralelos[2]}
"""

# Finalizar cuando esté completo
respuesta["lista"] = True
```

## Ventajas sobre Chain-of-Thought Tradicional

| Aspecto | CoT Tradicional | RLM + Context Folding |
|---------|-----------------|----------------------|
| **Context rot** | Se acumula → degrada | Cada paso es fresco |
| **Costo de tokens** | Lineal con pasos | El RLM principal usa pocos tokens |
| **Herramientas** | Todos los tokens en contexto | Solo sub-LLMs ven los tokens pesados |
| **Paralelización** | No posible | `llm_batch()` en paralelo |
| **Pérdida de info** | Resumir = perder info | Delegar ≠ perder info |

## Cuándo Usar

- Decisiones arquitectónicas complejas
- Análisis de trade-offs multi-dimensionales
- Planificación de proyectos con muchas variables
- Cualquier razonamiento que requiera >5 pasos encadenados

## Principios

1. **Los datos van al entorno, no al contexto** — REPL Python como buffer
2. **Cada paso razona con contexto fresco** — Sub-LLM dedicado
3. **Context folding > context summarization** — No se pierde información
4. **Paralelizar siempre que sea posible** — Eficiencia via `llm_batch()`
5. **La respuesta se construye por difusión** — Iterativa, no de una vez

## Referencia

- [PrimeIntellect: Recursive Language Models](https://www.primeintellect.ai/blog/rlm)
- [Context Rot Research](https://research.trychroma.com/context-rot)
- [Context Folding (arXiv:2510.11967)](http://arxiv.org/abs/2510.11967)
