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

  constructor(page: Page) {
    this.page = page;
    this.accountButton = page.locator('button:has(svg[viewBox="0 0 25 24"]):not(#mobile-menu)');
    this.shopAllLink = page.locator('a[data-title="shop all"]').first();
    this.logo = page.getByLabel('Top').getByRole('link', { name: 'Spree Commerce DEMO logo' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async openAccountMenu() {
    await this.accountButton.click();
  }

  async navigateToShopAll() {
    await this.shopAllLink.click();
  }
}
