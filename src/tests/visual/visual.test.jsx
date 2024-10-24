// src/tests/visual/visual.test.jsx
import { test, expect } from '@playwright/test';

// Helper to ensure page is fully loaded
async function waitForPage(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Increase timeout for all tests
    test.setTimeout(30000);
  });

  test('home page renders correctly', async ({ page }) => {
    await page.goto('/');
    await waitForPage(page);
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('home-page.png', {
      fullPage: true,
      timeout: 10000
    });
  });

  test('profile component renders correctly', async ({ page }) => {
    await page.goto('/profile');
    await waitForPage(page);

    // Wait for the profile content to be visible
    await page.waitForSelector('[data-testid="profile-content"]', { state: 'visible' });
    
    const profileSection = await page.locator('[data-testid="profile-content"]');
    await expect(profileSection).toHaveScreenshot('profile-section.png', {
      timeout: 10000
    });
  });

  test('loading spinner renders correctly', async ({ page }) => {
    await page.goto('/');
    await waitForPage(page);

    // Find spinner
    const spinner = await page.locator('[data-testid="loading-spinner"]');
    await expect(spinner).toBeDefined();
    await expect(spinner).toBeVisible();
    
    // Take screenshot of spinner
    await expect(spinner).toHaveScreenshot('loading-spinner.png');
  });
});