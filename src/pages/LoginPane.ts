import { Page, Locator, expect } from '@playwright/test';

export class LoginPane {
  readonly page: Page;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpLink = page.locator('a[href="/user/sign_up"]');
  }

  async clickSignUpLink() {
    await this.signUpLink.click();
  }

}
