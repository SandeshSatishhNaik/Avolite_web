import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const out = '.impeccable/review';
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
async function ready() {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(async image => {
      image.loading = 'eager';
      await image.decode().catch(() => {});
    }));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}
for (const [width, height, name] of [[1536,1024,'desktop'],[1440,900,'user-1440'],[768,1024,'tablet'],[390,844,'mobile']]) {
  await page.setViewportSize({ width, height });
  await page.goto('http://127.0.0.1:4321/');
  await ready();
  await page.screenshot({ path: `${out}/${name}.png` });
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  if (width === 1440 || width === 390) {
    // Element captures scroll the page; suppress sticky chrome only in these detail shots.
    await page.addStyleTag({ content: '.site-header { visibility: hidden !important; }' });
    for (const id of ['problem','how','built','new','demo','security','roadmap','why']) {
      await page.locator(`#${id}`).screenshot({ path: `${out}/${name}-${id}.png` });
    }
  }
}
await page.setViewportSize({ width: 1440, height: 900 });
for (const route of ['system','evidence']) {
  await page.goto(`http://127.0.0.1:4321/${route}/`);
  await ready();
  await page.screenshot({ path: `${out}/${route}-full.png`, fullPage: true });
}
await writeFile(`${out}/capture-errors.json`, JSON.stringify(errors, null, 2));
await browser.close();
console.log(`Captured desktop, tablet, phone and auxiliary routes; ${errors.length} page errors.`);
