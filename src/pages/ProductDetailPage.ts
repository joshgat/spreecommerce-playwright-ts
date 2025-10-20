import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly sizeDropdown: Locator;
  readonly sizeDropdownButton: Locator;
  readonly sizeDropdownMenu: Locator;
  readonly availableSizeOptions: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sizeDropdown = page.locator('[data-controller="dropdown"]');
    this.sizeDropdownButton = page.locator('[data-dropdown-target="button"]');
    this.sizeDropdownMenu = page.locator('[data-dropdown-target="menu"]');
    this.availableSizeOptions = page.locator('input[name="Size"]:not([disabled])');
    this.addToCartButton = page.locator('.add-to-cart-button, button[data-product-form-target="submit"]');
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

  /**
   * Verifies that the Add to Cart button is visible
   * @async
   * @returns {Promise<void>}
   */
  async expectAddToCartButtonVisible() {
    await expect(this.addToCartButton).toBeVisible();
  }

  /**
   * Waits for the product detail page to be fully loaded
   * @async
   * @param {number} [timeout=10000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForPageLoad(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
    await this.addToCartButton.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Checks if a size selection is required for this product
   * @async
   * @returns {Promise<boolean>} True if size selection is required
   */
  async isSizeSelectionRequired(): Promise<boolean> {
    return await this.sizeDropdownButton.isVisible();
  }

  /**
   * Gets the total number of available sizes for the product
   * @async
   * @returns {Promise<number>} Number of available sizes
   */
  async getAvailableSizeCount(): Promise<number> {
    return await this.availableSizeOptions.count();
  }
}