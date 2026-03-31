# Constituição do Don Cheli

> **Versão:** 2.0.0 | **Ratificada:** 2026-03-21
>
> A constituição governa TODO o código gerado sob o Don Cheli.
> Enriquecida com princípios do Specular (pei9564/Specular).

---

## I. Gherkin é Rei (Fonte Única de Verdade)

Os arquivos `.feature` em `specs/features/` são os **ÚNICOS** artefatos de especificação. Não se geram nem se mantêm arquivos spec.md separados.

- Todas as decisões de planejamento, implementação e testes DEVEM ser rastreadas até Cenários e Regras definidos no `.feature` correspondente.
- A ordem do fluxo DEVE ser: Ler Gherkin → Gerar Step Definitions (Vermelho) → Implementar Feature (Verde) → Refatorar.
- Quando um arquivo Gherkin é ambíguo ou incompleto, a lacuna DEVE ser resolvida atualizando o `.feature` — nunca inventando requisitos em artefatos posteriores.

---

## I-B. Schema como Verdade Viva (Ciclo de Vida DBML)

As definições de schema em `specs/db_schema/<dominio>.dbml` seguem um ciclo de duas fases:

1. **Provisório** (tag `@provisional` presente): Auto-gerado durante a fase Spec. Nomes de campos, tipos e restrições são rascunhos.
   - Os Cenários nos `.feature` DEVEM usar os nomes de campos provisórios como estão.
   - Os schemas provisórios DEVEM ser revisados e ratificados antes da fase Plan.

2. **Ratificado** (sem tag `@provisional`): Revisado durante o Clarify ou Plan. Uma vez ratificado, o DBML torna-se **Verdade Absoluta**.
   - Qualquer feature posterior no mesmo domínio DEVE estender (não substituir) o schema ratificado.
   - Renomear campos após a ratificação requer uma nota de migração no plano.

---

## II. Precisão Cirúrgica (Colaboração em Equipe)

Cada mudança DEVE ser a **mudança mínima viável** exigida pela tarefa atual.

- Refatoração "de passagem" de código não relacionado, helpers globais ou componentes compartilhados está **PROIBIDA** salvo solicitação explícita.
- Mudanças de formatação, adição de comentários e reordenação de imports fora do escopo da tarefa NÃO DEVEM aparecer em diffs.

---

## III. Arquitetura Plug-and-Play (Modularidade)

O código DEVE seguir o Princípio Aberto/Fechado: aberto para extensão, fechado para modificação.

- Novas features DEVEM ser entregues como módulos, Objetos de Serviço ou classes novas, sem inflar funções existentes.
- A lógica de negócio DEVE ser encapsulada em Objetos de Serviço ou classes especializadas. Controllers, Handlers e Routers DEVEM ser thin (apenas delegação).
- Concerns transversais (logging, auth, validação) DEVEM usar padrões de middleware ou decorators, não código inline.

---

## IV. A Regra "Las Vegas" (Isolamento de Serviços e Mocking)

> O que acontece dentro de um serviço FICA dentro desse serviço.

- Os testes DEVEM ser executados hermeticamente — sem chamadas de rede reais, sem estado de BD compartilhado, sem efeitos colaterais no filesystem.
- Toda interação com um serviço externo (HTTP APIs, gRPC, bancos de dados, filas de mensagens) DEVE ser mockada por padrão.
- As classes de serviço DEVEM aceitar dependências via Injeção de Dependências para que a troca de mocks por clientes reais seja transparente.
- Os testes end-to-end são a ÚNICA exceção e DEVEM ser marcados explicitamente como tais.

---

## IV-B. Regra do Ponto de Entrada (Alinhamento BDD-Arquitetura)

A validação de regras de negócio DEVE ser colocada o mais próximo possível do ponto de entrada que o passo `Quando` do BDD invoca.

**Teste de litmus:** Para cada Cenário de falha no `.feature`, perguntar: _"O passo `Quando` realmente é executado na minha arquitetura?"_ Se a resposta for não, a arquitetura viola esta regra.

---

## V. Padrões Modernos de Código

- **Type hints** são obrigatórios em toda assinatura de função.
- **Modelos de validação** (Pydantic/Zod/equivalente) DEVEM ser usados para DTOs e schemas — dicionários/objetos brutos estão PROIBIDOS para dados estruturados.
- O style guide da linguagem DEVE ser seguido (PEP 8, ESLint, etc.). Quando o guide conflita com legibilidade, legibilidade vence.

---

## VI. Adaptabilidade ao Contexto

Antes de gerar código, o framework e toolchain DEVEM ser detectados escaneando arquivos de configuração (`package.json`, `requirements.txt`, `pyproject.toml`, etc.).

O código gerado NÃO DEVE introduzir padrões que conflitem com as dependências instaladas ou convenções estabelecidas do projeto.

---

## VII. Codificação Defensiva e Tratamento de Erros

- Blocos `try...catch` vazios que engolem erros estão PROIBIDOS. Toda exceção capturada DEVE ser logada com stack trace completo.
- O código DEVE usar classes de exceção customizadas que mapeiem para códigos de status HTTP (ex: `RecursoNaoEncontrado` → 404).
- **Regra Stop-Loss:** Se uma tarefa falha (luz Vermelha) mais de 3 vezes, o trabalho DEVE ser pausado e orientação humana DEVE ser solicitada. Ciclos infinitos de fix-break estão PROIBIDOS.

---

## VIII. Protocolo de Clarificação (Auto-QA)

Ao executar `/dc:clarificar`, o agente age como **Engenheiro QA Rigoroso** e executa obrigatoriamente:

1. **Verificação de Consistência Schema-Spec:**
   - Escanear todos os campos no Gherkin
   - Comparar com o schema DBML
   - Erro se os nomes não coincidirem exatamente
   - Erro se campo `NOT NULL` não tiver cenário de validação

2. **Verificação de Convenção de Nomes:**
   - Feature COMMAND: usar padrão pré-condição/pós-condição
   - Feature QUERY: usar padrão pré-condição/sucesso

3. **Auditoria Auto-Gerado:**
   - Revisar cenários auto-gerados
   - Marcar os que forem redundantes ou logicamente impossíveis

**Formato de saída:** ✅ PASS / ⚠️ WARNING / ❌ FAIL

---

## Governança

- Esta constituição **substitui** todas as práticas de desenvolvimento e guias de estilo dentro do repositório.
- As emendas requerem: (1) Justificativa documentada, (2) Revisão, (3) Plano de migração para código que não esteja em conformidade.
- Todos os PRs e revisões de código DEVEM verificar a conformidade com estes princípios.
