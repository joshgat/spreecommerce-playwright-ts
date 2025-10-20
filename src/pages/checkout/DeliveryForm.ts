import { Page, Locator, expect } from '@playwright/test';

/**
 * Handles delivery method selection
 */
export class DeliveryForm {
  private readonly page: Page;
  readonly deliveryForm: Locator;
  readonly shippingMethodsList: Locator;
  readonly shippingRateItems: Locator;
  readonly saveAndContinueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deliveryForm = page.locator('form#edit_order_*, form[action*="/update/delivery"]');
    this.shippingMethodsList = page.locator('[data-checkout-delivery-target="shippingList"]');
    this.shippingRateItems = page.locator('[data-checkout-delivery-target="shippingRate"]');
    this.saveAndContinueButton = page.locator('button[data-checkout-delivery-target="submit"]');
  }

  /**
   * Validates that the delivery step is visible
   */
  async expectOnDeliveryStep(): Promise<void> {
    await expect(this.deliveryForm).toBeVisible();
    await expect(this.shippingMethodsList).toBeVisible();
    await expect(this.shippingRateItems.first()).toBeVisible();
  }

  /**
   * Selects shipping method by ID
   */
  async selectShippingMethodById(rateId: string | number): Promise<void> {
    const id = String(rateId);
    const radio = this.page.locator(`#shipping-rate-${id}`);
    
    if (await radio.count()) {
      await radio.first().check({ force: true });
      return;
    }
    
    const li = this.shippingRateItems.filter({ 
      has: this.page.locator(`input[type="radio"][value="${id}"]`) 
    }).first();
    
    await li.getByRole('radio').check({ force: true });
  }

  /**
   * Selects shipping method by label text
   */
  async selectShippingMethodByLabel(label: string | RegExp): Promise<void> {
    const item = this.shippingRateItems.filter({ 
      has: this.page.getByText(label as any, { exact: false }) 
    }).first();
    
    const radio = item.locator('input[type="radio"]');
    await radio.check({ force: true });
  }

  /**
   * Selects shipping method by price text
   */
  async selectShippingMethodByPrice(priceText: string): Promise<void> {
    const item = this.shippingRateItems.filter({ 
      has: this.page.getByText(priceText) 
    }).first();
    
    const radio = item.locator('input[type="radio"]');
    await radio.check({ force: true });
  }

  /**
   * Saves delivery selection and continues to next step
   */
  async saveAndContinue(): Promise<void> {
    await this.saveAndContinueButton.click();
  }

  /**
   * Gets available shipping methods
   */
  async getAvailableShippingMethods(): Promise<string[]> {
    const methods: string[] = [];
    const count = await this.shippingRateItems.count();
    
    for (let i = 0; i < count; i++) {
      const method = await this.shippingRateItems.nth(i).textContent();
      if (method) {
        methods.push(method.trim());
      }
    }
    
    return methods;
  }
}
