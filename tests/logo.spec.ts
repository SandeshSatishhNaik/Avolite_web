import { test, expect } from '@playwright/test';

// Header lands in plan 03, so inject test markup that uses the real sprite instead of relying on it.
const MARKUP = `
<div id="t-logos" style="display:flex;flex-direction:column;align-items:flex-start;gap:16px;padding:16px;background:var(--bg-0)">
  <svg id="t-mark" class="logo logo--mark logo--reversed" viewBox="443 50 1081 492"><use href="#lg-mark"/></svg>
  <svg id="t-word" class="logo logo--wordmark logo--reversed" viewBox="256 571 1471 150"><use href="#lg-word"/></svg>
  <svg id="t-lockup" class="logo logo--lockup logo--reversed" viewBox="256 50 1471 671"><use href="#lg-mark"/><use href="#lg-word"/></svg>
  <svg id="t-color" class="logo logo--mark logo--color" viewBox="443 50 1081 492"><use href="#lg-mark"/></svg>
</div>`;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate((html) => document.body.insertAdjacentHTML('beforeend', html), MARKUP);
});

test('logo sizes: mark 36, wordmark 14, lockup 64 px tall', async ({ page }) => {
  const box = async (id: string) => (await page.locator(id).boundingBox())!;
  const mark = await box('#t-mark');
  const word = await box('#t-word');
  const lockup = await box('#t-lockup');
  expect(mark.height).toBe(36);
  expect(word.height).toBe(14);
  expect(lockup.height).toBe(64);
  for (const b of [mark, word, lockup]) expect(b.width).toBeGreaterThan(0);
  expect(mark.width / mark.height).toBeGreaterThan(2.1);
  expect(mark.width / mark.height).toBeLessThan(2.3);
});

test('logo tones resolve from tokens', async ({ page }) => {
  const vars = (id: string) =>
    page.locator(id).evaluate((el) => {
      const cs = getComputedStyle(el);
      return [cs.getPropertyValue('--logo-green'), cs.getPropertyValue('--logo-khaki')].map((v) => v.trim().toLowerCase());
    });
  expect(await vars('#t-mark')).toEqual(['#e8eef6', '#bcac87']);
  expect((await vars('#t-color'))[0]).toBe('#2d4639');
});

test('logo art paints light and khaki pixels (not black, not clipped)', async ({ page }) => {
  const png = (await page.locator('#t-lockup').screenshot()).toString('base64');
  const [light, khaki, total] = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const near = (i: number, [r, g, b]: number[]) =>
      Math.abs(d[i] - r) <= 14 && Math.abs(d[i + 1] - g) <= 14 && Math.abs(d[i + 2] - b) <= 14;
    let l = 0;
    let k = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (near(i, [232, 238, 246])) l++;
      else if (near(i, [188, 172, 135])) k++;
    }
    return [l, k, d.length / 4];
  }, png);
  expect(light / total).toBeGreaterThan(0.01);
  expect(khaki / total).toBeGreaterThan(0.01);
});

test('logo sprite is emitted once per page', async ({ page }) => {
  await expect(page.locator('[id="lg-mark"]')).toHaveCount(1);
  await expect(page.locator('[id="lg-word"]')).toHaveCount(1);
});
