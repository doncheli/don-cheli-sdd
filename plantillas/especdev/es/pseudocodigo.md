# Pseudocódigo

Lógica de alto nivel agnóstica de lenguaje/framework. Se genera DESPUÉS de especificar y ANTES de planificar. Fuerza al agente a razonar sobre la lógica sin comprometer tecnología.

## [Feature/Módulo]

### Flujo Principal
```
CUANDO usuario hace X
  VALIDAR que Y
  SI condición A
    EJECUTAR acción B
    PERSISTIR resultado en C
    NOTIFICAR a D
  SINO
    RETORNAR error E
```

### Invariantes
<!-- Condiciones que SIEMPRE deben ser verdad -->
- [Invariante 1]
- [Invariante 2]

### Casos Límite
<!-- Qué pasa en los bordes -->
- [Edge case 1]: [comportamiento esperado]
- [Edge case 2]: [comportamiento esperado]

### Dependencias de Datos
<!-- Qué datos necesita y de dónde vienen -->
- [Dato 1] ← [Fuente]
- [Dato 2] ← [Fuente]

---
*Se genera con `/especdev:pseudocodigo` entre especificar y planificar.*
