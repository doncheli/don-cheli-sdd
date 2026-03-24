---
description: Aplicar el principio 80/20: enfocarse en el 20% que produce el 80% de los resultados.
i18n: true
---

# /razonar:pareto

Aplicar el principio 80/20: enfocarse en el 20% que produce el 80% de los resultados.

## Uso

```
/razonar:pareto [contexto]
```

## Proceso

1. **Listar** todos los elementos (features, bugs, tareas)
2. **Evaluar** el impacto de cada uno
3. **Ordenar** por impacto descendente
4. **Identificar** el 20% de mayor impacto
5. **Enfocar** recursos en ese 20%

## Ejemplo

```
/razonar:pareto "20 features solicitadas"

→ ¿Cuáles 20% entregarán 80% del valor?
→ Enfocarse en 4 features de alto impacto
→ Las 16 restantes pueden esperar
```
