import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { Routes } from '../constants/routes';
import { CheckoutInfo } from '../data/types';

/**
 * Page Object da 1a etapa do checkout: dados pessoais (checkout-step-one.html).
 */
export class CheckoutStepOnePage extends BasePage {
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  async expectToBeLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(Routes.CHECKOUT_STEP_ONE);
  }

  async fillInfoAndContinue(info: CheckoutInfo): Promise<void> {
    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.postalCodeInput.fill(info.postalCode);
    await this.continueButton.click();
  }
}
