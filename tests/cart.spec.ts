import { test } from '../fixtures/pages.fixture';
import { ProductName } from '../constants/products';

test.describe('Carrinho', () => {
  test('produto adicionado aparece no carrinho', { tag: ['@smoke', '@regression'] }, async ({
    loggedInPage,
    cartPage,
  }) => {
    await loggedInPage.addProductToCart(ProductName.BACKPACK);

    await loggedInPage.header.openCart();

    await cartPage.expectToBeLoaded();
    await cartPage.expectItemCount(1);
    await cartPage.expectProductInCart(ProductName.BACKPACK);
  });

  test('continuar comprando volta para a listagem de produtos', { tag: ['@regression'] }, async ({
    loggedInPage,
    cartPage,
  }) => {
    await loggedInPage.header.openCart();

    await cartPage.continueShopping();

    await loggedInPage.expectToBeLoaded();
  });
});
