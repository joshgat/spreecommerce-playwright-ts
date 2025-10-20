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
