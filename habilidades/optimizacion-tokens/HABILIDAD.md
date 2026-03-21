# Habilidad: Optimización de Tokens

**Versión:** 1.0.0
**Categoría:** Eficiencia
**Tipo:** Rígida

> **Auto-anuncio:** "Usando habilidad de Optimización de Tokens para minimizar costos y maximizar calidad."

## Cómo Mejora el Framework

Esta habilidad convierte a Don Cheli en un framework **costo-eficiente**. Sin ella, los LLMs consumen tokens innecesariamente: re-leen archivos, usan modelos caros para tareas simples, y generan prompts verbosos. Con esta habilidad:

- ⬇️ **~60% reducción de costos** por selección correcta de modelo
- ⬇️ **~40% menos tokens** por carga bajo demanda y referenciación
- ⬆️ **Mejor calidad** al usar el modelo correcto para cada tarea
- ⬆️ **Sesiones más largas** sin context rot por gestión proactiva

---

## Principio Central

> **Cada token cuesta dinero y tiempo. Seleccionar modelo y estrategia según la complejidad de la tarea, nunca por hábito.**

---

## Matriz de Selección de Modelos

| Tipo de Tarea | Modelo | Razón |
|--------------|--------|-------|
| Q&A simple, resúmenes, formateo | `haiku` | Rápido, barato, suficiente |
| Generación de código, bug fixes, tests | `sonnet` | Balance calidad/costo |
| Arquitectura, razonamiento complejo, seguridad | `opus` | Solo cuando se necesita profundidad |
| Procesamiento batch, transformaciones repetitivas | `haiku` | Tareas de volumen no necesitan opus |
| Code review, refactor multi-archivo | `sonnet` | Complejidad media |
| Análisis de seguridad, diseño de sistemas | `opus` | Razonamiento de alto riesgo |

**Regla:** Default a Haiku. Subir solo cuando la calidad sea insuficiente.

---

## Gestión de Ventana de Contexto

### 1. Cargar contexto bajo demanda (lazy)

```
❌ MALO: Cargar los 12 archivos del módulo antes de responder
✅ BUENO: Cargar solo el archivo en cuestión.
          Buscar adyacentes solo si hay dependencia no resuelta.
```

### 2. Podar system prompts agresivamente

- System prompts < **500 tokens** (se cobran en cada llamada)
- Mover reglas poco usadas a **skills bajo demanda**
- Eliminar reglas obsoletas inmediatamente

### 3. Archivos de memoria > re-lectura

Un registro de 50 tokens en memoria ahorra re-leer un archivo de 2,000 tokens repetidamente.

---

## Ingeniería de Prompts para Eficiencia

### Ser explícito, no verboso

```
❌ MALO (30 tokens, vago):
"¿Puedes por favor revisar este código y decirme si hay
algún problema potencial del que debería estar al tanto?"

✅ BUENO (12 tokens, preciso):
"Busca bugs en esta función. Lista cada uno con: ubicación, problema, fix."
```

### Outputs estructurados desde el inicio

```
# En vez de prosa libre, pedir:
Retorna JSON: { "archivo": string, "linea": number, "problema": string, "fix": string }[]
```

### Referenciar, no repetir

```
❌ MALO: Pegar el mismo schema en cada prompt
✅ BUENO: "Usa el schema definido en api/types.ts línea 45"
```

---

## Estrategia de Subagentes

### Cuándo usar subagentes

| Situación | Acción |
|-----------|--------|
| 3 análisis independientes | 3 llamadas Haiku en paralelo |
| Archivo >10K tokens | Subagente para aislar contexto |
| Tarea simple, 1 archivo | NO usar subagente (overhead > ahorro) |

### Asignación de modelo por subagente

```
Exploración/búsqueda → haiku   (buscar es barato)
Implementación        → sonnet  (escribir código requiere calidad)
Arquitectura          → opus    (solo para decisiones de diseño)
```

---

## Estrategias de Caché

### Caché a nivel de prompt

Colocar contenido estable (system prompt, docs grandes, schemas) al **inicio del contexto**. Claude cachea automáticamente hasta 4 prompts — prefijos repetidos cuestan ~10% del precio normal.

### Caché a nivel de aplicación

- Cachear respuestas para inputs determinísticos
- TTL: según estabilidad de los datos subyacentes

---

## Playbooks por Tipo de Tarea

| Tarea | Paso 1 | Paso 2 | Paso 3 |
|-------|--------|--------|--------|
| **Code Review** | Haiku: escanear estilo/lint | Sonnet: lógica, edge cases, coverage | Opus: solo crypto/auth/distribuido |
| **Documentación** | Haiku: generar borrador desde código | Sonnet: editar para precisión | Opus: nunca |
| **Debugging** | Sonnet: leer error, causa raíz, proponer fix | Opus: solo concurrencia/estado distribuido | — |
| **Tests** | Haiku: boilerplate desde signatures | Sonnet: edge cases + mocks complejos | — |
| **Scripting** | Haiku siempre | — | — |

---

## Anti-Patrones (Nunca Hacer)

| Anti-Patrón | Problema | Costo |
|------------|----------|-------|
| Opus para todo | Formateo y Q&A no necesitan razonamiento profundo | 15x más caro |
| Cargar todo el codebase | Context rot + tokens desperdiciados | Tokens innecesarios |
| System prompts verbosos | Se multiplica en cada llamada | Costo compuesto |
| Re-leer archivos en contexto | Información ya disponible | Tokens duplicados |
| Secuencial cuando puede ser paralelo | Subagentes independientes deben ser paralelos | Tiempo desperdiciado |
| Prompts ambiguos | Generan loops de clarificación | 200+ tokens extra |

---

## Guardarraíles de Presupuesto

| Umbral | Acción |
|--------|--------|
| Tarea individual > 50K tokens | Dividir en subtareas |
| Sesión > 200K tokens | Resumir y comprimir contexto |
| Subagente > 20K tokens | Reducir alcance o usar archivos de memoria |
| System prompt > 1K tokens | Auditar y podar |

---

## Referencia Rápida

```
¿Tarea simple?          → Haiku
¿Tarea media?           → Sonnet
¿Compleja/alto riesgo?  → Opus (confirmar con usuario primero)
¿Repetitiva/batch?      → Haiku en subagentes paralelos
¿Contexto grande?       → Subagente para aislar, luego surfear resultados
¿Ya lo leíste?          → Referenciarlo, no re-leer
```
