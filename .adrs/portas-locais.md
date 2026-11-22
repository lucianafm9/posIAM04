# ADR — Portas locais da fundação

## Contexto

`.docs/ARCHITECTURE.md` e `.docs/QA.md` fixam web em 3000 e docs em 3001; a CLI do Supabase usa 54321/54322/54323. A spec `000-foundation` deixou em aberto as portas da API e do Grafana, observando que o Grafana usa 3000 por padrão — conflito com a web.

## Decisão

| Serviço            | Porta host            | Observação                        |
| ------------------ | --------------------- | --------------------------------- |
| API (Nest)         | 4000                  | Padrão do Nest, livre no ambiente |
| Cliente web (Vite) | 3000                  | Mantém o valor já documentado     |
| Docs (Next)        | 3001                  | Inalterado                        |
| Grafana            | 3002                  | Container 3000 mapeado para 3002  |
| Loki               | 3100                  | Padrão do serviço                 |
| Tempo              | 3200                  | Padrão do serviço                 |
| Prometheus         | 9090                  | Padrão do serviço                 |
| Supabase CLI       | 54321 / 54322 / 54323 | Padrão da CLI                     |

## Consequências

- `vite.config.ts`, API, `docker-compose.yml`, `.env.example` e testes usam a mesma tabela.
- Não há sobreposição entre serviços locais.
- `turbo run dev` continuará iniciando web e docs nas portas já conhecidas; a API usa 4000.

## Alternativas descartadas

- **Grafana na 3000:** conflita com a web.
- **API na 3002 e Grafana na 3003:** uniforme, mas a API fora do padrão Nest e 3002 livre para o Grafana.
