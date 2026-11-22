# ADR — Comando commit-and-push

## Contexto

O fechamento de cada spec exige commit e push, e o repositório já obriga mensagens Conventional Commits via commitlint. Fazer esse fluxo manualmente é repetitivo e propenso a mensagens inconsistentes ou esquecimento do push.

## Decisão

Adicionar `npm run commit-and-push`, implementado em `scripts/commit-and-push.mjs`. O script:

1. lê `git status --porcelain` e `git diff --stat` para entender as mudanças;
2. gera um header Conventional Commits a partir dos caminhos alterados;
3. aceita `--only <caminhos...>` para limitar o staging, `--message "<header>"` para substituir o header gerado e `--dry-run` para inspecionar a mensagem sem commitar;
4. faz `git add`, cria o commit com `Co-Authored-By: OpenCode Agent <opencode@opencode.ai>`;
5. detecta o upstream e faz `git push` (com `-u` no primeiro push).
6. Quando não há mudanças, apenas faz push e encerra com sucesso.

O comando passa a ser obrigatório no fechamento de toda spec, registrado em `.docs/RULES.md` e `.docs/QA.md`.

## Consequências

- O histórico passa a ter mensagens padronizadas e rastreabilidade da autoria assistida.
- O hook do commitlint continua sendo a última barreira: se o script gerar um header inválido, o commit é bloqueado.
- O primeiro push requer `origin` configurado; o script falha com mensagem clara se o remote não existir.
- `--only` permite separar mudanças por tema sem sair do mesmo comando.

## Alternativas descartadas

- **Commit/push manuals:** não escala para o requisito de executar ao final de cada spec.
- **Comando exclusivo do OpenCode:** não funcionaria fora do agente e não reaproveitaria o commitlint automaticamente.
- **Gerar a mensagem com LLM externa:** dependeria de rede/credencial para uma tarefa que pode ser resolvida com heurística determinística sobre os caminhos alterados.
- **Push automático em `prepare` ou CI:** mudaria o fluxo de instalação e poderia publicar código sem validação.
