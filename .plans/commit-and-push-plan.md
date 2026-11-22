# Plano — commit-and-push

## Contexto

O repositório já valida mensagens com commitlint e precisa de um comando que analise as mudanças pendentes, gere uma mensagem Conventional Commits, faça `git add`, commit com `Co-Authored-By: OpenCode Agent <opencode@opencode.ai>` e push. O usuário também determinou que o comando deve ser executado ao final de cada spec/tarefa.

## Decisões (do feature-concept)

1. **Q1 — formato:** `npm run commit-and-push`, implementado em `scripts/commit-and-push.mjs`.
2. **Q2 — pendências atuais:** separar em commits por tema; o script aceita `--only <caminhos>` para selecionar um subconjunto.
3. **Q3 — co-author:** `Co-Authored-By: OpenCode Agent <opencode@opencode.ai>`.
4. **Q4 — remote/push:** configurar `origin` como `https://github.com/lucianafm9/posIAM04.git` e executar o push ao final.

## Critérios de aceite

- DADO `git status` com mudanças, QUANDO `npm run commit-and-push` roda, ENTÃO o script lê status e diff, gera header Conventional Commits, faz `git add`, commit com o trailer do co-author e push.
- DADA uma mensagem gerada inválida, QUANDO o hook `commit-msg` roda, ENTÃO o commit é bloqueado pelo commitlint.
- DADO nenhuma mudança pendente, QUANDO o comando roda, ENTÃO ele apenas faz push (quando aplicável) e termina com código `0`.
- DADO `npm run commit-and-push -- --only <caminhos>`, ENTÃO somente os caminhos informados são adicionados e commitados.
- DADO `npm run commit-and-push -- --message "<header>"`, ENTÃO o header informado substitui o gerado, desde que passe no commitlint.
- DADO o remote ausente, QUANDO o comando precisa fazer push, ENTÃO ele falha com mensagem clara em vez de tentar um remote inexistente.
- DADO o fechamento de uma spec, QUANDO o agente termina a validação, ENTÃO `npm run commit-and-push` é executado conforme `.docs/RULES.md`.

## Tarefas (ordem de execução e dependências)

1. **T1 — rastreabilidade.** Criar ADR para o novo comando e o co-author; salvar este plano antes da implementação.
2. **T2 — script.** Implementar `scripts/commit-and-push.mjs` com: leitura de `status --porcelain` e `diff --stat`, heurística de tipo/escopo/assunto, flags `--only` e `--message`, `git add`, commit com trailer e push com upstream detection. Validar com dry-run/mensagens temporárias.
3. **T3 — integração.** Adicionar script em `package.json`, atualizar `.docs/RULES.md` e `.docs/QA.md` com a obrigatoriedade do comando no fechamento.
4. **T4 — remote e execução.** Configurar `origin`, executar commits separados por tema usando `--only`/`--message` e rodar o comando ao final para push. Registrar resultados.

## Arquivos previstos

- `scripts/commit-and-push.mjs`
- `package.json`, `package-lock.json`
- `.adrs/commit-and-push.md`
- `.docs/RULES.md`, `.docs/QA.md`
- `.plans/commit-and-push-plan.md`

## Riscos e mitigação

- **Autenticação GitHub:** push pode falhar por credencial ausente; o commit local permanece e o erro é reportado.
- **Mensagem gerada incorreta:** `--message` permite correção manual; o commitlint bloqueia mensagens fora do padrão.
- **Inclusão acidental de arquivos:** `--only` limita o staging; sem ele, o padrão é `git add -A`, conforme pedido.

## Validação (comandos de QA.md + passos manuais)

- `node --check scripts/commit-and-push.mjs`
- `npm run commitlint` com header gerado
- `npm run lint`, `npm run check-types`, `npm run build`, `npm run test`, `npm run test:e2e`, `npx prettier --check "**/*.{ts,tsx,md}"`
- `git remote -v`
- `git log --oneline -5`
- `git status --short`

## Resultados da execução (2026-11-22)

- **T1 — concluído:** ADR `.adrs/commit-and-push.md` e este plano criados antes da implementação.
- **T2 — concluído:** `scripts/commit-and-push.mjs` implementado com leitura de status/diff, heurística de Conventional Commits, flags `--only`, `--message` e `--dry-run`, commit com o trailer `Co-Authored-By: OpenCode Agent <opencode@opencode.ai>` e push com detecção de upstream.
- **T2.1 — validação:** `node --check scripts/commit-and-push.mjs` passou; `npm run commit-and-push -- --dry-run` identificou as mudanças e exibiu o header que seria usado.
- **T3 — concluído:** script `commit-and-push` adicionado em `package.json`; `.docs/RULES.md` define a execução no fechamento de toda tarefa/spec; `.docs/QA.md` lista o comando e o checklist.
- **QA completo:** `npm run code:fix`, `npx prettier --check "**/*.{ts,tsx,md}"`, `npm run lint`, `npm run check-types`, `npm run build`, `npm run test` e `npm run test:e2e` terminaram com código `0`.
- **T4 — concluído:** remote `origin` configurado para `https://github.com/lucianafm9/posIAM04.git`; mudanças publicadas em quatro commits separados por tema usando `--only`/`--message`, todos com o trailer do co-author.
