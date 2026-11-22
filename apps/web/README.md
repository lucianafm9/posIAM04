# web

Cliente React + Vite da fundação. A rota `/` exibe apenas um `<h1>Hello World</h1>`.

## Desenvolvimento

Na raiz do monorepo:

```bash
npm run dev --workspace web
```

Acesse `http://localhost:3000`. O servidor usa porta fixa (`strictPort`) para manter o mapa de portas do projeto.

## Comandos

| Comando                               | O que faz                    |
| ------------------------------------- | ---------------------------- |
| `npm run dev --workspace web`         | Vite na porta 3000           |
| `npm run build --workspace web`       | Checa tipos e gera `dist/`   |
| `npm run lint --workspace web`        | ESLint com zero avisos       |
| `npm run check-types --workspace web` | `tsc --noEmit`               |
| `npm run test --workspace web`        | Vitest (smoke do componente) |
| `npm run test:e2e --workspace web`    | Playwright (smoke da página) |

Tailwind CSS v4 e shadcn estão configurados em `components.json` e `src/index.css`. O tema é exclusivamente claro; as cores vêm de `.docs/DESIGN.md`.
