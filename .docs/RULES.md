# Regras de trabalho

Fluxo obrigatório para qualquer tarefa de desenvolvimento neste repositório.

## Fluxo

1. **Entender:** leia os documentos de contexto e carregue as skills aplicáveis (`AGENTS.md`).
2. **Planejar:** use a skill `feature-concept` para fazer todas as perguntas necessárias e salve o plano em `./.plans/[spec-file-name]-plan.md`, na raiz do repositório. A spec de entrada fica em `./.specs/[spec-file-name].md`.
3. **Implementar:** siga `DEVELOPMENT.md`, `DESIGN.md` e `DESIGN_SYSTEM.md`.
4. **Validar:** execute o checklist de `QA.md`.
5. **Fechar:** entregue o resumo descrito abaixo.
6. **Publicar:** ao final de toda tarefa ou spec, execute `npm run commit-and-push`. O comando analisa as mudanças, gera uma mensagem Conventional Commits, commita com `Co-Authored-By: OpenCode Agent <opencode@opencode.ai>` e faz push.

> Não inicie a implementação sem o plano salvo. Os diretórios `.specs/`, `.plans/` e `.adrs/` são criados quando necessários.

## Skills do fluxo

- `create-spec`: transforma um prompt/brief em uma spec refinada e salva em `./.specs/<spec-file-name>.md`.
- `refine-spec`: revisa uma spec existente, remove ambiguidades e fortalece critérios/validação sem mudar a intenção sem confirmação.
- `feature-concept`: entrevista profunda que converte a spec em decisões, premissas verificadas e critérios de aceite. Não implementa nada.
- `implement-me <spec>`: carrega `AGENTS.md` e o `.docs`, chama `feature-concept`, grava `./.plans/[spec-file-name]-plan.md` e executa a spec até o QA passar.

## Decisões arquiteturais (ADR)

Sempre que a tarefa envolver uma decisão arquitetural relevante — nova dependência estrutural, mudança de camadas, contrato entre módulos, modelo de dados —:

1. Crie `./.adrs/<nome-da-decisao>.md` com a estrutura: **Contexto → Decisão → Consequências → Alternativas descartadas**.
2. Imprima um resumo da decisão na resposta final.

Se não houve decisão arquitetural, declare explicitamente: "Nenhuma ADR necessária".

## Fechamento da interação

Ao final de **toda** tarefa, entregue:

1. Decisões arquiteturais e resumo da ADR (ou a declaração de que não houve).
2. Lista de passos manuais para QA da tarefa.
3. Lista de arquivos modificados.
4. Lista de bibliotecas instaladas (ou "nenhuma").
5. Racionais por trás das decisões, implementações e mudanças.
