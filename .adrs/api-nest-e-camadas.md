# ADR — API em Nest.js com camadas preparadas

## Contexto

`.docs/ARCHITECTURE.md` define Nest.js como stack da API e as camadas `application`, `infrastructure`, `domain` e `interface`, com código compartilhado em `src/modules/shared`. A spec `000-foundation` pede `apps/api` com endpoint `GET /` de smoke e nenhum domínio de produto.

## Decisão

Criar `apps/api` com Nest.js (TypeScript, ESLint e tipos centralizados), controller de smoke no `AppModule` raiz respondendo `{"message":"Hello World"}` e as quatro pastas de camadas mais `src/modules/shared` como placeholders com `.gitkeep`. Nenhum caso de uso artificial será criado apenas para "exercitar" as camadas.

## Consequências

- Estrutura física das camadas já existe e as próximas specs podem fatiar por domínio sem reestruturar o projeto.
- O smoke permanece simples: não há indireção interface → application → domain para um `hello world`.
- A API expõe logs pelo logger padrão do Nest, passíveis de coleta pela stack LGTM.
- ADR separada registra a porta da API (4000) e os runners de teste.

## Alternativas descartadas

- **Smoke como slice em `shared` atravessando camadas:** demonstraria o fluxo, mas criaria abstração para uma única ocorrência, contrariando `DEVELOPMENT.md`.
- **Controller solto em `src/` sem pastas de camadas:** descumpre a organização alvo exigida pela spec.
- **Fastify ou Express puro:** a stack alvo do projeto é Nest.js.
