import { test, expect } from '@playwright/test';

test('home renders with fonts wired and no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    if (msg.location().url.endsWith('/favicon.svg')) return; // favicon arrives in plan 02
    errors.push(msg.text());
  });

  await page.goto('/');
  await expect(page).toHaveTitle('AVOLITE');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  const h1 = page.locator('h1');
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText('AVOLITE');
  expect(await h1.evaluate((el) => getComputedStyle(el).fontFamily)).toContain('Archivo');
  expect(errors).toEqual([]);
});
