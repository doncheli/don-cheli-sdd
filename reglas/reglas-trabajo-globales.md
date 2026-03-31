# Reglas de Trabajo Globales

## Cómo Mejoran el Framework

Estas reglas establecen un **estándar profesional de desarrollo** que se aplica a todos los proyectos que usen Don Cheli. Mientras que la constitución define los *principios*, estas reglas definen las *prácticas* concretas. El framework las carga automáticamente y las aplica en cada sesión, eliminando la necesidad de repetir instrucciones manualmente.

> **Uso:** Estas reglas se cargan automáticamente al ejecutar `/dc:iniciar`. Se pueden personalizar por proyecto en `.especdev/config.yaml`.

---

## Principios Generales

- Todo desarrollo debe ser **retrocompatible** a menos que se indique explícitamente lo contrario.
- Responder de forma directa y concisa, sin preámbulos innecesarios.

---

## Idioma

| Contexto | Idioma |
|----------|--------|
| Código (variables, funciones, comentarios) | **Inglés** |
| Commits y PR descriptions | **Español** |
| Respuestas al usuario | **Español** (salvo que pida otro) |
| Documentación (spec.md, tech.md) | **Español** |

---

## Precedencia de Configuración

```
.especdev/config.yaml (proyecto) > reglas-trabajo-globales.md (framework)
```

Si el proyecto tiene su propio `.especdev/config.yaml` o `CLAUDE.md`, sus reglas **prevalecen** sobre este archivo en caso de conflicto.

---

## Contexto del Repositorio

- Antes de empezar cualquier tarea, buscar y leer el `CLAUDE.md` del proyecto si existe.
- Si el repo tiene un `docs/index.md`, consultarlo como mapa de navegación antes de buscar archivos sueltos.

---

## Branches y Naming

| Tipo | Formato | Origen |
|------|---------|--------|
| Feature | `feature/<nombre-abreviado>` | `develop` (o rama principal) |
| Fix | `fix/<nombre>` | `develop` |
| Hotfix | `hotfix/<nombre>` | `main`/`production` |

---

## Commits

```
<type>: <descripción corta en español>
```

**Types válidos:** `feat`, `fix`, `hotfix`, `refactor`, `docs`, `test`, `chore`

Ejemplo: `feat: agregar componente carrusel de productos`

---

## Tamaño de PRs

- Un PR = **un único cambio lógico**.
- Si el scope crece → proponer al usuario dividir en PRs incrementales.

---

## Documentación Obligatoria por PR

| Tipo de PR | Documentación Requerida |
|-----------|------------------------|
| Feature con lógica de negocio o cambio de arquitectura | `spec.md` + `tech.md` en `/docs/specs/<feature>/` |
| Feature menor (<3 archivos, sin lógica nueva) | Descripción del PR es suficiente |
| Fixes, bumps de versión, config, wordings | **Exentos** de spec/tech |

- Antes de redactar el spec, **aclarar todas las dudas con el usuario**.
- Todo PR debe evaluar si los cambios requieren **actualizar `.md` existentes**.

---

## Cobertura de Código

- Mínimo **85% de coverage** sobre el código introducido en el PR (unit tests).
- El `.especdev/config.yaml` del proyecto puede definir otro umbral o eximirlo.

---

## Verificaciones de Calidad

### Antes de cada commit
- [ ] Ejecutar linter y corregir errores
- [ ] Ejecutar tests y verificar que pasen
- [ ] Verificar que compile sin errores

### Antes de abrir PR (adicional)
- [ ] Revisar diff completo: code smells, variables sin usar, imports innecesarios
- [ ] Verificar coherencia con `spec.md` (si existe)
- [ ] Verificar coverage mínimo sobre código introducido

---

## Tareas Complejas

- Refactors >5 archivos, cambios de arquitectura o migraciones → **presentar plan y esperar confirmación** antes de ejecutar.
- Paralelizar subtareas independientes siempre que sea posible.

---

## Límites de Autonomía

| Situación | Acción |
|-----------|--------|
| Cambios afectan >10 archivos no previstos | **Confirmar con el usuario** |
| Ambigüedad significativa | **Preguntar**, no asumir |
| Test no pasa después de 2 intentos de fix | Reportar con error completo |
| Dependencia no resuelve | Preguntar, no buscar workarounds |
| Build falla por razones externas | Notificar y continuar |

---

## Subagentes y Selección de Modelos

| Tipo de Tarea | Modelo |
|--------------|--------|
| Q&A, formateo, resúmenes, scripting, batch | `haiku` |
| Código, bug fixes, tests, code review | `sonnet` |
| Arquitectura, razonamiento complejo, seguridad | `opus` |

**Reglas:**
- **Default: Haiku.** Subir solo si la calidad del output es insuficiente.
- **Nunca** usar Opus sin confirmación explícita del usuario.
- Subtareas independientes → subagentes **en paralelo** (nunca secuenciales).
- Subagente de exploración/búsqueda → siempre Haiku.

---

## Gestión de Contexto y Tokens

- **Leer archivos bajo demanda**: no cargar lo que no sea necesario.
- **No re-leer lo que ya está en contexto**: referenciar, no repetir.
- **System prompts < 500 tokens**: mover reglas poco usadas a skills.
- **Outputs estructurados desde el inicio**: JSON o formato concreto = menos iteraciones.
- **Subagente para contexto grande**: si un resultado supera ~10K tokens, aislarlo en subagente.

---

## Dependencias

- Antes de agregar una dependencia externa, buscar alternativas internas.
- Si no existe alternativa, documentar la justificación en la descripción del PR.

---

## Seguridad

- **Nunca** exponer credenciales en código fuente.
- Usar siempre herramientas de gestión de secretos.

---

## Documentación Generada

- Archivos `.md` concisos: preferir bullets sobre párrafos, máximo ~200 líneas.
- No duplicar información entre archivos. Un dato en un solo lugar; en los demás, referenciar.
