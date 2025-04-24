import { test, expect } from '@playwright/test';
import { existingUsers } from '../../test-setup/localstorage.setup';
import { LoginPage } from '../../test-utils/pages/LoginPage';
import { HomePage } from '../../test-utils/pages/HomePage';
import { CONFIG } from '../../test-utils/config';

test.describe('Login functionality tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const validUser = existingUsers[0];
    
    // Act
    await loginPage.login(validUser.email, validUser.password);
    
    // Assert
    await expect(homePage.logoutButton).toBeVisible();
    const welcomeText = await homePage.getUserWelcomeMessage();
    expect(welcomeText).toContain(validUser.firstName);
    expect(welcomeText).toContain(validUser.lastName);
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const invalidEmail = 'nonexistent@example.com';
    const invalidPassword = 'wrong!password123';
    
    // Act
    await loginPage.login(invalidEmail, invalidPassword);
    
    // Assert
    await expect(loginPage.errorMessage).toBeVisible();
    expect(await loginPage.getErrorMessage()).toContain('Invalid credentials');
  });

  test('should disable login button when form is incomplete', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    
    // Act & Assert - Empty form
    await expect(loginPage.loginButton).toBeDisabled();
    
    // Act & Assert - Email only
    await loginPage.emailInput.fill('test@example.com');
    await expect(loginPage.loginButton).toBeDisabled();
    
    // Act & Assert - Password only (too short)
    await loginPage.emailInput.clear();
    await loginPage.passwordInput.fill('short');
    await expect(loginPage.loginButton).toBeDisabled();
    
    // Act & Assert - Valid email and password
    await loginPage.emailInput.fill('test@example.com');
    await loginPage.passwordInput.fill('validPassword123!');
    await expect(loginPage.loginButton).toBeEnabled();
  });
  
  test('should redirect to home page after successful login', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const validUser = existingUsers[0];
    
    // Act
    await loginPage.login(validUser.email, validUser.password);
    
    // Assert
    await expect(page).toHaveURL(`${CONFIG.baseUrl}${CONFIG.routes.home}`);
  });
});