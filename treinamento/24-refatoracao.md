← [Anterior](23-cicd.md) | [Índice](../README.md) | [Próximo: Boas Práticas →](25-boas-praticas.md)

# Capítulo 24 — Refatoração

## Conceito

Refatorar é melhorar a estrutura do código de teste **sem mudar o que ele valida**. É o exercício
prático de aplicar tudo que vimos até aqui (POM, Components, Fixtures, Constants) sobre um teste que
já existe e funciona, mas está mal escrito.

## Um teste ruim (exemplo didático)

```typescript
import { test, expect } from '@playwright/test';

test('teste 1', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.waitForTimeout(2000);
  await page.locator('.inventory_item').nth(0).locator('button').click();
  await page.locator('.shopping_cart_link').click();
  await page.waitForTimeout(1000);
  const items = await page.locator('.cart_item').count();
  expect(items).toBe(1);
});
```

## Problemas identificados

1. **Título não descritivo**: `'teste 1'` não diz nada sobre o comportamento validado.
2. **Seletores CSS de `id`** (`#user-name`, `#password`, `#login-button`) em vez de localizadores
   semânticos (Capítulo 6).
3. **`waitForTimeout` duplo**: sincronização cega em vez de esperar um estado real (Capítulo 15).
4. **`.nth(0)`**: depende da ordem dos produtos na tela, não do produto específico que se pretende
   testar (Capítulo 6).
5. **Zero reuso**: se outro teste precisar logar e adicionar um produto ao carrinho, todo esse
   código seria copiado e colado de novo.
6. **Sem POM**: o teste conhece profundamente a estrutura HTML da aplicação — qualquer mudança de
   seletor quebra diretamente aqui.

## Refatorado (usando o framework deste projeto)

```typescript
import { test } from '../fixtures/pages.fixture';
import { ProductName } from '../constants/products';

test('produto adicionado aparece no carrinho', { tag: ['@smoke', '@regression'] }, async ({
  loggedInPage,
  cartPage,
}) => {
  await loggedInPage.addProductToCart(ProductName.BACKPACK);

  await loggedInPage.header.openCart();

  await cartPage.expectToBeLoaded();
  await cartPage.expectItemCount(1);
});
```

(Este é, literalmente, o teste real em [`tests/cart.spec.ts`](../tests/cart.spec.ts).)

## Explicação de cada melhoria

- **Título descritivo**: `'produto adicionado aparece no carrinho'` documenta o comportamento
  esperado — qualquer pessoa lendo o relatório entende o que quebrou, sem abrir o código.
- **Login eliminado do teste**: a fixture `loggedInPage` (Capítulo 11) já entrega a
  `ProductsPage` autenticada — zero duplicação do fluxo de login entre testes.
- **`waitForTimeout` removido**: as ações (`addProductToCart`, `openCart`) e assertions
  (`expectToBeLoaded`, `expectItemCount`) já usam auto-waiting e web-first assertions (Capítulo 15);
  não existe espera cega em nenhum lugar.
- **`.nth(0)` substituído por `ProductName.BACKPACK`**: o teste sempre adiciona **o mesmo produto
  identificado por nome**, independente da ordem em que a lista é exibida (Capítulo 6).
- **POM aplicado**: o teste não conhece nenhum seletor CSS — tudo passa por métodos de
  `ProductsPage`, `HeaderComponent` e `CartPage` (Capítulos 8 e 9).
- **Tags adicionadas**: `@smoke`/`@regression` permitem rodar esse teste especificamente via
  `--grep` (Capítulo 21).

## Boas práticas

- Refatore um teste assim que perceber duplicação — não espere "ter tempo depois"; a dívida técnica
  em testes cresce tão rápido quanto em código de produção.
- Ao refatorar, rode o teste **antes e depois** da mudança para garantir que ele continua validando
  exatamente o mesmo comportamento (refatoração não muda comportamento, só estrutura).
- Prefira pequenos passos de refatoração (um problema por vez) a uma reescrita completa de uma vez —
  mais fácil de revisar e de reverter se algo quebrar.

## Erros comuns

- Confundir refatoração com "reescrever tudo do zero" — o objetivo é melhorar estrutura preservando
  comportamento, não redesenhar o teste inteiro sem necessidade.
- Refatorar sem rodar o teste depois, assumindo que "só mudou a organização" e introduzindo um bug
  silencioso na tradução de seletor CSS para Locator semântico.
- Deixar `waitForTimeout` "só nesse teste específico" durante uma refatoração parcial, achando que
  vai remover depois.

## Exercício prático

Pegue este teste ruim (adaptado do exemplo do capítulo) e refatore-o você mesmo, comparando sua
versão com [`tests/checkout.spec.ts`](../tests/checkout.spec.ts) ao final:

```typescript
test('teste 2', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();
  await page.locator('.inventory_item').nth(0).locator('button').click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();
  await page.locator('#first-name').fill('Davi');
  await page.locator('#last-name').fill('Benassi');
  await page.locator('#postal-code').fill('01310-100');
  await page.locator('[data-test="continue"]').click();
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
});
```

## Resumo

Refatorar testes é aplicar POM, Components, Fixtures, localizadores semânticos e esperas corretas
sobre um teste que já existe — sem mudar o que ele valida, só como ele valida.

## Checklist de revisão

- [ ] Sei identificar os 6 problemas clássicos listados neste capítulo em qualquer teste bruto.
- [ ] Sei refatorar um teste preservando exatamente seu comportamento validado.
- [ ] Rodei o teste antes e depois de cada refatoração para confirmar que nada mudou de fato.

## Perguntas para fixação

1. Qual a diferença entre "refatorar" e "reescrever do zero"?
2. Por que `.nth(0)` é um sintoma de teste frágil, mesmo quando "funciona hoje"?
3. Como a fixture `loggedInPage` elimina duplicação entre múltiplos testes que exigem login?
4. Por que é importante rodar o teste antes e depois de uma refatoração?

## Desafio opcional

Encontre (ou escreva de propósito) um teste com `waitForTimeout` e `.nth()` em um projeto próprio ou
de estudo, e aplique o mesmo processo de refatoração deste capítulo, documentando cada melhoria como
foi feito aqui.

---
← [Anterior](23-cicd.md) | [Índice](../README.md) | [Próximo: Boas Práticas →](25-boas-praticas.md)
