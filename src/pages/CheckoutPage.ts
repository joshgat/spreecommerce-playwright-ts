import { Page, Locator, FrameLocator, expect } from '@playwright/test';

export interface Card {
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  zipcode: string;
  country: string;
  state: string;
  phone: string;
}

/**
 * CheckoutPage - Multi-step checkout process interactions
 * 
 * Handles:
 * - Shipping address entry
 * - Delivery method selection
 * - Payment processing
 * - Order confirmation
 */
export class CheckoutPage {
  /** Playwright Page instance for browser interactions */
  readonly page: Page;

  readonly checkoutRoot: Locator;
  readonly addressForm: Locator;

  // Contact information
  readonly emailInput: Locator;

  // Shipping address fields
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly address1Input: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly phoneInput: Locator;

  // Actions
  readonly saveAndContinueButton: Locator;


  // Delivery step
  readonly deliveryForm: Locator;
  readonly shippingMethodsList: Locator;
  readonly shippingRateItems: Locator;
  readonly saveAndContinueDeliveryButton: Locator;


  // Payment step - Billing address
  readonly paymentForm: Locator;
  readonly useShippingAddressCheckbox: Locator;
  readonly billingFirstNameInput: Locator;
  readonly billingLastNameInput: Locator;
  readonly billingAddress1Input: Locator;
  readonly billingCityInput: Locator;
  readonly billingZipcodeInput: Locator;
  readonly billingPhoneInput: Locator;

  // Payment step - Payment method
  readonly stripeIframe: FrameLocator;
  readonly stripeCardNumberInput: Locator;
  readonly stripeCardExpiryInput: Locator;
  readonly stripeCardCvcInput: Locator;


  // Payment step - Submit
  readonly paymentSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.checkoutRoot = page.locator('#checkout-page');
    this.addressForm = page.locator('#checkout_form_address');

    this.emailInput = page.locator('#order_ship_address_attributes_email, input[name="order[email]"]');

    this.firstNameInput = page.locator('#order_ship_address_attributes_firstname');
    this.lastNameInput = page.locator('#order_ship_address_attributes_lastname');
    this.address1Input = page.locator('#order_ship_address_attributes_address1');
    this.cityInput = page.locator('#order_ship_address_attributes_city');
    this.zipcodeInput = page.locator('#order_ship_address_attributes_zipcode');
    this.phoneInput = page.locator('#order_ship_address_attributes_phone');

    this.saveAndContinueButton = this.addressForm.getByRole('button', { name: /save and continue/i });


    // Delivery step
    this.deliveryForm = page.locator('form#edit_order_*, form[action*="/update/delivery"]');
    this.shippingMethodsList = page.locator('[data-checkout-delivery-target="shippingList"]');
    this.shippingRateItems = page.locator('[data-checkout-delivery-target="shippingRate"]');
    this.saveAndContinueDeliveryButton = this.page.locator('button[data-checkout-delivery-target="submit"]');

    // Payment step - Summary/Review section

    // Payment step - Billing address
    this.paymentForm = page.locator('form#checkout_form_payment, form[action*="/update/payment"]');
    this.useShippingAddressCheckbox = page.locator('#order_use_shipping');
    this.billingFirstNameInput = page.locator('#order_bill_address_attributes_firstname');
    this.billingLastNameInput = page.locator('#order_bill_address_attributes_lastname');
    this.billingAddress1Input = page.locator('#order_bill_address_attributes_address1');
    this.billingCityInput = page.locator('#order_bill_address_attributes_city');
    this.billingZipcodeInput = page.locator('#order_bill_address_attributes_zipcode');
    this.billingPhoneInput = page.locator('#order_bill_address_attributes_phone');

    // Payment step - Payment method (Stripe)
    this.stripeIframe = page.frameLocator('iframe[title="Secure payment input frame"]');
    this.stripeCardNumberInput = this.stripeIframe.locator('input[name="number"]');
    this.stripeCardExpiryInput = this.stripeIframe.locator('input[name="expiry"]');
    this.stripeCardCvcInput = this.stripeIframe.locator('input[name="cvc"]');

    // Payment step - Submit
    this.paymentSubmitButton = page.locator('#checkout-payment-submit');
  }


  /**
   * Fills the contact information section of the checkout form
   * @async
   * @param {Object} params - Contact information parameters
   * @param {string} params.email - Email address for the order
   * @param {boolean} [params.acceptMarketing] - Whether to accept marketing communications
   * @param {boolean} [params.createAccount] - Whether to create a user account
   * @returns {Promise<void>}
   */
  async fillContactInformation(email: string) {
    await this.emailInput.fill(email);
  }

  /**
   * Fills the shipping address form with the provided address information
   * Handles address autocomplete suggestions and country/state dropdowns
   * @async
   * @param {Object} params - Address information parameters
   * @param {string} [params.country] - Country name or ISO code
   * @param {string} [params.countryValue] - Country value attribute for dropdown
   * @param {string} params.firstName - First name
   * @param {string} params.lastName - Last name
   * @param {string} params.address1 - Primary address line
   * @param {string} [params.address2] - Secondary address line (optional)
   * @param {string} params.city - City name
   * @param {string} [params.state] - State name or abbreviation
   * @param {string} [params.stateValue] - State value attribute for dropdown
   * @param {string} params.zipcode - ZIP or postal code
   * @param {string} [params.phone] - Phone number (optional)
   * @returns {Promise<void>}
   */
  async fillShippingAddress(address: Address) {
    await this.firstNameInput.fill(address.firstName);
    await this.lastNameInput.fill(address.lastName);
    await this.address1Input.fill(address.address1);
    await this.cityInput.fill(address.city);
    await this.zipcodeInput.fill(address.zipcode);
    await this.phoneInput.fill(address.phone);
  }


  /**
   * Saves the current step and continues to the next step in the checkout process
   * @async
   * @returns {Promise<void>}
   */
  async saveAndContinue() {
    await this.saveAndContinueButton.click();
  }


  async selectStandardShipping() {
    const item = this.shippingRateItems.filter({ has: this.page.getByText('Standard') }).first();
    await item.locator('input[type="radio"]').check();
  }

  async saveAndContinueDelivery() {
    await this.saveAndContinueDeliveryButton.click();
  }


  async toggleUseShippingAddress(useShipping: boolean) {
    const isChecked = await this.useShippingAddressCheckbox.isChecked();
    if (useShipping !== isChecked) {
      await this.useShippingAddressCheckbox.click({ force: true });
    }
  }

  async fillBillingAddress(address: Address) {
    await this.toggleUseShippingAddress(false);
    await this.billingFirstNameInput.fill(address.firstName);
    await this.billingLastNameInput.fill(address.lastName);
    await this.billingAddress1Input.fill(address.address1);
    await this.billingCityInput.fill(address.city);
    await this.billingZipcodeInput.fill(address.zipcode);
    await this.billingPhoneInput.fill(address.phone);
  }


  async submitPayment() {
    await this.paymentSubmitButton.click();
  }


  async fillPaymentDetails(card: Card) {
    // Wait for Stripe iframe to be ready
    await this.page.locator('iframe[title="Secure payment input frame"]').waitFor({ state: 'attached' });
    await this.stripeCardNumberInput.waitFor({ state: 'visible' });
    
    await this.stripeCardNumberInput.fill(card.number);
    await this.stripeCardExpiryInput.fill(card.expiry);
    await this.stripeCardCvcInput.fill(card.cvc);
  }

  async expectOrderConfirmation() {
    await expect(this.page.getByRole('heading', { name: 'Your order is confirmed!' })).toBeVisible({ timeout: 15000 });
  }

  async waitForPaymentFormReady() {
    await this.paymentForm.waitFor({ state: 'visible' });
    await this.page.locator('iframe[title="Secure payment input frame"]').waitFor({ state: 'attached' });
  }
}
