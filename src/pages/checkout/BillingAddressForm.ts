import { Page, Locator } from '@playwright/test';
import { AddressForm, Address } from './AddressForm';

/**
 * Handles billing address form interactions
 */
export class BillingAddressForm extends AddressForm {
  readonly useShippingAddressCheckbox: Locator;
  readonly billingAddressSection: Locator;

  constructor(page: Page) {
    super(page, '#billing-address');
    
    // Initialize billing-specific locators
    this.countrySelect = page.locator('#order_bill_address_attributes_country_id');
    this.firstNameInput = page.locator('#order_bill_address_attributes_firstname');
    this.lastNameInput = page.locator('#order_bill_address_attributes_lastname');
    this.address1Input = page.locator('#order_bill_address_attributes_address1');
    this.address2Input = page.locator('#order_bill_address_attributes_address2');
    this.cityInput = page.locator('#order_bill_address_attributes_city');
    this.stateSelect = page.locator('#order_bill_address_attributes_state_id');
    this.stateTextInput = page.locator('#order_bill_address_attributes_state_name');
    this.zipcodeInput = page.locator('#order_bill_address_attributes_zipcode');
    this.phoneInput = page.locator('#order_bill_address_attributes_phone');

    this.useShippingAddressCheckbox = page.locator('#order_use_shipping');
    this.billingAddressSection = page.locator('#billing-address');
  }

  /**
   * Toggles the "use shipping address" checkbox
   */
  async toggleUseShippingAddress(useShipping: boolean): Promise<void> {
    const isChecked = await this.useShippingAddressCheckbox.isChecked();
    if (useShipping !== isChecked) {
      await this.useShippingAddressCheckbox.click({ force: true });
    }
  }

  /**
   * Fills billing address (ensures billing form is visible first)
   */
  async fillBillingAddress(address: Address): Promise<void> {
    // Ensure billing address form is visible
    await this.toggleUseShippingAddress(false);
    await this.fillAddress(address);
  }

  /**
   * Uses shipping address for billing
   */
  async useShippingAddressForBilling(): Promise<void> {
    await this.toggleUseShippingAddress(true);
  }

  /**
   * Validates that the billing address section is visible
   */
  async expectBillingSectionVisible(): Promise<void> {
    await this.billingAddressSection.waitFor({ state: 'visible' });
  }
}
