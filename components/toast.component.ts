import { Locator, Page } from '@playwright/test';

/**
 * Component Object para a mensagem de erro exibida no topo do formulario
 * de login do saucedemo.com. E reutilizado sempre que uma Page precisar
 * verificar uma mensagem de erro, sem duplicar o locator em cada Page.
 */
export class ToastComponent {
  private readonly container: Locator;
  private readonly closeButton: Locator;

  constructor(page: Page) {
    this.container = page.locator('[data-test="error"]');
    this.closeButton = page.locator('.error-button');
  }

  async getMessage(): Promise<string> {
    return (await this.container.textContent()) ?? '';
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
