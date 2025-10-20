import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the User Registration/Sign Up functionality
 * 
 * This class handles all interactions with the user registration process including:
 * - Opening and closing the sign-up modal/panel
 * - Filling registration forms with user credentials
 * - Form validation and submission
 * - Navigation between login and sign-up forms
 * 
 * @class SignUpPane
 * @example
 * ```typescript
 * const signUpPane = new SignUpPane(page);
 * await signUpPane.fillSignUpForm('user@example.com', 'password123');
 * await signUpPane.submitSignUpForm();
 * ```
 */
export class SignUpPane {
  readonly page: Page;
  readonly overlay: Locator;
  readonly panel: Locator;
  readonly closeButton: Locator;
  readonly title: Locator;
  readonly signUpForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmationInput: Locator;
  readonly signUpButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overlay = page.locator('#account-pane');
    this.panel = page.locator('#slideover-account');
    this.closeButton = this.panel.locator('button[data-action="slideover-account#toggle"]');
    this.title = this.panel.locator('span:has-text("Account")');
    this.signUpForm = page.locator('form#new_user, form.new_user');
    this.emailInput = page.locator('#user_email');
    this.passwordInput = page.locator('#user_password');
    this.passwordConfirmationInput = page.locator('#user_password_confirmation');
    this.signUpButton = page.locator('input[type="submit"][value="Sign Up"]');
    this.loginLink = page.locator('a[href="/user/sign_in"]');
  }

  async close() {
    await this.closeButton.click();
  }

  /**
   * Fills the sign-up form with user registration details
   * @async
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} [passwordConfirmation] - Password confirmation (defaults to password if not provided)
   * @returns {Promise<void>}
   */
  async fillSignUpForm(email: string, password: string, passwordConfirmation?: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.passwordConfirmationInput.fill(passwordConfirmation || password);
  }

  /**
   * Submits the sign-up form
   * @async
   * @returns {Promise<void>}
   */
  async submitSignUpForm() {
    await this.signUpButton.click();
  }

  /**
   * Complete sign-up process - fills and submits the form in one operation
   * @async
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @param {string} [passwordConfirmation] - Password confirmation (defaults to password if not provided)
   * @returns {Promise<void>}
   */
  async signUp(email: string, password: string, passwordConfirmation?: string) {
    await this.fillSignUpForm(email, password, passwordConfirmation);
    await this.submitSignUpForm();
  }

  async clickLoginLink() {
    await this.loginLink.click();
  }

  async clearForm() {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.passwordConfirmationInput.clear();
  }

  async getEmailValue(): Promise<string> {
    return await this.emailInput.inputValue();
  }

  async getPasswordValue(): Promise<string> {
    return await this.passwordInput.inputValue();
  }

  async getPasswordConfirmationValue(): Promise<string> {
    return await this.passwordConfirmationInput.inputValue();
  }
}
