import { Page, Locator, expect } from '@playwright/test';

/**
 * Interface representing address information
 */
export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  stateValue?: string;
  zipcode: string;
  phone?: string;
  country?: string;
  countryValue?: string;
}

/**
 * Base class for handling address form interactions
 * Provides common functionality for both shipping and billing addresses
 */
export abstract class AddressForm {
  protected readonly page: Page;
  protected readonly form: Locator;

  // Common address fields
  protected readonly countrySelect: Locator;
  protected readonly firstNameInput: Locator;
  protected readonly lastNameInput: Locator;
  protected readonly address1Input: Locator;
  protected readonly address2Input: Locator;
  protected readonly cityInput: Locator;
  protected readonly stateSelect: Locator;
  protected readonly stateTextInput: Locator;
  protected readonly zipcodeInput: Locator;
  protected readonly phoneInput: Locator;

  // Address autocomplete
  protected readonly addressSuggestionsBox: Locator;
  protected readonly firstAddressSuggestion: Locator;

  constructor(page: Page, formSelector: string) {
    this.page = page;
    this.form = page.locator(formSelector);
    
    // Initialize common locators - to be overridden by subclasses
    this.countrySelect = page.locator('');
    this.firstNameInput = page.locator('');
    this.lastNameInput = page.locator('');
    this.address1Input = page.locator('');
    this.address2Input = page.locator('');
    this.cityInput = page.locator('');
    this.stateSelect = page.locator('');
    this.stateTextInput = page.locator('');
    this.zipcodeInput = page.locator('');
    this.phoneInput = page.locator('');
    
    this.addressSuggestionsBox = page.locator('[data-address-autocomplete-target="suggestionsBoxContainer"]');
    this.firstAddressSuggestion = page.locator('#suggestions-option-0');
  }

  /**
   * Fills the address form with the provided address information
   * @param address - Address information to fill
   */
  async fillAddress(address: Address): Promise<void> {
    await this.selectCountry(address.country, address.countryValue);
    await this.fillNameFields(address.firstName, address.lastName);
    await this.fillAddressFields(address.address1, address.address2);
    await this.fillLocationFields(address.city, address.state, address.stateValue, address.zipcode);
    if (address.phone) {
      await this.phoneInput.fill(address.phone);
    }
  }

  /**
   * Selects country from dropdown
   */
  private async selectCountry(country?: string, countryValue?: string): Promise<void> {
    if (countryValue) {
      await this.countrySelect.selectOption({ value: countryValue }).catch(() => {});
    } else if (country) {
      await this.selectCountryByValueOrLabel(country);
    }
  }

  /**
   * Selects country by value or label with fallback strategies
   */
  private async selectCountryByValueOrLabel(country: string): Promise<void> {
    // Try by ISO attribute first
    const isoOption = this.page.locator(`${this.countrySelect.locator('option[data-iso]').first().locator('..')} option[data-iso="${country}"]`);
    if (await isoOption.count()) {
      const val = await isoOption.first().getAttribute('value');
      if (val) {
        await this.countrySelect.selectOption(val).catch(() => {});
        return;
      }
    }

    // Try by label, then by value
    await this.countrySelect.selectOption({ label: country }).catch(async () => {
      await this.countrySelect.selectOption({ value: country }).catch(() => {});
    });
  }

  /**
   * Fills name fields
   */
  private async fillNameFields(firstName: string, lastName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  /**
   * Fills address fields with autocomplete handling
   */
  private async fillAddressFields(address1: string, address2?: string): Promise<void> {
    await this.address1Input.fill(address1);
    await this.selectFirstAddressSuggestion();
    if (address2) {
      await this.address2Input.fill(address2);
    }
  }

  /**
   * Fills location fields (city, state, zipcode)
   */
  private async fillLocationFields(city: string, state?: string, stateValue?: string, zipcode: string): Promise<void> {
    await this.cityInput.fill(city);
    await this.selectState(state, stateValue);
    await this.zipcodeInput.fill(zipcode);
  }

  /**
   * Selects state from dropdown or fills text input
   */
  private async selectState(state?: string, stateValue?: string): Promise<void> {
    if (stateValue) {
      if (await this.stateSelect.isVisible().catch(() => false)) {
        await this.stateSelect.selectOption({ value: stateValue }).catch(() => {});
      }
    } else if (state) {
      if (await this.stateSelect.isVisible().catch(() => false)) {
        await this.selectStateByValueOrLabel(state);
      } else if (await this.stateTextInput.isVisible().catch(() => false)) {
        await this.stateTextInput.fill(state);
      }
    }
  }

  /**
   * Selects state by value or label with fallback strategies
   */
  private async selectStateByValueOrLabel(state: string): Promise<void> {
    // Try by label first
    await this.stateSelect.selectOption({ label: state }).catch(async () => {
      // Try by value
      await this.stateSelect.selectOption({ value: state }).catch(async () => {
        // Try by data-abbr attribute
        const stateId = this.stateSelect.getAttribute('id');
        const stateIdValue = await stateId;
        if (stateIdValue) {
          const opt = this.page.locator(`#${stateIdValue} option[data-abbr="${state}"]`).first();
          if (await opt.count()) {
            const val = await opt.getAttribute('value');
            if (val) {
              await this.stateSelect.selectOption(val).catch(() => {});
            }
          }
        }
      });
    });
  }

  /**
   * Selects the first address suggestion from autocomplete
   */
  private async selectFirstAddressSuggestion(): Promise<void> {
    try {
      await this.addressSuggestionsBox.waitFor({ state: 'visible', timeout: 3000 });
      await this.firstAddressSuggestion.click();
    } catch (error) {
      // If no suggestions appear, continue without selecting
      console.log('No address suggestions found, continuing without selection');
    }
  }

  /**
   * Validates that the form is visible and ready for interaction
   */
  async expectFormVisible(): Promise<void> {
    await expect(this.form).toBeVisible();
  }
}
