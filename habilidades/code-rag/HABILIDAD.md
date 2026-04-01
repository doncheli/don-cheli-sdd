---
nombre: CodeRAG
descripcion: "Indexar repos de referencia y recuperar patrones relevantes usando RAG para informar implementación"
version: 1.0.0
autor: Don Cheli
tags: [contexto, RAG, código, patrones, referencia]
activacion: "buscar referencia", "código similar", "RAG", "cómo lo hicieron otros"
---

# Habilidad: CodeRAG (Retrieval-Augmented Generation para Código)

**Versión:** 1.0.0
**Categoría:** Contexto
**Tipo:** Flexible

> Adaptado de DeepCode (HKUDS/DeepCode) — CodeRAG System con dependency graphs y semantic analysis.

## Cómo Mejora el Framework

Don Cheli tiene memoria persistente (Engram) para decisiones y convenciones, pero carece de un sistema para **indexar y recuperar patrones de código relevantes** de repos de referencia. CodeRAG permite inyectar conocimiento de código existente durante la generación, sin cargar repos completos en contexto.

## El Concepto

```
Sin CodeRAG:
  Tarea: "Implementar webhook handler"
  Agente: Genera desde cero (posibles anti-patrones)

Con CodeRAG:
  Tarea: "Implementar webhook handler"
  CodeRAG: Busca patrones similares → encuentra 3 implementaciones
  Agente: Genera informado por mejores prácticas reales
```

## Arquitectura

```
Repositorio(s) de Referencia
        │
        ▼
┌─────────────────────┐
│  1. Indexación       │  Escanear → extraer → clasificar
│     - Dependencias   │
│     - Patrones       │
│     - APIs           │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  2. Índice Local     │  .dc/code-rag/
│     - patterns.json  │  Patrones indexados
│     - deps.json      │  Grafo de dependencias
│     - apis.json      │  APIs y contratos
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  3. Recuperación     │  Query → match → inject
│     - Por similitud  │
│     - Por dependencia │
│     - Por API        │
└─────────────────────┘
```

## Pipeline de Indexación

### Paso 1: Seleccionar Fuentes

```yaml
# .dc/code-rag/fuentes.yaml
fuentes:
  - tipo: local
    ruta: "../proyecto-hermano"
    descripcion: "Proyecto con patrones similares"

  - tipo: github
    repo: "org/proyecto-referencia"
    branch: "main"
    solo_directorios:
      - "src/services/"
      - "src/utils/"
    descripcion: "Microservicio de referencia del equipo"

  - tipo: snapshot
    ruta: ".dc/code-rag/snapshots/auth-pattern.ts"
    descripcion: "Patrón de auth aprobado por el equipo"
```

### Paso 2: Extraer Patrones

Para cada fuente, se extraen:

| Artefacto | Qué Captura | Ejemplo |
|-----------|-------------|---------|
| **Patrones** | Estructuras repetidas | Factory pattern, Repository pattern |
| **Dependencias** | Grafo de imports | `auth.ts` → `jwt.ts` → `crypto.ts` |
| **APIs** | Contratos públicos | `createUser(data: UserInput): Promise<User>` |
| **Convenciones** | Naming, estructura | snake_case, carpeta por feature |
| **Error handling** | Estrategias de manejo | Custom exceptions, error boundaries |

### Paso 3: Clasificar y Almacenar

```json
// .dc/code-rag/patterns.json
{
  "patterns": [
    {
      "id": "webhook-handler",
      "tipo": "architectural",
      "nombre": "Webhook Handler con Verificación",
      "fuente": "org/proyecto-referencia:src/services/webhook.ts",
      "tags": ["webhook", "security", "async"],
      "complejidad": "media",
      "snippet": "// Extracto relevante (< 50 líneas)",
      "dependencias": ["crypto", "queue"],
      "notas": "Incluye verificación de firma HMAC"
    }
  ]
}
```

## Recuperación Contextual

### Cuándo Recuperar

CodeRAG se activa automáticamente durante:

| Momento | Trigger |
|---------|---------|
| `/dc:planificar-tecnico` | Buscar patrones arquitectónicos relevantes |
| `/dc:implementar` | Inyectar snippets de referencia |
| `/dc:desglosar` | Informar complejidad real basada en código similar |
| Manual | `Consulta CodeRAG: <query>` |

### Cómo Recuperar

```
1. Extraer keywords de la tarea actual
2. Buscar en el índice por:
   a. Tags coincidentes (exacto)
   b. Similitud de nombre/descripción (fuzzy)
   c. Dependencias compartidas (grafo)
3. Rankear por relevancia
4. Inyectar top-3 como contexto (máx 200 líneas total)
```

### Formato de Inyección

```markdown
## Referencia CodeRAG (3 patrones relevantes)

### 1. Webhook Handler con Verificación (relevancia: 0.92)
Fuente: org/proyecto-referencia:src/services/webhook.ts
```typescript
// Extracto: verificación de firma + procesamiento async
export async function handleWebhook(req: Request): Promise<void> {
  const signature = req.headers['x-webhook-signature'];
  if (!verifySignature(req.body, signature, secret)) {
    throw new UnauthorizedError('Invalid webhook signature');
  }
  await queue.enqueue('webhook', req.body);
}
```

### 2. ... (más patrones)

> Nota: Estos son patrones de REFERENCIA, no código para copiar directamente.
> Adaptar al contexto y convenciones del proyecto actual.
```

## Grafo de Conocimiento (LightRAG)

> Mejorado con conceptos de [LightRAG](https://github.com/HKUDS/LightRAG) — Retrieval dual-level con grafo de entidades y relaciones.

### Enfoque Dual-Level

```
Query
  ├─→ Traversal de grafo (relaciones entre entidades)
  │   └─→ Nodo A → usa → Nodo B → extiende → Nodo C
  │
  └─→ Búsqueda semántica (similitud por tags/nombre)
      └─→ Match fuzzy por descripción

  ├─→ Combinar resultados con contexto relacional
  └─→ Inyectar top-3 con grafo de dependencias incluido
```

### Entidades y Relaciones

El grafo extrae automáticamente:

| Entidad | Ejemplos |
|---------|----------|
| **Función** | `handleWebhook`, `createUser` |
| **Clase** | `AuthService`, `UserRepository` |
| **Módulo** | `src/services/auth`, `src/utils/jwt` |
| **Patrón** | Factory, Repository, Observer |
| **Interfaz** | `UserInput`, `WebhookPayload` |

| Relación | Significado |
|----------|-----------|
| `calls` | Función A invoca función B |
| `extends` | Clase A hereda de clase B |
| `implements` | Clase A implementa interfaz B |
| `imports` | Módulo A importa desde módulo B |
| `composes` | Patrón A se compone con patrón B |
| `depends_on` | Componente A depende de componente B |

### Queries Multi-Nivel

| Modo | Qué busca | Ejemplo |
|------|----------|---------|
| **Local** | Contexto específico de un módulo | "error handling en auth service" |
| **Global** | Patrones cross-módulo | "todas las implementaciones de Factory" |
| **Híbrido** | Combina local + global | "auth patterns + sus dependencias" |

### Almacenamiento

```
.dc/code-rag/
├── patterns.json     # Patrones indexados
├── entities.json     # Entidades extraídas (funciones, clases, módulos)
├── relations.json    # Relaciones entre entidades (grafo)
├── deps.json         # Grafo de dependencias de archivos
├── apis.json         # APIs y contratos
└── fuentes.yaml      # Configuración de fuentes
```

```json
// .dc/code-rag/entities.json
{
  "entities": [
    {"id": "auth-service", "tipo": "service", "archivo": "src/services/auth.ts",
     "tags": ["auth", "jwt", "security"]},
    {"id": "jwt-util", "tipo": "utility", "archivo": "src/utils/jwt.ts",
     "tags": ["jwt", "crypto", "token"]}
  ]
}

// .dc/code-rag/relations.json
{
  "relations": [
    {"from": "auth-service", "to": "jwt-util", "tipo": "imports"},
    {"from": "auth-service", "to": "user-model", "tipo": "depends_on"},
    {"from": "auth-handler", "to": "auth-service", "tipo": "calls"}
  ]
}
```

### Ventaja sobre RAG tradicional

```
RAG tradicional:
  Query: "async error handling"
  → Busca por similitud → Devuelve snippets sueltos

CodeRAG + LightRAG:
  Query: "async error handling"
  → Extrae entidades: [error_handler, async_fn, middleware]
  → Traversa grafo: async_fn --calls--> error_handler --wraps--> middleware
  → Devuelve: snippet + contexto relacional + patrones asociados
  → Bonus: "Este patrón se compone con logging middleware"
```

## Gestión del Índice

| Acción | Cuándo |
|--------|--------|
| **Crear** | `/dc:iniciar` si se configuran fuentes |
| **Actualizar** | Manualmente o al detectar cambios en fuentes |
| **Limpiar** | `/dc:archivar` al completar proyecto |
| **Exportar** | Para compartir índice entre proyectos similares |

## Límites de Tokens

| Elemento | Límite |
|----------|--------|
| Snippet por patrón | 50 líneas máximo |
| Patrones inyectados por query | 3 máximo |
| Contexto total inyectado | 200 líneas máximo |
| Tamaño del índice | 500 patrones máximo |

## Integración con Habilidades Existentes

```
CodeRAG ←→ Mapa Arquitectónico
  El mapa usa el grafo de dependencias de CodeRAG

CodeRAG ←→ Ingeniería de Contexto
  CodeRAG respeta los límites de contexto

CodeRAG ←→ Memoria Persistente (Engram)
  Decisiones sobre patrones se guardan en Engram

CodeRAG ←→ Generador de Specs
  Specs se informan con patrones existentes
```

## Guardrails

- **Nunca** copiar código de referencia directamente — siempre adaptar
- **Nunca** indexar archivos con credenciales o secretos
- **Nunca** exceder los límites de inyección (200 líneas)
- **Siempre** indicar la fuente del patrón inyectado
- **Siempre** verificar que el patrón sigue siendo válido (fuente puede cambiar)
