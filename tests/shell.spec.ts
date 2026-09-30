import { test, expect, type Page } from '@playwright/test';
import { SECTIONS } from '../src/lib/site.ts';

const ids = SECTIONS.map((s) => s.id);

test('skip link is the first Tab stop and moves focus to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('a.skip');
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('sticky header stays at the top', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const header = page.locator('.site-header');
  expect(await header.evaluate((el) => getComputedStyle(el).position)).toBe('sticky');
  await page.evaluate(() => window.scrollTo({ top: 1500, behavior: 'instant' }));
  await expect.poll(async () => (await header.boundingBox())!.y).toBe(0);
});

test.describe('scroll-spy group (reduced motion)', () => {
  test.use({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });

  test('scroll-spy marks the section in view and clears over the hero', async ({ page }) => {
    await page.goto('/');
    expect(await page.locator('main > section[data-section]').evaluateAll((els) => els.map((e) => e.id))).toEqual(ids);
    const links = page.locator('.site-nav a');
    expect(await links.evaluateAll((els) => els.map((e) => e.getAttribute('href')))).toEqual(ids.map((i) => `#${i}`));
    await expect(page.locator('.site-nav a[aria-current]')).toHaveCount(0);

    await page.locator('.site-nav a[href="#built"]').click();
    const current = page.locator('.site-nav a[aria-current="location"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('href', '#built');

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(page.locator('.site-nav a[aria-current]')).toHaveCount(0);

    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('href', '#why');
  });

  test('anchor clicks land below the sticky header', async ({ page }) => {
    await page.goto('/');
    for (const [i, id] of ids.entries()) {
      await page.locator(`.site-nav a[href="#${id}"]`).click();
      const sec = page.locator(`#${id}`);
      await expect
        .poll(async () => {
          const y = (await sec.boundingBox())!.y;
          return y >= 62 && y < 900 && (i === ids.length - 1 || y <= 70);
        })
        .toBe(true);
    }
  });
});

test('scroll-behavior is smooth by default', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('smooth');
});

test.describe('reduced motion scroll-behavior', () => {
  test.use({ reducedMotion: 'reduce' });
  test('scroll-behavior is auto under reduced motion', async ({ page }) => {
    await page.goto('/');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  });
});

test.describe('mobile menu group', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('mobile menu opens, contains focus, closes and navigates', async ({ page }) => {
    await page.goto('/');
    const openBtn = page.locator('[data-menu-open]');
    await expect(page.locator('.site-nav')).toBeHidden();
    await expect(openBtn).toBeVisible();
    expect((await openBtn.boundingBox())!.height).toBeGreaterThanOrEqual(44);

    await openBtn.click();
    const dialog = page.locator('dialog#menu');
    await expect(dialog).toBeVisible();
    const items = page.locator('#menu nav a');
    await expect(items).toHaveCount(8);
    for (const [i, s] of SECTIONS.entries()) {
      await expect(items.nth(i).locator('small')).toHaveText(s.subtitle);
    }

    for (let i = 0; i < 14; i++) {
      await page.keyboard.press('Tab');
      const ok = await page.evaluate(() => {
        const a = document.activeElement;
        return a === document.body || !!a?.closest('#menu');
      });
      expect(ok, `Tab ${i + 1} escaped the dialog`).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(openBtn).toBeFocused();

    await openBtn.click();
    await page.locator('#menu a[href="#built"]').click();
    await expect(dialog).toBeHidden();
    await expect
      .poll(async () => {
        const y = (await page.locator('#built').boundingBox())!.y;
        return y >= 0 && y < 800;
      })
      .toBe(true);

    await openBtn.click();
    await expect(dialog).toBeVisible();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(dialog).toBeHidden();
  });
});

test.describe('invoker fallback group', () => {
  test.use({ viewport: { width: 390, height: 800 } });

  test('without Invoker Commands the JS fallback opens and closes the menu', async ({ page }) => {
    await page.addInitScript(() => {
      delete (HTMLButtonElement.prototype as unknown as { command?: unknown }).command;
    });
    await page.goto('/');
    expect(await page.evaluate(() => 'command' in HTMLButtonElement.prototype)).toBe(false);
    // Strip the declarative attributes so only the JS handlers can act.
    await page.evaluate(() => document.querySelectorAll('[command]').forEach((b) => b.removeAttribute('command')));
    const dialog = page.locator('dialog#menu');
    await page.locator('[data-menu-open]').click();
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(dialog).toBeHidden();
  });
});

test.describe('JS off group', () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 800 } });

  test('JS off: menu still opens and Escape closes it', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-menu-open]').click();
    const dialog = page.locator('dialog#menu');
    await expect(dialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});

type Shift = { value: number; hadRecentInput: boolean };

async function layoutShift(page: Page, width: number, height: number) {
  await page.addInitScript(() => {
    const w = window as unknown as { __cls: Shift[] };
    w.__cls = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        const ls = e as unknown as Shift;
        w.__cls.push({ value: ls.value, hadRecentInput: ls.hadRecentInput });
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.setViewportSize({ width, height });
  await page.goto('/', { waitUntil: 'load' });
  // Deterministic settle: fonts loaded, then two frames so late shifts are reported.
  await page.evaluate(
    () =>
      document.fonts.ready.then(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())))),
  );
  await page.waitForTimeout(250);
  return page.evaluate(() => {
    const w = window as unknown as { __cls: Shift[] };
    return w.__cls.filter((e) => !e.hadRecentInput).reduce((n, e) => n + e.value, 0);
  });
}

// Serial: font timing varies when heavy specs share one preview server.
test.describe('layout shift', () => {
  test.describe.configure({ mode: 'serial' });
  for (const [w, h] of [
    [390, 800],
    [1440, 900],
  ] as const) {
    test(`layout shift at ${w}px is at most 0.01`, async ({ page }) => {
      expect(await layoutShift(page, w, h)).toBeLessThanOrEqual(0.01);
    });
  }
});

for (const width of [1024, 1100, 1279, 1280]) {
  test(`header fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 768 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    const boxes = await page.locator('.site-nav a').evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { w: r.width, h: r.height, right: r.right };
      }),
    );
    expect(boxes).toHaveLength(8);
    for (const b of boxes) {
      expect(b.h).toBeLessThanOrEqual(48);
      expect(b.w).toBeGreaterThanOrEqual(44);
    }
    const margin = width < 1280 ? 40 : 80;
    expect(boxes[boxes.length - 1].right).toBeLessThanOrEqual(width - margin + 1);
    expect(await page.locator('.site-header__inner').evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
    await page.locator('.site-header').screenshot({ path: `test-results/header-${width}.png` });
  });
}

test('header logo: mark and wordmark paint real brand colours', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const brand = page.locator('a.brand[aria-label="AVOLITE home"]');
  await expect(brand.locator('svg.logo')).toHaveCount(2);
  for (const svg of await brand.locator('svg.logo').all()) await expect(svg).toHaveAttribute('aria-hidden', 'true');
  const mark = brand.locator('svg.logo--mark');
  const word = brand.locator('svg.logo--wordmark');
  expect((await mark.boundingBox())!.height).toBe(36);
  expect((await word.boundingBox())!.height).toBe(14);
  const vars = await mark.evaluate((el) => {
    const cs = getComputedStyle(el);
    return [cs.getPropertyValue('--logo-green'), cs.getPropertyValue('--logo-khaki')].map((v) => v.trim().toLowerCase());
  });
  expect(vars).toEqual(['#e8eef6', '#bcac87']);

  const png = (await brand.screenshot()).toString('base64');
  const [light, khaki] = await page.evaluate(async (b64) => {
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
      Math.abs(d[i] - r) <= 20 && Math.abs(d[i + 1] - g) <= 20 && Math.abs(d[i + 2] - b) <= 20;
    let l = 0;
    let k = 0;
    for (let i = 0; i < d.length; i += 4) {
      if (near(i, [232, 238, 246])) l++;
      if (near(i, [188, 172, 135])) k++;
    }
    return [l, k];
  }, png);
  expect(light).toBeGreaterThanOrEqual(20);
  expect(khaki).toBeGreaterThanOrEqual(20);
});
