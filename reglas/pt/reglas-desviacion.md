# Regras de Desvio

## As 5 Regras

Quando você encontra algo inesperado durante a execução:

| Regra | Gatilho | Ação |
|:-----:|---------|------|
| **1** | Bug encontrado | 🔧 Auto-corrigir imediatamente |
| **2** | Falta algo crítico (deps, config) | ➕ Auto-adicionar imediatamente |
| **3** | Bloqueador (impede progresso) | 🚧 Auto-desbloquear imediatamente |
| **4** | Mudança arquitetural | ⛔ **PARAR E PERGUNTAR** |
| **5** | Melhoria (nice-to-have) | 📝 Registrar em ISSUES.md |

## Distribuição de Autonomia

```
AUTÔNOMO (apenas fazer):
├── Regra 1: Bug → Corrigir
├── Regra 2: Faltante → Adicionar
├── Regra 3: Bloqueador → Desbloquear
└── Regra 5: Melhoria → Registrar

HUMANO NECESSÁRIO (parar e perguntar):
└── Regra 4: Mudança arquitetural
```

## Guia Rápido de Decisão

```
Posso corrigir isso em < 5 min sem mudar como as coisas funcionam juntas?
├── SIM → Regras 1, 2 ou 3 (auto-gerenciar)
└── NÃO → Precisa de uma decisão de design?
          ├── SIM → Regra 4 (PARAR e PERGUNTAR)
          └── NÃO → Regra 5 (Registrar e continuar)
```
