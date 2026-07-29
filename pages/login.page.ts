import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { ToastComponent } from '../components/toast.component';
import { Routes } from '../constants/routes';
import { UserCredentials } from '../data/types';

/**
 * Page Object da tela de login (https://www.saucedemo.com/).
 * Concentra os locators e as acoes possiveis nessa tela. Os testes nunca
 * devem conhecer os seletores internos: eles so chamam metodos desta classe.
 */
export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  readonly errorToast: ToastComponent;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorToast = new ToastComponent(page);
  }

  async open(): Promise<void> {
    await this.goto(Routes.LOGIN);
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  async expectToBeLoggedOut(): Promise<void> {
    await expect(this.page).toHaveURL(Routes.LOGIN);
    await expect(this.loginButton).toBeVisible();
  }
}
