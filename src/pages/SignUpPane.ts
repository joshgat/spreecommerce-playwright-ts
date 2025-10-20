import { Page, Locator, expect } from '@playwright/test';

/**
 * SignUpPane - User registration modal interactions
 * 
 * Handles:
 * - Sign up form filling
 * - Form submission
 */
export class SignUpPane {
  readonly page: Page;
  readonly signUpForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmationInput: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signUpForm = page.locator('form#new_user, form.new_user');
    this.emailInput = page.locator('#user_email');
    this.passwordInput = page.locator('#user_password');
    this.passwordConfirmationInput = page.locator('#user_password_confirmation');
    this.signUpButton = page.locator('input[type="submit"][value="Sign Up"]');
  }

  async fillSignUpForm(email: string, password: string, passwordConfirmation?: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.passwordConfirmationInput.fill(passwordConfirmation || password);
  }

  async submitSignUpForm() {
    await this.signUpButton.click();
  }
}
