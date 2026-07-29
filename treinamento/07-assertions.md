← [Anterior](06-localizadores.md) | [Índice](00-indice.md) | [Próximo: Page Object Model →](08-page-object-model.md)

# Capítulo 7 — Assertions

## Conceito

`expect()` cria uma asserção: uma verificação que, se falhar, interrompe o teste e o marca como
reprovado, mostrando exatamente o que era esperado e o que foi encontrado. Quando o argumento de
`expect()` é um `Locator`, o Playwright usa **web-first assertions**: a verificação fica tentando de
novo automaticamente até passar ou até o timeout configurado (`expect.timeout` em
[`playwright.config.ts`](../playwright.config.ts)) — sem exigir `waitFor` manual antes.

## Assertions mais utilizadas

```typescript
await expect(locator).toBeVisible();     // elemento está visível na tela
await expect(locator).toBeHidden();      // elemento não está visível (ou não existe)
await expect(locator).toContainText('texto');   // contém um trecho de texto
await expect(locator).toHaveText('texto exato'); // texto exatamente igual
await expect(locator).toBeEnabled();     // elemento não está desabilitado
await expect(locator).toBeDisabled();    // elemento está desabilitado
await expect(page).toHaveURL(/inventory\.html/); // URL da página bate com o padrão
await expect(locator).toHaveCount(3);    // quantidade de elementos retornados pelo locator
await expect(locator).toHaveValue('texto'); // valor atual de um input
```

Diferença importante entre duas delas: `toContainText` verifica um **trecho** do texto (útil quando
o texto tem partes dinâmicas); `toHaveText` exige o texto **exato**, incluindo espaços — use quando
precisar de uma verificação estrita.

## Exemplo prático (código real do projeto)

```typescript
// components/header.component.ts
async expectCartItemsCount(expected: number): Promise<void> {
  if (expected === 0) {
    await expect(this.cartBadge).toBeHidden();
    return;
  }
  await expect(this.cartBadge).toHaveText(String(expected));
}
```

```typescript
// pages/checkout-step-two.page.ts
async expectTotalToContain(expectedText: string): Promise<void> {
  await expect(this.summaryTotalLabel).toContainText(expectedText);
}
```

## Explicação

- Quando o carrinho está vazio, o badge de contagem **nem existe visualmente** no saucedemo.com —
  por isso verificamos `toBeHidden()` em vez de `toHaveText('0')`.
- `toHaveText(String(expected))` converte o número para string, porque o texto do DOM é sempre uma
  string — comparar `número === string` sempre falharia.
- Encapsular a asserção dentro de um método do Page/Component (`expectCartItemsCount`,
  `expectTotalToContain`) em vez de espalhar `expect(...)` cru pelos testes é o que discutiremos em
  detalhe no Capítulo 8 (POM) — aqui já plantamos a semente.

## Boas práticas

- Prefira `expect(locator)` (web-first, com retry automático) a `expect(await locator.textContent())`
  (síncrono, sem retry) sempre que possível.
- Use `toContainText` para textos com partes dinâmicas (preço, data, contador) e `toHaveText` para
  textos totalmente estáticos.
- Uma asserção por conceito de negócio verificado — não acumule 10 `expect`s não relacionados no
  mesmo teste "para economizar tempo".

## Erros comuns

- Usar `toHaveText` para textos com conteúdo dinâmico (ex.: timestamp), gerando testes que falham de
  forma intermitente.
- Fazer `const text = await locator.textContent(); expect(text).toBe('X')` — perde o retry automático
  do web-first assertion, tornando o teste sensível a timing.
- Verificar `toBeVisible()` sem antes garantir que a navegação/ação anterior realmente disparou a
  mudança esperada, mascarando por acaso um fluxo quebrado.

## Exercício prático

Em [`tests/checkout.spec.ts`](../tests/checkout.spec.ts), adicione uma verificação, logo após
`checkoutStepTwoPage.expectToBeLoaded()`, de que o total do pedido (`summary_total_label`) contém o
texto `"Total"`, usando o método `expectTotalToContain` já existente em
[`pages/checkout-step-two.page.ts`](../pages/checkout-step-two.page.ts).

## Resumo

`expect(locator)` é a forma preferida de asserção no Playwright: web-first, com retry automático até
o timeout configurado. Escolha `toContainText` vs. `toHaveText` conforme o texto é dinâmico ou fixo.

## Checklist de revisão

- [ ] Sei explicar o que é uma "web-first assertion" e por que ela tem retry automático.
- [ ] Sei quando usar `toContainText` em vez de `toHaveText`.
- [ ] Sei por que `expect(await locator.textContent()).toBe(...)` perde o retry automático.

## Perguntas para fixação

1. O que diferencia `toContainText` de `toHaveText`?
2. Por que `expect(locator).toBeVisible()` tem retry automático, mas
   `expect(await locator.isVisible()).toBe(true)` não tem?
3. Em que situação `toBeHidden()` é mais apropriado que `toHaveCount(0)`?
4. Por que encapsular um `expect` dentro de um método do Page Object (`expectToBeLoaded()`) é
   melhor do que escrever o `expect` cru dentro do teste?

## Desafio opcional

Pesquise a assertion `toHaveScreenshot()` do Playwright (comparação visual) e escreva, em texto, os
riscos de usá-la como principal estratégia de verificação em uma suíte de regressão.

---
← [Anterior](06-localizadores.md) | [Índice](00-indice.md) | [Próximo: Page Object Model →](08-page-object-model.md)
