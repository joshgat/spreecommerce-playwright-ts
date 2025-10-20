import { Page, Locator } from '@playwright/test';

/**
 * HomePage - Main page object for home page interactions
 * 
 * Handles:
 * - Account menu access
 * - Navigation to Shop All
 * - Logo verification
 */
export class HomePage {
  readonly page: Page;
  readonly accountButton: Locator;
  readonly shopAllLink: Locator;
  readonly logo: Locator;
  readonly accountPane: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountButton = page.locator('button:has(svg[viewBox="0 0 25 24"]):not(#mobile-menu)');
    this.shopAllLink = page.locator('a[data-title="shop all"]').first();
    this.logo = page.getByLabel('Top').getByRole('link', { name: 'Spree Commerce DEMO logo' });
    this.accountPane = page.locator('#account-pane');
    this.successMessage = page.locator('#flashes .flash-message:has-text("Welcome! You have signed up successfully.")');
  }


  async openAccountMenu() {
    await this.accountButton.click();
  }

  async navigateToShopAll() {
    await this.shopAllLink.click();
  }
}
