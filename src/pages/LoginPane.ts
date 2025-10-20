import { Page, Locator, expect } from '@playwright/test';

export class LoginPane {
  readonly page: Page;
  readonly overlay: Locator;
  readonly panel: Locator;
  readonly closeButton: Locator;
  readonly title: Locator;
  readonly loginForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly signUpLink: Locator;
  readonly forgotPasswordLink: Locator;
  readonly guestCheckoutButton: Locator;
  readonly guestCheckoutText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overlay = page.locator('#account-pane');
    this.panel = page.locator('#slideover-account');
    this.closeButton = this.panel.locator('button[data-action="slideover-account#toggle"]');
    this.title = this.panel.locator('span:has-text("Account")');
    this.loginForm = page.locator('form#new_user, form.new_user');
    this.emailInput = page.locator('#user_email');
    this.passwordInput = page.locator('#user_password');
    this.rememberMeCheckbox = page.locator('#user_remember_me');
    this.loginButton = page.locator('#login-button, input[type="submit"][value="Login"]');
    this.signUpLink = page.locator('a[href="/user/sign_up"]');
    this.forgotPasswordLink = page.locator('a[href="/user/password/new"]');
    this.guestCheckoutButton = page.locator('a[href*="/checkout"][href*="guest=true"]');
    this.guestCheckoutText = page.locator('p:has-text("Continue without logging in")');
  }

  async close() {
    await this.closeButton.click();
  }

  async fillLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitLoginForm() {
    await this.loginButton.click();
  }

  async login(email: string, password: string) {
    await this.fillLoginForm(email, password);
    await this.submitLoginForm();
  }

  async toggleRememberMe(remember: boolean) {
    const isChecked = await this.rememberMeCheckbox.isChecked();
    if (remember !== isChecked) {
      await this.rememberMeCheckbox.click();
    }
  }

  async clickSignUpLink() {
    await this.signUpLink.click();
  }

  async clickForgotPasswordLink() {
    await this.forgotPasswordLink.click();
  }

  async clickGuestCheckout() {
    await this.guestCheckoutButton.click();
  }

}
