import { Page, Locator, FrameLocator, expect } from '@playwright/test';

/**
 * Interface representing credit card information for payment processing
 * @interface Card
 */
export interface Card {
  /** Crucially, we need to know that the card number is correct. */
  number: string;
  /** The name on the card. */
  name: string;
  /** The expiry date. */
  expiry: string;
  /** The CVC code. */
  cvc: string;
}

/**
 * Interface representing shipping or billing address information
 * @interface Address
 */
export interface Address {
  /** The first name of the person. */
  firstName: string;
  /** The last name of the person. */
  lastName: string;
  /** The first line of the address. */
  address1: string;
  /** The city. */
  city: string;
  /** The ZIP code. */
  zipcode: string;
  /** The country. */
  country: string;
  /** The state. */
  state: string;
  /** The phone number. */
  phone: string;
}

/**
 * Page Object Model for the Checkout process in Spree Commerce
 * 
 * This class handles all interactions with the multi-step checkout process including:
 * - Contact information entry
 * - Shipping address management with autocomplete
 * - Delivery method selection
 * - Payment processing with Stripe integration
 * - Order confirmation verification
 * 
 * @class CheckoutPage
 * @example
 * ```typescript
 * const checkoutPage = new CheckoutPage(page);
 * await checkoutPage.fillShippingAddress(testAddress);
 * await checkoutPage.saveAndContinue();
 * ```
 */
export class CheckoutPage {
  /** Playwright Page instance for browser interactions */
  readonly page: Page;

  readonly checkoutRoot: Locator;
  readonly addressForm: Locator;

  // Contact information
  readonly emailInput: Locator;
  readonly acceptMarketingCheckbox: Locator;
  readonly createAccountCheckbox: Locator;

  // Shipping address fields
  readonly countrySelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly stateTextInput: Locator;
  readonly zipcodeInput: Locator;
  readonly phoneInput: Locator;
  
  // Address autocomplete
  readonly addressSuggestionsBox: Locator;
  readonly firstAddressSuggestion: Locator;

  // Actions
  readonly saveAndContinueButton: Locator;

  // Summary / coupon
  readonly toggleOrderSummaryButton: Locator;
  readonly orderTotalInHeader: Locator;
  readonly couponCodeInput: Locator;
  readonly couponApplyButton: Locator;

  // Delivery step
  readonly deliveryForm: Locator;
  readonly shippingMethodsList: Locator;
  readonly shippingRateItems: Locator;
  readonly saveAndContinueDeliveryButton: Locator;

  // Payment step - Summary/Review section
  readonly paymentReviewContactInfo: Locator;
  readonly paymentReviewShippingAddress: Locator;
  readonly paymentReviewDeliveryMethod: Locator;
  readonly paymentReviewEditContactLink: Locator;
  readonly paymentReviewEditShippingLink: Locator;
  readonly paymentReviewEditDeliveryLink: Locator;

  // Payment step - Billing address
  readonly paymentForm: Locator;
  readonly useShippingAddressCheckbox: Locator;
  readonly billingAddressSection: Locator;
  readonly billingCountrySelect: Locator;
  readonly billingFirstNameInput: Locator;
  readonly billingLastNameInput: Locator;
  readonly billingAddress1Input: Locator;
  readonly billingAddress2Input: Locator;
  readonly billingCityInput: Locator;
  readonly billingStateSelect: Locator;
  readonly billingStateTextInput: Locator;
  readonly billingZipcodeInput: Locator;
  readonly billingPhoneInput: Locator;

  // Payment step - Payment method
  readonly paymentMethodsFrame: Locator;
  readonly stripePaymentElement: Locator;
  readonly stripeCardNumberFrame: FrameLocator;
  readonly stripeCardExpiryFrame: FrameLocator;
  readonly stripeCardCvcFrame: FrameLocator;
  readonly paymentMessageContainer: Locator;
  readonly paymentLoadingIndicator: Locator;
  
  // Card panel and form fields
  readonly cardPanel: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvcInput: Locator;
  
  // Stripe iframe elements
  readonly stripeIframe: FrameLocator;
  readonly stripeCardNumberInput: Locator;
  readonly stripeCardExpiryInput: Locator;
  readonly stripeCardCvcInput: Locator;

  // Order confirmation
  readonly orderConfirmationPage: Locator;
  readonly orderNumber: Locator;
  readonly orderSuccessMessage: Locator;

  // Payment step - Submit
  readonly paymentSubmitButton: Locator;
  readonly termsOfServiceLink: Locator;
  readonly privacyPolicyLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.checkoutRoot = page.locator('#checkout-page');
    this.addressForm = page.locator('#checkout_form_address');

    this.emailInput = page.locator('#order_ship_address_attributes_email, input[name="order[email]"]');
    this.acceptMarketingCheckbox = page.locator('#order_accept_marketing');
    this.createAccountCheckbox = page.locator('#order_signup_for_an_account');

    this.countrySelect = page.locator('#order_ship_address_attributes_country_id');
    this.firstNameInput = page.locator('#order_ship_address_attributes_firstname');
    this.lastNameInput = page.locator('#order_ship_address_attributes_lastname');
    this.address1Input = page.locator('#order_ship_address_attributes_address1');
    this.address2Input = page.locator('#order_ship_address_attributes_address2');
    this.cityInput = page.locator('#order_ship_address_attributes_city');
    this.stateSelect = page.locator('#address_state_id');
    this.stateTextInput = page.locator('#address_state_name');
    this.zipcodeInput = page.locator('#order_ship_address_attributes_zipcode');
    this.phoneInput = page.locator('#order_ship_address_attributes_phone');
    
    // Address autocomplete
    this.addressSuggestionsBox = page.locator('[data-address-autocomplete-target="suggestionsBoxContainer"]');
    this.firstAddressSuggestion = page.locator('#suggestions-option-0');

    this.saveAndContinueButton = this.addressForm.getByRole('button', { name: /save and continue/i });

    this.toggleOrderSummaryButton = page.locator('#toggle-order-summary');
    this.orderTotalInHeader = page.locator('#summary-order-total').first();
    this.couponCodeInput = page.locator('#coupon_code');
    this.couponApplyButton = page.locator('turbo-frame#checkout_coupon_code').getByRole('button', { name: /apply/i });

    // Delivery step
    this.deliveryForm = page.locator('form#edit_order_*, form[action*="/update/delivery"]');
    this.shippingMethodsList = page.locator('[data-checkout-delivery-target="shippingList"]');
    this.shippingRateItems = page.locator('[data-checkout-delivery-target="shippingRate"]');
    this.saveAndContinueDeliveryButton = this.page.locator('button[data-checkout-delivery-target="submit"]');

    // Payment step - Summary/Review section
    this.paymentReviewContactInfo = page.locator('.border.text-sm .flex:has-text("Contact")');
    this.paymentReviewShippingAddress = page.locator('.border.text-sm .flex:has-text("Ship Address")');
    this.paymentReviewDeliveryMethod = page.locator('.border.text-sm .flex:has-text("Delivery method")');
    this.paymentReviewEditContactLink = this.paymentReviewContactInfo.getByRole('link', { name: /edit/i });
    this.paymentReviewEditShippingLink = this.paymentReviewShippingAddress.getByRole('link', { name: /edit/i });
    this.paymentReviewEditDeliveryLink = this.paymentReviewDeliveryMethod.getByRole('link', { name: /edit/i });

    // Payment step - Billing address
    this.paymentForm = page.locator('form#checkout_form_payment, form[action*="/update/payment"]');
    this.useShippingAddressCheckbox = page.locator('#order_use_shipping');
    this.billingAddressSection = page.locator('#billing-address');
    this.billingCountrySelect = page.locator('#order_bill_address_attributes_country_id');
    this.billingFirstNameInput = page.locator('#order_bill_address_attributes_firstname');
    this.billingLastNameInput = page.locator('#order_bill_address_attributes_lastname');
    this.billingAddress1Input = page.locator('#order_bill_address_attributes_address1');
    this.billingAddress2Input = page.locator('#order_bill_address_attributes_address2');
    this.billingCityInput = page.locator('#order_bill_address_attributes_city');
    this.billingStateSelect = page.locator('#order_bill_address_attributes_state_id');
    this.billingStateTextInput = page.locator('#order_bill_address_attributes_state_name');
    this.billingZipcodeInput = page.locator('#order_bill_address_attributes_zipcode');
    this.billingPhoneInput = page.locator('#order_bill_address_attributes_phone');

    // Payment step - Payment method (Stripe)
    this.paymentMethodsFrame = page.locator('turbo-frame#checkout_payment_methods');
    this.stripePaymentElement = page.locator('[data-checkout-stripe-target="paymentElement"]');
    this.stripeCardNumberFrame = page.frameLocator('iframe[name*="__privateStripeFrame"]');
    this.stripeCardExpiryFrame = page.frameLocator('iframe[title="Secure expiration date input frame"]');
    this.stripeCardCvcFrame = page.frameLocator('iframe[title="Secure CVC input frame"]');
    this.paymentMessageContainer = page.locator('[data-checkout-stripe-target="messageContainer"]');
    this.paymentLoadingIndicator = page.locator('[data-checkout-stripe-target="loading"]');
    
    // Card panel and form fields
    this.cardPanel = page.locator('#card-panel');
    this.cardNumberInput = page.locator('#Field-numberInput');
    this.cardExpiryInput = page.locator('#Field-expiryInput');
    this.cardCvcInput = page.locator('#Field-cvcInput');
    
    // Stripe iframe elements
    this.stripeIframe = page.frameLocator('iframe[title="Secure payment input frame"]');
    this.stripeCardNumberInput = this.stripeIframe.locator('input[name="number"]');
    this.stripeCardExpiryInput = this.stripeIframe.locator('input[name="expiry"]');
    this.stripeCardCvcInput = this.stripeIframe.locator('input[name="cvc"]');

    // Payment step - Submit
    this.paymentSubmitButton = page.locator('#checkout-payment-submit');
    this.termsOfServiceLink = page.locator('a[href*="/policies/terms_of_service"]');
    this.privacyPolicyLink = page.locator('a[href*="/policies/privacy_policy"]');

    // Order confirmation
    this.orderConfirmationPage = page.locator('#checkout-page');
    this.orderNumber = page.locator('p:has-text("Order") strong');
    this.orderSuccessMessage = page.locator('h5:has-text("Your order is confirmed!")');
  }

  /**
   * Verifies that the checkout process is on the address step
   * @async
   * @returns {Promise<void>}
   */
  async expectOnAddressStep() {
    await expect(this.checkoutRoot).toBeVisible();
    await expect(this.addressForm).toBeVisible();
    await expect(this.saveAndContinueButton).toBeVisible();
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
  async fillContactInformation(params: {
    email: string;
    acceptMarketing?: boolean;
    createAccount?: boolean;
  }) {
    const { email, acceptMarketing, createAccount } = params;
    await this.emailInput.fill(email);
    if (typeof acceptMarketing === 'boolean') {
      const checked = await this.acceptMarketingCheckbox.isChecked().catch(() => false);
      if (acceptMarketing !== checked) {
        await this.acceptMarketingCheckbox.check({ force: true }).catch(async () => {
          if (!acceptMarketing) await this.acceptMarketingCheckbox.uncheck({ force: true }).catch(() => {});
        });
      }
    }
    if (typeof createAccount === 'boolean') {
      const checked = await this.createAccountCheckbox.isChecked().catch(() => false);
      if (createAccount !== checked) {
        await this.createAccountCheckbox.check({ force: true }).catch(async () => {
          if (!createAccount) await this.createAccountCheckbox.uncheck({ force: true }).catch(() => {});
        });
      }
    }
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
  async fillShippingAddress(params: {
    country?: string;
    countryValue?: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    stateValue?: string;
    zipcode: string;
    phone?: string;
  }) {
    const {
      country,
      countryValue,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      stateValue,
      zipcode,
      phone,
    } = params;

    if (countryValue) {
      await this.countrySelect.selectOption({ value: countryValue }).catch(() => {});
    } else if (country) {
      // try value, label, or by data-iso attribute
      const isoOption = this.page.locator(`#order_ship_address_attributes_country_id option[data-iso="${country}"]`);
      if (await isoOption.count()) {
        const val = await isoOption.first().getAttribute('value');
        if (val) await this.countrySelect.selectOption(val).catch(() => {});
      } else {
        await this.countrySelect.selectOption({ label: country }).catch(async () => {
          await this.countrySelect.selectOption({ value: country }).catch(() => {});
        });
      }
    }

    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    
    // Fill address1 and handle autocomplete suggestions
    await this.address1Input.fill(address1);
    await this.selectFirstAddressSuggestion();
    
    if (address2) await this.address2Input.fill(address2);
    await this.cityInput.fill(city);

    // State can be a select or a text input depending on country
    if (stateValue) {
      if (await this.stateSelect.isVisible().catch(() => false)) {
        await this.stateSelect.selectOption({ value: stateValue }).catch(() => {});
      }
    } else if (state) {
      if (await this.stateSelect.isVisible().catch(() => false)) {
        // try by label first, then by value
        await this.stateSelect.selectOption({ label: state }).catch(async () => {
          await this.stateSelect.selectOption({ value: state }).catch(async () => {
            // try matching by data-abbr attribute
            const opt = this.page.locator(`#address_state_id option[data-abbr="${state}"]`).first();
            if (await opt.count()) {
              const val = await opt.getAttribute('value');
              if (val) await this.stateSelect.selectOption(val).catch(() => {});
            }
          });
        });
      } else if (await this.stateTextInput.isVisible().catch(() => false)) {
        await this.stateTextInput.fill(state);
      }
    }

    await this.zipcodeInput.fill(zipcode);
    if (phone) await this.phoneInput.fill(phone);
  }

  async applyCoupon(code: string) {
    await this.couponCodeInput.fill(code);
    await this.couponApplyButton.click();
  }

  async toggleOrderSummary() {
    if (await this.toggleOrderSummaryButton.isVisible().catch(() => false)) {
      await this.toggleOrderSummaryButton.click();
    }
  }

  async getDisplayedTotal(): Promise<string> {
    return (await this.orderTotalInHeader.innerText()).trim();
  }

  /**
   * Saves the current step and continues to the next step in the checkout process
   * @async
   * @returns {Promise<void>}
   */
  async saveAndContinue() {
    await this.saveAndContinueButton.click();
  }

  // ===== Delivery step helpers =====
  async expectOnDeliveryStep() {
    await expect(this.deliveryForm).toBeVisible();
    await expect(this.shippingMethodsList).toBeVisible();
    await expect(this.shippingRateItems.first()).toBeVisible();
  }

  async selectShippingMethodById(rateId: string | number) {
    const id = String(rateId);
    const radio = this.page.locator(`#shipping-rate-${id}`);
    if (await radio.count()) {
      await radio.first().check({ force: true });
      return;
    }
    const li = this.shippingRateItems.filter({ has: this.page.locator(`input[type="radio"][value="${id}"]`) }).first();
    await li.getByRole('radio').check({ force: true });
  }

  async selectShippingMethodByLabel(label: string | RegExp) {
    // Match label text inside each shipping rate item
    const item = this.shippingRateItems.filter({ has: this.page.getByText(label as any, { exact: false }) }).first();
    const radio = item.locator('input[type="radio"]');
    await radio.check({ force: true });
  }

  async selectShippingMethodByPrice(priceText: string) {
    const item = this.shippingRateItems.filter({ has: this.page.getByText(priceText) }).first();
    const radio = item.locator('input[type="radio"]');
    await radio.check({ force: true });
  }

  async saveAndContinueDelivery() {
    await this.saveAndContinueDeliveryButton.click();
  }

  // ===== Payment step helpers =====
  async expectOnPaymentStep() {
    await expect(this.paymentForm).toBeVisible();
    await expect(this.paymentMethodsFrame).toBeVisible();
    await expect(this.paymentSubmitButton).toBeVisible();
  }

  async toggleUseShippingAddress(useShipping: boolean) {
    const isChecked = await this.useShippingAddressCheckbox.isChecked();
    if (useShipping !== isChecked) {
      await this.useShippingAddressCheckbox.click({ force: true });
    }
  }

  async fillBillingAddress(params: {
    country?: string;
    countryValue?: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    stateValue?: string;
    zipcode: string;
    phone?: string;
  }) {
    const {
      country,
      countryValue,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      stateValue,
      zipcode,
      phone,
    } = params;

    // First ensure billing address form is visible
    await this.toggleUseShippingAddress(false);

    if (countryValue) {
      await this.billingCountrySelect.selectOption({ value: countryValue }).catch(() => {});
    } else if (country) {
      const isoOption = this.page.locator(`#order_bill_address_attributes_country_id option[data-iso="${country}"]`);
      if (await isoOption.count()) {
        const val = await isoOption.first().getAttribute('value');
        if (val) await this.billingCountrySelect.selectOption(val).catch(() => {});
      } else {
        await this.billingCountrySelect.selectOption({ label: country }).catch(async () => {
          await this.billingCountrySelect.selectOption({ value: country }).catch(() => {});
        });
      }
    }

    await this.billingFirstNameInput.fill(firstName);
    await this.billingLastNameInput.fill(lastName);
    await this.billingAddress1Input.fill(address1);
    if (address2) await this.billingAddress2Input.fill(address2);
    await this.billingCityInput.fill(city);

    if (stateValue) {
      if (await this.billingStateSelect.isVisible().catch(() => false)) {
        await this.billingStateSelect.selectOption({ value: stateValue }).catch(() => {});
      }
    } else if (state) {
      if (await this.billingStateSelect.isVisible().catch(() => false)) {
        await this.billingStateSelect.selectOption({ label: state }).catch(async () => {
          await this.billingStateSelect.selectOption({ value: state }).catch(async () => {
            const opt = this.page.locator(`#order_bill_address_attributes_state_id option[data-abbr="${state}"]`).first();
            if (await opt.count()) {
              const val = await opt.getAttribute('value');
              if (val) await this.billingStateSelect.selectOption(val).catch(() => {});
            }
          });
        });
      } else if (await this.billingStateTextInput.isVisible().catch(() => false)) {
        await this.billingStateTextInput.fill(state);
      }
    }

    await this.billingZipcodeInput.fill(zipcode);
    if (phone) await this.billingPhoneInput.fill(phone);
  }

  /**
   * Selects the "Add a new card" option to show the Stripe payment form
   * @async
   * @returns {Promise<void>}
   */
  async selectAddNewCard(): Promise<void> {
    const addNewCardRadio = this.page.locator('input[name="order[existing_card]"][id="order_existing_card_"]');
    await addNewCardRadio.check({ force: true });
  }

  async submitPayment() {
    await this.paymentSubmitButton.click();
  }

  async expectPaymentReviewInfo(params: {
    email?: string | RegExp;
    shippingAddress?: string | RegExp;
    deliveryMethod?: string | RegExp;
  }) {
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

  async editContactFromPayment() {
    await this.paymentReviewEditContactLink.click();
  }

  async editShippingFromPayment() {
    await this.paymentReviewEditShippingLink.click();
  }

  async editDeliveryFromPayment() {
    await this.paymentReviewEditDeliveryLink.click();
  }

  /**
   * Fills the payment form with credit card details
   * @async
   * @param {Card} card - Credit card information object
   * @returns {Promise<void>}
   */
  async fillPaymentDetails(card: Card) {
    // Wait for Stripe iframe to be attached
    await this.page.locator('iframe[title="Secure payment input frame"]').waitFor({ state: 'attached' });
    
    // Wait for card number input in the iframe to be visible
    await this.stripeCardNumberInput.waitFor({ state: 'visible' });
    
    // Fill card details in the Stripe iframe
    await this.stripeCardNumberInput.fill(card.number);
    await this.stripeCardExpiryInput.fill(card.expiry);
    await this.stripeCardCvcInput.fill(card.cvc);
    
    // Note: Card name field not present in current DOM structure
    // If needed, it can be added when the field becomes available
  }

  async expectOrderConfirmation() {
    await expect(this.page.getByRole('heading', { name: 'Your order is confirmed!' })).toBeVisible();
  }

  /**
   * Selects the first address suggestion from the autocomplete dropdown
   * If no suggestions are available, continues without selection
   * @async
   * @returns {Promise<void>}
   */
  async selectFirstAddressSuggestion() {
    try {
      await this.addressSuggestionsBox.waitFor({ state: 'visible', timeout: 3000 });
      await this.firstAddressSuggestion.click();
    } catch (error) {
      // If no suggestions appear, continue without selecting
      console.log('No address suggestions found, continuing without selection');
    }
  }

  /**
   * Waits for the checkout page to be fully loaded with proper error handling
   * @async
   * @param {number} [timeout=10000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForCheckoutPageLoad(timeout = 10000): Promise<void> {
    try {
      await this.checkoutRoot.waitFor({ state: 'visible', timeout });
      await this.addressForm.waitFor({ state: 'visible', timeout: 5000 });
    } catch (error) {
      throw new Error(`Checkout page failed to load within ${timeout}ms: ${error}`);
    }
  }

  /**
   * Waits for payment form to be ready with proper error handling
   * @async
   * @param {number} [timeout=15000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForPaymentFormReady(timeout = 15000): Promise<void> {
    try {
      await this.paymentForm.waitFor({ state: 'visible', timeout });
      // Wait for Stripe iframe to be visible and loaded
      await this.page.locator('iframe[title="Secure payment input frame"]').waitFor({ state: 'attached', timeout: 10000 });
    } catch (error) {
      throw new Error(`Payment form failed to load within ${timeout}ms: ${error}`);
    }
  }
}
