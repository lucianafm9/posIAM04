# Negócio

## O que é

Plataforma para gestão de **agentes customizados especialistas em uma posição da empresa**. Cada expert analisa e executa trabalho como o profissional daquela área:

| Expert     | Domínio              |
| ---------- | -------------------- |
| CEO expert | Negócio e estratégia |
| CMO expert | Marketing            |
| CTO expert | Tecnologia           |

## Problema que resolve

O contexto necessário para esse trabalho está disperso em ferramentas e documentos diferentes. A plataforma reúne essas fontes e entrega o conteúdo ao expert, que produz o trabalho sob demanda.

## Como funciona (Alvo)

1. **Conectar** fontes externas de dados.
2. **Disponibilizar** o conteúdo como contexto para os experts.
3. **Solicitar** uma tarefa ao expert da área desejada.
4. **Receber** o trabalho produzido a partir dessas informações.

Fontes previstas: Notion, Google Drive, PDF, Markdown, Confluence, Jira, Linear, ClickUp, Google Docs, Google Sheets e outras.

## Estado

**Visão de produto (Alvo).** O repositório hoje é o starter Turborepo: nenhum expert, conector ou fluxo de solicitação está implementado.

## Ainda não definido

O documento de origem estabelece domínio e fontes, mas não especifica permissões, formato das entregas, critérios de avaliação nem a interface de solicitação. Trate esses pontos como em aberto e registre cada decisão em ADR antes de implementá-los (`RULES.md`).
