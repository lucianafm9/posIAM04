# ADR — Tailwind CSS v4 e shadcn sem componentes adicionais

## Contexto

A spec pede setup de Tailwind e shadcn, mas a página de smoke deve exibir somente um `<h1>`. `.docs/DESIGN.md` define paleta pastel, tokens CSS e tema claro exclusivo; `.docs/DESIGN_SYSTEM.md` usa shadcn como base e `@repo/ui` para componentes internos.

## Decisão

Instalar Tailwind CSS 4.3.5 com `@tailwindcss/vite`, expressar os tokens de `.docs/DESIGN.md` como variáveis CSS em `:root`, executar `shadcn init` para gerar `components.json` e `src/lib/utils.ts` sem adicionar componentes, e não renderizar nenhum componente de UI além do `<h1>` da página de smoke.

## Consequências

- Não há `tailwind.config.ts`: a configuração de tema vive em CSS, conforme o modelo v4.
- Nenhuma variante de tema escuro é criada, inclusive em `prefers-color-scheme: dark`.
- Componentes shadcn futuros virão com seus tokens adaptados à paleta do projeto.

## Alternativas descartadas

- **Tailwind v3 com `tailwind.config.ts`:** versão anterior, sem necessidade de compatibilidade legada nesta fundação.
- **Instalar componentes shadcn agora:** a página deve mostrar apenas o título; componentes extras seriam código morto.
- **Pular shadcn:** descumpre a lista alvo da spec e atrasa a base do design system.
