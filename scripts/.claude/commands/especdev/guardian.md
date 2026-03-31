---
description: Revisión de código IA como pre-commit hook — Guardian Angel
i18n: true
---

# /dc:guardian

## Objetivo

Ejecutar revisión de código automatizada usando IA como puerta de calidad antes de cada commit. Actúa como un "Ángel Guardián" que valida que el código cumple con los estándares del equipo.

> Inspirado en GGA (Gentleman Guardian Angel) de Gentle-AI.

## Uso

```
/dc:guardian                    # Revisar archivos staged
/dc:guardian --modo pr          # Revisar todos los cambios del branch vs base
/dc:guardian --modo ci          # Para integración continua
/dc:guardian --instalar-hook    # Instalar como pre-commit hook
```

## Cómo Funciona

```
git add <archivos>
git commit -m "feat: agregar login"
    │
    ├── Hook pre-commit se activa
    │   └── /dc:guardian
    │       ├── Lee archivos staged
    │       ├── Lee reglas de .especdev/estandares.md
    │       ├── Envía al LLM para revisión
    │       └── Resultado:
    │           ├── ✅ PASS → commit permitido
    │           ├── ⚠️ WARN → commit con advertencias
    │           └── ❌ FAIL → commit BLOQUEADO
    │
    └── Resultado del commit
```

## Estandares de Revisión

El archivo `.especdev/estandares.md` define las reglas que el Guardian valida:

```markdown
# Estándares de Código

## Obligatorios (❌ si falta)
- [ ] Type hints en todas las firmas de función
- [ ] No hay `any` / `Any` sin justificación
- [ ] Tests para lógica de negocio nueva
- [ ] No credenciales en código fuente
- [ ] Manejo de errores (no try/catch vacíos)

## Recomendados (⚠️ si falta)
- [ ] Docstrings en funciones públicas
- [ ] Nombres descriptivos (no variables de 1 letra)
- [ ] Imports organizados
```

## Output

```
=== Guardian Angel: Revisión de Código ===

Archivos revisados: 3
Modelo usado: sonnet

✅ PASS: app/services/auth_service.py
  • Type hints completos
  • Manejo de errores correcto
  • Tests existentes

⚠️ WARN: app/routers/auth.py
  • Falta docstring en endpoint /login (recomendado)
  • Import no usado: `from typing import Optional`

❌ FAIL: app/config.py
  • Línea 23: API_KEY hardcodeada — usar variable de entorno
  • Línea 45: try/except vacío que engulre errores

RESULTADO: BLOQUEADO (1 FAIL)
→ Corregir los issues marcados con ❌ antes de commitear
```

## Caché Inteligente

- SHA256 por archivo — solo re-revisa archivos que cambiaron
- Solo archivos con `PASS` se cachean
- El caché se invalida si `.especdev/estandares.md` cambia

## Selección de Modelo

| Tipo de Revisión | Modelo |
|-----------------|--------|
| Style / lint | `haiku` (rápido, barato) |
| Lógica de negocio | `sonnet` (balance) |
| Seguridad / crypto | `opus` (profundidad) |
