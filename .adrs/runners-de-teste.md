# ADR — Runners de teste e seams da fundação

## Contexto

O starter não tem runner de testes. A spec pede um smoke por runner: Vitest (API e cliente), Supertest (API) e Playwright (cliente), sem features de produto. `DEVELOPMENT.md` pede TDD no seam acordado.

## Decisão

- `apps/api`: Vitest para o teste de smoke do controller e Vitest + Supertest para validar `GET /` em HTTP na porta 4000.
- `apps/web`: Vitest com `react-dom/server` (`renderToStaticMarkup`) para afirmar que a página contém um único `<h1>Hello World</h1>` — sem `@testing-library/react` nem `jsdom`.
- `apps/web`: Playwright com `webServer` iniciando o Vite na porta 3000 para o E2E da página `/`; Chromium via `npx playwright install chromium`.
- Raiz: `npm run test` e `npm run test:e2e` delegam a tasks do Turbo; `code:fix` e `types:check` permanecem aliases de scripts npm.

## Consequências

- A lista alvo de dependências é atendida sem adições fora dela.
- O teste do cliente roda em ambiente Node, sem DOM simulado; testes de interação virão quando houver interface real.
- Supertest e Playwright cobrem as duas pontas HTTP com um único caso de smoke cada.

## Alternativas descartadas

- **Testing Library + jsdom:** duas dependências extras fora da lista alvo, sem necessidade para um título estático.
- **Usar apenas Playwright para tudo:** deixaria Vitest/Supertest sem cobertura e misturaria unitário com E2E.
- **Testes apenas na raiz:** contraria a convenção Turborepo de instalar o runner na workspace que usa o teste.
