# ADR — TypeScript 6 apenas em `apps/api`

## Contexto

O repositório usa TypeScript 7.0.2 na raiz e nas workspaces. O Nest CLI 12.0.15 rejeita essa versão: a API de compilação de programas só retornaria na 7.1. Além disso, a TS7 removeu `moduleResolution: node10`, usado implicitamente pela configuração inicial da API.

## Decisão

Fixar `typescript@6.0.3` como devDependency de `apps/api`, mantendo 7.0.2 na raiz e nas demais workspaces. A configuração da API herda `module`/`moduleResolution: NodeNext` de `@repo/typescript-config/base.json` e desativa `isolatedModules` para permitir `emitDecoratorMetadata`.

## Consequências

- `nest build`, `nest start` e `tsc --noEmit` voltam a funcionar na API sem tooling customizado.
- Existem duas versões de TypeScript no lockfile, cada uma na workspace que a utiliza; `npm ls` deixa a exceção explícita.
- Quando a TS 7.1 restabelecer a API do compilador, a exceção pode ser removida.

## Alternativas descartadas

- **Downgrade global para 6.0.3:** mudaria o estado "Atual" documentado de todas as workspaces sem necessidade.
- **Manter TS7 e substituir o Nest CLI por `tsc` + `node --watch`:** scripting customizado e perda do fluxo padrão do Nest.
- **Alterar `moduleResolution` para `node10`:** opção removida na TS7.
