import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ProductsPage } from '../pages/products.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutStepOnePage } from '../pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two.page';
import { CheckoutCompletePage } from '../pages/checkout-complete.page';
import { users } from '../data/users';

/**
 * Fixtures customizadas do projeto (ver Capitulo 11).
 *
 * - Cada Page Object vira uma fixture: o teste recebe a instancia pronta,
 *   sem precisar fazer "new XyzPage(page)" em todo teste.
 * - "loggedInPage" e uma fixture composta: ela reutiliza a fixture
 *   "loginPage" para autenticar e entrega ao teste a ProductsPage ja
 *   carregada, eliminando a duplicacao do fluxo de login em cada teste.
 */
type Fixtures = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutStepOnePage: CheckoutStepOnePage;
  checkoutStepTwoPage: CheckoutStepTwoPage;
  checkoutCompletePage: CheckoutCompletePage;
  loggedInPage: ProductsPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutStepOnePage: async ({ page }, use) => {
    await use(new CheckoutStepOnePage(page));
  },

  checkoutStepTwoPage: async ({ page }, use) => {
    await use(new CheckoutStepTwoPage(page));
  },

  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },

  loggedInPage: async ({ loginPage, productsPage }, use) => {
    await loginPage.open();
    await loginPage.login(users.standard);
    await productsPage.expectToBeLoaded();
    await use(productsPage);
  },
});

export { expect } from '@playwright/test';
