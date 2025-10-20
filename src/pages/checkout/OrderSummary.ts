import { Page, Locator } from '@playwright/test';

/**
 * Handles order summary and coupon functionality
 */
export class OrderSummary {
  private readonly page: Page;
  readonly toggleOrderSummaryButton: Locator;
  readonly orderTotalInHeader: Locator;
  readonly couponCodeInput: Locator;
  readonly couponApplyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toggleOrderSummaryButton = page.locator('#toggle-order-summary');
    this.orderTotalInHeader = page.locator('#summary-order-total').first();
    this.couponCodeInput = page.locator('#coupon_code');
    this.couponApplyButton = page.locator('turbo-frame#checkout_coupon_code').getByRole('button', { name: /apply/i });
  }

  /**
   * Toggles the order summary visibility
   */
  async toggleOrderSummary(): Promise<void> {
    if (await this.toggleOrderSummaryButton.isVisible().catch(() => false)) {
      await this.toggleOrderSummaryButton.click();
    }
  }

  /**
   * Gets the displayed order total
   */
  async getDisplayedTotal(): Promise<string> {
    return (await this.orderTotalInHeader.innerText()).trim();
  }

  /**
   * Applies a coupon code
   */
  async applyCoupon(code: string): Promise<void> {
    await this.couponCodeInput.fill(code);
    await this.couponApplyButton.click();
  }

  /**
   * Validates that the order summary is visible
   */
  async expectOrderSummaryVisible(): Promise<void> {
    await this.orderTotalInHeader.waitFor({ state: 'visible' });
  }

  /**
   * Validates coupon code format
   */
  validateCouponCode(code: string): { isValid: boolean; error?: string } {
    if (!code || code.trim().length === 0) {
      return { isValid: false, error: 'Coupon code cannot be empty' };
    }

    if (code.length < 3) {
      return { isValid: false, error: 'Coupon code must be at least 3 characters' };
    }

    return { isValid: true };
  }
}
