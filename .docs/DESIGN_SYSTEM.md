# Design system

## Base

- **shadcn** é a base de componentização (**Alvo**): construímos nosso design system sobre ela, não a substituímos.
- Tokens visuais vivem em `DESIGN.md`; não duplique cores, gradientes ou regras de tema aqui.
- Componentes internos vivem em `@repo/ui` (`packages/ui/src/*.tsx`, importáveis como `@repo/ui/<componente>`).

**Atual:** `@repo/ui` contém apenas os stubs do starter (`button.tsx`, `card.tsx`, `code.tsx`). shadcn e Tailwind ainda não estão instalados.

## Regras para componentes

1. Antes de alterar UI, carregue `frontend-design` e `web-design-guidelines` (`AGENTS.md`).
2. Reutilize a primitiva existente; crie um novo componente somente se nenhum atender ao caso.
3. Não repita valores de cor ou espaçamento: use os tokens de `DESIGN.md`.
4. Todo componente deve ser acessível (teclado, semântica, contraste) e responsivo (desktop, tablet e mobile).
5. Respeite o tema claro exclusivo — sem variantes escuras.
6. Ao adicionar uma dependência de UI, registre a decisão em ADR (`RULES.md`).

## Fluxo de decisão

1. Já existe em `@repo/ui`? Use-o.
2. Existe no shadcn? Instale/configure e adapte com os tokens do projeto.
3. Não existe? Crie em `packages/ui/src/`, exporte via `@repo/ui/<componente>` e documente aqui.
