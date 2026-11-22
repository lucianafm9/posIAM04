---
name: implement-me
description: Executa uma spec de ponta a ponta neste repositório. Recebe o nome da spec, carrega o contexto do AGENTS.md e das regras de .docs, chama `feature-concept` para fechar ambiguidades, gera o plano em `./.plans/<spec>-plan.md` e implementa até o QA passar. Use quando o usuário disser "implemente a spec X", "execute a spec X" ou invocar `/implement-me <spec>`. Não use para apenas discutir a spec — nesse caso use `feature-concept`.
disable-model-invocation: true
---

# Implement Me

Você recebe o **nome da spec** como argumento (ex.: `/implement-me cadastro-usuario`). O resultado esperado é a spec implementada e validada, com plano e decisões rastreáveis.

## 1. Carregar contexto

1. Leia o `AGENTS.md` da raiz — ele contém a diretiva gerenciada do Turborepo — e o `.docs/AGENTS.md`.
2. Leia `.docs/README.md` e os documentos de contexto aplicáveis à spec (`BUSINESS.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `DESIGN.md`, `DESIGN_SYSTEM.md`, `QA.md`).
3. Leia `.docs/RULES.md`: é o contrato de plano, ADR e fechamento.
4. Localize a spec. Convenção: `./.specs/<nome-da-spec>.md`. Se não existir, procure markdowns com o nome ou termo informado; se ainda não encontrar, pergunte ao usuário.
5. Antes de alterar configuração ou comandos do Turborepo, leia `node_modules/turbo/docs/README.md` e a página relevante da documentação instalada.

## 2. Fechar o entendimento

Carregue a skill `feature-concept` com a spec e siga o processo até a fronteira de decisões esvaziar e o usuário confirmar o entendimento compartilhado. Receba o **Resumo de entendimento**.

Não comece a implementar com pergunta aberta. Não reinvente decisões que o usuário já tomou na entrevista.

## 3. Gerar o plano

Crie `./.plans/<nome-da-spec>-plan.md` a partir do resumo, usando exatamente esta estrutura:

```markdown
# Plano — <nome da spec>

## Contexto

## Decisões (do feature-concept)

## Critérios de aceite

## Tarefas (ordem de execução e dependências)

## Arquivos previstos

## Riscos e mitigação

## Validação (comandos de QA.md + passos manuais)
```

Cada tarefa deve ser executável por si só e indicar qual critério de aceite atende.

## 4. Implementar

- Siga a ordem do plano, uma tarefa por vez, com validação ao final de cada uma.
- Aplique `.docs/DEVELOPMENT.md`: camadas, vertical slices, `src/modules/shared`, clean code e SOLID.
- Carregue as skills do domínio conforme o que a tarefa toca:

| Domínio                      | Skill                                                      |
| ---------------------------- | ---------------------------------------------------------- |
| Qualquer mudança de UI       | `frontend-design` e `web-design-guidelines` (obrigatórias) |
| Next.js                      | `next-best-practices`                                      |
| React / performance          | `vercel-react-best-practices`                              |
| Componentes shadcn           | `shadcn`                                                   |
| Postgres / Supabase          | `supabase-postgres-best-practices`                         |
| Testes                       | `tdd` (vermelho → verde, no seam acordado)                 |
| Automação de navegador / E2E | `playwright`                                               |

- Respeite `.docs/DESIGN.md` (tema claro exclusivo, paleta) e `.docs/DESIGN_SYSTEM.md`.
- Registre toda decisão arquitetural relevante em `./.adrs/`, conforme `.docs/RULES.md`.
- Não adicione dependência marcada como **Alvo** sem necessidade real e sem registrar a decisão.

## 5. Validar

Execute os comandos de `.docs/QA.md` — `npm run lint`, `npm run check-types`, `npm run build` — e os testes disponíveis. Rode os passos manuais aplicáveis (fluxo, desktop/tablet/mobile, teclado, tema claro) e registre o resultado no plano.

## 6. Fechar

Entregue os itens de `.docs/RULES.md`:

1. Decisões arquiteturais e resumo da ADR (ou "Nenhuma ADR necessária").
2. Lista de passos manuais de QA.
3. Lista de arquivos modificados.
4. Lista de bibliotecas instaladas (ou "nenhuma").
5. Racionais por trás das decisões, implementação e mudanças.

Informe também o caminho do plano gerado.
