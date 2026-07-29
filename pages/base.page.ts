import { Page } from '@playwright/test';
import { Routes } from '../constants/routes';

/**
 * BasePage concentra comportamento comum a todas as Pages (navegacao,
 * espera de carregamento). Pages especificas herdam dela para nao duplicar
 * esse tipo de logica.
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(route: Routes): Promise<void> {
    await this.page.goto(route);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}
