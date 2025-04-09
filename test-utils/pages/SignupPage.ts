import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
  }

  async goto() {
    await this.page.goto('localhost:8080/signup');
  }

  async fillSignupForm(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submitForm() {
    await this.submitButton.click();
  }

  async signup(firstName: string, lastName: string, email: string, password: string) {
    await this.fillSignupForm(firstName, lastName, email, password);
    await this.submitForm();
  }
}