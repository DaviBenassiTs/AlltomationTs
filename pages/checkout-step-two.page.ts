import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '../constants/routes';
import { parsePriceToNumber, sum } from '../helpers/currency.helper';

/**
 * Page Object da 2a etapa do checkout: resumo do pedido (checkout-step-two.html).
 */
export class CheckoutStepTwoPage extends BasePage {
  private readonly itemPrices: Locator;
  private readonly summaryTotalLabel: Locator;
  private readonly finishButton: Locator;

  constructor(page: Page) {
    super(page);
    this.itemPrices = page.locator('.inventory_item_price');
    this.summaryTotalLabel = page.locator('.summary_total_label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });
  }

  async expectToBeLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(Routes.CHECKOUT_STEP_TWO);
  }

  async getItemsSubtotal(): Promise<number> {
    const priceTexts = await this.itemPrices.allTextContents();
    return sum(priceTexts.map(parsePriceToNumber));
  }

  async expectTotalToContain(expectedText: string): Promise<void> {
    await expect(this.summaryTotalLabel).toContainText(expectedText);
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }
}
