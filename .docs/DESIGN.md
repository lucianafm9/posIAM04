# Design

## Direção visual

- Clean, minimalista e elegante.
- Cores em tons pastéis.
- **Somente tema claro (light theme).** Não introduza tema escuro.
- Componentes acessíveis e responsivos (ver `DEVELOPMENT.md`).

> **Atual:** `apps/web/app/globals.css` ainda contém `@media (prefers-color-scheme: dark)` do starter. Remova ao aplicar o tema claro.

## Paleta

HEX é a representação canônica; HSL é o equivalente exibido para referência. Não crie uma terceira representação.

| Token        | HEX       | HSL                  |
| ------------ | --------- | -------------------- |
| powder-petal | `#EDDCD2` | `hsl(22, 43%, 88%)`  |
| linen        | `#FFF1E6` | `hsl(26, 100%, 95%)` |
| soft-blush   | `#FDE2E4` | `hsl(356, 87%, 94%)` |
| petal-frost  | `#FAD2E1` | `hsl(338, 80%, 90%)` |
| light-cyan   | `#C5DEDD` | `hsl(178, 27%, 82%)` |
| mint-cream   | `#DBE7E4` | `hsl(165, 20%, 88%)` |
| parchment    | `#F0EFEB` | `hsl(48, 14%, 93%)`  |
| alice-blue   | `#D6E2E9` | `hsl(202, 30%, 88%)` |
| pale-sky     | `#BCD4E6` | `hsl(206, 46%, 82%)` |
| powder-blue  | `#99C1DE` | `hsl(205, 51%, 74%)` |

### Tokens CSS (Alvo)

```css
:root {
  --color-powder-petal: #eddcd2;
  --color-linen: #fff1e6;
  --color-soft-blush: #fde2e4;
  --color-petal-frost: #fad2e1;
  --color-light-cyan: #c5dedd;
  --color-mint-cream: #dbe7e4;
  --color-parchment: #f0efeb;
  --color-alice-blue: #d6e2e9;
  --color-pale-sky: #bcd4e6;
  --color-powder-blue: #99c1de;
}
```

**Atual:** o starter usa CSS Modules e variáveis próprias em `apps/web/app/globals.css`. Ao adotar Tailwind, estes tokens passam a ser a configuração de tema.

## Gradientes (Alvo)

Sequência padrão: powder-petal → linen → soft-blush → petal-frost → light-cyan → mint-cream → parchment → alice-blue → pale-sky → powder-blue.

| Nome                    | Direção  |
| ----------------------- | -------- |
| `gradient-top`          | `0deg`   |
| `gradient-right`        | `90deg`  |
| `gradient-bottom`       | `180deg` |
| `gradient-left`         | `270deg` |
| `gradient-top-right`    | `45deg`  |
| `gradient-bottom-right` | `135deg` |
| `gradient-top-left`     | `225deg` |
| `gradient-bottom-left`  | `315deg` |
| `gradient-radial`       | radial   |

Reserve gradientes para fundos e realces visuais; evite aplicá-los a texto.
