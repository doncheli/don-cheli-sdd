---
description: Ejecutar tareas TDD fase por fase dentro de Docker hasta que todos los tests pasen
i18n: true
---

# /especdev:implementar

## Objetivo

Ejecutar las tareas generadas por `/especdev:desglosar` de forma automatizada, siguiendo el ciclo TDD (RED → GREEN → REFACTOR) dentro de un entorno Docker aislado, con checkpoints formalizados para intervención humana.

> Adaptado del comando `speckit.implement` de Specular.
> Mejorado con Taxonomía de Checkpoints de Get Shit Done (gsd-build/get-shit-done).

## Uso

```
/especdev:implementar @specs/features/<dominio>/<Feature>.tasks.md
/especdev:implementar --fase <numero>
/especdev:implementar --seco   # Solo mostrar plan sin ejecutar
```

## Comportamiento

1. **Leer** archivo `.tasks.md`
2. **Verificar** que Docker está disponible
3. **Verificar Nyquist** — Validar mapeo tests↔requisitos (Puerta 5)
4. **Ejecutar** tareas fase por fase con checkpoints

### Flujo por Fase

```
┌─ Fase 1: Setup ───────────────────────────────┐
│  Crear archivos vacíos: modelos, servicios,    │
│  repositorios, controladores, tests            │
│  → Verificar: archivos existen                 │
└────────────────────────────────────────────────┘
         │
┌─ Fase 2: Tests Unitarios (RED) ───────────────┐
│  Escribir tests que FALLAN                     │
│  → docker compose run --rm test                │
│  → Verificar: tests existen y FALLAN (RED)     │
└────────────────────────────────────────────────┘
         │
┌─ Fase 3: Tests BDD/Integración (RED) ────────┐
│  Escribir tests BDD desde Gherkin              │
│  → Aplicar patrones ISA (isa.yml)             │
│  → docker compose run --rm test                │
│  → Verificar: tests BDD existen y FALLAN       │
└────────────────────────────────────────────────┘
         │
┌─ Fase 4: Lógica de Negocio (GREEN) ──────────┐
│  Implementar código que hace pasar los tests   │
│  → docker compose run --rm test                │
│  → [DETECCIÓN STUBS] automática                │
│  → Verificar: TODOS los tests PASAN (GREEN)    │
└────────────────────────────────────────────────┘
         │
┌─ Fase 5: Lint & Tipos ───────────────────────┐
│  → docker compose run --rm lint                │
│  → Verificar: sin errores de lint/tipos        │
└────────────────────────────────────────────────┘
```

## Taxonomía de Checkpoints

Durante la ejecución, hay momentos donde el agente DEBE pausar para intervención humana. Estos se clasifican en 3 tipos:

### 1. `[checkpoint:verificar]` — Verificación Humana (90% de los casos)

El agente completó una tarea y necesita que el usuario **verifique el resultado** visualmente o funcionalmente.

```markdown
⏸️ CHECKPOINT: verificar
Tarea: T013 — Implementar UsuarioController
Verificación: Abrir http://localhost:3000/register y verificar:
  - [ ] El formulario renderiza correctamente
  - [ ] Los campos tienen labels y placeholders
  - [ ] El submit envía los datos al backend
  - [ ] Los errores de validación se muestran al usuario

→ ¿Verificado? [sí/no/parcial]
```

**Cuándo usar:**
- UI implementada que requiere verificación visual
- Flujo de usuario completo que requiere testing manual
- Integración con servicio externo (OAuth, pagos)

### 2. `[checkpoint:decision]` — Decisión Humana (9% de los casos)

El agente llegó a un punto donde hay **múltiples opciones válidas** y necesita una decisión del usuario.

```markdown
⏸️ CHECKPOINT: decisión
Tarea: T010 — Implementar UsuarioService
Decisión requerida: Estrategia de hashing de contraseña

  A) bcrypt (estándar, bien conocido, ~100ms/hash)
  B) argon2id (más moderno, más seguro, ~200ms/hash)
  C) scrypt (alternativa, menos popular)

Recomendación: B (argon2id) — mejor resistencia a ataques GPU
→ Tu elección: [A/B/C]
```

**Cuándo usar:**
- Elección de librería/dependencia externa
- Decisión arquitectónica con trade-offs
- Configuración de seguridad
- Proveedor de servicio externo

### 3. `[checkpoint:accion-humana]` — Acción Humana (1% de los casos)

El agente necesita que el usuario **haga algo** que no puede automatizarse.

```markdown
⏸️ CHECKPOINT: acción-humana
Tarea: T015 — Configurar OAuth con Google
Acción requerida: Crear credenciales en Google Cloud Console

  1. Ir a https://console.cloud.google.com/apis/credentials
  2. Crear OAuth 2.0 Client ID
  3. Agregar redirect URI: http://localhost:3000/api/auth/callback/google
  4. Copiar Client ID y Client Secret

→ Proporcionar:
  - GOOGLE_CLIENT_ID: ___
  - GOOGLE_CLIENT_SECRET: ___
```

**Cuándo usar:**
- Configuración de servicios externos (OAuth, DNS, certificados)
- Acciones en dashboards que no tienen API/CLI
- Aprobaciones organizacionales
- Configuración de hardware/dispositivos

### Principio: "Si el agente puede ejecutarlo, el agente lo ejecuta"

Los checkpoints son **excepciones**, no la norma. Solo usar cuando genuinamente se necesita intervención humana.

| Automatizable | NO checkpoint | Ejemplo |
|---------------|---------------|---------|
| Instalar dependencia | `npm install bcrypt` | El agente lo ejecuta |
| Crear migración | `prisma migrate dev` | El agente lo ejecuta |
| Ejecutar tests | `pytest` | El agente lo ejecuta |
| Formatear código | `prettier --write .` | El agente lo ejecuta |

| No automatizable | SÍ checkpoint | Tipo |
|------------------|---------------|------|
| ¿Se ve bien la UI? | Verificar | `verificar` |
| ¿bcrypt o argon2? | Decidir | `decisión` |
| Crear API key en dashboard | Acción | `acción-humana` |

## Regla Stop-Loss

> Si una tarea falla (luz ROJA) más de **3 veces** durante la implementación, el trabajo DEBE detenerse y se DEBE solicitar guía humana. Los ciclos infinitos de fix-break están **PROHIBIDOS**.

Integración con **Detección de Loops** (habilidad): si se detecta un loop, escalar según los 3 niveles de escape antes de llegar al stop-loss.

## Ejemplo

```bash
/especdev:implementar @specs/features/usuario/CrearUsuario.tasks.md

=== Implementando: CrearUsuario ===

📁 Fase 1: Setup
  ✅ app/models/usuario.py (creado)
  ✅ app/services/usuario_service.py (creado)
  ✅ tests/unit/test_usuario_service.py (creado)
  ✅ tests/integracion/test_crear_usuario.py (creado)

🔴 Fase 2: Tests Unitarios (RED)
  ✅ 3 tests escritos
  ✅ 3/3 FALLAN (RED esperado)

🔴 Fase 3: Tests BDD (RED)
  ✅ 4 escenarios BDD escritos (desde .feature)
  ✅ 4/4 FALLAN (RED esperado)
  ✅ ISA patterns aplicados

⏸️ CHECKPOINT: decisión
  Estrategia de hashing: bcrypt vs argon2id
  → Usuario elige: argon2id

🟢 Fase 4: Lógica de Negocio (GREEN)
  ✅ UsuarioService.crear() implementado
  ✅ Detección de stubs: 0 stubs encontrados
  ✅ 7/7 tests PASAN (GREEN)

⏸️ CHECKPOINT: verificar
  Abrir http://localhost:3000/register
  → Usuario verifica: ✅ OK

✨ Fase 5: Lint
  ✅ Sin errores de lint
  ✅ 0 type errors

=== COMPLETO ===
Todos los tests pasan. Feature implementada exitosamente.
```

## Integración con Docker

```yaml
# docker-compose.yml (requerido)
services:
  test:
    build: .
    command: pytest -v
    volumes:
      - .:/app
  lint:
    build: .
    command: |
      flake8 app/ &&
      mypy app/ --strict
    volumes:
      - .:/app
  reporte:
    build: .
    command: pytest --html=reports/test-report.html --self-contained-html
    volumes:
      - .:/app
      - ./reports:/app/reports
```
