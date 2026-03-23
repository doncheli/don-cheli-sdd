---
description: Explorar e investigar el codebase antes de proponer cambios
i18n: true
---

# /especdev:explorar

## Objetivo

Investigar el codebase existente antes de comprometer un cambio. Entender la arquitectura, patrones, convenciones y dependencias ANTES de modificar nada.

> Adaptado de `sdd-explore` de Gentle-AI — fase que Don Cheli no tenía.
> Mejorado con Modo Supuestos de Get Shit Done (gsd-build/get-shit-done).

## Uso

```
/especdev:explorar <área o concepto a investigar>
/especdev:explorar --profundidad <superficial|media|profunda>
/especdev:explorar --modo supuestos                            # Modo Supuestos (nuevo)
```

## Dos Modos de Exploración

### Modo Interactivo (default)

El modo original: el agente investiga y hace preguntas al usuario.

**Flujo:** Escanear → Preguntar → Documentar → Repetir (15-20 interacciones típicas)

### Modo Supuestos (nuevo)

El agente analiza el codebase, forma **supuestos con evidencia**, y el usuario solo confirma o corrige.

**Flujo:** Analizar → Presentar supuestos → Usuario confirma/corrige (2-4 interacciones típicas)

**Cuándo usar cada modo:**

| Situación | Modo recomendado |
|-----------|------------------|
| Proyecto nuevo sin código | Interactivo |
| Codebase existente con >10 archivos | **Supuestos** |
| Usuario conoce bien el proyecto | **Supuestos** |
| Dominio complejo o desconocido | Interactivo |
| Quiero terminar rápido | **Supuestos** |

## Comportamiento — Modo Interactivo

1. **Escanear** estructura del proyecto (directorios, archivos clave)
2. **Identificar** stack tecnológico (package.json, requirements.txt, etc.)
3. **Mapear** patrones existentes (naming, estructura, imports)
4. **Detectar** convenciones (estilo de código, formato de tests)
5. **Documentar** hallazgos en `.especdev/hallazgos.md`

## Comportamiento — Modo Supuestos

### Paso 1: Análisis Silencioso

El agente analiza 5-15 archivos relevantes **sin preguntar nada**:

```
Analizando codebase...
├── Archivos escaneados: 12
├── Patrones detectados: 8
├── Convenciones inferidas: 5
└── Supuestos formados: 7
```

### Paso 2: Presentar Supuestos

Cada supuesto incluye **evidencia** y **nivel de confianza**:

```markdown
## Supuestos sobre el Módulo de Autenticación

### S1: El proyecto usa Repository Pattern [ALTA confianza]
**Evidencia:**
- `src/repositories/user_repo.py` existe con interface definida (línea 5-15)
- `src/services/auth_service.py` recibe repositorio por inyección (línea 8)
- 3 repositorios más siguen el mismo patrón

**Supuesto:** Los nuevos componentes DEBEN seguir Repository Pattern con DI.
→ ¿Correcto? [sí/no/matiz]

---

### S2: Los tests de integración usan base de datos real [MEDIA confianza]
**Evidencia:**
- `tests/conftest.py` crea una BD de test (línea 12-20)
- No hay mocks de BD en `tests/integration/`
- Pero `tests/unit/` sí usa mocks

**Supuesto:** Integration tests = BD real. Unit tests = mocks.
→ ¿Correcto? [sí/no/matiz]

---

### S3: No hay sistema de permisos/roles [ALTA confianza]
**Evidencia:**
- No existe archivo de roles ni middleware de permisos
- El JWT solo contiene `user_id`, sin `role` ni `permissions`
- No hay tests relacionados con autorización

**Supuesto:** La feature nueva NO necesita considerar roles/permisos.
→ ¿Correcto? [sí/no/matiz]
```

### Paso 3: Confirmar/Corregir

El usuario responde con:
- **"sí"** → Supuesto confirmado
- **"no"** → Supuesto rechazado (el agente pide la corrección)
- **"matiz: ..."** → Parcialmente correcto (el agente ajusta)

### Paso 4: Generar Hallazgos

Los supuestos confirmados se documentan en `.especdev/hallazgos.md` con la misma estructura que el modo interactivo, pero **más rápido**.

## Niveles de Confianza

| Nivel | Significado | Evidencia requerida |
|-------|-------------|---------------------|
| **ALTA** | Patrón consistente en 3+ archivos | ≥3 archivos coinciden |
| **MEDIA** | Patrón en 1-2 archivos o con excepciones | 1-2 archivos, con contraejemplos |
| **BAJA** | Inferencia sin evidencia directa | Sin archivos que lo demuestren directamente |

**Regla:** Solo presentar supuestos con confianza MEDIA o ALTA. Los de confianza BAJA se descartan o se convierten en preguntas abiertas.

## Output

```markdown
## Exploración: Módulo de Autenticación

### Stack Detectado
- Framework: FastAPI 0.115
- ORM: SQLAlchemy 2.0
- Auth: JWT con python-jose
- Tests: pytest + pytest-asyncio

### Estructura
app/
├── services/auth_service.py  (342 líneas)
├── routers/auth.py           (89 líneas)
├── models/user.py            (45 líneas)
└── middleware/jwt.py          (67 líneas)

### Convenciones Encontradas
- Servicios usan async/await
- Repository pattern con inyección de dependencias
- Tests unitarios en tests/unit/, integración en tests/integration/
- Naming: snake_case para todo

### Funcionalidad Existente Relevante
- `auth_service.create_user()` ya existe
- `jwt.verify_token()` ya existe
- `UserRepository` interface definida

### Supuestos Confirmados (Modo Supuestos)
- S1 ✅ Repository Pattern con DI es obligatorio
- S2 ✅ Integration tests = BD real, unit tests = mocks
- S3 ✅ No hay sistema de roles/permisos

### ⚠️ Notas
- El middleware de auth no cubre rutas /admin/*
- No hay tests para refresh token
```

## Integración con Pipeline

```
/especdev:explorar → hallazgos.md
→ /especdev:proponer → propuesta de cambio
→ /especdev:especificar → .feature
→ ... (pipeline normal)
```
