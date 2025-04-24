import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly logoutButton: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
    this.welcomeMessage = page.locator('div[style*="display: flex"]').filter({ hasText: 'Welcome' });
  }

  async isLoggedIn() {
    return await this.logoutButton.isVisible();
  }

  async getUserWelcomeMessage() {
    return await this.welcomeMessage.textContent();
  }

  async logout() {
    await this.logoutButton.click();
  }
}