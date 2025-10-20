import { Page, Locator, expect } from '@playwright/test';

/**
 * ProductDetailPage - Product detail page interactions
 * 
 * Handles:
 * - Size selection
 * - Adding products to cart
 */
export class ProductDetailPage {
  readonly page: Page;
  readonly sizeDropdownButton: Locator;
  readonly descriptionSection: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sizeDropdownButton = page.locator('[data-dropdown-target="button"]');
    this.descriptionSection = page.locator('[data-editor-name="Description"]');
  }

  async selectFirstAvailableSize() {
    await this.sizeDropdownButton.click().catch(() => {});
    const label = this.page
      .locator('[data-dropdown-target="menu"] label[for^="product-option-"]:not(.cursor-not-allowed):not(.opacity-50)')
      .first();
    if ((await label.count()) === 0) return;
    await label.click();
  }

  async addToCart() {
    const visibleAddToCart = this.page.locator('.add-to-cart-button:visible').first();
    await expect(visibleAddToCart).toBeVisible();
    await expect(visibleAddToCart).toContainText(/add to cart/i);
    await visibleAddToCart.click();
  }
}