---
name: refine-spec
description: Refina uma spec existente em ./.specs, tornando-a mais clara, completa e testável antes do planejamento ou implementação. Use quando o usuário pedir para "refinar spec", "melhorar a spec", "revisar a spec", "deixar a spec mais completa" ou quando uma spec tiver ambiguidades, critérios fracos, escopo nebuloso ou lacunas de validação. Não implementa código.
---

# Refine Spec

Objetivo: pegar uma spec existente e torná-la assertiva, sem mudar sua intenção sem confirmação.

## Entrada

Receba o nome/caminho da spec ou identifique a spec pelo contexto. Convenção: `./.specs/<nome-da-spec>.md`.

## Antes de editar

1. Leia `.docs/README.md`, `.docs/AGENTS.md`, `.docs/RULES.md` e os documentos relevantes (`BUSINESS.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `DESIGN.md`, `DESIGN_SYSTEM.md`, `QA.md`).
2. Leia `./.specs/_template.md` e a spec alvo.
3. Inspecione o repositório para confirmar fatos citados pela spec: caminhos, scripts, stacks, comandos, nomenclaturas e restrições atuais.
4. Se a mudança alterar o sentido do pedido, trate como decisão do usuário, não como correção silenciosa.

## O que revisar

| Área                | Sinais de problema                            | Ação                                         |
| ------------------- | --------------------------------------------- | -------------------------------------------- |
| Objetivo            | Resultado vago, sem valor de negócio          | Tornar objetivo observável                   |
| Escopo              | Limites ausentes, "etc.", escopo inflável     | Separar incluído/fora de escopo              |
| Requisitos          | Frases genéricas, sem ator/gatilho/resultado  | Reescrever como RF/RNF verificáveis          |
| Critérios de aceite | Não testáveis, sem erro/borda                 | Criar checklist objetivo                     |
| Contexto técnico    | Conflito com arquitetura/scripts/docs         | Alinhar com o repo ou marcar ponto em aberto |
| Validação           | Sem QA automatizado/manual                    | Adicionar plano de validação                 |
| Riscos              | Premissas escondidas, dependências implícitas | Explicitar premissas, riscos e perguntas     |

## Processo

1. **Diagnosticar** — liste lacunas, ambiguidades, contradições e suposições.
2. **Separar fato de decisão** — corrija fatos verificáveis direto; leve decisões de produto/escopo/arquitetura ao usuário.
3. **Perguntar só o necessário** — perguntas numeradas, com recomendação e justificativa curta. Não repita o que a spec já decide.
4. **Reescrever a spec** — alinhe ao template do projeto, mantenha a intenção original e melhore clareza. Preserve decisões já tomadas.
5. **Marcar status** — atualize o status/metadados da spec quando o template tiver esses campos.

## Regras de qualidade

- Não implemente código.
- Não invente requisitos de negócio; se faltar decisão, deixe explícito em "Riscos e pontos em aberto".
- Não apague restrições importantes ao resumir; mova para a seção correta.
- Critérios de aceite devem ser verificáveis por teste, inspeção, comando ou passo manual claro.
- Ao encontrar conflito com `.docs/` ou `package.json`, prefira a fonte de verdade e registre o ajuste.
- Se a spec estiver pronta para planejamento, diga isso claramente.

## Saída

1. Salve a spec refinada no mesmo arquivo, salvo pedido explícito para criar outra.
2. Responda com:
   - caminho da spec atualizada;
   - principais mudanças feitas;
   - decisões que ainda dependem do usuário;
   - avaliação: `pronta para feature-concept/implement-me` ou `aguardando decisões`.
