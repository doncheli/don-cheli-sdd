# Constitución de Don Cheli

> **Versión:** 2.0.0 | **Ratificada:** 2026-03-21
>
> La constitución gobierna TODO el código generado bajo Don Cheli.
> Enriquecida con principios de Specular (pei9564/Specular).

---

## I. Gherkin es Rey (Fuente Única de Verdad)

Los archivos `.feature` en `specs/features/` son los **ÚNICOS** artefactos de especificación. No se generan ni mantienen archivos spec.md separados.

- Todas las decisiones de planificación, implementación y testing DEBEN rastrearse hasta Escenarios y Reglas definidos en el `.feature` correspondiente.
- El orden del flujo DEBE ser: Leer Gherkin → Generar Step Definitions (Rojo) → Implementar Feature (Verde) → Refactorizar.
- Cuando un archivo Gherkin es ambiguo o incompleto, el vacío DEBE resolverse actualizando el `.feature` — nunca inventando requisitos en artefactos posteriores.

---

## I-B. Schema como Verdad Viva (Ciclo de Vida DBML)

Las definiciones de schema en `specs/db_schema/<dominio>.dbml` siguen un ciclo de dos fases:

1. **Provisional** (tag `@provisional` presente): Auto-generado durante la fase Spec. Nombres de campos, tipos y restricciones son borradores.
   - Los Escenarios en `.feature` DEBEN usar los nombres de campos provisionales tal como están.
   - Los schemas provisionales DEBEN revisarse y ratificarse antes de la fase Plan.

2. **Ratificado** (sin tag `@provisional`): Revisado durante Clarify o Plan. Una vez ratificado, el DBML se convierte en **Verdad Absoluta**.
   - Cualquier feature posterior en el mismo dominio DEBE extender (no reemplazar) el schema ratificado.
   - Renombrar campos después de la ratificación requiere una nota de migración en el plan.

---

## II. Precisión Quirúrgica (Colaboración en Equipo)

Cada cambio DEBE ser el **cambio mínimo viable** requerido por la tarea actual.

- Refactoring "de paso" de código no relacionado, helpers globales o componentes compartidos está **PROHIBIDO** salvo que se solicite explícitamente.
- Cambios de formato, adición de comentarios y reordenamiento de imports fuera del alcance de la tarea NO DEBEN aparecer en diffs.

---

## III. Arquitectura Plug-and-Play (Modularidad)

El código DEBE seguir el Principio Abierto/Cerrado: abierto para extensión, cerrado para modificación.

- Nuevas features DEBEN entregarse como módulos, Objetos de Servicio o clases nuevas, no inflando funciones existentes.
- La lógica de negocio DEBE encapsularse en Objetos de Servicio o clases especializadas. Controllers, Handlers y Routers DEBEN ser thin (solo delegación).
- Concerns transversales (logging, auth, validación) DEBEN usar patrones de middleware o decoradores, no código inline.

---

## IV. La Regla "Las Vegas" (Aislamiento de Servicios y Mocking)

> Lo que pasa dentro de un servicio SE QUEDA dentro de ese servicio.

- Los tests DEBEN ejecutarse herméticamente — sin llamadas de red reales, sin estado de BD compartido, sin efectos secundarios en el filesystem.
- Toda interacción con un servicio externo (HTTP APIs, gRPC, bases de datos, colas de mensajes) DEBE estar mockeada por defecto.
- Las clases de servicio DEBEN aceptar dependencias via Inyección de Dependencias para que intercambiar mocks por clientes reales sea transparente.
- Los tests end-to-end son la ÚNICA excepción y DEBEN marcarse explícitamente como tales.

---

## IV-B. Regla del Punto de Entrada (Alineamiento BDD-Arquitectura)

La validación de reglas de negocio DEBE colocarse lo más cerca posible del punto de entrada que el paso `Cuando` del BDD invoca.

**Test de litmus:** Para cada Escenario de fallo en el `.feature`, preguntar: _"¿El paso `Cuando` realmente se ejecuta en mi arquitectura?"_ Si la respuesta es no, la arquitectura viola esta regla.

---

## V. Estándares Modernos de Código

- **Type hints** son obligatorios en toda firma de función.
- **Modelos de validación** (Pydantic/Zod/equivalente) DEBEN usarse para DTOs y schemas — diccionarios/objetos crudos están PROHIBIDOS para datos estructurados.
- Se DEBE seguir el style guide del lenguaje (PEP 8, ESLint, etc.). Donde el guide conflicta con legibilidad, gana legibilidad.

---

## VI. Adaptabilidad al Contexto

Antes de generar código, el framework y toolchain DEBEN detectarse escaneando archivos de configuración (`package.json`, `requirements.txt`, `pyproject.toml`, etc.).

El código generado NO DEBE introducir patrones que conflicten con las dependencias instaladas o convenciones establecidas del proyecto.

---

## VII. Codificación Defensiva y Manejo de Errores

- Bloques `try...catch` desnudos que engullen errores están PROHIBIDOS. Toda excepción capturada DEBE logguearse con stack trace completo.
- El código DEBE usar clases de excepción custom que mapeen a códigos de estado HTTP (ej: `RecursoNoEncontrado` → 404).
- **Regla Stop-Loss:** Si una tarea falla (luz Roja) más de 3 veces, el trabajo DEBE detenerse y se DEBE solicitar guía humana. Los ciclos infinitos de fix-break están PROHIBIDOS.

---

## VIII. Protocolo de Clarificación (Auto-QA)

Al ejecutar `/dc:clarificar`, el agente actúa como **Ingeniero QA Estricto** y ejecuta obligatoriamente:

1. **Verificación de Consistencia Schema-Spec:**
   - Escanear todos los campos en el Gherkin
   - Comparar contra el schema DBML
   - Error si nombres no coinciden exactamente
   - Error si campo `NOT NULL` no tiene escenario de validación

2. **Verificación de Convención de Nombres:**
   - Feature COMMAND: usar patrón precondición/postcondición
   - Feature QUERY: usar patrón precondición/éxito

3. **Auditoría Auto-Generado:**
   - Revisar escenarios auto-generados
   - Marcar los que sean redundantes o lógicamente imposibles

**Formato de salida:** ✅ PASS / ⚠️ WARNING / ❌ FAIL

---

## Gobernanza

- Esta constitución **supersede** todas las prácticas de desarrollo y guías de estilo dentro del repositorio.
- Las enmiendas requieren: (1) Justificación documentada, (2) Revisión, (3) Plan de migración para código que ya no cumpla.
- Todos los PRs y revisiones de código DEBEN verificar cumplimiento con estos principios.
