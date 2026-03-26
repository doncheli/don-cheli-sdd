# Boas Práticas para Skills (Anthropic Skills 2.0)

## Compatibilidade de Formatos

O Don Cheli suporta dois formatos de skill:

### Formato Anthropic (SKILL.md)
```yaml
---
name: Skill Name
description: What it does and when to trigger it
---
# Instructions...
```

### Formato Don Cheli (HABILIDAD.md)
```yaml
---
nombre: Nombre de la Habilidad
descripcion: Qué hace y cuándo se activa
version: 1.0.0
autor: Autor
tags: [tag1, tag2]
activacion: "keyword1", "keyword2"
grado_libertad: alto | medio | bajo
---
# Instrucciones...
```

Ambos são lidos automaticamente. O formato Don Cheli possui campos adicionais (version, tags, grado_libertad) que melhoram a gestão.

## Regras de Escrita

### 1. Metadata é o mais importante
A metadata (YAML frontmatter) determina se a skill será ativada ou não. O Claude lê APENAS a metadata no início da sessão. O body é carregado sob demanda.

**Boa metadata:**
```yaml
description: Generates weekly team reports from standup notes and PR activity. Triggers on "weekly report", "team update", "sprint summary", "what did we do this week".
```

**Má metadata:**
```yaml
description: A useful skill for reports
```

### 2. Limite de 500 linhas
Se o SKILL.md ultrapassar 500 linhas, separar em:
- `SKILL.md` — Instruções principais (< 500 linhas)
- `templates/` — Arquivos de template
- `reference.md` — Material de referência detalhado
- `examples/` — Exemplos completos

Usar instruções no SKILL.md para guiar o Claude a carregar arquivos adicionais apenas quando necessário (Progressive Disclosure).

### 3. Incluir apenas o que o Claude não sabe
- Não incluir: conhecimento geral (linguagens, frameworks, bibliotecas populares)
- Não incluir: documentação que o Claude já tem nos seus dados de treinamento
- Incluir: regras específicas da empresa/equipe
- Incluir: formatos e templates próprios
- Incluir: particularidades de ferramentas internas
- Incluir: workflows específicos do projeto
- Incluir: convenções não-padrão

### 4. Grau de liberdade
Ajustar a granularidade das instruções ao tipo de tarefa:

| Grau | Tipo de tarefa | Formato |
|------|---------------|---------|
| **Alto** | Criativa (redação, design, brainstorming) | Guidelines gerais, princípios |
| **Médio** | Workflow com variações (code review, relatórios) | Pseudocódigo, passos com parâmetros |
| **Baixo** | Processo crítico (deploy, migração, segurança) | Script exato, poucos parâmetros |

### 5. Progressive Disclosure (3 camadas)
```
Camada 1: Metadata (YAML)     → Sempre carregada (~20 tokens por skill)
Camada 2: Body (Markdown)     → Carregada ao ativar a skill
Camada 3: File References     → Carregadas apenas se necessário
```

Isso permite ter muitas skills sem impactar a context window.

### 6. MCP + Skills = Cozinha + Receita
- **MCP** define QUAIS ferramentas estão disponíveis (a cozinha)
- **Skills** ensinam COMO usar essas ferramentas (as receitas)

Se você usa um MCP server, crie skills que orquestrem suas ferramentas.

## Estrutura de Diretório

### Skills da Anthropic
```
.claude/skills/
  minha-skill/
    SKILL.md
    templates/
    reference.md
```

### Skills do Don Cheli
```
habilidades/
  minha-habilidade/
    HABILIDAD.md
    plantillas/
    referencia.md
```

Ambas as localizações são escaneadas automaticamente.
