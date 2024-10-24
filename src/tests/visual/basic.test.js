// src/tests/visual/basic.test.js
import { test, expect } from '@playwright/test';

test('basic screenshot test', async ({ page }) => {
  // Go to homepage
  await page.goto('http://localhost:3000');
  
  // Wait for React to render
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await expect(page).toHaveScreenshot('homepage.png');
});