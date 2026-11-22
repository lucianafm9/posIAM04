# ADR — Cliente React com Vite em `apps/web`

## Contexto

O starter usa Next.js 16.3.8 em `apps/web` (:3000) e `apps/docs` (:3001). A spec `000-foundation` pede um cliente React com Vite em `apps/web`, com uma página `/` contendo apenas um título, e mantém `apps/docs` inalterado.

## Decisão

Substituir o Next.js de `apps/web` por Vite + React na porta 3000, removendo `next`, configurações e artefatos do starter daquela workspace. `apps/docs` permanece Next.js e intocado. TypeScript, ESLint e Prettier continuam centralizados em `@repo/*`.

## Consequências

- `apps/web` passa a gerar `dist/**`; `turbo.json` precisa declarar esse output além de `.next/**` (ver ADR de portas/QA).
- O script `check-types` de `apps/web` deixa de usar `next typegen` e passa a `tsc --noEmit`.
- Nenhuma funcionalidade de SSR, roteamento de arquivos ou metadados do Next.js é levada para o cliente.

## Alternativas descartadas

- **Manter Next.js em `apps/web`:** contraria a spec, que pede explicitamente Vite.
- **Criar `apps/client` e deixar `apps/web` como estava:** a spec confirma que o cliente Vite é `apps/web`.
- **Migrar `apps/docs` junto:** fora de escopo da spec.
