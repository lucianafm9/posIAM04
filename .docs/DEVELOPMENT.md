# Desenvolvimento

Convenções aplicáveis a toda mudança de código. Antes de começar, siga o fluxo de `RULES.md`.

## Princípios

| Princípio         | Aplicação prática                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| DRY               | Uma regra de negócio tem uma única implementação.                                                                          |
| WET (anti-padrão) | Duplicação é tolerada até a terceira ocorrência; ao repetir três vezes, extraia. Não crie abstração para duas ocorrências. |
| Clean code        | Nomes claros, funções pequenas, sem efeitos colaterais implícitos.                                                         |
| SOLID             | Especialmente responsabilidade única e inversão de dependência entre camadas.                                              |

## Estrutura

- Arquitetura em camadas: `application`, `infrastructure`, `domain`, `interface` — responsabilidades detalhadas em `ARCHITECTURE.md`.
- Vertical slices por domínio, nunca por tipo técnico.
- Código compartilhado em `src/modules/shared`.
- Domínios de exemplo: `products`, `checkout`, `payments`, `inventory`, `accounts`.

## Testes

- TDD: escreva o comportamento esperado antes da implementação.
- Cobertura esperada por mudança: unitário, integração e E2E.
- **Atual:** o starter não possui runner de testes. Adicione Vitest e Playwright (com ADR) antes de exigir testes automatizados; até lá, registre os passos manuais de QA no fechamento.

## Qualidade transversal

- **A11y:** todo componente e tela deve ser navegável por teclado e ter semântica/roles corretos.
- **Responsividade:** desktop, tablet e mobile.
- **O11y:** logs e integração com a stack LGTM desde o dia zero (**Alvo**).
- **Tema:** somente light theme, conforme `DESIGN.md`.
- **UI:** carregue as skills obrigatórias antes de alterar interfaces (`AGENTS.md`).

## Commits

- Mensagens seguem **Conventional Commits** (`type: subject`), com os types do `@commitlint/config-conventional` (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`, etc.).
- O hook `commit-msg`, gerenciado pelo Husky, valida cada mensagem com commitlint e bloqueia mensagens inválidas.
- `npm run commitlint` valida uma mensagem recebida via stdin; `npm run commitlint:last` valida o último commit.
- Mensagens antigas não são reescritas; a regra passa a valer para commits novos.

## Antes de finalizar

Execute o checklist de `QA.md` e entregue os itens de fechamento de `RULES.md`.
