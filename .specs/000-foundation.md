# Fundação

> Status: `refinada`  
> Dono: `<a definir>`  
> Ultima atualizacao: `2026-11-22`

## Resumo

Preparar o monorepo para o desenvolvimento real: criar `apps/api` em Nest.js e substituir o starter Next.js em `apps/web` por um cliente React com Vite. Instalar as bibliotecas e configurações descritas como alvo em `.docs/ARCHITECTURE.md`, disponibilizar comandos únicos de lint, tipagem, build, testes, infra local e migrações, com validação automatizada mínima. Resultado: qualquer desenvolvedor consegue subir API, cliente e infra local e executar o QA sem tomar novas decisões.

## Contexto

- **Problema atual:** o repositório é o starter `create-turbo`. `apps/web` (porta `3000`) e `apps/docs` (porta `3001`) usam Next.js `16.3.8`; existem os pacotes compartilhados `@repo/ui`, `@repo/eslint-config` e `@repo/typescript-config`. Não há API, runner de testes, Supabase, stack LGTM, `docker-compose.yml`, comandos de infra nem migrações. Os scripts da raiz são apenas `build`, `dev`, `lint`, `format` e `check-types` (fonte: `package.json`), e as tasks do Turbo são `build`, `lint`, `check-types` e `dev` (fonte: `turbo.json`). Não existem marcadores `[implementado]` no repositório, nas specs ou nos documentos.
- **Motivacao:** as documentações de arquitetura já definem a stack alvo, mas nada dela está instalada. Sem uma fundação reproduzível, cada feature começaria com decisões de setup e configurações duplicadas.
- **Referencias:** `.docs/ARCHITECTURE.md` (stack alvo e camadas), `.docs/QA.md` (comandos reais e correção dos comandos `bun` antigos), `.docs/RULES.md` (plano e ADRs), `.docs/DEVELOPMENT.md`, `.docs/DESIGN.md`, `.specs/_template.md`.

> Correção factual registrada: a spec original escrevia `@apps/api` também para o cliente React com Vite. O cliente passa a ser `apps/web`, conforme decisão confirmada; `apps/api` é exclusivo do back-end Nest.js.

## Objetivo de negocio

Reduzir o tempo entre "clonar o repositório" e "começar uma feature real": com um único conjunto de comandos, o time obtém API e cliente funcionais, infra local idêntica em todas as máquinas e pipeline de QA executável. Saberemos que gerou valor quando um desenvolvedor executar `npm install`, `npm run infra:up`, `npm run dev` e os comandos de `QA.md` sem perguntas adicionais e sem ajustes manuais de configuração.

## Escopo

### Incluido

- `apps/api`: novo projeto Nest.js com endpoint `GET /` de smoke, estrutura em camadas alvo (`application`, `infrastructure`, `domain`, `interface`) e `src/modules/shared`. Nenhum domínio de produto ainda.
- `apps/web`: substituir o starter Next.js por React com Vite, com uma página `/` contendo apenas um título.
- Instalação das bibliotecas listadas em `.docs/ARCHITECTURE.md` — seção "Stack alvo" — cada uma na workspace em que é efetivamente usada:
  - API: Nest.js, TypeScript, Supabase (SDK), bcrypt, Vitest e Supertest.
  - Cliente: React, TypeScript, Tailwind CSS, shadcn, date-fns, TanStack Query, TanStack Table, TanStack Chart, Vitest e Playwright.
  - Monorepo: Turborepo, TypeScript, ESLint, Prettier e `@repo/ui` para código compartilhado.
- Configurações necessárias: Nest CLI/TypeScript/ESLint/Vitest em `apps/api`; Vite/TypeScript/Tailwind/shadcn/Vitest/Playwright em `apps/web`; `turbo.json`; `supabase/config.toml` e `supabase/migrations`; `docker-compose.yml` com a stack LGTM; `.env.example` com placeholders.
- Comandos npm na raiz: `dev`, `build`, `lint`, `format`, `check-types`, `code:fix`, `types:check`, `test`, `test:e2e`, `infra:up`, `infra:down` e `db:migrate`.
- Limpeza das dependências não utilizadas do starter em `apps/web` (Next.js e correlatas) e ajuste dos outputs do Turbo para contemplar `dist/**` além de `.next/**`.
- Ajuste da configuração centralizada de ESLint/Prettier para cobrir os novos apps, sem criar uma segunda configuração.
- ADRs para as decisões arquiteturais introduzidas, conforme `.docs/RULES.md`.

### Fora de escopo

- Features de produto: experts CEO/CMO/CTO, conectores de fontes externas, solicitação de tarefas ou formato das entregas.
- Autenticação/autorização, modelos de dados de negócio, RLS e permissões.
- Deploy em Vercel e qualquer configuração de produção (a stack alvo cita Vercel como hospedagem, mas isso não é biblioteca nem é necessário para a fundação local).
- Design system visual completo; apenas o setup de Tailwind/shadcn e o mínimo necessário para a página de smoke.
- Alteração ou remoção de `apps/docs`, que permanece como está nesta spec.
- Tema escuro, explicitamente proibido por `.docs/DESIGN.md`.

## Requisitos funcionais

- **RF-01:** DADO o monorepo com dependências instaladas, QUANDO `npm run dev` é executado, ENTAO a API e o cliente iniciam e ficam acessíveis nas portas documentadas na implementação.
- **RF-02:** DADO a API em execução, QUANDO `GET /` é chamado, ENTAO a resposta é HTTP `200`, com `Content-Type: application/json` e corpo `{"message":"Hello World"}`.
- **RF-03:** DADO o cliente em execução, QUANDO `/` é aberto no navegador, ENTAO a página exibe um único elemento `<h1>` com o texto `Hello World` e nenhum outro conteúdo visível.
- **RF-04:** DADO uma alteração de código, QUANDO `npm run lint` é executado, ENTAO o ESLint termina com zero erros e zero avisos em todas as workspaces.
- **RF-05:** DADO uma alteração de código, QUANDO `npm run code:fix` é executado, ENTAO o ESLint aplica correções automáticas, o Prettier formata os arquivos suportados e o comando termina com zero erros; `npm run format` continua funcional.
- **RF-06:** DADO uma alteração de código, QUANDO `npm run types:check` é executado, ENTAO o script delega a `npm run check-types` e a checagem termina sem erros em todas as workspaces.
- **RF-07:** DADO o monorepo, QUANDO `npm run build` é executado, ENTAO `apps/api`, `apps/web` e `apps/docs` geram seus artefatos e o comando termina com código `0`.
- **RF-08:** DADO o Vitest configurado, QUANDO `npm run test` é executado, ENTAO ao menos um teste de smoke da API e um do cliente passam.
- **RF-09:** DADO Supertest e Playwright configurados, QUANDO `npm run test:e2e` é executado, ENTAO o Supertest valida `GET /` da API e o Playwright valida a página `/` do cliente, ambos com sucesso.
- **RF-10:** DADO Docker, Docker Compose e Supabase CLI disponíveis, QUANDO `npm run infra:up` é executado, ENTAO `supabase start` sobe o Supabase local e `docker compose up -d` sobe os serviços LGTM definidos em `docker-compose.yml`.
- **RF-11:** DADO a infra local ativa, QUANDO `npm run infra:down` é executado, ENTAO os containers LGTM são parados/removidos e o Supabase local é interrompido, sem resíduos que impeçam um novo `infra:up`.
- **RF-12:** DADO as migrations em `supabase/migrations`, QUANDO `npm run db:migrate` é executado, ENTAO são aplicadas ao banco local e uma segunda execução não retorna erro nem reaplica a mesma migration.
- **RF-13:** DADO a lista de bibliotecas alvo, QUANDO `npm install` termina, ENTAO cada biblioteca está instalada na workspace correta e nenhuma dependência não utilizada do starter permanece em `apps/web`.
- **RF-14:** DADO qualquer decisão arquitetural desta spec, QUANDO o código vai ser alterado, ENTAO existe um ADR correspondente em `./.adrs/`, conforme `.docs/RULES.md`.

## Requisitos nao funcionais

- **RNF-01:** compatibilidade com Node `>=24` e npm `11.19.0`, conforme `engines` e `devEngines` da raiz.
- **RNF-02:** observabilidade desde o dia zero — stack LGTM (Grafana, Loki, Tempo e Prometheus) disponível via `docker-compose.yml`, com a API emitindo logs que possam ser coletados.
- **RNF-03:** a página de smoke usa semântica de heading, é navegável por teclado e respeita exclusivamente o tema claro definido em `.docs/DESIGN.md`.
- **RNF-04:** `infra:up`, `infra:down` e `db:migrate` são repetíveis e retornam código diferente de zero quando qualquer serviço não atinge o estado esperado.
- **RNF-05:** nenhuma credencial real é versionada; variáveis de ambiente são documentadas apenas em `.env.example`, com placeholders.
- **RNF-06:** uma única configuração de ESLint e Prettier por workspace, centralizada em `@repo/eslint-config` e na raiz, sem duplicação de regras.

## Criterios de aceite

- [x] `npm install` conclui sem erros e não deixa dependências órfãs da antiga configuração do Next.js em `apps/web`.
- [x] `npm run dev` inicia API e cliente; `curl -i http://<porta-da-api>/` retorna `200`, `Content-Type: application/json` e `{"message":"Hello World"}`.
- [x] A rota `/` do cliente mostra somente o título `Hello World`, verificado manualmente em três viewports e pelo teste E2E.
- [x] `npm run lint`, `npm run check-types`, `npm run types:check` e `npm run code:fix` terminam com código `0`.
- [x] `npx prettier --check "**/*.{ts,tsx,md}"` não aponta arquivos pendentes de formatação após `code:fix`.
- [x] `npm run build` termina com código `0` e gera artefatos para `apps/api`, `apps/web` e `apps/docs`; `turbo.json` declara outputs tanto `.next/**` quanto `dist/**`.
- [x] `npm run test` e `npm run test:e2e` executam os testes de smoke e terminam com código `0`.
- [ ] `npm run infra:up` faz `supabase status` reportar os serviços ativos e `docker compose ps` mostrar os containers LGTM sem falha. **Não executado localmente: Docker e Supabase CLI ausentes.**
- [ ] `npm run infra:down` interrompe Supabase e LGTM; um segundo `npm run infra:up` volta a funcionar sem limpeza manual. **Não executado localmente: pré-requisitos ausentes.**
- [ ] `npm run db:migrate` aplica as migrations locais e uma segunda execução é bem-sucedida sem duplicação. **Não executado localmente: depende do Supabase ativo.**
- [x] Todas as bibliotecas da seção "Stack alvo" de `.docs/ARCHITECTURE.md` estão presentes nas workspaces correspondentes; itens de deploy/Vercel não foram instalados.
- [x] ADRs das decisões estruturais desta spec existem em `./.adrs/` e o plano foi salvo em `./.plans/000-foundation-plan.md` antes da implementação.
- [x] Revisão final do diff: apenas arquivos intencionais mudaram e `.docs/QA.md` reflete os comandos disponíveis após a entrega.

## Abordagem sugerida

- Criar `apps/api` com Nest.js, `tsconfig` estendendo `@repo/typescript-config`, lint estendendo `@repo/eslint-config` e um controller de smoke no módulo raiz. Manter a divisão em camadas e `src/modules/shared`, sem criar domínios de negócio.
- Em `apps/web`, substituir Next.js por Vite React (`index.html`, `vite.config.ts`, entrypoint React), remover scripts como `next typegen` e adaptar o lint para o preset base/React. `apps/docs` permanece Next.js e intocado.
- Instalar as bibliotecas por workspace conforme o item "Incluido" e registrar em ADR cada dependência estrutural relevante (Nest.js, Vite no lugar de Next.js, Supabase, LGTM, runners de teste, Tailwind/shadcn).
- Ajustar `turbo.json`: preservar `.next/**` para `apps/docs`, adicionar `dist/**` para o build do Vite e criar tasks para `test` e `test:e2e`. `code:fix` e `types:check` são aliases de scripts npm para `format`/lint e `check-types`, não novas tasks do Turbo.
- Manter `package.json` da raiz como fonte da verdade dos comandos; atualizar `.docs/QA.md` depois que os novos scripts existirem.
- `docker-compose.yml` na raiz conterá apenas Grafana, Loki, Tempo e Prometheus. O Supabase local é gerenciado pela CLI (`supabase/config.toml` + `supabase/migrations`); `infra:up`/`infra:down` orquestram os dois e verificam o resultado.
- Configurar um único teste de smoke por runner (Vitest, Supertest e Playwright) apenas para provar que o pipeline funciona; cobertura de features vem nas specs seguintes.

## Dependencias e premissas

- **Dependencias:** Docker com Docker Compose e Supabase CLI instalados na máquina de desenvolvimento; acesso à rede para `npm install`; Node `>=24` e npm `11.19.0`; portas locais livres para API, cliente, Grafana e Supabase; ADRs aprovados antes das mudanças estruturais.
- **Premissas confirmadas:** o cliente Vite fica em `apps/web`; `apps/docs` não faz parte desta entrega; `code:fix` e `types:check` são aliases dos scripts atuais; Supabase local via CLI e LGTM via `docker-compose.yml`; o inventário de bibliotecas é o da seção "Stack alvo" de `.docs/ARCHITECTURE.md`; ESLint/Prettier atuais são ajustados, não substituídos.

## Riscos e pontos em aberto

- **Risco:** conflito de portas — `apps/web` usa `3000`, `apps/docs` usa `3001`, o Grafana costuma usar `3000` e a CLI do Supabase usa `54321`/`54322`/`54323`. Mitigação: mapear explicitamente as portas host no compose e na configuração da API. **Em aberto:** portas oficiais da API e do Grafana, a decidir em `feature-concept`.
- **Risco:** `turbo.json` hoje declara apenas outputs `.next/**`; sem ajuste, os artefatos do Vite (`dist/**`) não serão corretamente considerados. Mitigação: declarar ambos os padrões de output.
- **Risco:** o lint atual de `apps/web` está voltado a Next.js e pode gerar regras inválidas após a troca para Vite. Mitigação: usar os presets base/React de `@repo/eslint-config`.
- **Risco:** `infra:up` ou `infra:down` podem falhar parcialmente (CLI sobe, compose falha, ou o contrário). Mitigação: os scripts verificam `supabase status` e `docker compose ps` e falham se algum serviço não estiver no estado esperado.
- **Risco:** instalar toda a stack alvo aumenta o tempo de setup e a quantidade de ADRs. Mitigação: instalar por workspace, sem features, e registrar as decisões antes da implementação.
- **Em aberto:** dono da spec (`<a definir>` no cabeçalho).
- **Em aberto:** ausência de marcadores `[implementado]` no repositório — a regra confirmada é apenas não duplicar configurações já existentes.

## Plano de validacao

- **Automatizada:** `npm install`, `npm run lint`, `npm run check-types`, `npm run types:check`, `npm run code:fix`, `npm run build`, `npm run test`, `npm run test:e2e`, `npm run infra:up`, `npm run db:migrate`, `npm run infra:down` e nova execução de `npm run infra:up`.
- **Manual:** `curl` na rota raiz da API conferindo status, header e corpo; abrir `/` do cliente em desktop, tablet e mobile e conferir o título único; verificar navegação por teclado e ausência de tema escuro; `supabase status` e `docker compose ps` após subir a infra; revisão do diff e dos ADRs.

## Resultado esperado

Monorepo com `apps/api` (Nest.js) respondendo `GET /` em JSON e `apps/web` (React + Vite) exibindo `Hello World` no `/`. Bibliotecas alvo instaladas nas workspaces corretas, configurações centralizadas de ESLint/Prettier/TypeScript ajustadas, runners de teste funcionando e `turbo.json` cobrindo os builds de Next.js e Vite. Na raiz existem `docker-compose.yml` (LGTM), `supabase/config.toml`, `supabase/migrations`, `.env.example` e os comandos `dev`, `build`, `lint`, `format`, `check-types`, `code:fix`, `types:check`, `test`, `test:e2e`, `infra:up`, `infra:down` e `db:migrate`. ADRs e plano salvos, QA verde e nenhuma feature de produto implementada.
