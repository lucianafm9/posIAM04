# Regras para agentes de código

Aplicam-se a qualquer agente que modifique este repositório. Comece por `.docs/README.md`.

## 1. Skills

- **UI obrigatório:** ao criar ou alterar qualquer interface, carregue `frontend-design` e `web-design-guidelines` antes de escrever código.
- **Por contexto:** identifique o domínio da tarefa e carregue a skill correspondente antes de agir.

| Domínio da tarefa    | Skill esperada |
| -------------------- | -------------- |
| Banco de dados / SQL | PostgreSQL     |
| Next.js              | Next.js        |
| React                | React          |
| Textos de interface  | Copywriting    |
| Textos para busca    | SEO            |

Se não existir skill disponível para o domínio, diga isso explicitamente e siga as convenções destes documentos.

- **Fluxo do projeto:** use `create-spec` para criar uma spec nova, `refine-spec` para melhorar uma spec existente, `feature-concept` para fechar o entendimento antes de planejar e `implement-me <spec>` para executar uma spec de ponta a ponta.

## 2. Antes de começar

1. Leia `BUSINESS.md` e `ARCHITECTURE.md` para entender o domínio e onde o código deve viver.
2. Siga o fluxo de `RULES.md` (plano salvo + skill `feature-concept`).
3. Para qualquer mudança de UI, leia `DESIGN.md` e `DESIGN_SYSTEM.md`.

## 3. Durante a implementação

- Respeite `DEVELOPMENT.md`: camadas, vertical slices, TDD, acessibilidade e responsividade.
- Use os comandos de `QA.md` e confirme os scripts reais em `package.json`.
- Não presuma que dependências marcadas como **Alvo** estão instaladas. Verifique antes de importar.

## 4. Referência rápida

- `RULES.md` — plano, ADR e entregáveis de fechamento.
- `DEVELOPMENT.md` — convenções de código.
- `DESIGN.md` + `DESIGN_SYSTEM.md` — regras visuais e de componentes.
- `QA.md` — validação antes de concluir.
- Mapa completo com propósito de cada arquivo: `.docs/README.md`.
