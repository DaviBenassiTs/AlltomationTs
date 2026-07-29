← [Anterior](10-organizacao-framework.md) | [Índice](../README.md) | [Próximo: Hooks →](12-hooks.md)

# Capítulo 11 — Fixtures

## Conceito

Fixtures são o mecanismo de injeção de dependência do Playwright Test. Em vez de cada teste montar
manualmente o que precisa (abrir navegador, logar, preparar dados), ele **declara** essa necessidade
como um parâmetro da função de teste, e o Playwright entrega o recurso já pronto.

Fixtures nativas mais usadas: `page`, `context`, `browser`, `request`. Fixtures **personalizadas** são
as que você cria para o seu domínio — neste projeto, todas em
[`fixtures/pages.fixture.ts`](../fixtures/pages.fixture.ts).

## Quando utilizar

- Sempre que dois ou mais testes precisarem do mesmo "estado inicial" (ex.: usuário logado).
- Sempre que quiser entregar um Page Object já instanciado, sem repetir `new XPage(page)` em cada
  teste.
- Quando precisar de dados/setup compartilhado (API autenticada, token, dados pré-cadastrados).

## Vantagens

- Elimina duplicação do fluxo de setup (ex.: login) entre testes.
- Composição: uma fixture pode depender de outra (`loggedInPage` depende de `loginPage` e
  `productsPage`).
- Cleanup automático: o código depois do `use()` roda mesmo se o teste falhar (equivalente a um
  `finally`).

## Desvantagens

- Fixtures mal nomeadas ou muito "mágicas" dificultam entender de onde vem um dado sem abrir o
  arquivo de fixtures.
- Encadeamentos muito profundos de fixtures podem dificultar debug (qual fixture, exatamente, está
  lenta ou falhando).

## Exemplo prático completo (código real do projeto)

```typescript
// fixtures/pages.fixture.ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';
import { users } from '../data/users';

type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  loggedInPage: ProductsPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  loggedInPage: async ({ loginPage, productsPage }, use) => {
    await loginPage.open();
    await loginPage.login(users.standard);
    await productsPage.expectToBeLoaded();
    await use(productsPage);
  },
});

export { expect } from '@playwright/test';
```

## Explicação linha por linha

- `import { test as base } from '@playwright/test';` — importamos o `test` original com outro nome
  (`base`), porque vamos **estender** ele, criando nossa própria versão de `test` com fixtures
  adicionais.
- `type Fixtures = { ... };` — declara, com tipagem forte, quais fixtures customizadas existem e o
  tipo de cada uma. Isso dá autocomplete no editor ao escrever `async ({ loggedInPage }) => {...}`
  em qualquer teste.
- `base.extend<Fixtures>({...})` — cada chave do objeto é uma fixture; o valor é uma função
  `async (dependencias, use) => { ... await use(valor); ... }`.
- `loginPage: async ({ page }, use) => { await use(new LoginPage(page)); }` — a fixture `loginPage`
  depende da fixture nativa `page`; ela cria uma instância de `LoginPage` e a entrega ao teste
  através de `use(...)`.
- `loggedInPage: async ({ loginPage, productsPage }, use) => { ... }` — **fixture composta**: em vez
  de depender de `page` diretamente, ela depende de outras duas fixtures customizadas
  (`loginPage`, `productsPage`), reaproveitando o que elas já resolvem.
- Dentro da fixture `loggedInPage`, o código **antes** de `use(...)` roda como setup (login); o
  código **depois** (se houvesse) rodaria como teardown, mesmo em caso de falha do teste.
- `export const test = ...` e `export { expect } from '@playwright/test';` — todo arquivo de teste do
  projeto importa `test`/`expect` **daqui** (`../fixtures/pages.fixture`), nunca direto de
  `@playwright/test`, para ter acesso às fixtures customizadas.

## Uso em um teste real

```typescript
// tests/products.spec.ts
import { test } from '../fixtures/pages.fixture';

test('adicionar produto ao carrinho...', async ({ loggedInPage }) => {
  await loggedInPage.addProductToCart(ProductName.BACKPACK);
  // já está logado e na tela de produtos — zero linhas de setup no teste
});
```

## Boas práticas

- Sempre reexporte `test`/`expect` a partir do seu arquivo de fixtures (nunca misture imports de
  `@playwright/test` com o `test` customizado no mesmo arquivo de spec).
- Prefira compor fixtures (`loggedInPage` usando `loginPage` + `productsPage`) a duplicar o fluxo de
  login dentro de cada fixture nova.
- Nomeie fixtures pelo **resultado** que entregam (`loggedInPage`), não pelo mecanismo
  (`fixtureDeLogin`).

## Erros comuns

- Esquecer de reexportar `expect` do arquivo de fixtures, causando confusão sobre qual `test`/`expect`
  usar em cada spec.
- Repetir o fluxo de login manualmente dentro de cada `test()` em vez de usar `loggedInPage`.
- Criar fixtures com efeitos colaterais que não são óbvios pelo nome (ex.: uma fixture chamada
  `productsPage` que também faz login escondido).

## Exercício prático

Adicione, em [`fixtures/pages.fixture.ts`](../fixtures/pages.fixture.ts), uma fixture
`cartWithOneItem` que depende de `loggedInPage` e `cartPage`, adiciona a Sauce Labs Backpack ao
carrinho e entrega o `cartPage` já carregado — assim um teste de checkout não precisa repetir esses
dois passos.

## Resumo

Fixtures = setup declarativo e reutilizável. `page` é a fixture nativa mais usada; fixtures
customizadas (`loginPage`, `loggedInPage`) eliminam repetição de Page Objects e de fluxos de
pré-condição entre testes.

## Checklist de revisão

- [ ] Todo teste do projeto importa `test`/`expect` do arquivo de fixtures, não de `@playwright/test`.
- [ ] Nenhum teste repete manualmente o fluxo de login.
- [ ] Sei explicar a diferença entre uma fixture simples (`loginPage`) e uma composta (`loggedInPage`).

## Perguntas para fixação

1. Por que `loggedInPage` depende de `loginPage` e `productsPage`, em vez de `page` diretamente?
2. O que aconteceria se um teste importasse `test` de `@playwright/test` em vez de
   `../fixtures/pages.fixture`?
3. Onde ficaria o código de "teardown" de uma fixture (o que roda depois do `use(...)`)?
4. Por que é melhor nomear uma fixture pelo resultado (`loggedInPage`) do que pelo mecanismo
   (`fixtureLogin`)?

## Desafio opcional

Crie uma fixture `authenticatedRequest` que usa a fixture nativa `request` (API do Playwright para
chamadas HTTP, ver Capítulo 16) para autenticar contra uma API fictícia e devolver um contexto de
requisição já com o token de autenticação configurado nos headers.

---
← [Anterior](10-organizacao-framework.md) | [Índice](../README.md) | [Próximo: Hooks →](12-hooks.md)
