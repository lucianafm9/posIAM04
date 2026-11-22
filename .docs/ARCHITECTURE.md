# Arquitetura

## Como ler

O repositório está no starter `create-turbo`. Esta página separa o que existe hoje (**Atual**) da direção decidida (**Alvo**). Não importe dependências marcadas como Alvo sem antes adicioná-las à workspace correta e registrar a decisão em ADR (`RULES.md`).

## Ferramentas e runtime — Atual

| Item                      | Papel / versão                                           | Onde                         |
| ------------------------- | -------------------------------------------------------- | ---------------------------- |
| Turborepo                 | Orquestração de tasks (`^2.11.13`)                       | `turbo.json`                 |
| npm / Node                | npm `11.19.0` (`devEngines`), Node `>=24`                | `package.json` da raiz       |
| TypeScript                | `7.0.2`, tipagem em todas as workspaces                  | raiz e workspaces            |
| ESLint                    | `10.9.1`, config centralizada                            | `@repo/eslint-config`        |
| Prettier                  | `3.9.6`, formatação de `ts`, `tsx` e `md`                | script `format` da raiz      |
| Next.js                   | `16.3.8` — `web` na porta `3000`, `docs` na porta `3001` | `apps/web`, `apps/docs`      |
| React                     | `19.2.8`                                                 | apps e `@repo/ui`            |
| `@repo/ui`                | Componentes compartilhados                               | `packages/ui/src/*.tsx`      |
| `@repo/typescript-config` | `tsconfig.json`s reutilizáveis                           | `packages/typescript-config` |

## Tasks do Turborepo — Atual

| Task          | Comportamento                                                   |
| ------------- | --------------------------------------------------------------- |
| `build`       | Depende de `^build`; inclui `.env*` nos inputs; gera `.next/**` |
| `lint`        | Depende de `^lint`                                              |
| `check-types` | Depende de `^check-types`                                       |
| `dev`         | Persistente, sem cache                                          |

Scripts de entrada: `npm run build`, `npm run lint`, `npm run check-types`, `npm run dev`, `npm run format`. Fonte: `package.json` e `turbo.json` da raiz.

> Antes de alterar configuração ou comandos do Turborepo, leia a documentação instalada em `node_modules/turbo/docs/` — ela corresponde à versão em uso.

## Stack alvo — Planejado

### Front-end

| Item           | Papel                            |
| -------------- | -------------------------------- |
| React          | Construção de interfaces         |
| TypeScript     | Tipagem                          |
| Tailwind CSS   | Estilização                      |
| shadcn         | Base do design system            |
| date-fns       | Manipulação de datas             |
| TanStack Query | Queries e mutations              |
| TanStack Table | Tabelas                          |
| TanStack Chart | Gráficos                         |
| Vitest         | Testes unitários e de integração |
| Playwright     | Testes E2E                       |

### Back-end

Nest.js (API), TypeScript, Supabase (autenticação, banco e storage), bcrypt (hash de senhas), Vitest (unitário e integração) e Supertest (E2E da API).

### Infra e dados

Vercel (hospedagem da API) e Supabase (PostgreSQL, Auth e Storage).

> Nada desta seção está instalado no starter.

## Organização em camadas — Alvo

| Camada           | Responsabilidade                                                  |
| ---------------- | ----------------------------------------------------------------- |
| `application`    | Casos de uso                                                      |
| `infrastructure` | Implementações concretas: repositórios, eventos/mensageria, filas |
| `domain`         | Entidades e serviços de domínio                                   |
| `interface`      | Endpoints e handlers HTTP                                         |

Complementos:

- **Vertical slices:** fatiar por domínio (ex.: `products`, `checkout`, `payments`, `inventory`, `accounts`), não por tipo técnico.
- **Shared:** código compartilhado em `src/modules/shared`.
- **Observabilidade:** stack LGTM (Grafana), com logs e telemetria desde o primeiro dia.

**Atual:** `apps/*` e `packages/*` seguem apenas a estrutura do starter; as camadas acima ainda não existem.
