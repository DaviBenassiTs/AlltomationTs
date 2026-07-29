← [Anterior](09-component-object-model.md) | [Índice](00-indice.md) | [Próximo: Fixtures →](11-fixtures.md)

# Capítulo 10 — Organização do Framework

## Conceito

Depois de dominar Pages e Components, o passo seguinte é entender como as demais camadas do
framework se encaixam entre si: Fixtures, Data, Constants, Utils, Helpers, Enums. Cada uma resolve
um tipo diferente de repetição.

## Camadas e responsabilidades

| Camada | Pergunta que resolve | Exemplo real no projeto |
|---|---|---|
| `pages/` | "Quais ações essa tela permite?" | [`pages/products.page.ts`](../pages/products.page.ts) |
| `components/` | "Que pedaço de UI se repete entre telas?" | [`components/header.component.ts`](../components/header.component.ts) |
| `fixtures/` | "O que precisa estar pronto antes do teste rodar?" | [`fixtures/pages.fixture.ts`](../fixtures/pages.fixture.ts) |
| `data/` | "Quais dados eu uso e qual o formato deles?" | [`data/users.ts`](../data/users.ts), [`data/types.ts`](../data/types.ts) |
| `constants/` (enums) | "Qual valor fixo eu não deveria digitar de novo?" | [`constants/routes.ts`](../constants/routes.ts) |
| `utils/` | "Como acesso infraestrutura (env, config)?" | [`utils/env.ts`](../utils/env.ts) |
| `helpers/` | "Que lógica pura eu reaproveito entre Pages?" | [`helpers/currency.helper.ts`](../helpers/currency.helper.ts) |

## Regra de dependência entre camadas

```text
tests/  ──depende de──▶  fixtures/  ──depende de──▶  pages/  ──depende de──▶  components/
   │                                                     │                        │
   └────────────────depende de────────────────▶  data/, constants/, helpers/, utils/
```

`helpers/` e `utils/` **nunca** devem depender de `Page`/`Locator` — são a camada mais "pura" do
framework, testável isoladamente até com testes unitários simples (sem precisar de navegador). Veja
[`helpers/currency.helper.ts`](../helpers/currency.helper.ts): recebe uma `string`, devolve um
`number`, sem tocar em Playwright.

## Exemplo de como as camadas colaboram

No teste de checkout ([`tests/checkout.spec.ts`](../tests/checkout.spec.ts)):

```typescript
import { test } from '../fixtures/pages.fixture';   // camada fixtures
import { ProductName } from '../constants/products'; // camada constants
import { CheckoutInfo } from '../data/types';         // camada data
```

O teste nunca importa nada de `pages/` diretamente — ele recebe as Pages já prontas através da
fixture. Isso é intencional: `fixtures/` é a **única** camada que instancia Page Objects; o teste só
consome.

## Por que separar `utils/` de `helpers/`

- `utils/` cuida de **infraestrutura**: como ler uma variável de ambiente
  ([`utils/env.ts`](../utils/env.ts)), como gerar um nome de arquivo de evidência, etc. Depende do
  ambiente de execução.
- `helpers/` cuida de **lógica de domínio pura**: transformar `"$29.99"` em `29.99`
  ([`helpers/currency.helper.ts`](../helpers/currency.helper.ts)), somar valores. Não depende de
  nada externo — é só entrada e saída.

Essa distinção evita que "utils" vire uma gaveta genérica onde tudo cai sem critério.

## Boas práticas

- Ao adicionar algo novo, pergunte primeiro: "isso é uma ação de tela (Page), um pedaço de UI
  repetido (Component), uma pré-condição de teste (Fixture), um dado (Data/Constants) ou uma lógica
  pura (Helper) ou de infraestrutura (Util)?" — a resposta diz onde colocar.
- Nunca deixe um teste instanciar uma Page diretamente (`new LoginPage(page)`) se já existe uma
  fixture para isso — use a fixture (Capítulo 11).

## Erros comuns

- Importar Page Objects diretamente nos testes em vez de usar fixtures, perdendo a centralização de
  pré-condições (ex.: login).
- Colocar lógica de negócio pura (cálculo, formatação) dentro de um Page Object, misturando
  responsabilidades que deveriam estar em `helpers/`.
- Deixar `constants/` cheio de strings soltas em vez de `enum`s (perde autocomplete e checagem de
  tipo do TypeScript).

## Exercício prático

Sem consultar o código, desenhe (em texto) em qual camada você colocaria: (a) a lista de códigos
postais válidos para teste, (b) uma função que formata uma data para `dd/mm/aaaa`, (c) uma fixture
que fornece um carrinho já com 3 itens adicionados, (d) o nome exato do botão "Finish" do checkout.

## Resumo

O framework é uma pirâmide de dependências: testes usam fixtures; fixtures montam Pages; Pages usam
Components, Data, Constants e Helpers. `utils/` e `helpers/` nunca dependem de Playwright.

## Checklist de revisão

- [ ] Nenhum teste do meu projeto instancia uma Page diretamente com `new`.
- [ ] `helpers/` e `utils/` no meu projeto não importam nada de `@playwright/test`.
- [ ] Toda string repetida em mais de um lugar virou uma constante/enum.

## Perguntas para fixação

1. Por que `fixtures/` é a única camada que deveria instanciar Page Objects?
2. Qual a diferença de propósito entre `utils/` e `helpers/`?
3. Por que `helpers/currency.helper.ts` não importa nada de `@playwright/test`?
4. O que a "regra de dependência entre camadas" impede que aconteça no projeto?

## Desafio opcional

Desenhe (em texto ou diagrama) como esta arquitetura de camadas escalaria para um segundo módulo da
aplicação (ex.: um blog dentro do mesmo site) sem que `pages/` vire uma pasta única com 40 arquivos
soltos — pense em subpastas por domínio (`pages/checkout/`, `pages/blog/`, etc.).

---
← [Anterior](09-component-object-model.md) | [Índice](00-indice.md) | [Próximo: Fixtures →](11-fixtures.md)
