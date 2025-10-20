import { Page, Locator } from '@playwright/test';
import { AddressForm, Address } from './AddressForm';

/**
 * Handles shipping address form interactions
 */
export class ShippingAddressForm extends AddressForm {
  // Contact information
  readonly emailInput: Locator;
  readonly acceptMarketingCheckbox: Locator;
  readonly createAccountCheckbox: Locator;

  // Actions
  readonly saveAndContinueButton: Locator;

  constructor(page: Page) {
    super(page, '#checkout_form_address');
    
    // Initialize shipping-specific locators
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

    // Contact information
    this.emailInput = page.locator('#order_ship_address_attributes_email, input[name="order[email]"]');
    this.acceptMarketingCheckbox = page.locator('#order_accept_marketing');
    this.createAccountCheckbox = page.locator('#order_signup_for_an_account');

    // Actions
    this.saveAndContinueButton = this.form.getByRole('button', { name: /save and continue/i });
  }

  /**
   * Fills contact information
   */
  async fillContactInformation(params: {
    email: string;
    acceptMarketing?: boolean;
    createAccount?: boolean;
  }): Promise<void> {
    const { email, acceptMarketing, createAccount } = params;
    
    await this.emailInput.fill(email);
    
    if (typeof acceptMarketing === 'boolean') {
      await this.toggleCheckbox(this.acceptMarketingCheckbox, acceptMarketing);
    }
    
    if (typeof createAccount === 'boolean') {
      await this.toggleCheckbox(this.createAccountCheckbox, createAccount);
    }
  }

  /**
   * Toggles a checkbox to the desired state
   */
  private async toggleCheckbox(checkbox: Locator, checked: boolean): Promise<void> {
    const isCurrentlyChecked = await checkbox.isChecked().catch(() => false);
    if (checked !== isCurrentlyChecked) {
      if (checked) {
        await checkbox.check({ force: true }).catch(() => {});
      } else {
        await checkbox.uncheck({ force: true }).catch(() => {});
      }
    }
  }

  /**
   * Fills shipping address and contact information
   */
  async fillShippingForm(params: {
    contact: {
      email: string;
      acceptMarketing?: boolean;
      createAccount?: boolean;
    };
    address: Address;
  }): Promise<void> {
    await this.fillContactInformation(params.contact);
    await this.fillAddress(params.address);
  }

  /**
   * Saves the shipping form and continues to next step
   */
  async saveAndContinue(): Promise<void> {
    await this.saveAndContinueButton.click();
  }

  /**
   * Validates that the shipping step is visible
   */
  async expectOnShippingStep(): Promise<void> {
    await this.expectFormVisible();
    await this.saveAndContinueButton.waitFor({ state: 'visible' });
  }
}
