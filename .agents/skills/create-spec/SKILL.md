---
name: create-spec
description: Cria uma spec refinada em ./.specs a partir de um prompt, ideia ou pedido bruto. Use quando o usuário quiser transformar uma necessidade em spec pronta para planejamento, pedir "crie uma spec", "escreva a spec", "documente essa feature" ou fornecer um brief que ainda não existe como spec. Faz perguntas apenas onde houver ambiguidade real, aplica o template do projeto e salva o arquivo em ./.specs/[number]-<nome>.md. Não implementa código.
---

# Create Spec

Objetivo: transformar um prompt em uma spec clara, verificável e pronta para `feature-concept`/`implement-me`, salva em `./.specs/`.

## Entrada

Receba um prompt, brief, ideia ou problema de negócio. Se o usuário já sugerir o nome do arquivo, use-o; caso contrário, proponha um slug curto em kebab-case.

## Antes de escrever

1. Leia `.docs/README.md`, `.docs/AGENTS.md`, `.docs/RULES.md` e os documentos relevantes (`BUSINESS.md`, `ARCHITECTURE.md`, `DEVELOPMENT.md`, `DESIGN.md`, `DESIGN_SYSTEM.md`, `QA.md`).
2. Leia `./.specs/_template.md` e use-o como base.
3. Inspecione specs existentes em `./.specs/` para manter consistência de tom e granularidade.
4. Descubra fatos no repositório antes de perguntar: estrutura, scripts, convenções, dependências e código existente. Fatos são responsabilidade do agente; decisões de produto/escopo são do usuário.

## Processo

1. **Extrair o pedido** — identifique objetivo, público, gatilho, resultado esperado e restrições explícitas.
2. **Mapear lacunas** — compare o pedido com as seções do template. Só pergunte o que não dá para inferir com segurança ou decidir pelo repositório.
3. **Perguntar com foco** — quando houver ambiguidade relevante, faça perguntas objetivas, numeradas, com recomendação e justificativa curta. Agrupe perguntas independentes na mesma rodada.
4. **Redigir a spec** — preencha todas as seções do template. Remova TODOs. Onde algo permanecer incerto, registre em "Riscos e pontos em aberto" em vez de inventar.
5. **Refinar para execução** — critérios de aceite devem ser testáveis; requisitos funcionais devem ser observáveis; fora de escopo deve proteger contra expansão acidental.

## Regras de qualidade

- Não implemente código nem crie plano de execução.
- Não copie o prompt literalmente; transforme em especificação.
- Prefira critérios verificáveis ("DADO/QUANDO/ENTÃO", checklists objetivas, comandos/validações esperadas).
- Marque suposições explicitamente como premissas ou pontos em aberto.
- Se a spec tocar UI, inclua acessibilidade, responsividade e tema claro conforme `.docs/DESIGN.md`.
- Se a spec tocar dados/Postgres, sinalize a necessidade da skill `supabase-postgres-best-practices` na implementação.
- Se houver decisão arquitetural provável, registre em "Riscos e pontos em aberto" ou "Dependências e premissas" que exigirá ADR.

## Saída

1. Salve a spec em `./.specs/<nome-da-spec>.md`.
2. Responda com:
   - caminho do arquivo criado;
   - resumo curto do escopo;
   - premissas/pontos em aberto que precisam de confirmação;
   - recomendação do próximo passo (`feature-concept` para fechar entendimento ou `implement-me <spec>` quando já estiver suficientemente clara).
