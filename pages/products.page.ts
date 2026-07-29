import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { SortOption } from '../constants/products';
import { parsePriceToNumber } from '../helpers/currency.helper';

/**
 * Page Object da tela de listagem de produtos (inventory.html).
 * Cada metodo publico representa uma acao ou consulta de negocio
 * ("adicionar produto X ao carrinho"), nunca um detalhe de seletor.
 */
export class ProductsPage extends BasePage {
  readonly header: HeaderComponent;
  private readonly inventoryList: Locator;
  private readonly sortDropdown: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.inventoryList = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
  }

  private cardByName(productName: string): Locator {
    return this.inventoryList.filter({ hasText: productName });
  }

  async expectToBeLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.page.getByText('Products')).toBeVisible();
  }

  async addProductToCart(productName: string): Promise<void> {
    await this.cardByName(productName).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeProductFromCart(productName: string): Promise<void> {
    await this.cardByName(productName).getByRole('button', { name: 'Remove' }).click();
  }

  async getProductPrice(productName: string): Promise<number> {
    const priceText = await this.cardByName(productName).locator('.inventory_item_price').textContent();
    return parsePriceToNumber(priceText ?? '0');
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getAllProductNames(): Promise<string[]> {
    return this.inventoryList.locator('.inventory_item_name').allTextContents();
  }

  async getAllPrices(): Promise<number[]> {
    const priceTexts = await this.inventoryList.locator('.inventory_item_price').allTextContents();
    return priceTexts.map(parsePriceToNumber);
  }
}
