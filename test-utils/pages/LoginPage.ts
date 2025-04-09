import { Page, Locator } from '@playwright/test';
import { CONFIG } from '../config';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('div[style*="color: red"]');
  }

  async goto() {
    await this.page.goto(`${CONFIG.baseUrl}${CONFIG.routes.login}`);
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.isVisible() ? await this.errorMessage.textContent() : null;
  }
}