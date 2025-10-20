import { Page, Locator, FrameLocator, expect } from '@playwright/test';

/**
 * Interface representing credit card information
 */
export interface Card {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

/**
 * Handles payment form interactions
 */
export class PaymentForm {
  private readonly page: Page;
  readonly paymentForm: Locator;
  readonly paymentMethodsFrame: Locator;
  readonly paymentSubmitButton: Locator;

  // Stripe payment elements
  readonly stripePaymentElement: Locator;
  readonly stripeCardNumberFrame: FrameLocator;
  readonly stripeCardExpiryFrame: FrameLocator;
  readonly stripeCardCvcFrame: FrameLocator;
  readonly paymentMessageContainer: Locator;
  readonly paymentLoadingIndicator: Locator;

  // Card form fields
  readonly cardPanel: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvcInput: Locator;

  // Review section
  readonly paymentReviewContactInfo: Locator;
  readonly paymentReviewShippingAddress: Locator;
  readonly paymentReviewDeliveryMethod: Locator;
  readonly paymentReviewEditContactLink: Locator;
  readonly paymentReviewEditShippingLink: Locator;
  readonly paymentReviewEditDeliveryLink: Locator;

  // Order confirmation
  readonly orderConfirmationPage: Locator;
  readonly orderNumber: Locator;
  readonly orderSuccessMessage: Locator;

  // Legal links
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentForm = page.locator('form#checkout_form_payment, form[action*="/update/payment"]');
    this.paymentMethodsFrame = page.locator('turbo-frame#checkout_payment_methods');
    this.paymentSubmitButton = page.locator('#checkout-payment-submit');

    // Stripe elements
    this.stripePaymentElement = page.locator('[data-checkout-stripe-target="paymentElement"]');
    this.stripeCardNumberFrame = page.frameLocator('iframe[name*="__privateStripeFrame"]');
    this.stripeCardExpiryFrame = page.frameLocator('iframe[title="Secure expiration date input frame"]');
    this.stripeCardCvcFrame = page.frameLocator('iframe[title="Secure CVC input frame"]');
    this.paymentMessageContainer = page.locator('[data-checkout-stripe-target="messageContainer"]');
    this.paymentLoadingIndicator = page.locator('[data-checkout-stripe-target="loading"]');

    // Card form fields
    this.cardPanel = page.locator('#card-panel');
    this.cardNumberInput = page.locator('#Field-numberInput');
    this.cardExpiryInput = page.locator('#Field-expiryInput');
    this.cardCvcInput = page.locator('#Field-cvcInput');

    // Review section
    this.paymentReviewContactInfo = page.locator('.border.text-sm .flex:has-text("Contact")');
    this.paymentReviewShippingAddress = page.locator('.border.text-sm .flex:has-text("Ship Address")');
    this.paymentReviewDeliveryMethod = page.locator('.border.text-sm .flex:has-text("Delivery method")');
    this.paymentReviewEditContactLink = this.paymentReviewContactInfo.getByRole('link', { name: /edit/i });
    this.paymentReviewEditShippingLink = this.paymentReviewShippingAddress.getByRole('link', { name: /edit/i });
    this.paymentReviewEditDeliveryLink = this.paymentReviewDeliveryMethod.getByRole('link', { name: /edit/i });

    // Order confirmation
    this.orderConfirmationPage = page.locator('#checkout-page');
    this.orderNumber = page.locator('p:has-text("Order") strong');
    this.orderSuccessMessage = page.locator('h5:has-text("Your order is confirmed!")');

    // Legal links
    this.termsOfServiceLink = page.locator('a[href*="/policies/terms_of_service"]');
    this.privacyPolicyLink = page.locator('a[href*="/policies/privacy_policy"]');
  }

  /**
   * Validates that the payment step is visible
   */
  async expectOnPaymentStep(): Promise<void> {
    await expect(this.paymentForm).toBeVisible();
    await expect(this.paymentMethodsFrame).toBeVisible();
    await expect(this.paymentSubmitButton).toBeVisible();
  }

  /**
   * Waits for payment form to be ready
   */
  async waitForPaymentFormReady(timeout = 15000): Promise<void> {
    try {
      await this.paymentForm.waitFor({ state: 'visible', timeout });
      await this.cardPanel.waitFor({ state: 'visible', timeout: 5000 });
    } catch (error) {
      throw new Error(`Payment form failed to load within ${timeout}ms: ${error}`);
    }
  }

  /**
   * Fills payment details with credit card information
   */
  async fillPaymentDetails(card: Card): Promise<void> {
    // Wait for card panel to be visible
    await this.cardPanel.waitFor({ state: 'visible' });
    
    // Fill card details
    await this.cardNumberInput.fill(card.number);
    await this.cardExpiryInput.fill(card.expiry);
    await this.cardCvcInput.fill(card.cvc);
  }

  /**
   * Submits the payment form
   */
  async submitPayment(): Promise<void> {
    await this.paymentSubmitButton.click();
  }

  /**
   * Validates payment review information
   */
  async expectPaymentReviewInfo(params: {
    email?: string | RegExp;
    shippingAddress?: string | RegExp;
    deliveryMethod?: string | RegExp;
  }): Promise<void> {
    const { email, shippingAddress, deliveryMethod } = params;

    if (email) {
      await expect(this.paymentReviewContactInfo).toContainText(email);
    }
    if (shippingAddress) {
      await expect(this.paymentReviewShippingAddress).toContainText(shippingAddress);
    }
    if (deliveryMethod) {
      await expect(this.paymentReviewDeliveryMethod).toContainText(deliveryMethod);
    }
  }

  /**
   * Clicks edit link for contact information
   */
  async editContactFromPayment(): Promise<void> {
    await this.paymentReviewEditContactLink.click();
  }

  /**
   * Clicks edit link for shipping address
   */
  async editShippingFromPayment(): Promise<void> {
    await this.paymentReviewEditShippingLink.click();
  }

  /**
   * Clicks edit link for delivery method
   */
  async editDeliveryFromPayment(): Promise<void> {
    await this.paymentReviewEditDeliveryLink.click();
  }

  /**
   * Validates order confirmation
   */
  async expectOrderConfirmation(): Promise<void> {
    await expect(this.orderConfirmationPage).toBeVisible();
    await expect(this.orderNumber).toBeVisible();
    await expect(this.orderSuccessMessage).toBeVisible();
    await expect(this.orderSuccessMessage).toHaveText('Your order is confirmed!');
  }

  /**
   * Gets the order number from confirmation page
   */
  async getOrderNumber(): Promise<string | null> {
    return await this.orderNumber.textContent();
  }

  /**
   * Validates card information format
   */
  validateCard(card: Card): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!card.number || card.number.replace(/\s/g, '').length < 13) {
      errors.push('Card number must be at least 13 digits');
    }

    if (!card.expiry || !/^\d{2}\/\d{2}$/.test(card.expiry)) {
      errors.push('Expiry must be in MM/YY format');
    }

    if (!card.cvc || !/^\d{3,4}$/.test(card.cvc)) {
      errors.push('CVC must be 3-4 digits');
    }

    if (!card.name || card.name.trim().length < 2) {
      errors.push('Cardholder name must be at least 2 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
