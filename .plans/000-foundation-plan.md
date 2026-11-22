# Plano — 000-foundation

## Contexto

O repositório é o starter `create-turbo`: `apps/web` (Next.js 16.3.8, :3000), `apps/docs` (Next.js 16.3.8, :3001), `@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`, scripts de raiz `build/dev/lint/format/check-types` e `turbo.json` com outputs apenas `.next/**`. A spec `.specs/000-foundation.md` pede a fundação para desenvolvimento real: `apps/api` em Nest.js, `apps/web` em React+Vite, bibliotecas alvo de `.docs/ARCHITECTURE.md`, comandos únicos de QA/infra e validação mínima. Fatos verificados: Node 24.21.0, npm 11.19.0, Turbo 2.11.13 com documentação instalada; Docker, Supabase CLI e browsers do Playwright ausentes nesta máquina; `.adrs/` e `.plans/` vazios. `AGENTS.md` da raiz contém o bloco gerenciado do Turborepo, que deve permanecer.

## Decisões (do feature-concept)

1. **Portas (Q1):** API `4000`, web `3000`, docs `3001`, Grafana host `3002` → container `3000`, Loki `3100`, Tempo `3200`, Prometheus `9090`, Supabase `54321/54322/54323`.
2. **Infra local (Q2):** escrever compose/config/migrations e scripts com falha rápida; **não executar** `infra:up`, `infra:down` ou `db:migrate` neste ambiente por ausência de Docker/Supabase CLI; registrar critérios como não validados localmente e entregar passos manuais.
3. **Gráficos (Q3):** instalar `@tanstack/react-charts` em `apps/web` (não existe `@tanstack/react-chart`); decisão em ADR.
4. **UI (Q4):** Tailwind CSS `4.3.5` via `@tailwindcss/vite`, tokens de `.docs/DESIGN.md` como variáveis CSS, `shadcn init` sem componentes adicionais; página de smoke com um único `<h1>`.
5. **Dono da spec (Q5):** manter `<a definir>` no cabeçalho.
6. **Migration (Q6):** criar uma migration no-op em `supabase/migrations` para provar `db:migrate` sem modelo de negócio.
7. **Testes (Q7):** `test` = Vitest na API e Vitest em `apps/web` com `react-dom/server` (sem novas dependências); `test:e2e` = Vitest+Supertest em `GET /` (API :4000) e Playwright com webServer Vite na :3000; Chromium será instalado via `npx playwright install chromium`.
8. **Camadas (Q8):** criar `application`, `infrastructure`, `domain`, `interface` e `src/modules/shared` com `.gitkeep`; controller de smoke no `AppModule` raiz, sem domínio de produto.
9. **TypeScript da API (Q9):** fixar `typescript@6.0.3` apenas em `apps/api` (Nest CLI 12 não compila com a API ausente na 7.0.2); raiz e demais workspaces permanecem em 7.0.2.

Premissas confirmadas pela spec que **não** foram renegociadas: cliente Vite em `apps/web`; `apps/docs` intocado; `code:fix` e `types:check` são aliases de scripts npm (não novas tasks Turbo); Supabase via CLI e LGTM via `docker-compose.yml`; ESLint/Prettier centralizados são ajustados, não substituídos; nenhum tema escuro.

## Critérios de aceite

- **CA-01:** `npm install` conclui sem erros e `apps/web` não retém dependências órfãs do Next.js.
- **CA-02:** `GET http://localhost:4000/` → `200`, `Content-Type: application/json` e `{"message":"Hello World"}`.
- **CA-03:** `/` em `http://localhost:3000` exibe somente `<h1>Hello World</h1>`, conferido manualmente e por E2E.
- **CA-04:** `npm run lint`, `npm run check-types`, `npm run types:check` e `npm run code:fix` terminam com código `0`, sem erros nem avisos.
- **CA-05:** `npx prettier --check "**/*.{ts,tsx,md}"` não aponta arquivos pendentes após `code:fix`.
- **CA-06:** `npm run build` termina com código `0` e gera artefatos de `apps/api`, `apps/web` e `apps/docs`; `turbo.json` declara `.next/**` e `dist/**`.
- **CA-07:** `npm run test` executa smoke da API e do cliente com sucesso.
- **CA-08:** `npm run test:e2e` executa Supertest (`GET /`) e Playwright (`/` do cliente) com sucesso.
- **CA-09:** `npm run infra:up` sobe Supabase via CLI e os quatro serviços LGTM via compose, verificando `supabase status` e `docker compose ps`.
- **CA-10:** `npm run infra:down` interrompe tudo sem resíduos; novo `infra:up` funciona.
- **CA-11:** `npm run db:migrate` aplica a migration local e uma segunda execução é bem-sucedida sem duplicação.
- **CA-12:** ADRs das decisões estruturais existem em `./.adrs/` e este plano foi salvo antes da implementação.
- **CA-13:** bibliotecas da "Stack alvo" estão nas workspaces corretas; itens de deploy/Vercel não foram instalados.
- **CA-14:** `.docs/QA.md` reflete os comandos disponíveis após a entrega e o diff final contém apenas arquivos intencionais.

## Tarefas (ordem de execução e dependências)

- **T0 — ADRs e plano (sem dependência).** Salvar este plano e criar em `./.adrs/`: `api-nest-e-camadas.md`, `web-vite-no-lugar-de-next.md`, `portas-locais.md`, `tailwind-v4-e-shadcn.md`, `runners-de-teste.md`, `supabase-e-lgtm.md`, `tanstack-charts.md` e `typescript-6-na-api.md`. Cada ADR usa Contexto → Decisão → Consequências → Alternativas descartadas. Validação: arquivos presentes e plano salvo. Atende **CA-12**.
- **T1 — Scripts de raiz e Turborepo (depende de T0).** Atualizar `package.json` com `dev`, `build`, `lint`, `format`, `check-types`, `code:fix`, `types:check`, `test`, `test:e2e`, `infra:up`, `infra:down`, `db:migrate`; ajustar `turbo.json` com outputs `.next/**` e `dist/**` e tasks `test`/`test:e2e`, mantendo `dev` persistente sem cache e o bloco `AGENTS.md`. Validação: `npx turbo run --dry=json` e `npm run lint` (após T2/T3). Atende **CA-04, CA-06, CA-07, CA-08**.
- **T2 — `apps/api` Nest.js (depende de T0; validação final depende de T1).** Criar workspace, dependências Nest/Supabase/bcrypt, TypeScript estendendo `@repo/typescript-config`, ESLint estendendo `@repo/eslint-config/ base`, Vitest, `GET /` com `{"message":"Hello World"}`, pastas de camadas e `src/modules/shared` com `.gitkeep`. TDD: escrever teste de smoke antes do controller. Validação: `npm run test --workspace api`, `curl` na :4000. Atende **CA-02, CA-04, CA-06, CA-07, CA-13**.
- **T3 — `apps/web` React+Vite (depende de T0; validação final depende de T1).** Substituir Next.js por Vite na :3000, remover dependências/configs órfãos, aplicar Tailwind v4 com tokens do `DESIGN.md`, `shadcn init` sem componentes, configurar ESLint base/React do pacote centralizado, página com único `<h1>` e tema claro exclusivo. Carregar `frontend-design`, `web-design-guidelines`, `shadcn` e `vercel-react-best-practices` antes de escrever UI. Validação: `npm run build --workspace web`, inspeção da página em desktop/tablet/mobile. Atende **CA-01, CA-03, CA-05, CA-06, CA-13**.
- **T4 — Runners e testes de smoke (depende de T1, T2, T3).** Configurar Vitest em `apps/api` e `apps/web` (com `react-dom/server`), Supertest para `GET /` e Playwright em `apps/web` com `webServer` na :3000; escrever os testes no seam acordado (TDD vermelho → verde) e instalar Chromium. Validação: `npm run test` e `npm run test:e2e`. Atende **CA-07, CA-08**.
- **T5 — Infra local (depende de T0 e T1).** Criar `docker-compose.yml` com Grafana (:3002→3000), Loki (:3100), Tempo (:3200), Prometheus (:9090); `supabase/config.toml`, `supabase/migrations` com migration no-op, `.env.example` sem credenciais reais e scripts `infra:up`/`infra:down`/`db:migrate` com verificação de pré-requisitos e falha rápida. Carregar `supabase-postgres-best-practices`. Validação: checagem estática dos arquivos, `docker compose config` e `supabase` quando disponíveis; neste ambiente registrar não executado. Atende **CA-09, CA-10, CA-11, CA-13**.
- **T6 — Instalação e verificação da stack alvo (depende de T1–T5).** Rodar `npm install` e conferir no lockfile cada biblioteca alvo na workspace correta: API (Nest, Supabase SDK, bcrypt, Vitest, Supertest), cliente (React, TS, Tailwind, shadcn, date-fns, Query, Table, Charts, Vitest, Playwright), monorepo (Turbo, TS, ESLint, Prettier, `@repo/ui`). Validação: `npm ls` por workspace. Atende **CA-01, CA-13**.
- **T7 — QA final e fechamento (depende de T1–T6).** Executar todos os comandos de `QA.md`, atualizar `.docs/QA.md` com os comandos disponíveis, revisar diff, registrar resultados manuais e os critérios de infra não executados no plano. Atende **CA-04, CA-05, CA-06, CA-07, CA-08, CA-14**.

## Arquivos previstos

- `.plans/000-foundation-plan.md` (este arquivo) e `.adrs/*.md` (8 ADRs).
- Raiz: `package.json`, `turbo.json`, `docker-compose.yml`, `.env.example`, `.docs/QA.md`; `AGENTS.md` preservado.
- `apps/api/`: `package.json`, `tsconfig.json`, `tsconfig.build.json`, `eslint.config.mjs`, `vitest.config.mts`, `vitest.e2e.config.mts`, `nest-cli.json`, `src/main.ts`, `src/app.module.ts`, `src/app.controller.ts`, `test/app.controller.spec.ts`, `test/app.e2e-spec.ts`, `src/application/`, `src/domain/`, `src/infrastructure/`, `src/interface/`, `src/modules/shared/` (com `.gitkeep`).
- `apps/web/`: `package.json`, `index.html`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `tsconfig.json`, `eslint.config.js`, `src/main.tsx`, `src/App.tsx`, `src/App.spec.tsx`, `src/index.css`, `components.json`, `src/lib/utils.ts` e `e2e/smoke.spec.ts`; remoção de `next.config.js`, `next-env.d.ts`, `app/`, `public/` do starter.
- `supabase/config.toml` e `supabase/migrations/<timestamp>_foundation_noop.sql`.
- `package-lock.json` atualizado.

## Riscos e mitigação

- **Docker/Supabase CLI ausentes:** scripts falham rápido com mensagem de pré-requisito; critérios CA-09/CA-10/CA-11 registrados como não executados neste ambiente, com passos manuais no fechamento.
- **Chromium não em cache:** `npx playwright install chromium`; se o download falhar, registrar CA-08 como parcialmente validado em vez de esconder a falha.
- **Compatibilidade TS 7 / ESLint 10 / Tailwind 4 / Nest 12 / Vite 8:** validar cedo em cada tarefa; ajustar presets centralizados em vez de criar segunda configuração.
- **Cache do Turbo em `code:fix` (`lint --fix`):** usar `--force`/desabilitar cache conforme a documentação instalada, para garantir que as correções sejam aplicadas.
- **Conflito de portas:** tabela de portas da decisão Q1 aplicada em `vite.config.ts`, API, compose e `.env.example`.
- **Dependências "Alvo" ausentes no início:** instalar por workspace e conferir no lockfile; nenhuma dependência de deploy/Vercel.

## Validação (comandos de QA.md + passos manuais)

**Comandos (raiz):** `npm install`, `npm run lint`, `npm run check-types`, `npm run types:check`, `npm run code:fix`, `npm run format`, `npx prettier --check "**/*.{ts,tsx,md}"`, `npm run build`, `npm run test`, `npm run test:e2e`, `npm run dev`, `npm run infra:up`, `npm run db:migrate`, `npm run infra:down` e nova execução de `npm run infra:up`.

**Passos manuais aplicáveis:**

1. `curl -i http://localhost:4000/` — conferir `200`, `Content-Type: application/json` e corpo exato.
2. Abrir `http://localhost:3000` em desktop, tablet e mobile — conferir único `<h1>Hello World</h1>`, sem outro conteúdo visível.
3. Navegar por teclado e verificar semântica/contraste; confirmar ausência de tema escuro (inclusive em `prefers-color-scheme: dark`).
4. Com Docker e Supabase CLI disponíveis: `supabase status` e `docker compose ps`; `npm run db:migrate` duas vezes; `npm run infra:down` e novo `npm run infra:up`.
5. Revisar `git diff` e confirmar que apenas arquivos intencionais mudaram e que `.docs/QA.md` está atualizado.

**Registro de resultados:** preencher ao final de cada tarefa e no fechamento; itens dependentes de infra ausente ficam marcados como "não executados — pré-requisito ausente neste ambiente".

## Resultados da execução (2026-11-22)

- **T0 — concluído:** plano salvo antes da implementação e 8 ADRs em `.adrs/` (incluindo a exceção de TypeScript 6 na API, descoberta na validação de T2).
- **T1 — concluído:** `npx turbo run build test test:e2e --dry=json` listou as quatro tasks; `turbo.json` declara `.next/**` e `dist/**` no build, `test` sem outputs (evita aviso de `coverage/**` inexistente) e `test:e2e` sem cache.
- **T2 — concluído:** teste vermelho escrito antes do controller; `GET /` respondeu `200` com `{"message":"Hello World"}`; `test`, `lint`, `check-types`, `build` e carregamento de `bcrypt` passaram. ADR `typescript-6-na-api.md` registra a exceção necessária.
- **T3 — concluído:** starter Next.js removido de `apps/web`; Vite, Tailwind v4, tokens de `DESIGN.md` e shadcn configurados; build/lint/tipagem limpos. Verificação em navegador a 1280×720, 768×1024 e 375×667 confirmou único `<h1>`, sem overflow e tema claro mesmo com `prefers-color-scheme: dark`.
- **T4 — concluído:** `npm run test` e `npm run test:e2e` passaram (Vitest da API e web, Supertest em `GET /`, Playwright/Chromium em `/`).
- **T5 — concluído com ressalva de ambiente:** `docker-compose.yml`, configs LGTM, `supabase/config.toml`, migration no-op, `.env.example` e `scripts/infra.mjs` criados. Sintaxe validada por `node --check`, `tomllib` e `js-yaml`. A config do Tempo 3.1 foi conferida na documentação oficial e corrigida para usar `live_store` e `backend_scheduler.provider.compaction.compaction` (os blocos `ingester`/`compactor` foram removidos no Tempo 3.x). `infra:up`, `infra:down` e `db:migrate` **não executados**: Docker e Supabase CLI ausentes; passos manuais registrados em `.docs/QA.md`.
- **T6 — concluído:** `npm ls` confirmou Nest/Supabase/bcrypt/Vitest/Supertest em `api`, React/TS/Tailwind/shadcn/date-fns/Query/Table/Charts/Vitest/Playwright em `web` e Turbo/TS/ESLint/Prettier/`@repo/ui` na raiz. `apps/web` não tem `next` nem `eslint-config-next`.
- **T7 — concluído com ressalva de ambiente:** todos os comandos automatizados e checagens manuais aplicáveis passaram; `.docs/QA.md` atualizado. `.prettierrc.json` com `endOfLine: auto` preserva os arquivos CRLF existentes, mantendo `apps/docs` intocado e `prettier --check` limpo. CA-09/CA-10/CA-11 permanecem como **não executados — pré-requisito ausente neste ambiente**.
