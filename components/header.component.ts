import { Locator, Page, expect } from '@playwright/test';

/**
 * Component Object para o cabecalho ("Swag Labs" + menu hamburguer + carrinho)
 * presente em varias telas (inventory, cart, checkout). Extrair isso para um
 * Component evita duplicar os mesmos locators em cada Page que exibe o header.
 */
export class HeaderComponent {
  private readonly menuButton: Locator;
  private readonly logoutLink: Locator;
  private readonly cartLink: Locator;
  private readonly cartBadge: Locator;

  constructor(page: Page) {
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartItemsCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }
    const text = await this.cartBadge.textContent();
    return Number.parseInt(text ?? '0', 10);
  }

  async expectCartItemsCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).toBeHidden();
      return;
    }
    await expect(this.cartBadge).toHaveText(String(expected));
  }
}
