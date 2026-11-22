# ADR — Commitlint e Conventional Commits

## Contexto

O repositório não valida mensagens de commit e não documenta um padrão de escrita. Sem validação automática, mensagens inconsistentes dificultam a leitura do histórico e a geração futura de changelog/versionamento.

## Decisão

Adotar **Conventional Commits** como padrão obrigatório e usar `@commitlint/cli` com `@commitlint/config-conventional` para validar mensagens no hook `commit-msg`, instalado por **Husky** por meio do script `prepare`. As regras do preset oficial são usadas sem customizações. A raiz expõe `npm run commitlint` para validação via stdin e `npm run commitlint:last` para validar o último commit.

## Consequências

- Commits inválidos são bloqueados localmente antes de serem criados.
- O formato aceito segue o preset: `type: subject`, com types como `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, entre outros.
- `npm install` passa a executar `husky` automaticamente; clones novos não precisam configurar `core.hooksPath` manualmente.
- Nenhuma mensagem antiga é reescrita; a regra vale para commits novos.
- Não há escopo obrigatório nem regras extras de tamanho/caixa nesta entrega.

## Alternativas descartadas

- **Git hooks nativo com `core.hooksPath`:** sem dependência extra, mas exigiria configuração manual em cada clone.
- **Apenas script npm/CI:** não bloquearia commits localmente, permitindo que mensagens inválidas entrassem no histórico.
- **Regras customizadas desde já:** aumentaria o atrito sem necessidade; o preset oficial cobre o contrato básico de Conventional Commits.
- **Husky com hooks `pre-commit` ou `commit-msg` duplicados:** desnecessário, pois o commitlint atua somente sobre a mensagem.
