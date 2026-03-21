# Reglas de Desviación

## Las 5 Reglas

Cuando encuentras algo inesperado durante la ejecución:

| Regla | Disparador | Acción |
|:-----:|-----------|--------|
| **1** | Bug encontrado | 🔧 Auto-corregir inmediatamente |
| **2** | Falta algo crítico (deps, config) | ➕ Auto-agregar inmediatamente |
| **3** | Bloqueador (impide progreso) | 🚧 Auto-desbloquear inmediatamente |
| **4** | Cambio arquitectónico | ⛔ **PARAR Y PREGUNTAR** |
| **5** | Mejora (nice-to-have) | 📝 Registrar en ISSUES.md |

## Distribución de Autonomía

```
AUTÓNOMO (solo hacerlo):
├── Regla 1: Bug → Corregir
├── Regla 2: Faltante → Agregar
├── Regla 3: Bloqueador → Desbloquear
└── Regla 5: Mejora → Registrar

HUMANO REQUERIDO (parar y preguntar):
└── Regla 4: Cambio arquitectónico
```

## Guía Rápida de Decisión

```
¿Puedo corregir esto en < 5 min sin cambiar cómo las cosas trabajan juntas?
├── SÍ → Reglas 1, 2 o 3 (auto-manejar)
└── NO → ¿Necesita una decisión de diseño?
          ├── SÍ → Regla 4 (PARAR y PREGUNTAR)
          └── NO → Regla 5 (Registrar y continuar)
```
