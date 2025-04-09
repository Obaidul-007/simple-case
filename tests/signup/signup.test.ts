import { test, expect } from '@playwright/test';
import { SignupPage } from '../../test-utils/pages/SignupPage';
import { LoginPage } from '../../test-utils/pages/LoginPage';
import { HomePage } from '../../test-utils/pages/HomePage';
import { CONFIG } from '../../test-utils/config';

test.describe('Sign Up functionality tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to signup page before each test
    const signupPage = new SignupPage(page);
    await signupPage.goto();
  });

  test('should create a new account and login successfully', async ({ page }) => {
    // Arrange
    const signupPage = new SignupPage(page);
    const homePage = new HomePage(page);
    
    // Generate unique email using timestamp to avoid conflicts
    const timestamp = new Date().getTime();
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: `john.doe.${timestamp}@example.com`,
      password: 'SecurePassword123!'
    };
    
    // Act - Sign up with new account
    await signupPage.signup(
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.password
    );
    
    // Assert - Should be redirected to home page after signup
    await expect(page).toHaveURL(`${CONFIG.baseUrl}${CONFIG.routes.home}`);
    
    // Assert - Welcome message should contain user name
    const welcomeText = await homePage.getUserWelcomeMessage();
    expect(welcomeText).toContain(newUser.firstName);
    expect(welcomeText).toContain(newUser.lastName);
    
    // Act - Log out
    await homePage.logout();
    
    // Assert - Should be redirected to login page
    await expect(page).toHaveURL(`${CONFIG.baseUrl}${CONFIG.routes.login}`);
    
    // Act - Log in with the newly created account
    const loginPage = new LoginPage(page);
    await loginPage.login(newUser.email, newUser.password);
    
    // Assert - Should log in successfully with the new account
    await expect(homePage.logoutButton).toBeVisible();
    
    // Verify the welcome message again
    const welcomeTextAfterLogin = await homePage.getUserWelcomeMessage();
    expect(welcomeTextAfterLogin).toContain(newUser.firstName);
    expect(welcomeTextAfterLogin).toContain(newUser.lastName);
  });
});