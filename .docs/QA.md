# QA

Validação obrigatória antes de declarar qualquer mudança concluída. **Fonte da verdade:** os scripts em `package.json` da raiz.

## Comandos disponíveis

| Comando                                   | O que faz                                                         |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `npm install`                             | Instala as dependências de todas as workspaces                    |
| `npm run dev`                             | Turbo com `api` :4000, `web` :3000 e `docs` :3001                 |
| `npm run build`                           | Build de `api`, `web` e `docs` (`turbo run build`)                |
| `npm run lint`                            | ESLint em todas as workspaces (`turbo run lint`)                  |
| `npm run check-types`                     | Checagem de tipos (`turbo run check-types`)                       |
| `npm run types:check`                     | Alias de `npm run check-types`                                    |
| `npm run code:fix`                        | Prettier + ESLint com `--fix` (`turbo run lint --force -- --fix`) |
| `npm run format`                          | Prettier em `ts`, `tsx` e `md`                                    |
| `npx prettier --check "**/*.{ts,tsx,md}"` | Verifica formatação sem alterar arquivos                          |
| `npm run prepare`                         | Instala os hooks do Husky (executado automaticamente no install)  |
| `npm run commitlint`                      | Valida uma mensagem de commit recebida via stdin                  |
| `npm run commitlint:last`                 | Valida a mensagem do último commit                                |
| `npm run commit-and-push`                 | Analisa mudanças, gera commit Conventional Commits e faz push     |
| `npm run test`                            | Vitest da API e do cliente (`turbo run test`)                     |
| `npm run test:e2e`                        | Supertest da API + Playwright do cliente (`turbo run test:e2e`)   |
| `npm run infra:up`                        | Sobe Supabase local e a stack LGTM                                |
| `npm run db:migrate`                      | Aplica migrations locais via Supabase CLI                         |
| `npm run infra:down`                      | Para Supabase local e a stack LGTM                                |

> `infra:up`, `db:migrate` e `infra:down` exigem Docker com Compose e Supabase CLI. Copie `.env.example` para `.env` para ajustar portas e credenciais locais. `.prettierrc.json` usa `endOfLine: auto` para preservar o CRLF já versionado em arquivos não alterados desta entrega.

## Checklist — fundação (validado em 2026-11-22)

### Automatizado

- [x] `npm install`
- [x] `npm run lint`
- [x] `npm run check-types`
- [x] `npm run types:check`
- [x] `npm run code:fix`
- [x] `npm run format`
- [x] `npx prettier --check "**/*.{ts,tsx,md}"`
- [x] `npm run build` — artefatos em `apps/api/dist`, `apps/web/dist` e `apps/docs/.next`
- [x] `npm run test` — 1 teste da API e 1 do cliente
- [x] `npm run test:e2e` — Supertest em `GET /` e Playwright em `/`
- [x] `npm run dev` — `api` :4000, `web` :3000 e `docs` :3001 responderam `200`
- [ ] `npm run infra:up` — **não executado**: Docker e Supabase CLI ausentes neste ambiente
- [ ] `npm run db:migrate` — **não executado**: depende do Supabase local ativo
- [ ] `npm run infra:down` — **não executado**: depende de Docker e Supabase CLI

### Validação estática da infra

- [x] `node --check scripts/infra.mjs`
- [x] `node scripts/infra.mjs` falha com código `1` e mensagem de uso
- [x] `supabase/config.toml` analisado com `tomllib` do Python
- [x] `docker-compose.yml`, configs de Loki/Tempo/Prometheus e datasources do Grafana analisados com `js-yaml`
- [x] Chaves do Tempo 3.1 conferidas na documentação oficial: sem blocos `ingester`/`compactor`; equivalências em `live_store` e `backend_scheduler.provider.compaction.compaction`
- [x] Presença de Docker/Compose/Supabase CLI verificada: ausentes

### Checklist — commitlint (validado em 2026-11-22)

- [x] `npm install` com `@commitlint/cli@21.2.4`, `@commitlint/config-conventional@21.2.4` e `husky@9.1.7`
- [x] `npm run prepare` configura `core.hooksPath=.husky/_`
- [x] `commitlint.config.js` estende `@commitlint/config-conventional` sem regras customizadas
- [x] Hook `.husky/commit-msg` executa `npx --no -- commitlint --edit "$1"`
- [x] Mensagem inválida (`mensagem sem tipo`) no hook → código `1` com erros `subject-empty` e `type-empty`
- [x] Mensagem válida (`feat: configura commitlint`) no hook → código `0`
- [x] Mensagem inválida via stdin → código `1`; mensagem válida via stdin → código `0`
- [x] `npm run commitlint -- --edit <arquivo>` valida o arquivo com código `0`
- [x] `npm run commitlint:last` usa `commitlint --last` e funciona mesmo com um único commit; o commit do starter é considerado inválido, como esperado

### Checklist — commit-and-push

- [x] `node --check scripts/commit-and-push.mjs`
- [x] Script lê `git status --porcelain` e `git diff --stat`, gera header Conventional Commits e adiciona o trailer `Co-Authored-By: OpenCode Agent <opencode@opencode.ai>`
- [x] Flags `--only <caminhos...>`, `--message <header>` e `--dry-run` disponíveis
- [x] Detecta upstream e usa `git push -u origin <branch>` no primeiro push
- [x] Sem mudanças pendentes, apenas verifica o push e termina com código `0`
- [x] Executado ao final de cada spec, conforme `.docs/RULES.md`

### Manual

- [x] `curl -i http://localhost:4000/` → `200`, `Content-Type: application/json`, `{"message":"Hello World"}`
- [x] `/` em `http://localhost:3000` em 1280×720, 768×1024 e 375×667: único `<h1>Hello World</h1>`, sem outro texto, sem overflow horizontal
- [x] `prefers-color-scheme: dark` emulado: `color-scheme: light`, fundo `rgb(255, 241, 230)` e texto `rgb(42, 35, 32)`
- [x] Semântica e navegação por teclado: apenas um heading de nível 1 e nenhum controle focável
- [ ] Com Docker e Supabase CLI: `supabase status`, `docker compose ps`, `npm run db:migrate` duas vezes, `npm run infra:down` e novo `npm run infra:up`

## Pendências de ambiente

Os critérios de infra (CA-09 a CA-11) não puderam ser executados localmente. Em uma máquina com os pré-requisitos, validar nesta ordem:

1. Copiar `.env.example` para `.env`.
2. `npm run infra:up` → `supabase status` e `docker compose ps` devem listar os serviços ativos.
3. `npm run db:migrate` duas vezes → a segunda execução não deve reaplicar a migration.
4. `npm run infra:down` → nenhum container LGTM ativo e Supabase parado.
5. `npm run infra:up` novamente → deve subir sem limpeza manual.
