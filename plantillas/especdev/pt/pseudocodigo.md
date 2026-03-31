# Pseudocódigo

Lógica de alto nível agnóstica de linguagem/framework. Gerado DEPOIS de especificar e ANTES de planejar. Força o agente a raciocinar sobre a lógica sem comprometer tecnologia.

## [Feature/Módulo]

### Fluxo Principal
```
QUANDO usuário faz X
  VALIDAR que Y
  SE condição A
    EXECUTAR ação B
    PERSISTIR resultado em C
    NOTIFICAR D
  SENÃO
    RETORNAR erro E
```

### Invariantes
<!-- Condições que SEMPRE devem ser verdadeiras -->
- [Invariante 1]
- [Invariante 2]

### Casos Limite
<!-- O que acontece nas bordas -->
- [Edge case 1]: [comportamento esperado]
- [Edge case 2]: [comportamento esperado]

### Dependências de Dados
<!-- Quais dados são necessários e de onde vêm -->
- [Dado 1] ← [Fonte]
- [Dado 2] ← [Fonte]

---
*Gerado com `/dc:pseudocodigo` entre especificar e planejar.*
