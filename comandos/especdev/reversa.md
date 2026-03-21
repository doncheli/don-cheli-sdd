---
description: Extraer arquitectura de un codebase existente (ingeniería inversa)
---

# /especdev:reversa

## Objetivo

Analizar un codebase existente y extraer su arquitectura implícita: componentes, conexiones, flujos de datos, tecnologías y propiedad de código. Convierte código desorganizado en un mapa arquitectónico explícito.

> Adaptado de DevilDev (lak7/devildev) — Reverse Architecture.

## Uso

```
/especdev:reversa                          # Analizar el proyecto actual
/especdev:reversa @ruta/al/proyecto        # Analizar un proyecto específico
/especdev:reversa --profundidad superficial # Solo estructura de alto nivel
/especdev:reversa --profundidad profunda    # Incluir flujo de datos y dependencias
```

## Por Qué Existe

El 80% del trabajo de desarrollo es sobre codebases **existentes**, no greenfield. Antes de modificar un sistema, necesitas entender:
- ¿Cuáles son los componentes principales?
- ¿Cómo se conectan entre sí?
- ¿Qué tecnologías usa cada componente?
- ¿Dónde vive el código de cada componente?

Sin esta herramienta, un agente IA empieza a modificar código **sin entender la arquitectura**, generando inconsistencias y duplicación.

## Comportamiento

### Paso 1: Escaneo Estructural

```
Escaneando proyecto...
├── Detectando framework: Next.js 15 + TypeScript
├── Identificando dependencias: 24 directas, 8 dev
├── Mapeando estructura de directorios
└── Analizando imports y exports
```

### Paso 2: Identificación de Componentes

Aplica estas reglas (de DevilDev):

1. **Solo componentes con evidencia** — No inventar lo que no existe
2. **Test de valor de negocio** — ¿Un stakeholder no-técnico lo entendería?
3. **Test de significancia** — ¿Si falla, requiere una solución técnica diferente?
4. **Test de independencia** — ¿Se podría reemplazar con otra tecnología?

### Paso 3: Mapeo de Propiedad de Código

Para cada componente:

```json
{
  "codeOwnership": {
    "primaryImplementation": {
      "directories": ["src/services/auth/"],
      "files": ["src/middleware/jwt.ts"],
      "confidence": 0.9,
      "rationale": "Contiene toda la lógica de autenticación"
    },
    "supportingRelated": {
      "directories": ["src/utils/crypto/"],
      "confidence": 0.6,
      "rationale": "Helpers de encriptación usados por auth"
    },
    "sharedDependencies": {
      "files": ["src/db/prisma.ts"],
      "confidence": 0.3,
      "rationale": "Cliente de BD compartido con otros servicios"
    }
  }
}
```

## Output

```markdown
# Arquitectura Extraída: mi-proyecto

## Resumen
E-commerce platform con 6 componentes principales.
Stack: Next.js 15, PostgreSQL, Stripe, Redis.

## Componentes

### 1. 🛍️ Portal de Cliente
- **Propósito:** Interfaz de usuario para compras
- **Tecnologías:** React 19, Next.js App Router, TailwindCSS
- **Código:** src/app/(store)/, src/components/
- **Flujo de datos:**
  - Envía: órdenes, búsquedas, preferencias
  - Recibe: productos, precios, estado de pedido

### 2. 🔐 Sistema de Autenticación
- **Propósito:** Login, registro, sesiones
- **Tecnologías:** NextAuth.js v5, JWT, bcrypt
- **Código:** src/app/api/auth/, src/middleware.ts
- **Flujo de datos:**
  - Envía: tokens JWT, sesiones
  - Recibe: credenciales, tokens OAuth

### 3. 💳 Procesamiento de Pagos
- **Propósito:** Cobros, reembolsos, suscripciones
- **Tecnologías:** Stripe API v3, webhooks
- **Código:** src/services/payment/, src/app/api/webhook/stripe/
- **Flujo de datos:**
  - Envía: cobros, reembolsos
  - Recibe: confirmaciones, eventos Stripe

### ... (más componentes)

## Mapa de Conexiones

```
Portal de Cliente ──► Sistema de Auth ──► BD PostgreSQL
       │                                        ▲
       ▼                                        │
Procesamiento de Pagos ─────────────────────────┘
       │
       ▼
Servicio de Email
```

## Métricas
- Complejidad ciclomática promedio: 4.2
- Archivos sin tests: 12/48 (25%)
- Dependencias desactualizadas: 3
- Código muerto detectado: ~200 líneas
```

## Sincronización Automática

Cuando hay un `git push`, la arquitectura se puede re-evaluar automáticamente:

```yaml
# WORKFLOW.md
reversa:
  auto_sync: true
  trigger: "git push"
  solo_archivos_cambiados: true  # Solo re-analiza lo que cambió
```

## Niveles de Profundidad

| Nivel | Qué Incluye | Tokens Estimados |
|-------|------------|-----------------|
| Superficial | Estructura, framework, componentes principales | ~2,000 |
| Media (default) | + conexiones, tecnologías, propiedad de código | ~5,000 |
| Profunda | + flujo de datos, métricas, código muerto, tests | ~10,000 |
