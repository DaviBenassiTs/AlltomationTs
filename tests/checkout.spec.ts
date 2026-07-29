import { test } from '../fixtures/pages.fixture';
import { ProductName } from '../constants/products';
import { CheckoutInfo } from '../data/types';

const validCheckoutInfo: CheckoutInfo = {
  firstName: 'Davi',
  lastName: 'Benassi',
  postalCode: '01310-100',
};

/**
 * Teste end-to-end do fluxo de compra completo, do login ate a confirmacao
 * do pedido. Representa o cenario de maior valor de negocio (@critical).
 */
test.describe('Checkout', () => {
  test('compra completa de um produto', { tag: ['@critical', '@regression'] }, async ({
    loggedInPage,
    cartPage,
    checkoutStepOnePage,
    checkoutStepTwoPage,
    checkoutCompletePage,
  }) => {
    await loggedInPage.addProductToCart(ProductName.BACKPACK);
    await loggedInPage.header.openCart();

    await cartPage.expectToBeLoaded();
    await cartPage.goToCheckout();

    await checkoutStepOnePage.expectToBeLoaded();
    await checkoutStepOnePage.fillInfoAndContinue(validCheckoutInfo);

    await checkoutStepTwoPage.expectToBeLoaded();
    await checkoutStepTwoPage.finish();

    await checkoutCompletePage.expectToBeLoaded();
  });
});
