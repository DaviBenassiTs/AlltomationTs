import { test, expect } from '../fixtures/pages.fixture';
import { ProductName, SortOption } from '../constants/products';

/**
 * Suite de testes da listagem de produtos.
 * Repare que o login ja acontece dentro da fixture "loggedInPage"
 * (ver fixtures/pages.fixture.ts e Capitulo 11).
 */
test.describe('Produtos', () => {
  test('adicionar produto ao carrinho atualiza o badge do header', { tag: ['@smoke', '@regression'] }, async ({
    loggedInPage,
  }) => {
    await loggedInPage.addProductToCart(ProductName.BACKPACK);

    await loggedInPage.header.expectCartItemsCount(1);
  });

  test('remover produto do carrinho zera o badge do header', { tag: ['@regression'] }, async ({ loggedInPage }) => {
    await loggedInPage.addProductToCart(ProductName.BACKPACK);
    await loggedInPage.header.expectCartItemsCount(1);

    await loggedInPage.removeProductFromCart(ProductName.BACKPACK);

    await loggedInPage.header.expectCartItemsCount(0);
  });

  test('ordenar por preco do menor para o maior', { tag: ['@regression'] }, async ({ loggedInPage }) => {
    await loggedInPage.sortBy(SortOption.PRICE_LOW_TO_HIGH);

    const prices = await loggedInPage.getAllPrices();
    const sortedAscending = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedAscending);
  });
});
