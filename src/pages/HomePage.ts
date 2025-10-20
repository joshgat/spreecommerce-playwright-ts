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
  readonly closeCookie: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.accountButton = page.locator('button:has(svg[viewBox="0 0 25 24"]):not(#mobile-menu)');
    this.shopAllLink = page.locator('a[data-title="shop all"]').first();
    this.closeCookie = page.getByRole('button', { name: /close|accept|ok/i });
    this.logo = page.getByLabel('Top').getByRole('link', { name: 'Spree Commerce DEMO logo' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async dismissBannersIfAny() {
    const candidates: Locator[] = [this.closeCookie];
    for (const candidate of candidates) {
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.click().catch(() => {});
      }
    }
  }

  async openAccountMenu() {
    await this.accountButton.click();
  }

  /**
   * Navigates to the Shop All page
   * @async
   * @returns {Promise<void>}
   */
  async navigateToShopAll() {
    await this.shopAllLink.click();
  }

  /**
   * Waits for the home page to be fully loaded
   * @async
   * @param {number} [timeout=10000] - Timeout in milliseconds
   * @returns {Promise<void>}
   */
  async waitForPageLoad(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
    await this.logo.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * Dismisses any banners or popups that might appear on the page
   * @async
   * @returns {Promise<void>}
   */
  async dismissAllBanners(): Promise<void> {
    await this.dismissBannersIfAny();
  }
}
