# Plano — commitlint

## Contexto

O repositório ainda não valida mensagens de commit. O usuário pediu para configurar o commitlint com Conventional Commits e confirmou duas decisões: disparo automático por Husky no hook `commit-msg` e uso do preset oficial `@commitlint/config-conventional`, sem regras customizadas.

## Decisões (do feature-concept)

1. **Q1 — disparo:** Husky com hook `commit-msg`, instalado automaticamente por um script `prepare` no `npm install`.
2. **Q2 — regras:** `@commitlint/config-conventional` sem customizações; mensagens no formato `type: subject` com os types do preset (`feat`, `fix`, `docs`, etc.).
3. Fora de escopo: escopo obrigatório, regras de tamanho/caixa personalizadas, auto-fix, CI e reescrita de commits existentes.

## Critérios de aceite

- DADO `@commitlint/cli`, `@commitlint/config-conventional` e `husky` instalados na raiz, QUANDO `npm install` roda, ENTÃO o `prepare` instala o hook `commit-msg`.
- DADA uma mensagem inválida (por exemplo, `mensagem sem tipo`), QUANDO o hook `commit-msg` é executado, ENTÃO ele termina com código diferente de zero e mostra os erros do commitlint.
- DADA uma mensagem válida (por exemplo, `feat: configura commitlint`), QUANDO o hook `commit-msg` é executado, ENTÃO ele termina com código `0`.
- DADO o comando `npm run commitlint` com uma mensagem via stdin, ENTÃO a validação usa o preset conventional.
- DADO `npm run commitlint:last`, ENTÃO o último commit é validado.
- DADO `npm run lint`, `npm run check-types`, `npm run build`, `npm run test` e `npx prettier --check "**/*.{ts,tsx,md}"`, ENTÃO todos terminam com código `0`.

## Tarefas (ordem de execução e dependências)

1. **T1 — entendimento e rastreabilidade.** Registrar a ADR da nova ferramenta e do contrato de mensagens. Atende à regra de ADR do `RULES.md`.
2. **T2 — instalação e configuração.** Adicionar `--save-dev --save-exact` as dependências, criar `commitlint.config.js`, scripts `prepare`, `commitlint` e `commitlint:last`, e o hook `.husky/commit-msg`. Validação:Comandos de instalação e inspeção do hook. Atende ao critério 1.
3. **T3 — documentação.** Atualizar `.docs/DEVELOPMENT.md` e `.docs/QA.md` com o contrato de commits e os comandos disponíveis. Atende aos critérios 4 e 5 de documentação.
4. **T4 — validação vermelho/verde e QA completo.** Testar mensagem inválida e válida no hook e via script, rodar o checklist aplicável de `QA.md`, registrar resultados neste plano. Atende a todos os critérios.

## Arquivos previstos

- `package.json`, `package-lock.json`
- `commitlint.config.js`
- `.husky/commit-msg`
- `.adrs/commitlint-e-conventional-commits.md`
- `.docs/DEVELOPMENT.md`, `.docs/QA.md`
- `.plans/commitlint-plan.md`

## Riscos e mitigação

- **Windows + Git Bash:** o hook precisa usar sintaxe compatível. Mitigação: validar com arquivo temporário em `C:\Users\luciana.faria\AppData\Local\Temp\opencode`.
- **`prepare` em todo `npm install`:** é o mecanismo padrão do Husky; manter o comando simples (`husky`) para falhar visiblemente se a instalação do hook quebrar.
- **Mensagens já existentes:** nenhum commit será reescrito; a validação passa a valer para commits novos.

## Validação (comandos de QA.md + passos manuais)

- `npm install`
- `git config --get core.hooksPath`
- `printf 'mensagem inválida' | npx --no -- commitlint` → código `1`
- `printf 'feat: configura commitlint' | npx --no -- commitlint` → código `0`
- `.husky/commit-msg <arquivo-invalido>` → código `1`
- `.husky/commit-msg <arquivo-valido>` → código `0`
- `npm run commitlint:last`
- `npm run lint`, `npm run check-types`, `npm run build`, `npm run test`, `npm run test:e2e`, `npx prettier --check "**/*.{ts,tsx,md}"`

## Resultados da execução (2026-11-22)

- **T1 — concluído:** ADR `.adrs/commitlint-e-conventional-commits.md` criada antes da instalação, registrando Husky, preset conventional e fora de escopo.
- **T2 — concluído:** instalados `@commitlint/cli@21.2.4`, `@commitlint/config-conventional@21.2.4` e `husky@9.1.7` como devDependencies exatas. Criados `commitlint.config.js`, `.husky/commit-msg` e os scripts `prepare`, `commitlint` e `commitlint:last`. `npm run prepare` definiu `core.hooksPath=.husky/_`.
- **T2.1 — correção:** `commitlint:last` usa `commitlint --last` porque `--from HEAD~1 --to HEAD` falha quando o repositório tem apenas o commit inicial.
- **T3 — concluído:** `.docs/DEVELOPMENT.md` documenta o contrato de commits; `.docs/QA.md` lista os novos comandos e o checklist de validação.
- **T4 — concluído:** hook e scripts testados no modo vermelho/verde com arquivos temporários em UTF-8 sem BOM. Mensagem inválida retornou `1` (`subject-empty`, `type-empty`); mensagem válida retornou `0`. Validação via stdin e `--edit` também passou. `commitlint:last` apontou corretamente que o commit do starter não é conventional.
- **QA completo:** `npm install`, `npm run code:fix`, `npx prettier --check "**/*.{ts,tsx,md}"`, `npm run lint`, `npm run check-types`, `npm run build`, `npm run test` e `npm run test:e2e` terminaram com código `0`.
