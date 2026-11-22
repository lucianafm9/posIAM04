# ADR — Pacote de gráficos TanStack

## Contexto

`.docs/ARCHITECTURE.md` e a spec `000-foundation` listam "TanStack Chart" entre as bibliotecas alvo do cliente. O registro npm não contém `@tanstack/react-chart`; contém `@tanstack/react-charts` (1.5.0).

## Decisão

Instalar `@tanstack/react-charts` em `apps/web` como a concretização do item "TanStack Chart", registrando a diferença de nome. Nenhum gráfico será renderizado na página de smoke.

## Consequências

- RF-13 é atendido com o pacote oficial publicado, sem criar um pacote fictício.
- O nome real fica documentado para as specs de visualização de dados.

## Alternativas descartadas

- **Pular a instalação e registrar exceção:** deixaria a lista alvo incompleta.
- **Usar biblioteca de outro autor (por exemplo, Chart.js):** mudaria a decisão de stack sem aprovação.
- **Instalar `@tanstack/react-chart`:** pacote inexistente no registro npm (404).
