/**
 * Rotas da aplicacao sob teste (saucedemo.com), relativas a baseURL.
 * Centralizar rotas aqui evita strings magicas espalhadas pelos Page Objects.
 */
export enum Routes {
  LOGIN = '/',
  INVENTORY = '/inventory.html',
  CART = '/cart.html',
  CHECKOUT_STEP_ONE = '/checkout-step-one.html',
  CHECKOUT_STEP_TWO = '/checkout-step-two.html',
  CHECKOUT_COMPLETE = '/checkout-complete.html',
}
