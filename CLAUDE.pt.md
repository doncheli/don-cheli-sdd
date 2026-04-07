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

## Auto-atualização no início da sessão
No início da **primeira interação** de cada sessão, executar automaticamente:

### Passo 1: Atualizar framework
1. Ler `${FRAMEWORK_HOME}/VERSION`
2. `curl -s https://raw.githubusercontent.com/doncheli/don-cheli-sdd/main/VERSION`
3. Se versões iguais ou curl falhar → silêncio
4. Se versão mais recente → **auto-atualizar em background**:
   a. Clonar nova versão em diretório temporário
   b. **Auditoria de segurança** nos scripts alterados
   c. **Validação de estrutura**: `bash scripts/validar.sh`
   d. Se 🔴 Crítico → **PARAR**: `🛑 Atualização v{remota} bloqueada por segurança`
   e. Se passar → aplicar: `bash scripts/actualizar.sh --forzar`
   f. Notificar: `✅ Don Cheli atualizado: v{local} → v{remota} (segurança: ✅ | estrutura: ✅)`

### Passo 2: Atualizar skills de terceiros (semanal)
1. Executar `bash scripts/skill-updater.sh --quiet` (throttle de 7 dias)
2. Anthropic Skills → aplicar automaticamente (fonte confiável)
3. Skills da comunidade → apenas notificar (revisão manual)

### Regras
- **Uma vez por sessão** — não repetir
- Sem conexão → silêncio, não bloquear
- **Sempre** executar checks de segurança e estrutura antes de aplicar
- Se auditoria falhar → **PARAR**, nunca aplicar mudanças inseguras

## Idioma (i18n)
Detecção: `${FRAMEWORK_HOME}/locale` → `.dc/config.yaml` → padrão `es`
Código sempre em inglês. Comunicação no idioma configurado.
