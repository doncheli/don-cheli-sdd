# Regras de Trabalho Globais

## Como Melhoram o Framework

Estas regras estabelecem um **padrão profissional de desenvolvimento** aplicável a todos os projetos que usam o Don Cheli. Enquanto a constituição define os *princípios*, estas regras definem as *práticas* concretas. O framework as carrega automaticamente e as aplica em cada sessão, eliminando a necessidade de repetir instruções manualmente.

> **Uso:** Estas regras são carregadas automaticamente ao executar `/dc:iniciar`. Podem ser personalizadas por projeto em `.dc/config.yaml`.

---

## Princípios Gerais

- Todo desenvolvimento deve ser **retrocompatível** a menos que seja indicado explicitamente o contrário.
- Responder de forma direta e concisa, sem preâmbulos desnecessários.

---

## Idioma

| Contexto | Idioma |
|----------|--------|
| Código (variáveis, funções, comentários) | **Inglês** |
| Commits e PR descriptions | **Português** |
| Respostas ao usuário | **Português** (salvo solicitação de outro idioma) |
| Documentação (spec.md, tech.md) | **Português** |

---

## Precedência de Configuração

```
.dc/config.yaml (projeto) > reglas-trabajo-globales.md (framework)
```

Se o projeto tiver seu próprio `.dc/config.yaml` ou `CLAUDE.md`, suas regras **prevalecem** sobre este arquivo em caso de conflito.

---

## Contexto do Repositório

- Antes de iniciar qualquer tarefa, buscar e ler o `CLAUDE.md` do projeto, se existir.
- Se o repo tiver um `docs/index.md`, consultá-lo como mapa de navegação antes de buscar arquivos avulsos.

---

## Branches e Naming

| Tipo | Formato | Origem |
|------|---------|--------|
| Feature | `feature/<nome-abreviado>` | `develop` (ou branch principal) |
| Fix | `fix/<nome>` | `develop` |
| Hotfix | `hotfix/<nome>` | `main`/`production` |

---

## Commits

```
<type>: <descrição curta em português>
```

**Types válidos:** `feat`, `fix`, `hotfix`, `refactor`, `docs`, `test`, `chore`

Exemplo: `feat: adicionar componente carrossel de produtos`

---

## Tamanho de PRs

- Um PR = **uma única mudança lógica**.
- Se o escopo crescer → propor ao usuário dividir em PRs incrementais.

---

## Documentação Obrigatória por PR

| Tipo de PR | Documentação Necessária |
|-----------|------------------------|
| Feature com lógica de negócio ou mudança de arquitetura | `spec.md` + `tech.md` em `/docs/specs/<feature>/` |
| Feature menor (<3 arquivos, sem lógica nova) | Descrição do PR é suficiente |
| Fixes, bumps de versão, config, wordings | **Isentos** de spec/tech |

- Antes de redigir o spec, **esclarecer todas as dúvidas com o usuário**.
- Todo PR deve avaliar se as mudanças requerem **atualizar `.md` existentes**.

---

## Cobertura de Código

- Mínimo **85% de coverage** sobre o código introduzido no PR (unit tests).
- O `.dc/config.yaml` do projeto pode definir outro limiar ou isentá-lo.

---

## Verificações de Qualidade

### Antes de cada commit
- [ ] Executar linter e corrigir erros
- [ ] Executar testes e verificar que passam
- [ ] Verificar que compila sem erros

### Antes de abrir PR (adicional)
- [ ] Revisar diff completo: code smells, variáveis sem uso, imports desnecessários
- [ ] Verificar coerência com `spec.md` (se existir)
- [ ] Verificar coverage mínimo sobre o código introduzido

---

## Tarefas Complexas

- Refactors >5 arquivos, mudanças de arquitetura ou migrações → **apresentar plano e aguardar confirmação** antes de executar.
- Paralelizar subtarefas independentes sempre que possível.

---

## Limites de Autonomia

| Situação | Ação |
|----------|------|
| Mudanças afetam >10 arquivos não previstos | **Confirmar com o usuário** |
| Ambiguidade significativa | **Perguntar**, não assumir |
| Teste não passa após 2 tentativas de correção | Reportar com erro completo |
| Dependência não resolve | Perguntar, não buscar workarounds |
| Build falha por razões externas | Notificar e continuar |

---

## Subagentes e Seleção de Modelos

| Tipo de Tarefa | Modelo |
|---------------|--------|
| Q&A, formatação, resumos, scripting, batch | `haiku` |
| Código, bug fixes, testes, code review | `sonnet` |
| Arquitetura, raciocínio complexo, segurança | `opus` |

**Regras:**
- **Padrão: Haiku.** Subir apenas se a qualidade do output for insuficiente.
- **Nunca** usar Opus sem confirmação explícita do usuário.
- Subtarefas independentes → subagentes **em paralelo** (nunca sequenciais).
- Subagente de exploração/busca → sempre Haiku.

---

## Gestão de Contexto e Tokens

- **Ler arquivos sob demanda**: não carregar o que não for necessário.
- **Não re-ler o que já está em contexto**: referenciar, não repetir.
- **System prompts < 500 tokens**: mover regras pouco usadas para skills.
- **Outputs estruturados desde o início**: JSON ou formato concreto = menos iterações.
- **Subagente para contexto grande**: se um resultado ultrapassa ~10K tokens, isolá-lo em subagente.

---

## Dependências

- Antes de adicionar uma dependência externa, buscar alternativas internas.
- Se não existir alternativa, documentar a justificativa na descrição do PR.

---

## Segurança

- **Nunca** expor credenciais no código-fonte.
- Sempre usar ferramentas de gestão de segredos.

---

## Documentação Gerada

- Arquivos `.md` concisos: preferir bullets em vez de parágrafos, máximo ~200 linhas.
- Não duplicar informações entre arquivos. Um dado em um único lugar; nos demais, referenciar.
