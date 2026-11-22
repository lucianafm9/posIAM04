# ADR — Supabase local, LGTM e migration inicial

## Contexto

A spec pede `docker-compose.yml` com Grafana, Loki, Tempo e Prometheus, `supabase/config.toml` com migrations, comandos `infra:up`, `infra:down`, `db:migrate` repetíveis e `.env.example` sem credenciais reais. Nesta máquina Docker e Supabase CLI não estão instalados.

## Decisão

Usar a CLI do Supabase como pré-requisito externo para o banco local e `docker-compose.yml` apenas para os quatro serviços LGTM, com portas definidas na ADR de portas. Criar uma migration no-op em `supabase/migrations` para provar o pipeline sem modelo de negócio. Os scripts verificam pré-requisitos, falham rápido com mensagem clara e validam o resultado com `supabase status` e `docker compose ps`. Nenhuma credencial real é versionada; apenas `.env.example` com placeholders.

## Consequências

- A infra local não pôde ser executada neste ambiente: CA-09/CA-10/CA-11 ficam registrados como não validados localmente, com passos manuais no fechamento.
- Um novo desenvolvedor com Docker e Supabase CLI instalados consegue subir tudo com os mesmos comandos.
- A idempotência de `db:migrate` é garantida pelo controle de migrations da CLI; a migration não cria tabelas.

## Alternativas descartadas

- **Instalar Docker/Supabase CLI nesta máquina:** exigiria winget/choco, possivelmente admin/reboot, e não é necessário para escrever a fundação.
- **Adicionar um coletor de logs ao compose:** a spec restringe o compose aos quatro serviços; basta que a API emita logs coletáveis.
- **Versionar `.env` com valores reais:** viola RNF-05.
