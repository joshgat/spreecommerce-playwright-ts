import { Page, Locator } from '@playwright/test';

export class ShopAllPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly firstProductLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.section-page-title:has-text("Shop All")');
    this.firstProductLink = page.locator('.product-card a').first();
  }

  async clickFirstProduct() {
    await this.firstProductLink.click();
  }
}

