# Documentação do projeto

Índice único de contexto do repositório. Leia este arquivo primeiro e depois siga apenas para o documento da sua tarefa.

## Estado do repositório

O código atual é o starter `create-turbo`: monorepo com Next.js, React e TypeScript, sem nenhuma feature de produto implementada. Os documentos desta pasta descrevem **o produto e os padrões alvo**, não necessariamente o que já está instalado.

| Marcador  | Significado                                                               |
| --------- | ------------------------------------------------------------------------- |
| **Atual** | Existe no repositório hoje. Fonte: `package.json`, `turbo.json` e código. |
| **Alvo**  | Decisão de produto/arquitetura ainda não implementada.                    |

**Fonte da verdade para comandos:** `package.json` da raiz. Se qualquer documento divergir dele, o `package.json` prevalece.

**Skills do repositório:** ficam em `.agents/skills/`. Skills do fluxo de spec: `create-spec` (cria spec refinada em `./.specs`), `refine-spec` (melhora spec existente), `feature-concept` (fecha entendimento antes do plano) e `implement-me` (plano + implementação + QA).

## Mapa de documentos

| Arquivo            | Para que serve                                      | Quando ler                             |
| ------------------ | --------------------------------------------------- | -------------------------------------- |
| `AGENTS.md`        | Regras e skills obrigatórias para agentes de código | Antes de qualquer tarefa               |
| `RULES.md`         | Fluxo de trabalho: plano, ADR e fechamento          | Antes de iniciar e ao finalizar        |
| `BUSINESS.md`      | O produto, o domínio e as fontes de dados           | Sempre que precisar entender o negócio |
| `ARCHITECTURE.md`  | Stack atual, stack alvo e organização em camadas    | Antes de decidir onde o código vive    |
| `DEVELOPMENT.md`   | Princípios e convenções de implementação            | Durante a escrita do código            |
| `DESIGN.md`        | Direção visual, paleta e tema                       | Antes de qualquer mudança de UI        |
| `DESIGN_SYSTEM.md` | Base de componentes e uso do `@repo/ui`             | Ao criar ou alterar componentes        |
| `QA.md`            | Comandos e checklist de validação                   | Antes de declarar a tarefa concluída   |

## Ordem de leitura recomendada

1. Contexto: `BUSINESS.md` → `ARCHITECTURE.md`
2. Como trabalhar: `AGENTS.md` → `RULES.md`
3. Como implementar: `DEVELOPMENT.md` → `DESIGN.md` → `DESIGN_SYSTEM.md`
4. Como validar: `QA.md`
