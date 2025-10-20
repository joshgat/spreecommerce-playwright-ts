import { Page, Locator, expect } from '@playwright/test';

export class CartPane {
  readonly page: Page;
  readonly overlay: Locator;
  readonly panel: Locator;
  readonly closeButton: Locator;
  readonly counter: Locator;
  readonly lineItems: Locator;
  readonly totalAmount: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overlay = page.locator('#cart-pane');
    this.panel = page.locator('#slideover-cart');
    this.closeButton = this.panel.getByRole('button', { name: /close sidebar|close/i }).first();
    this.counter = this.panel.locator('.cart-counter');
    this.lineItems = this.panel.locator('#line-items > turbo-frame li.cart-line-item');
    this.totalAmount = this.panel.locator('.shopping-cart-total-amount');
    this.checkoutButton = this.panel.getByRole('link', { name: /checkout/i });
  }

  async expectOpen() {
    await expect(this.overlay).toBeVisible();
    await expect(this.panel).toBeVisible();
  }

  async close() {
    await this.closeButton.click();
    await expect(this.panel).toBeHidden();
  }

  async getCounter(): Promise<number> {
    const text = (await this.counter.textContent())?.trim() ?? '0';
    const val = parseInt(text, 10);
    return Number.isFinite(val) ? val : 0;
  }

  async getTotalText(): Promise<string> {
    return (await this.totalAmount.innerText()).trim();
  }

  async lineItemCount(): Promise<number> {
    return await this.lineItems.count();
  }

  private itemRoot(index = 0): Locator {
    return this.lineItems.nth(index);
  }

  async removeLineItem(index = 0) {
    const item = this.itemRoot(index);
    const removeButton = item.locator('.remove-line-item-button');
    await removeButton.click();
  }

  async setLineItemQuantity(index: number, quantity: number) {
    const item = this.itemRoot(index);
    const qtyInput = item.locator('input#line_item_quantity');
    await qtyInput.fill(String(Math.max(1, quantity)));
    await qtyInput.press('Enter');
  }

  async increaseLineItemQuantity(index = 0, times = 1) {
    const item = this.itemRoot(index);
    const inc = item.locator('.quantity-increase-button');
    for (let i = 0; i < times; i++) {
      await inc.click();
    }
  }

  async decreaseLineItemQuantity(index = 0, times = 1) {
    const item = this.itemRoot(index);
    const dec = item.locator('.quantity-decrease-button');
    for (let i = 0; i < times; i++) {
      await dec.click();
    }
  }

  /**
   * Proceeds to the checkout page from the cart
   * @async
   * @returns {Promise<void>}
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Waits for the cart to be populated with items
   * @async
   * @param {number} [timeout=10000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForCartToBePopulated(timeout = 10000): Promise<void> {
    await this.counter.waitFor({ state: 'visible', timeout });
    const count = await this.getCounter();
    if (count === 0) {
      throw new Error('Cart counter is still 0 after waiting for population');
    }
  }

  /**
   * Verifies that the cart contains the expected number of items
   * @async
   * @param {number} expectedCount - Expected number of items in cart
   * @returns {Promise<void>}
   */
  async verifyItemCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCounter();
    if (actualCount !== expectedCount) {
      throw new Error(`Expected ${expectedCount} items in cart, but found ${actualCount}`);
    }
  }
}
