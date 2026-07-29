← [Anterior](05-entendendo-um-teste.md) | [Índice](00-indice.md) | [Próximo: Assertions →](07-assertions.md)

# Capítulo 6 — Localizadores

## Conceito

Um `Locator` é uma referência "preguiçosa" (lazy) a um elemento (ou lista de elementos) da página.
Ele **não busca o elemento na hora em que é criado** — só quando uma ação (`.click()`, `.fill()`) ou
asserção (`expect(locator)...`) é executada. Isso é o que possibilita o auto-waiting: o Playwright
pode ficar tentando localizar/verificar o elemento até ele estar pronto, sem você escrever um loop de
espera manual.

## Os localizadores e quando usar cada um

- **`getByRole(role, { name })`** — busca pelo papel semântico de acessibilidade (`button`, `link`,
  `heading`, `textbox`...) e pelo nome acessível. **É a opção recomendada por padrão**: reflete como
  usuários reais (inclusive com leitor de tela) percebem a página, e é o mais resistente a mudanças
  visuais/de estrutura HTML.
  ```typescript
  page.getByRole('button', { name: 'Login' })
  ```

- **`getByText(texto)`** — busca por conteúdo textual visível. Bom para validar mensagens, títulos,
  textos estáticos. Frágil se o texto muda com frequência (ex.: textos que variam por idioma).
  ```typescript
  page.getByText('Thank you for your order!')
  ```

- **`getByLabel(texto)`** — busca um campo de formulário pelo `<label>` associado. Ideal para
  formulários acessíveis.
  ```typescript
  page.getByLabel('Endereço de e-mail')
  ```

- **`getByPlaceholder(texto)`** — busca um input pelo atributo `placeholder`. Útil quando não há
  `<label>` (como no saucedemo.com — ver [`pages/login.page.ts`](../pages/login.page.ts)).
  ```typescript
  page.getByPlaceholder('Username')
  ```

- **`getByTestId(id)`** — busca por um atributo dedicado a testes (por padrão `data-testid`,
  configurável). É a opção mais **estável**, porque é criada de propósito para automação e não muda
  quando o time de front-end reestiliza a página — mas exige que o time de desenvolvimento adicione
  esse atributo no código.
  ```typescript
  page.getByTestId('error') // usado em components/toast.component.ts
  ```

- **`locator(seletor)`** — aceita CSS ou XPath cru. É a opção mais flexível, mas também a mais
  frágil (qualquer mudança de classe/estrutura quebra o teste). Reserve para quando nenhuma das
  opções semânticas acima resolve.
  ```typescript
  page.locator('.shopping_cart_badge') // usado em components/header.component.ts
  ```

- **`.nth(index)`** — seleciona o elemento de índice `index` (começando em 0) dentro de um conjunto
  retornado por um locator. Use com cautela: é uma dependência de ordem, não de identidade.
  ```typescript
  page.locator('.inventory_item').nth(2)
  ```

- **`.first()` / `.last()`** — atalhos para `.nth(0)` e o último elemento do conjunto.
  ```typescript
  page.locator('.inventory_item').first()
  ```

## Exemplo prático (código real do projeto)

```typescript
// pages/products.page.ts
private cardByName(productName: string): Locator {
  return this.inventoryList.filter({ hasText: productName });
}

async addProductToCart(productName: string): Promise<void> {
  await this.cardByName(productName)
    .getByRole('button', { name: 'Add to cart' })
    .click();
}
```

## Explicação

- `this.inventoryList` já é um `Locator` para `.inventory_item` (todos os cards de produto).
- `.filter({ hasText: productName })` **encadeia** um novo locator que restringe o conjunto anterior
  a quem contém aquele texto — sem nunca "buscar" nada até o momento da ação.
- `.getByRole('button', { name: 'Add to cart' })` encadeado busca, **dentro** do card já filtrado, o
  botão certo — combinando dois localizadores para chegar a um elemento único e preciso, sem
  depender de índice (`nth`) nem de CSS frágil.

## Boas práticas

- Prefira sempre, nesta ordem: `getByRole` → `getByLabel`/`getByPlaceholder` → `getByTestId` →
  `locator()` (CSS) → `nth()`/`first()`/`last()` como último recurso.
- Encadeie locators para expressar "isto dentro daquilo" (`card.getByRole(...)`) em vez de escrever
  um único seletor CSS complexo.
- Evite XPath: é mais verboso, mais lento de ler, e não traz nenhuma vantagem sobre CSS/role para a
  grande maioria dos casos.

## Erros comuns

- Usar `.nth(2)` para "pegar o terceiro produto da lista" quando o teste deveria filtrar pelo nome
  do produto — a ordem da lista pode mudar (ex.: após ordenar) e o teste passa a testar a coisa
  errada silenciosamente.
- Depender de classes CSS geradas por frameworks (`.css-1x2y3z`) que mudam a cada build.
- Usar `getByText` para textos que mudam por idioma/localização, quebrando a suíte ao trocar o idioma
  padrão da aplicação.

## Exercício prático

Em [`pages/products.page.ts`](../pages/products.page.ts), crie um método `getProductDescription`
que retorna a descrição de um produto (classe `.inventory_item_desc`), reaproveitando o mesmo padrão
de `cardByName(...)` já usado em `addProductToCart`.

## Resumo

Locators são preguiçosos e encadeáveis. A ordem de preferência é semântica primeiro
(`getByRole`/`getByLabel`/`getByPlaceholder`), `getByTestId` quando disponível, CSS/XPath cru por
último, e índice (`nth`) apenas quando não há alternativa melhor.

## Checklist de revisão

- [ ] Sei explicar por que um `Locator` não "busca" o elemento na hora em que é criado.
- [ ] Sei escolher entre `getByRole`, `getByLabel`, `getByPlaceholder` e `getByTestId`.
- [ ] Sei encadear locators para expressar "isto dentro daquilo".

## Perguntas para fixação

1. Por que `getByRole` é o localizador recomendado por padrão?
2. Qual o risco de usar `.nth()` em vez de filtrar por conteúdo?
3. Por que `getByTestId` é considerado o mais estável entre os localizadores?
4. Dê um exemplo de quando `locator()` com CSS é justificável apesar de ser a opção mais frágil.
5. O que significa dizer que um `Locator` é "preguiçoso" (lazy)?

## Desafio opcional

Abra o saucedemo.com com o DevTools do navegador e liste, para os 3 primeiros produtos da tela de
inventário, quais localizadores (dos citados neste capítulo) você conseguiria usar para clicar em
"Add to cart" de cada um, sem usar `.nth()`.

---
← [Anterior](05-entendendo-um-teste.md) | [Índice](00-indice.md) | [Próximo: Assertions →](07-assertions.md)
