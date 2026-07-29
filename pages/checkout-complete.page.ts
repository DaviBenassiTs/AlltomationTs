import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '../constants/routes';

/**
 * Page Object da tela de confirmacao do pedido (checkout-complete.html).
 * E o equivalente, no saucedemo.com, a uma tela de "Pedido realizado".
 */
export class CheckoutCompletePage extends BasePage {
  private readonly completeHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.completeHeader = page.getByRole('heading', { name: 'Thank you for your order!' });
  }

  async expectToBeLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(Routes.CHECKOUT_COMPLETE);
    await expect(this.completeHeader).toBeVisible();
  }
}
