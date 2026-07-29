← [Anterior](08-page-object-model.md) | [Índice](00-indice.md) | [Próximo: Organização do Framework →](10-organizacao-framework.md)

# Capítulo 9 — Component Object Model

## Conceito

Um Component Object representa um pedaço de UI que se **repete em várias telas** — cabeçalho,
menu lateral, modal, toast/mensagem de erro, rodapé. Em vez de cada Page reimplementar os mesmos
locators para esse pedaço, ele vira sua própria classe, instanciada dentro das Pages que o exibem.

## Quando criar um Component

Crie um Component quando o mesmo pedaço de UI aparece em duas ou mais telas: Header, Sidebar, Modal,
Menu, Toast, Footer são os exemplos clássicos. Neste projeto:

- [`components/header.component.ts`](../components/header.component.ts) — aparece em
  [`pages/products.page.ts`](../pages/products.page.ts) e [`pages/cart.page.ts`](../pages/cart.page.ts).
- [`components/toast.component.ts`](../components/toast.component.ts) — usado em
  [`pages/login.page.ts`](../pages/login.page.ts) para a mensagem de erro de login.

## Por que isso reduz duplicação

Sem Component, tanto `ProductsPage` quanto `CartPage` teriam que declarar seus próprios locators
para o link do carrinho, o badge de contagem e o botão de logout — duplicando os mesmos seletores em
dois arquivos. Se o menu mudar de estrutura, seria preciso lembrar de atualizar **todas** as Pages
que o duplicam. Com o Component, existe uma única fonte de verdade.

## Exemplo prático (código real)

```typescript
// components/header.component.ts
export class HeaderComponent {
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async expectCartItemsCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).toBeHidden();
      return;
    }
    await expect(this.cartBadge).toHaveText(String(expected));
  }
}
```

Uso dentro de uma Page:

```typescript
// pages/products.page.ts
export class ProductsPage extends BasePage {
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    // ...
  }
}
```

E no teste:

```typescript
// tests/products.spec.ts
await loggedInPage.addProductToCart(ProductName.BACKPACK);
await loggedInPage.header.expectCartItemsCount(1);
```

## Explicação

- `HeaderComponent` recebe apenas `page` no construtor — exatamente como uma Page. A diferença é
  puramente semântica: um Component nunca é usado sozinho num teste, ele sempre vive **dentro** de
  uma Page (`loggedInPage.header`), nunca é instanciado diretamente em um `test()`.
- `readonly header: HeaderComponent;` em `ProductsPage` é público, porque o teste precisa acessar
  ações do header (`.openCart()`, `.expectCartItemsCount()`) através da Page que o contém.
- Note que tanto `ProductsPage` quanto `CartPage` reaproveitam esse mesmo `HeaderComponent` — zero
  duplicação de locators do cabeçalho entre as duas.

## Vantagens

- Elimina duplicação de locators de UI compartilhada entre Pages.
- Isola a manutenção: uma mudança no menu lateral é um único arquivo a editar.
- Deixa Page Objects menores e mais focados no que é exclusivo daquela tela.

## Desvantagens

- Mais uma camada de indireção — para projetos pequenos, com poucas telas e nenhuma UI repetida,
  pode não compensar ainda.
- Exige disciplina para não duplicar sem perceber (criar o mesmo locator em duas Pages em vez de
  extrair um Component na primeira oportunidade).

## Boas práticas

- Assim que um pedaço de UI aparecer em uma segunda tela, extraia-o para um Component antes de
  duplicar o locator.
- Um Component nunca deveria ser instanciado diretamente dentro de um `test()` — sempre através de
  uma Page que o expõe (`loggedInPage.header`, nunca `new HeaderComponent(page)` solto no teste).

## Erros comuns

- Duplicar o mesmo locator de cabeçalho em duas ou mais Pages "porque é rápido", adiando a extração
  do Component até o dia em que o header muda e é preciso caçar todas as cópias.
- Misturar responsabilidades de Page e Component na mesma classe (uma classe que representa a tela
  inteira, mas também tenta ser reutilizada como pedaço de outra tela).

## Exercício prático

Extraia um `FooterComponent` fictício (mesmo se o saucedemo.com não tiver um rodapé rico) com um
único método `getCopyrightText()`, e mostre como ele seria instanciado dentro de
[`pages/products.page.ts`](../pages/products.page.ts), seguindo exatamente o padrão do
`HeaderComponent`.

## Resumo

Component Object = mesma lógica do Page Object, aplicada a pedaços de UI repetidos entre telas. A
regra prática: duplicou o locator em duas Pages? Deveria ter sido um Component.

## Checklist de revisão

- [ ] Nenhum locator de UI compartilhada está duplicado entre duas Pages no meu projeto.
- [ ] Meus Components só são instanciados dentro de Pages, nunca direto em um `test()`.
- [ ] Sei diferenciar quando algo é uma Page (tela inteira) e quando é um Component (pedaço de UI).

## Perguntas para fixação

1. Qual o critério prático para decidir se algo deveria ser um Component?
2. Por que `HeaderComponent` é instanciado dentro de `ProductsPage` e `CartPage`, e não diretamente
   dentro dos testes?
3. O que aconteceria com a manutenção da suíte se o header fosse duplicado em cada Page em vez de
   extraído como Component?
4. Qual a diferença estrutural entre uma classe de Page e uma classe de Component?

## Desafio opcional

Modele (sem necessariamente implementar) um `ModalComponent` genérico, reutilizável por qualquer
modal da aplicação, com métodos `confirm()`, `cancel()` e `getTitle()`. Pense em como ele receberia
os locators do modal específico sem precisar de uma classe nova para cada modal da aplicação.

---
← [Anterior](08-page-object-model.md) | [Índice](00-indice.md) | [Próximo: Organização do Framework →](10-organizacao-framework.md)
