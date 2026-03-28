> 🌐 Leia em outros idiomas: [Español](README.es.md) | [English](README.md) | [Português](README.pt.md)

<p align="center">
  <h1 align="center">Don Cheli — SDD Framework</h1>
  <p align="center">
    <strong>Pare de adivinhar. Comece a fazer engenharia.</strong><br/>
    <sub>Vibe coding é a faísca; SDD é o motor. Transição do caos assistido por IA para entrega profissional de software.</sub>
  </p>
  <p align="center">
    O framework de Desenvolvimento Dirigido por Especificações mais completo do mercado.<br/>
    Open source. Multilíngue (ES/EN/PT). Para Claude Code e outros agentes de IA.
  </p>
  <p align="center">
    <a href="#-instalação"><img src="https://img.shields.io/badge/instalação-1_minuto-brightgreen" alt="Install"></a>
    <img src="https://img.shields.io/badge/licença-Apache%202.0-green" alt="License">
    <img src="https://img.shields.io/badge/idiomas-ES%20|%20EN%20|%20PT-red" alt="Languages">
    <img src="https://img.shields.io/badge/comandos-85+-purple" alt="Commands">
    <img src="https://img.shields.io/badge/habilidades-42+-orange" alt="Skills">
    <img src="https://img.shields.io/badge/Anthropic%20Skills%202.0-compatible-blueviolet" alt="Skills 2.0">
    <br/>
    <a href="https://github.com/doncheli/don-cheli-sdd/actions/workflows/validar.yml"><img src="https://github.com/doncheli/don-cheli-sdd/actions/workflows/validar.yml/badge.svg" alt="CI"></a>
    <a href="https://www.npmjs.com/package/don-cheli-sdd"><img src="https://img.shields.io/npm/v/don-cheli-sdd" alt="npm"></a>
    <a href="./CHANGELOG.md"><img src="https://img.shields.io/badge/changelog-ver-blue" alt="Changelog"></a>
    <img src="https://img.shields.io/github/last-commit/doncheli/don-cheli-sdd" alt="Last Commit">
    <img src="https://img.shields.io/github/contributors/doncheli/don-cheli-sdd" alt="Contributors">
  </p>
</p>

---

## O Problema

Você começa um projeto com IA. As primeiras 2 horas tudo vai bem. Depois:

- **Context rot** — Claude esquece suas decisões de arquitetura
- **Stubs silenciosos** — Diz "implementei o serviço" mas o código diz `// TODO`
- **Sem verificação** — Funciona? Não sei. Testes? Não. Posso fazer deploy? Tomara

Isso é **vibe coding**. E é o inimigo do software de qualidade.

## A Solução

**Don Cheli** transforma o caos em um processo estruturado:

```
Especificar → Clarificar → Planejar → Decompor → Implementar → Revisar
```

Cada etapa tem **portas de qualidade**. Você não avança sem cumpri-las. O código é gerado com **TDD obrigatório**, **detecção de stubs** e **peer review de 7 dimensões**.

---

## Por que Don Cheli

<table>
<tr><th></th><th>BMAD<br/><sub>41K ⭐</sub></th><th>GSD<br/><sub>38K ⭐</sub></th><th>spec-kit<br/><sub>40K ⭐</sub></th><th><strong>Don Cheli</strong></th></tr>
<tr><td>Comandos</td><td>~20</td><td>~80</td><td>~10</td><td><strong>85+</strong></td></tr>
<tr><td>Habilidades (Skills)</td><td>~15</td><td>~15</td><td>~6</td><td><strong>42</strong></td></tr>
<tr><td>Modelos de raciocínio</td><td>—</td><td>—</td><td>—</td><td><strong>15</strong></td></tr>
<tr><td>Estimativas automáticas</td><td>—</td><td>—</td><td>—</td><td><strong>4 modelos</strong></td></tr>
<tr><td>Quality gates formais</td><td>—</td><td>1</td><td>4</td><td><strong>6</strong></td></tr>
<tr><td>TDD obrigatório</td><td>—</td><td>—</td><td>—</td><td><strong>Lei de Ferro</strong></td></tr>
<tr><td>Modo PoC</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Auditoria OWASP</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Migração de Stacks</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Detecção de stubs</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Contratos de UI</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Validação Nyquist</td><td>—</td><td>✅</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Multilíngue (ES/EN/PT)</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Anthropic Skills 2.0</td><td>—</td><td>—</td><td>—</td><td><strong>✅ Compatível</strong></td></tr>
<tr><td>Skill Creator (meta-skill)</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
<tr><td>Skills Marketplace</td><td>—</td><td>—</td><td>—</td><td><strong>✅</strong></td></tr>
</table>

### 20 coisas que só o Don Cheli tem

1. **15 modelos de raciocínio** — Pré-mortem, 5 porquês, Pareto, RLM
2. **4 modelos de estimação** — Pontos de Função, Planning Poker IA, COCOMO, Histórico
3. **Modo PoC** — Validar ideias com timebox e critérios de sucesso antes de se comprometer
4. **Blueprint Distillation** — Extrair specs a partir de código existente (engenharia reversa de comportamento)
5. **CodeRAG** — Indexar repositórios de referência e recuperar padrões relevantes
6. **Auditoria OWASP** — Varredura de segurança estática integrada ao pipeline
7. **Migração de Stacks** — Vue→React, JS→TS com plano de waves e equivalências
8. **Contratos de API** — REST/GraphQL com retentativas, circuit breaker, idempotência
9. **Refatoração SOLID** — Checklist, métricas, padrões de design estruturados
10. **Documentação viva** — ADRs, OpenAPI auto-gerado, diagramas Mermaid
11. **Captures & Triage** — Anotar ideias sem pausar o trabalho, classificação automática em 5 categorias
12. **UAT auto-gerado** — Scripts de aceitação executáveis por humanos após cada feature
13. **Doctor** — Diagnóstico e auto-reparo de git, framework e ambiente
14. **Skill Creator** — Meta-skill iterativo: gerar → testar → avaliar → melhorar skills automaticamente
15. **Skills Marketplace** — Instalar skills do Anthropic oficial, da comunidade, ou criar as suas próprias
16. **Constituição do Projeto** — Princípios imutáveis pré-spec validados em cada portão de qualidade
17. **Pseudocódigo Formal** — Fase de lógica agnóstica de tecnologia entre spec e planejamento (SPARC)
18. **Validação Multi-camada de Specs** — 8 verificações (vazamento de implementação, mensurabilidade, completude, aderência à constituição)
19. **Debate Adversarial Multi-role** — PM vs Arquiteto vs QA com tensões explícitas e objeções obrigatórias
20. **Planejamento Adaptativo à Escala** — Nível de planejamento se ajusta à complexidade (mesmo processo para 1 arquivo ≠ 100 arquivos)

---

## Instalação

```bash
# 1. Clonar
git clone https://github.com/doncheli/don-cheli-sdd.git

# 2. Instalar globalmente
cd don-cheli-sdd && bash scripts/instalar.sh --global

# 3. Em qualquer projeto, inicializar
/dc:iniciar
```

### Seleção de Idioma

A **primeira** coisa que você vê ao instalar é o seletor de idioma:

```
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║           🏗️  Don Cheli — SDD Framework                   ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝

  🌍 Selecciona tu idioma / Select your language / Selecione seu idioma

     1)  🇪🇸  Español
     2)  🇬🇧  English
     3)  🇧🇷  Português

  ▸ _
```

Uma vez selecionado, **todo o framework se adapta ao idioma escolhido**: pastas, arquivos, modelos, mensagens e a comunicação do Claude.

### Estrutura por Idioma

A instalação cria pastas com nomes no idioma selecionado:

<table>
<tr><th>Conteúdo</th><th>🇪🇸 Español</th><th>🇬🇧 English</th><th>🇧🇷 Português</th></tr>
<tr><td>Habilidades</td><td><code>habilidades/</code></td><td><code>skills/</code></td><td><code>habilidades/</code></td></tr>
<tr><td>Regras</td><td><code>reglas/</code></td><td><code>rules/</code></td><td><code>regras/</code></td></tr>
<tr><td>Modelos</td><td><code>plantillas/</code></td><td><code>templates/</code></td><td><code>modelos/</code></td></tr>
<tr><td>Ganchos</td><td><code>ganchos/</code></td><td><code>hooks/</code></td><td><code>ganchos/</code></td></tr>
<tr><td>Agentes</td><td><code>agentes/</code></td><td><code>agents/</code></td><td><code>agentes/</code></td></tr>
</table>

Os arquivos do projeto (`.especdev/`) também são criados no idioma configurado:

<table>
<tr><th>Arquivo</th><th>🇪🇸 Español</th><th>🇬🇧 English</th><th>🇧🇷 Português</th></tr>
<tr><td>Estado</td><td><code>estado.md</code></td><td><code>status.md</code></td><td><code>estado.md</code></td></tr>
<tr><td>Descobertas</td><td><code>hallazgos.md</code></td><td><code>findings.md</code></td><td><code>descobertas.md</code></td></tr>
<tr><td>Plano</td><td><code>plan.md</code></td><td><code>plan.md</code></td><td><code>plano.md</code></td></tr>
<tr><td>Progresso</td><td><code>progreso.md</code></td><td><code>progress.md</code></td><td><code>progresso.md</code></td></tr>
<tr><td>Proposta</td><td><code>propuesta.md</code></td><td><code>proposal.md</code></td><td><code>proposta.md</code></td></tr>
</table>

O idioma é persistido em `locale` e `folder-map.json` para que o Claude saiba exatamente quais arquivos buscar. Para mudar de idioma, basta reinstalar:

```bash
bash scripts/instalar.sh --global
```

<details>
<summary>Instalação remota (sem clonar)</summary>

O instalador baixa automaticamente o repositório quando executado via pipe:

```bash
# Interativo (pergunta o idioma)
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global

# Não-interativo (idioma direto)
curl -fsSL https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/scripts/instalar.sh | bash -s -- --global --lang pt
```

Idiomas disponíveis: `es` (Español), `en` (English), `pt` (Português)
</details>

**Requisitos:** Claude Code (ou agente de IA compatível) + Git

---

## Início Rápido

### 1. Inicializar no seu projeto

```bash
/dc:iniciar --tipo serviço --nome "minha-api"
```

### 2. Iniciar uma tarefa

```bash
/dc:começar Implementar autenticação JWT
```

O Don Cheli detecta automaticamente a complexidade e escolhe o processo adequado:

| Nível | Nome | Quando |
|-------|------|--------|
| **0** | Atômico | 1 arquivo, < 30 min |
| **P** | PoC | Validar viabilidade (timebox de 2-4h) |
| **1** | Micro | 1-3 arquivos, solução conhecida |
| **2** | Padrão | Múltiplos arquivos, 1-3 dias |
| **3** | Complexo | Multi-módulo, 1-2 semanas |
| **4** | Produto | Sistema novo, 2+ semanas |

### 3. Seguir o pipeline

```bash
/dc:especificar    # Spec Gherkin + schema DBML
/dc:clarificar     # Auto-QA + resolver ambiguidades
/dc:plano-tecnico  # Blueprint + verificação de constituição
/dc:decompor      # Tarefas TDD com paralelismo
/dc:implementar    # RED → GREEN → REFACTOR no Docker
/dc:revisar        # Peer review de 7 dimensões
```

---

## As 3 Leis de Ferro

Não negociáveis. Aplicam-se sempre.

| Lei | Princípio | Na prática |
|-----|-----------|------------|
| **TDD** | Todo código requer testes | RED → GREEN → REFACTOR, sem exceções |
| **Debugging** | Causa raiz primeiro | Reproduzir → Isolar → Entender → Corrigir → Verificar |
| **Verificação** | Evidência antes de afirmações | "Os testes passam" > "acho que funciona" |

---

## Anthropic Skills 2.0

O Don Cheli é **100% compatível** com o ecossistema de [Anthropic Skills](https://github.com/anthropics/skills). Suporta ambos os formatos de skill:

| Formato | Arquivo | Uso |
|---------|---------|-----|
| **Anthropic** | `SKILL.md` | Compatível com o marketplace oficial |
| **Don Cheli** | `HABILIDAD.md` | Formato estendido com versão, tags, grau de liberdade |

### Skill Creator

Criar skills sem escrever uma única linha de YAML:

```bash
/dc:criar-skill "Gerador de relatórios semanais da equipe"
```

5 fases iterativas: **Descobrir** → **Gerar** SKILL.md → **Testar** com prompt real → **Avaliar** qualidade → **Iterar** até o ideal.

### Skills Marketplace

Instalar skills do marketplace oficial da Anthropic ou da comunidade:

```bash
/dc:marketplace --instalar document-skills --fonte anthropic
/dc:marketplace --buscar "weekly report"
```

Fontes suportadas: [Anthropic Official](https://github.com/anthropics/skills) • [skillsmp.com](https://skillsmp.com/) • [aitmpl.com](https://www.aitmpl.com/skills) • Don Cheli built-in (42 skills)

### Progressive Disclosure

As skills usam um design de 3 camadas para máxima eficiência de tokens:

```
Camada 1: Metadata (YAML)      → ~20 tokens por skill, sempre em contexto
Camada 2: Body (Markdown)      → Carregado apenas ao ativar a skill
Camada 3: File References      → Carregados sob demanda dentro do body
```

Isso permite ter dezenas de skills sem impactar a janela de contexto.

---

## Comandos (85+)

> **Retrocompatível:** Todos os comandos `/dc:*` também estão disponíveis como `/especdev:*` por retrocompatibilidade.

<details>
<summary><strong>Principais (29)</strong></summary>

| Comando | Descrição |
|---------|-----------|
| `/dc:iniciar` | Inicializar em um projeto |
| `/dc:começar` | Iniciar tarefa (detecta nível automaticamente) |
| `/dc:rapido` | Modo rápido (Nível 1) |
| `/dc:poc` | Prova de Conceito com timebox |
| `/dc:completo` | Modo completo (Nível 3) |
| `/dc:estado` | Estado atual |
| `/dc:diagnostico` | Health check do setup |
| `/dc:doctor` | Diagnóstico e auto-reparo de git, framework e ambiente |
| `/dc:continuar` | Recuperar sessão anterior |
| `/dc:refletir` | Auto-reflexão (+8-21% de qualidade) |
| `/dc:capturar` | Fire-and-forget de ideias com triage automático |
| `/dc:uat` | Scripts de aceitação auto-gerados por feature |
| `/dc:agente` | Carregar agente especializado |
| `/dc:mesa-redonda` | Discussão multi-perspectiva (CPO, UX, Negócio) |
| `/dc:mesa-tecnica` | Mesa de especialistas sênior de desenvolvimento (Tech Lead, Backend, Frontend, Arquiteto, DevOps) |
| `/dc:planning` | Planning semanal de equipe: revisão de RFCs, priorização WSJF, atribuição por par/squad |
| `/dc:estimar` | Estimativas de desenvolvimento |
| `/dc:destilar` | Extrair specs a partir de código |
| `/dc:minar-referencias` | Buscar repositórios de referência |
| `/dc:contrato-ui` | Contratos de design de UI |
| `/dc:contrato-api` | Contratos de API/webhooks |
| `/dc:auditar-segurança` | Auditoria OWASP Top 10 |
| `/dc:migrar` | Migração de stacks |
| `/dc:reversa` | Engenharia reversa de arquitetura |
| `/dc:explorar` | Explorar codebase (modo suposições) |
| `/dc:propor` | Proposta de mudança |
| `/dc:analisar-sessoes` | Análise de padrões de uso |
| `/dc:apresentar` | Gerar apresentação interativa em HTML |
| `/dc:criar-skill` | Criar skills iterativamente (compatível Anthropic Skills 2.0) |
| `/dc:marketplace` | Instalar skills do Anthropic, comunidade ou built-in |
| `/dc:atualizar` | Detectar e aplicar atualizações do framework |
</details>

<details>
<summary><strong>Pipeline Gherkin (5)</strong></summary>

| Comando | Descrição |
|---------|-----------|
| `/dc:especificar` | Spec Gherkin com prioridades P1/P2/P3+ |
| `/dc:clarificar` | Auto-QA + verificação schema-spec |
| `/dc:plano-tecnico` | Blueprint + verificação de constituição |
| `/dc:decompor` | Tarefas TDD com marcadores `[P]` |
| `/dc:revisar` | Peer review de 7 dimensões |
</details>

<details>
<summary><strong>Raciocínio (15)</strong></summary>

| Comando | O que faz |
|---------|-----------|
| `/razonar:primeiros-principios` | Decompor ao fundamental |
| `/razonar:5-porques` | Análise de causa raiz |
| `/razonar:pareto` | Foco 80/20 |
| `/razonar:inversao` | Resolver ao contrário |
| `/razonar:segunda-ordem` | Consequências das consequências |
| `/razonar:pre-mortem` | Antecipar falhas |
| `/razonar:minimizar-arrependimento` | Decisões de longo prazo |
| `/razonar:custo-oportunidade` | Avaliar alternativas |
| `/razonar:circulo-competencia` | Conhecer seus limites |
| `/razonar:mapa-territorio` | Modelo vs realidade |
| `/razonar:probabilistico` | Raciocinar em probabilidades |
| `/razonar:reversibilidade` | É possível desfazer? |
| `/razonar:rlm-verificacao` | Verificação com sub-LLMs |
| `/razonar:rlm-cadeia-pensamento` | Raciocínio em múltiplas etapas |
| `/razonar:rlm-decomposicao` | Dividir e conquistar |
</details>

---

## Habilidades (42)

| Categoria | Habilidades |
|-----------|------------|
| **Qualidade** | Leis de ferro, Validação Nyquist, Detecção de stubs, Detecção de loops, Portas de qualidade, Prova de trabalho, Rigor progressivo |
| **Contexto** | Engenharia de contexto, Otimizador de contexto, Memória persistente (Engram), CodeRAG + LightRAG, Code reference mining |
| **Raciocínio** | 12 modelos mentais, 3 modelos RLM (PrimeIntellect) |
| **Arquitetura** | Mapa arquitetural vivo, Refatoração SOLID, Schemas DBML |
| **Design** | UI/UX Design System (67 estilos, 161 paletas), Contratos de UI, Apresentações HTML |
| **Documentação** | Documentação viva (ADRs, OpenAPI), DevLog, Rastreabilidade, Delta specs, Obsidian |
| **Autonomia** | Orquestração autônoma, Auto-correção, Recuperação de sessão |
| **Descoberta** | Brainstorming estruturado, Git Worktrees |
| **Eficiência** | Otimização de tokens, Contabilidade de tokens, Desenvolvimento com subagentes, **Roteamento dinâmico de modelos**, **Projeções de custo** |
| **Observabilidade** | **Saúde de habilidades** (telemetria de taxa de sucesso e consumo por skill) |
| **Segurança** | Permissões e segurança, Auditoria OWASP |
| **Integração** | MCP servers, Extensões e presets |

---

## Pipeline Visual

```
  ┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
  │ ESPECIFICAR │────▶│  CLARIFICAR  │────▶│PLANEJAR TÉCNICO  │
  │             │     │              │     │                  │
  │ Gherkin     │     │ Auto-QA      │     │ Verificação de   │
  │ P1/P2/P3+   │     │ Schema↔Spec  │     │ constituição     │
  │ DBML auto   │     │ Ambiguidades │     │ Contexto técnico │
  └─────────────┘     └─────────────┘     └──────────────────┘
        │                   │                      │
    [Porta 1]           [Porta 2+3]            [Porta 4]
                                                   │
                                                   ▼
  ┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
  │   REVISAR   │◀────│ IMPLEMENTAR │◀────│    DECOMPOR      │
  │             │     │             │     │                  │
  │ 7 dimensões │     │ TDD no Docker│     │ [T001] [P] [US1] │
  │ N+1, SOLID  │     │ Checkpoints │     │ 5 fases          │
  │ Segurança   │     │ Anti-stubs  │     │ Nyquist          │
  └─────────────┘     └─────────────┘     └──────────────────┘
        │                   │                      │
    [Porta 6]           [Porta 6]             [Porta 5]
    + Regressão
```

Cada porta bloqueia o avanço se os critérios não forem cumpridos. **Sem atalhos.**

---

## 7 agentes especializados

| Agente | Modelo | Papel |
|--------|--------|-------|
| `planejador` | opus | Decomposição e planejamento |
| `arquiteto` | opus | Design de sistemas |
| `executor` | sonnet | Implementação de código |
| `revisor` | opus | Code review arquitetural |
| `testador` | sonnet | Testing e QA |
| `documentador` | haiku | Documentação |
| `estimador` | opus | Estimativas de esforço |

```bash
/dc:agente planejador
/dc:mesa-redonda "Monolito ou microsserviços?"
/dc:mesa-tecnica "Redis ou Memcached para caching de sessões?"
/dc:planning --equipe "Ana,Carlos,Luis" --semana "2026-03-24"
```

---

## Modo PoC

Validar ideias antes de se comprometer com a implementação:

```bash
/dc:poc --hipotese "SQLite é suficiente para o MVP"
```

| Fase | O que é |
|------|---------|
| **Hipótese** | Definir o que validar e os critérios de sucesso/fracasso |
| **Construir** | Código descartável, regras relaxadas, sem TDD |
| **Avaliar** | Resultados vs critérios com evidência |
| **Veredicto** | VIÁVEL / COM RESSALVAS / NÃO VIÁVEL / INCONCLUSIVO |

Se for viável → `/dc:poc --promover` → pipeline completo.

---

## Estimativas Automáticas

```bash
/dc:estimar docs/prd.md
```

4 modelos que se complementam:

| Modelo | Técnica |
|--------|---------|
| **Pontos de Função** | Complexidade funcional |
| **Planning Poker IA** | 3 agentes estimam independentemente |
| **COCOMO** | LOC estimadas → esforço |
| **Histórico** | Comparação com tarefas similares |

Saída: estimativa otimista, esperada e pessimista com detalhamento por feature.

---

## Auditoria de Segurança

```bash
/dc:auditar-segurança
```

Varre as 10 categorias OWASP:

- **A01** Broken Access Control — endpoints sem autenticação, IDOR, CORS
- **A02** Cryptographic Failures — senhas em texto plano, JWT sem expiração
- **A03** Injection — SQL, XSS, command injection
- **A04-A10** — Configuração, componentes vulneráveis, logging

Cada descoberta com severidade, arquivo, linha e correção sugerida.

---

## Migração de Stacks

```bash
/dc:migrar --de "Vue 3" --para "React 19"
```

6 fases: Inventário → Equivalências → Estratégia → Plano → Execução → Verificação

Suporta: framework (Vue→React), versão (Next 14→15), linguagem (JS→TS), paradigma (REST→GraphQL).

---

## Multi-LLM

| Arquivo | Agente |
|---------|--------|
| `CLAUDE.md` | Claude Code |
| `AGENTS.md` | Codex |
| `prompt.md` | Amp / outros |

---

## Estrutura do Projeto

```
don-cheli/
├── comandos/
│   ├── especdev/          # 53 comandos /dc:*
│   └── razonar/           # 15 comandos /razonar:*
├── habilidades/           # 42 habilidades modulares
├── reglas/
│   ├── constitucion.md    # 8 princípios governantes
│   ├── leyes-hierro.md    # 3 leis não negociáveis
│   ├── puertas-calidad.md # 6 quality gates
│   ├── i18n.md            # Regras de internacionalização
│   ├── skills-best-practices.md  # Boas práticas Anthropic Skills 2.0
│   └── reglas-trabajo-globales.md
├── locales/               # 🌍 Strings i18n
│   ├── es.json            # Español (158 strings)
│   ├── en.json            # English (158 strings)
│   └── pt.json            # Português (158 strings)
├── plantillas/
│   └── especdev/
│       ├── es/            # Templates em espanhol
│       ├── en/            # Templates em inglês
│       └── pt/            # Templates em português
├── agentes/               # 7 agentes especializados
├── ganchos/               # Hooks Pre/Post de ferramenta + Stop hooks
├── scripts/               # instalar.sh, bucle.sh, validar.sh
├── CLAUDE.md              # Instruções para Claude Code
├── AGENTS.md              # Instruções para Codex
├── prompt.md              # Instruções para Amp
├── NOTICE                 # Atribuições
└── LICENCIA               # Apache 2.0
```

Após instalar com um idioma, a estrutura instalada usa os nomes localizados:

```
~/.claude/don-cheli/          # Instalação global
├── skills/                   # (ou habilidades/ em ES, habilidades/ em PT)
├── rules/                    # (ou reglas/ em ES, regras/ em PT)
├── templates/                # (ou plantillas/ em ES, modelos/ em PT)
├── hooks/                    # (ou ganchos/ em ES/PT)
├── agents/                   # (ou agentes/ em ES/PT)
├── locales/                  # es.json, en.json, pt.json
├── locale                    # Arquivo de 2 letras: "es", "en" ou "pt"
├── folder-map.json           # Mapeamento de nomes para o Claude
├── CLAUDE.md
└── VERSION
```

---

## Filosofia

> **"Janela de Contexto = RAM, Sistema de Arquivos = Disco"**

1. **Persistência sobre conversa** — Escreva, não apenas diga
2. **Estrutura sobre caos** — Arquivos claros, papéis claros
3. **Recuperação sobre reinício** — Nunca perder progresso
4. **Evidência sobre afirmações** — Mostre, não conte
5. **Simplicidade sobre complexidade** — Tudo no seu idioma

---

## Contribuir

Veja [CONTRIBUIR.md](CONTRIBUIR.md) para o guia completo.

```bash
# Fork → Clone → Branch → Mudanças → PR
git checkout -b feature/minha-melhoria
```

---

## Licença

[Apache 2.0](LICENCIA) — Copyright 2026 Jose Luis Oronoz Troconis (@DonCheli)

Você pode usar, modificar e distribuir o Don Cheli livremente. Deve manter a atribuição ao autor original e indicar as alterações realizadas.

---

<p align="center">
  <strong>Pare de adivinhar. Comece a fazer engenharia.</strong><br/>
    <sub>Vibe coding é a faísca; SDD é o motor. Transição do caos assistido por IA para entrega profissional de software.</sub><br/>
  <sub>Don Cheli — SDD Framework</sub>
</p>
