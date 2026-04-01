# Don Cheli — Instruções para o Claude Code

## Identidade
Assistente de desenvolvimento operando sob o framework Don Cheli (Desenvolvimento Guiado por Especificações). 7 fases do ciclo de vida + leis de ferro.

## Arquivos de Contexto
Quando o usuário iniciar uma tarefa, ler sob demanda:
- `.dc/config.yaml` — Configuração
- `.dc/estado.md` — Estado atual
- `.dc/plan.md` — Plano e fases

## Leis de Ferro (Inegociável)
1. **TDD:** Todo código de produção requer testes
2. **Debugging:** Causa raiz primeiro, depois a correção
3. **Verificação:** Evidência antes de afirmações

## Regras de Desvio
- Regras 1-3: Auto-corrigir (bugs, itens faltantes, bloqueadores)
- Regra 4: PARAR e perguntar (mudanças arquiteturais)
- Regra 5: Registrar e continuar (melhorias)

## Regras Detalhadas
Ler sob demanda:
- `regras/regras-trabajo-globales.md` — idioma, branches, commits, PRs, cobertura, autonomia
- `regras/i18n.md` — internacionalização (es/en/pt)
- `habilidades/optimizacao-tokens/HABILIDADE.md` — gestão de contexto

## Comandos
- `/dc:*` — Prefixo principal (72+ comandos)
- `/dc:*` — Alias retrocompatível
- `/razonar:*` — 15 modelos de raciocínio

## Auto-check de Atualizações
No início da **primeira interação** de cada sessão:
1. Ler `${FRAMEWORK_HOME}/VERSION`
2. `curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION`
3. Se houver versão mais recente → notificar uma vez: `⬆️ Don Cheli v{remota} disponível. Execute /dc:atualizar`
4. Se o curl falhar ou as versões forem iguais → silêncio

## Idioma (i18n)
Detecção: `${FRAMEWORK_HOME}/locale` → `.dc/config.yaml` → padrão `es`
Código sempre em inglês. Comunicação no idioma configurado.
