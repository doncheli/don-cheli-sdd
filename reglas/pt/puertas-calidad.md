# Portões de Qualidade (Quality Gates)

## Como Melhoram o Framework

Os portões de qualidade são **pontos de verificação obrigatórios** entre as fases do pipeline.
Sem eles, o pipeline avança mesmo havendo problemas. Com eles, cada fase DEVE cumprir
critérios formais antes de passar para a próxima. Isso é fundamental para a **rastreabilidade**.

> Adaptado do Specular (pei9564/Specular → constitution.md §Quality Gates)
> Alinhado com spec-kit (github/spec-kit) — critérios de completude e constitution check

---

## Os 6 Portões

| # | Portão | Fase | Critérios |
|---|--------|------|-----------|
| 1 | **Completude de Spec** | Após `/especdev:especificar` | P1 tem happy + sad path. Critérios de sucesso definidos (≥2 mensuráveis). Marcadores `[PRECISA CLARIFICAÇÃO]` identificados |
| 2 | **Status de Spec** | Antes de `/especdev:planificar-tecnico` | Tag `@lista` presente. Specs `@borrador` NÃO podem entrar na fase Plan |
| 3 | **Verificação Clarify** | Após `/especdev:clarificar` | Relatório Auto-QA sem ❌ FALHA. Todos os `[PRECISA CLARIFICAÇÃO]` resolvidos. Auditoria concluída |
| 4 | **Aprovação de Plan** | Após `/especdev:planificar-tecnico` | Verificação de constituição passa (todos ✅). Contexto técnico completo. DBML ratificado. Rastreamento de complexidade documentado |
| 5 | **Preparação de Tarefas** | Após `/especdev:desglosar` | Todas as tarefas com IDs (`T###`). Caminhos de arquivos nas tarefas de implementação. Marcadores `[P]` de paralelismo atribuídos. 5 fases presentes |
| 6 | **Merge de Código** | Após `/especdev:implementar` | Testes verdes, lint limpo, type-check passa, coverage ≥85%, sem diff não relacionado, regressão cross-fase passa |

## Verificação Automática

Cada portão é verificado automaticamente. Se falhar, o framework **bloqueia** o avanço:

```
/especdev:especificar → [Portão 1: Completude?]
    ├── ✅ PASSA → Continuar
    └── ❌ FALHA → "Faltam cenários sad path em P1" ou "Critérios de sucesso não definidos"

/especdev:clarificar → [Portão 2+3: Status? Auto-QA?]
    ├── ✅ PASSA → Marcar @lista
    └── ❌ FALHA → "Restam 2 [PRECISA CLARIFICAÇÃO] sem resolver"

/especdev:planificar-tecnico → [Portão 4: Aprovação?]
    ├── ✅ PASSA → Continuar para tarefas
    └── ❌ FALHA → "Artigo III da constituição não cumprido" ou "DBML provisório não ratificado"

/especdev:desglosar → [Portão 5: Preparação?]
    ├── ✅ PASSA → Pronto para implementar
    └── ❌ FALHA → "Tarefa T008 sem caminho de arquivo" ou "Falta Fase 5 (Verificação)"

/especdev:implementar → [Portão 6: Merge?]
    ├── ✅ PASSA → Feature concluída
    └── ❌ FALHA → "3 testes falhando" ou "Coverage 72% < 85%"
```

## Relatório de Portão

Cada portão gera um relatório estruturado:

```markdown
## Portão de Qualidade: Completude de Spec

✅ PASS: P1 tem happy path (Registro bem-sucedido)
✅ PASS: P1 tem sad path (Email duplicado)
✅ PASS: Critérios de sucesso definidos (4 mensuráveis)
⚠️ WARNING: P2 tem apenas 1 cenário (recomendado: ≥2)
✅ PASS: 3 marcadores [PRECISA CLARIFICAÇÃO] identificados
❌ FAIL: P3+ tem cenário sem critério de aceite

**Resultado: NÃO-AVANÇAR (1 FAIL)**
→ Ação requerida: Adicionar Given/When/Then ao cenário P3+ "Registro OAuth"
```

## Regressão Cross-Fase

Ao concluir o Portão 6 de uma feature, é executada **regressão automática** sobre features anteriores:

```
Feature atual: CriarUsuario (Portão 6)
  │
  ├── Testes de CriarUsuario: ✅ 21/21
  ├── Regressão: ListarProdutos (feature anterior): ✅ 15/15
  ├── Regressão: GerenciarCarrinho (feature anterior): ✅ 18/18
  └── Resultado: ✅ SEM REGRESSÃO

  Algum teste de feature anterior falhou?
  ├── NÃO → ✅ Portão 6 passa
  └── SIM → ❌ REGRESSÃO DETECTADA
       └── Identificar qual teste quebrou e em qual feature
```

**Regra:** Não se pode mergear código que quebra features anteriores. A regressão cross-fase é parte obrigatória do Portão 6.
