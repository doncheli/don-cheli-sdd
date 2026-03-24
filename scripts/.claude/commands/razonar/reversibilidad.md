---
description: Calibrar el nivel de compromiso según si la decisión es reversible o irreversible.
i18n: true
---

# /razonar:reversibilidad

Calibrar el nivel de compromiso según si la decisión es reversible o irreversible.

## Uso

```
/razonar:reversibilidad [decisión]
```

## Proceso

1. **Clasificar**: ¿Es reversible o irreversible?
2. **Si reversible** (puerta de dos vías): Decidir rápido, iterar
3. **Si irreversible** (puerta de una vía): Decidir con cuidado, analizar profundamente

## Regla

| Tipo | Velocidad | Análisis |
|------|-----------|----------|
| Reversible | Rápido | Mínimo |
| Irreversible | Lento | Exhaustivo |
