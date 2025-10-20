import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for the Home Page functionality
 * 
 * This class handles all interactions with the main home page including:
 * - Navigation to different sections (Shop All, Account menu)
 * - Banner and cookie consent handling
 * - Logo verification and page loading
 * 
 * @class HomePage
 * @example
 * ```typescript
 * const homePage = new HomePage(page);
 * await homePage.goto();
 * await homePage.navigateToShopAll();
 * ```
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
