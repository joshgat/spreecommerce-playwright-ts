import { Page, Locator, expect } from '@playwright/test';

export class ShopAllPage {
  readonly page: Page;
  readonly title: Locator;
  readonly filterButton: Locator;
  readonly sortButton: Locator;
  readonly productsGrid: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByRole('heading', { name: /shop all/i });
    this.filterButton = page.getByRole('button', { name: /filter/i }).first();
    this.sortButton = page.locator('[data-test-id="sort-button"]');
    this.productsGrid = page.locator('#products');
  }

  async expectOnPage() {
    await expect(this.title).toBeVisible();
    await expect(this.page).toHaveURL(/products|collections|shop/i);
  }

  async openFilters() {
    if (await this.filterButton.isVisible().catch(() => false)) {
      await this.filterButton.click();
    }
  }

  async selectSort(optionLabel: string) {
    await this.sortButton.click();
    await this.page.getByRole('radio', { name: new RegExp(optionLabel, 'i') }).check();
  }

  async openFirstProduct() {
    const firstProductLink = this.page.locator('a[href^="/products/"]').first();
    await firstProductLink.waitFor();
    await firstProductLink.click();
  }
}

