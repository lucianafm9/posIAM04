---
name: feature-concept
description: Entrevista profunda para transformar uma ideia, spec ou pedido de feature em entendimento assertivo antes de planejar ou implementar. Use sempre que precisar converter um plano em ações, refinar requisitos, eliminar ambiguidades ou quando o usuário pedir para "aprofundar", "refinar", "grillar" ou "conceituar" uma feature. Também deve ser invocada por `implement-me` antes de gerar o plano. Não faz perguntas superficiais: questiona premissas, bordas e consequências até não restar nada assumido silenciosamente.
---

# Feature Concept

Objetivo: chegar a um entendimento compartilhado e verificável o suficiente para virar plano e código. Uma resposta "mais ou menos" é uma decisão ainda aberta. Esta skill **não implementa nada** — ela produz o entendimento que alimenta o plano.

## Antes de perguntar

1. Leia `.docs/README.md`, `.docs/AGENTS.md`, `.docs/RULES.md` e os documentos de contexto relevantes: `BUSINESS.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `DESIGN.md`, `DESIGN_SYSTEM.md`, `QA.md`.
2. Se existir uma spec, leia-a (por padrão `./.specs/<nome-da-spec>.md`). Trate o que ela já responde como decidido — não repita perguntas respondidas.
3. Descubra **fatos** no repositório antes de perguntar. Use um subagente de exploração com contexto limpo para vasculhar código, configurações ou histórico quando isso economizar idas e vindas. Fatos são responsabilidade do agente; **decisões são do usuário**.

## Árvore de decisões

Modele o trabalho como uma árvore: cada decisão abre as decisões que dependem dela. Trabalhe em **rodadas**.

- **Fronteira** é o conjunto de decisões cujos pré-requisitos já estão resolvidos e que podem ser perguntadas agora.
- Em cada rodada, pergunte **toda a fronteira de uma vez**, numerando `Q1`, `Q2`, ...
- Para cada pergunta, apresente uma **resposta recomendada** com justificativa curta. Formule a pergunta de modo que "sim" aceite a recomendação.
- Uma pergunta que depende de outra ainda aberta na mesma rodada vai para a rodada seguinte, não entra nela.
- Depois das respostas, recalcule a fronteira e abra a próxima rodada.
- Uma exploração em andamento é um pré-requisito não resolvido: apenas as perguntas downstream dela esperam; o restante da fronteira segue em frente.

Formato de cada rodada:

```
❓ **Q1** — <título>: <pergunta com contexto, opções e critérios>

➡️ <resposta recomendada e por quê>

---

❓ **Q2** — <título>: ...
```

## Cobertura a percorrer

Só marque uma área como resolvida quando houver uma resposta explícita do usuário.

| Área             | O que costuma ficar ambíguo                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Objetivo e valor | O que muda para o usuário? Como saber que a tarefa terminou?                                                                      |
| Escopo           | O que fica de fora? Qual é o corte da primeira entrega?                                                                           |
| Domínio          | Entidades, estados, regras de negócio, invariantes, vocabulário (`BUSINESS.md`)                                                   |
| Dados            | Origem da informação, autoridade, migração, permissões. Se tocar Postgres, carregue `supabase-postgres-best-practices`            |
| Interface        | Fluxo, estados de erro/vazio/carregamento, a11y, responsividade, tema claro. Carregue `frontend-design` e `web-design-guidelines` |
| Integrações      | Contratos, retry, timeout, idempotência, segredos                                                                                 |
| Arquitetura      | Camada, módulo, fronteira, novas dependências — o que exige ADR?                                                                  |
| Testes           | Onde estão os seams, quais casos são críticos, o que precisa de E2E. Carregue `tdd`                                               |
| Operação         | Logs, métricas, feature flag, rollout e rollback                                                                                  |
| Entrega          | Como validar manualmente, conforme `QA.md`                                                                                        |

## Regras de conduta

- Não pergunte o que dá para descobrir lendo arquivos, rodando comandos ou explorando o código.
- Não faça suposição silenciosa: se algo ficou sem resposta, vire pergunta.
- Uma recomendação só se torna decisão quando o usuário aceita — explicitamente ou respondendo "sim".
- Quando o usuário não tem o conhecimento necessário para decidir, explique as opções e consequências antes de recomendar.
- Encerre quando a fronteira estiver vazia **e** o usuário confirmar que há entendimento compartilhado.

## Saída

Entregue ao chamador (por exemplo, `implement-me`) um **Resumo de entendimento** com:

1. **Decisões** — lista numerada; cada item traz a pergunta que o originou e a resposta aceita.
2. **Premissas verificadas** — fatos confirmados no repositório, com caminhos de arquivo.
3. **Fora de escopo** — o que foi explicitamente descartado.
4. **Critérios de aceite** — verificáveis, no formato "DADO ... QUANDO ... ENTÃO ...".
5. **Riscos e pontos em aberto** — o que ainda depende de decisão externa.
6. **Skills e ADRs necessárias** — quais carregar na implementação e quais decisões exigem registro em `./.adrs/`.

Não inicie a implementação nesta skill.
