# /razonar:rlm-descomposicion

🧠 **Modelo RLM: Descomposición Recursiva con Sub-LLMs**

Basado en el paradigma **Recursive Language Model (RLM)** de PrimeIntellect. Para problemas con inputs masivos o contextos extremadamente largos, el RLM descompone el problema programáticamente y delega sub-tareas a sub-LLMs frescos en paralelo, evitando completamente el context rot.

## Uso

```
/razonar:rlm-descomposicion [problema complejo o codebase grande]
```

## El Paradigma RLM

> "En vez de ingerir directamente sus datos de entrada (potencialmente enormes), el RLM permite al LLM usar un REPL Python persistente para inspeccionar y transformar sus datos de entrada, y llamar sub-LLMs desde ese REPL."
> — PrimeIntellect, 2026

### El modelo NO ve los datos directamente

```python
# ❌ Enfoque tradicional: cargar todo al contexto
# El contexto crece, la calidad baja (context rot)

# ✅ Enfoque RLM: datos en entorno externo
# El RLM los inspecciona programáticamente
datos = env.input_data  # Puede ser enorme: PDFs, codebases, datasets
print(len(datos))       # "1,500,000 caracteres"
print(datos[:500])      # Solo ve un fragmento a la vez
```

## Arquitectura Completa

```
┌──────────────────────────────────────────────────────┐
│                    RLM Principal                      │
│              (Orquestador Recursivo)                  │
│                                                       │
│  NO ingiere los datos directamente                    │
│  NO usa herramientas directamente                     │
│  SOLO escribe código Python en el REPL                │
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │              REPL Python Persistente          │    │
│  │                                               │    │
│  │  # 1. Inspeccionar datos de entrada           │    │
│  │  archivos = listar_proyecto("src/")           │    │
│  │  print(f"Archivos: {len(archivos)}")          │    │
│  │                                               │    │
│  │  # 2. Dividir en chunks manejables            │    │
│  │  chunks = particionar(archivos, tamaño=10)    │    │
│  │                                               │    │
│  │  # 3. Despachar sub-LLMs en paralelo          │    │
│  │  analisis = llm_batch([                       │    │
│  │    f"Analiza estos archivos: {chunk}"         │    │
│  │    for chunk in chunks                        │    │
│  │  ])                                            │    │
│  │  # Cada sub-LLM tiene:                        │    │
│  │  # - Contexto FRESCO (sin context rot)        │    │
│  │  # - Acceso a herramientas (leer archivos,    │    │
│  │  #   ejecutar tests, buscar)                  │    │
│  │  # - Solo ve SU chunk, no todo                │    │
│  │                                               │    │
│  │  # 4. Sintetizar hallazgos                    │    │
│  │  # Solo los RESÚMENES vuelven al RLM          │    │
│  │  for i, resultado in enumerate(analisis):     │    │
│  │      print(f"Chunk {i}: {resultado[:500]}")   │    │
│  │                                               │    │
│  │  # 5. Si hay gaps, despachar más sub-LLMs     │    │
│  │  seguimiento = llm_batch([                    │    │
│  │    "Investiga la dependencia circular...",    │    │
│  │    "¿Cómo se conecta el módulo auth con..."  │    │
│  │  ])                                            │    │
│  │                                               │    │
│  │  # 6. Construir respuesta iterativamente      │    │
│  │  respuesta["contenido"] = combinar(analisis)  │    │
│  │  respuesta["lista"] = True                    │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐          │
│  │Sub 1│ │Sub 2│ │Sub 3│ │Sub 4│ │Sub N│          │
│  │FRESH│ │FRESH│ │FRESH│ │FRESH│ │FRESH│          │
│  │+tool│ │+tool│ │+tool│ │+tool│ │+tool│          │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘          │
│  ▲ EN PARALELO via llm_batch()                       │
└──────────────────────────────────────────────────────┘
```

## Estrategias de Descomposición

### 1. Map-Reduce (para análisis de codebases grandes)

```python
# MAP: Cada sub-LLM analiza un grupo de archivos
archivos = listar_todos("src/")  # 200 archivos
grupos = particionar(archivos, tamaño=15)

hallazgos = llm_batch([
    f"Analiza estos archivos y reporta: "
    f"- Dependencias, APIs expuestas, complejidad. "
    f"Archivos: {grupo}"
    for grupo in grupos
])

# REDUCE: Sintetizar todos los hallazgos
sintesis = llm_batch([
    f"Sintetiza estos {len(hallazgos)} análisis parciales "
    f"en un reporte unificado: {hallazgos}"
])[0]

respuesta["contenido"] = sintesis
```

### 2. Divide y Conquista (para problemas particionables)

```python
# Dividir problema en sub-problemas independientes
sub_problemas = [
    "Diseñar el modelo de datos",
    "Diseñar la API REST",
    "Diseñar la interfaz de usuario",
    "Diseñar la infraestructura"
]

# Resolver en paralelo (cada uno con contexto fresco)
soluciones = llm_batch([
    f"Resuelve este sub-problema de forma independiente: "
    f"{sp}. Contexto del proyecto: {resumen_proyecto}"
    for sp in sub_problemas
])

# Verificar coherencia entre soluciones
coherencia = llm_batch([
    f"¿Las soluciones A y B son coherentes entre sí? "
    f"A: {soluciones[i]} B: {soluciones[j]}"
    for i, j in combinaciones_pares(len(soluciones))
])
```

### 3. Búsqueda Binaria Semántica (para recuperación en contextos largos)

```python
# Para encontrar información específica en contextos enormes
documento = env.input_data  # 500K tokens
mitades = [documento[:len(documento)//2],
           documento[len(documento)//2:]]

relevancia = llm_batch([
    f"¿Esta sección contiene info sobre '{consulta}'? "
    f"Responde SÍ/NO y extracto relevante. Sección: {m[:5000]}"
    for m in mitades
])

# Recurrir sobre la mitad relevante
# (recursión depth puede ser >1 en futuras versiones)
```

## La Variable `respuesta`

```python
# Inicializada al comienzo de cada rollout
respuesta = {"contenido": "", "lista": False}

# El RLM puede escribir, editar, reescribir
# MÚLTIPLES VECES durante el proceso
respuesta["contenido"] = "Análisis parcial del módulo de auth..."

# Después de más procesamiento...
respuesta["contenido"] = f"""
# Análisis Completo del Codebase

## Módulo de Auth
{analisis_auth}

## Módulo de API
{analisis_api}

## Dependencias y Riesgos
{analisis_deps}
"""

# Solo cuando está satisfecho:
respuesta["lista"] = True  # Finaliza el rollout
```

## Cuándo Usar

| Situación | ¿Usar RLM-Descomposición? |
|-----------|--------------------------|
| Analizar un codebase grande (>50 archivos) | ✅ Sí |
| Procesar documentos largos (PRDs, specs) | ✅ Sí |
| Migración de sistema completo | ✅ Sí |
| Tarea simple (1-3 archivos) | ❌ No (overhead innecesario) |
| Problema que cabe en un contexto | ❌ No |

## Principios del RLM (PrimeIntellect)

1. **Los datos van al entorno, NUNCA al contexto del RLM** — Esto evita context rot
2. **El RLM solo ve lo que imprime** — Fuerza selectividad (máx 8192 chars por print)
3. **Herramientas solo para sub-LLMs** — El RLM principal orquesta, no ejecuta
4. **Sub-LLMs siempre tienen contexto fresco** — Cada instancia es nueva
5. **`llm_batch()` para paralelización** — Eficiencia en procesamiento
6. **La respuesta se construye por difusión** — Se edita iterativamente
7. **Context folding > context summarization** — Delegar ≠ resumir (no se pierde info)

## Referencia

- [PrimeIntellect: Recursive Language Models — the paradigm of 2026](https://www.primeintellect.ai/blog/rlm)
- [Alex Zhang: Recursive Language Models (Oct 2025)](https://alexzhang13.github.io/blog/2025/rlm/)
- [Paper: arXiv:2512.24601](https://arxiv.org/abs/2512.24601)
- [Implementación: PrimeIntellect/verifiers](https://github.com/PrimeIntellect-ai/verifiers/)
- [Context Rot Research](https://research.trychroma.com/context-rot)
