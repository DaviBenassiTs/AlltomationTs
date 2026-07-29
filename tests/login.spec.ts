import { test, expect } from '../fixtures/pages.fixture';
import { users } from '../data/users';

/**
 * Suite de testes da tela de login.
 * Ver Capitulo 27 (Exercicio Pratico) para a versao passo a passo deste arquivo.
 */
test.describe('Login', () => {
  test('login com sucesso redireciona para a lista de produtos', { tag: ['@smoke', '@critical', '@login'] }, async ({
    loginPage,
    productsPage,
  }) => {
    await loginPage.open();
    await loginPage.login(users.standard);

    await productsPage.expectToBeLoaded();
  });

  test('usuario bloqueado ve mensagem de erro', { tag: ['@regression', '@login'] }, async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.lockedOut);

    await expect(loginPage.errorToast.isVisible()).resolves.toBe(true);
    await expect(loginPage.errorToast.getMessage()).resolves.toContain('locked out');
  });

  test('login sem senha mantem o usuario na tela de login', { tag: ['@regression', '@login'] }, async ({
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.login({ username: users.standard.username, password: '' });

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorToast.getMessage()).resolves.toContain('Password is required');
  });

  test('logout retorna para a tela de login', { tag: ['@regression', '@login'] }, async ({
    loggedInPage,
    loginPage,
  }) => {
    await loggedInPage.header.logout();

    await loginPage.expectToBeLoggedOut();
  });
});
