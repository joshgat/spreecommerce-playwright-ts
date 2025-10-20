import { Page, Locator, expect } from '@playwright/test';

/**
 * CartPane - Cart sidebar interactions
 * 
 * Handles:
 * - Cart counter visibility
 * - Proceeding to checkout
 */
export class CartPane {
  readonly page: Page;
  readonly counter: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.counter = page.locator('#slideover-cart .cart-counter');
    this.checkoutButton = page.locator('#slideover-cart').getByRole('link', { name: /checkout/i });
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
