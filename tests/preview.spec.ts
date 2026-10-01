import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const STATUSES = ['BUILT', 'SIMULATED', 'PROTOTYPE', 'DESIGNED', 'PLANNED', 'ILLUSTRATIVE'];

async function open(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/preview/');
}

const noHScroll = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test('preview status tags', async ({ page }) => {
  await open(page, 1440);
  const tags = page.locator('dl.legend .tag');
  await expect(tags).toHaveCount(6);
  const glyphs = await tags.evaluateAll((els) => els.map((e) => e.querySelector('svg')?.getAttribute('data-glyph')));
  expect(new Set(glyphs).size).toBe(6);
  for (const s of STATUSES) {
    const tag = page.locator(`dl.legend .tag[data-status="${s}"]`);
    await expect(tag).toHaveText(s);
    const css = await tag.evaluate((e) => {
      const c = getComputedStyle(e);
      return { border: c.borderTopStyle, bg: c.backgroundImage, bgc: c.backgroundColor };
    });
    expect(css.border).toBe(s === 'PLANNED' || s === 'ILLUSTRATIVE' ? 'dashed' : 'solid');
    if (s === 'ILLUSTRATIVE') expect(css.bg).toContain('gradient');
    else expect(css.bg).toBe('none');
    if (s === 'DESIGNED' || s === 'PLANNED') expect(css.bgc).toBe('rgba(0, 0, 0, 0)');
  }
});

test('preview legend', async ({ page }) => {
  await open(page, 1440);
  const legend = page.locator('dl.legend');
  await expect(legend.locator('dt')).toHaveCount(6);
  await expect(legend.locator('dd')).toHaveCount(6);
  for (const dd of await legend.locator('dd').allTextContents()) {
    expect(dd.trim().length).toBeGreaterThan(0);
    expect(dd).not.toMatch(/\blive\b/i);
  }
});

test('preview metric', async ({ page }) => {
  await open(page, 1440);
  const sim = page.locator('.metric--simulated data.metric__value').first();
  await expect(sim).toHaveAttribute('data-countup', '');
  expect(await sim.evaluate((e) => getComputedStyle(e).fontVariantNumeric)).toContain('tabular-nums');
  const ill = page.locator('.metric--illustrative data.metric__value');
  await expect(ill).not.toHaveAttribute('data-countup', /.*/);
  const [simColor, illColor, bodyColor] = await Promise.all([
    sim.evaluate((e) => getComputedStyle(e).color),
    ill.evaluate((e) => getComputedStyle(e).color),
    page.evaluate(() => getComputedStyle(document.body).color),
  ]);
  expect(illColor).toBe(bodyColor);
  expect(illColor).not.toBe(simColor);
  expect(await page.locator('.metric--illustrative').evaluate((e) => getComputedStyle(e).backgroundImage)).toContain('gradient');
  expect((await ill.textContent())?.trim()).toMatch(/\d/);
});

test('preview figure', async ({ page }) => {
  await open(page, 1440);
  const fig = page.locator('figure.figure');
  const plate = fig.locator('.plate');
  expect(await plate.evaluate((e) => getComputedStyle(e).backgroundColor)).toBe('rgb(255, 255, 255)');
  const img = plate.locator('img');
  const css = await img.evaluate((e) => {
    const c = getComputedStyle(e);
    return { filter: c.filter, blend: c.mixBlendMode, opacity: c.opacity };
  });
  expect(css).toEqual({ filter: 'none', blend: 'normal', opacity: '1' });
  await expect(img).toHaveAttribute('width', /\d+/);
  await expect(img).toHaveAttribute('height', /\d+/);
  await expect(fig.locator('picture source[type="image/avif"]')).toHaveCount(1);
  await expect(fig.locator('picture source[type="image/webp"]')).toHaveCount(1);
  const cap = fig.locator('figcaption');
  await expect(cap.locator('.tag[data-status="SIMULATED"]')).toHaveCount(1);
  await expect(cap.locator('a')).toHaveAttribute('href', /github\.com\/abhishekpj0902-apj\/AVOLITE\/blob\/9b985ca7/);
});

test('preview placeholder', async ({ page }) => {
  for (const width of [1440, 390]) {
    await open(page, width);
    const boxes = page.locator('[data-placeholder]');
    await expect(boxes).toHaveCount(2);
    for (const [i, ratio] of [16 / 10, 2.23].entries()) {
      const box = boxes.nth(i);
      const b = await box.boundingBox();
      expect(b).not.toBeNull();
      expect(Math.abs(b!.height - b!.width / ratio)).toBeLessThanOrEqual(1);
      await expect(box).toContainText('pending from the team');
      await expect(box.locator('.tag')).toHaveCount(1);
    }
  }
});

test('preview table', async ({ page }) => {
  await open(page, 1440);
  const table = page.locator('section#result-table table[role="table"]');
  await expect(table).toHaveCount(1);
  expect(await table.locator('tbody tr').first().evaluate((e) => getComputedStyle(e).display)).toBe('table-row');
  expect(await noHScroll(page)).toBe(true);

  for (const width of [768, 390]) {
    await open(page, width);
    expect(await noHScroll(page)).toBe(true);
    const t = page.locator('section#result-table table[role="table"]');
    const row = t.locator('tbody tr').first();
    if (width === 390) {
      expect(await row.evaluate((e) => getComputedStyle(e).display)).not.toBe('table-row');
      const td = row.locator('td').first();
      const [label, before] = await Promise.all([
        td.getAttribute('data-label'),
        td.evaluate((e) => getComputedStyle(e, '::before').content.replace(/^["']|["']$/g, '')),
      ]);
      expect(before).toBe(label);
    }
  }

  await open(page, 390);
  const details = page.locator('details.disclosure');
  const summary = details.locator('summary', { hasText: 'View as table' });
  expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await summary.click();
  await expect(details).toHaveAttribute('open', '');
  await expect(details.locator('table')).toBeVisible();
});

async function axe(page: Page, width: number) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await open(page, width);
  const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  expect(errors).toEqual([]);
}

test('axe preview 1440', async ({ page }) => axe(page, 1440));
test('axe preview 390', async ({ page }) => axe(page, 390));
