import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('cutaway introduction plays once, closes the return path and supports replay',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');const hero=page.locator('[data-widget=cutaway]');
 await expect(hero.getByRole('button',{name:'Pause loop'})).toBeVisible();await expect(hero.locator('.plane-trace')).toHaveCount(1);
 await expect(hero.locator('.return-signal')).toHaveCount(1,{timeout:8000});
 await expect(hero.getByRole('button',{name:'Replay loop'})).toBeVisible({timeout:2000});await expect(hero.locator('.plane.active text')).toHaveText('Scan again');
 await page.waitForTimeout(1050);await expect(hero.getByRole('button',{name:'Replay loop'})).toBeVisible();
 await hero.getByRole('button',{name:'Replay loop'}).click();await expect(hero.locator('.plane.active text')).toHaveText('Observe');await hero.getByRole('button',{name:'Pause loop'}).click();
});

test('phone introduction waits for the diagram and reset cancels pending playback',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');const hero=page.locator('[data-widget=cutaway]');
 await page.waitForTimeout(1050);await expect(hero.locator('.signal-head')).toHaveCount(0);
 await hero.scrollIntoViewIfNeeded();await expect(hero.getByRole('button',{name:'Pause loop'})).toBeVisible();
 await hero.getByRole('button',{name:'Reset',exact:true}).click();await page.waitForTimeout(1050);await expect(hero.locator('.signal-head')).toHaveCount(0);
 await page.reload();await hero.getByRole('button',{name:'Reset',exact:true}).click();await page.waitForTimeout(1050);await expect(hero.locator('.signal-head')).toHaveCount(0);
});

test('pause and runtime reduced motion interrupt the introduction',async({page})=>{
 await page.setViewportSize({width:1440,height:1000});await page.goto('/');const hero=page.locator('[data-widget=cutaway]');
 await hero.getByRole('button',{name:'Pause loop'}).click();const selected=await hero.locator('.plane.active text').textContent();
 await page.waitForTimeout(1050);expect(await hero.locator('.plane.active text').textContent()).toBe(selected);
 await hero.getByRole('button',{name:'Resume loop'}).click();await page.emulateMedia({reducedMotion:'reduce'});
 await expect(hero.getByRole('button',{name:/Resume loop|Replay loop/})).toBeDisabled();const reducedStage=await hero.locator('.plane.active text').textContent();
 await page.waitForTimeout(1050);expect(await hero.locator('.plane.active text').textContent()).toBe(reducedStage);
 expect(await hero.locator('.plane-trace').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');await expect(hero.locator('.return-signal')).toHaveCount(0);
});

test('diagram selection supports keyboard and animated signal state',async({page})=>{
 await page.goto('/');const hero=page.locator('[data-widget=cutaway]');
 const predict=hero.getByRole('button',{name:'Select Predict stage'});await predict.focus();await predict.press('Enter');
 await expect(predict).toHaveAttribute('aria-pressed','true');await expect(hero.locator('.plane.active text')).toHaveText('Predict');
 await expect(hero.locator('.signal-head')).toHaveAttribute('style',/translateY\(-252px\)/);
 await hero.getByRole('button',{name:'Reset',exact:true}).click();await expect(hero.locator('.signal-head')).toHaveCount(0);
 await page.emulateMedia({reducedMotion:'reduce'});await predict.click();
 expect(await hero.locator('.signal-head').evaluate(e=>getComputedStyle(e).transitionDuration)).toBe('0s');
});

test('figure inspection supports zoom, navigation, escape and focus return',async({page})=>{
 await page.goto('/evidence/');const link=page.locator('a[data-figure-title]').first();await link.click();
 const viewer=page.getByRole('dialog');await expect(viewer).toBeVisible();await expect(viewer.getByRole('heading')).toContainText('Expected and detected range');
 await viewer.getByRole('button',{name:'Zoom in'}).click();await expect(viewer.locator('img')).toHaveAttribute('style',/scale\(1.5\)/);
 await viewer.getByRole('button',{name:'Next figure'}).click();await expect(viewer.getByRole('heading')).toContainText('Expected and detected velocity');
 await expect(viewer.locator('img')).toHaveAttribute('style',/scale\(1\)/);
 await expect(viewer.getByRole('link',{name:'Inspect pinned source'})).toHaveAttribute('href',/github.com.*9b985ca7/);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await page.keyboard.press('Escape');await expect(viewer).not.toBeVisible();await expect(link).toBeFocused();
 await expect.poll(()=>page.evaluate(()=>document.documentElement.classList.contains('inspecting-figure'))).toBe(false);
});

test('reduced motion leaves inspection usable and disables timed effects',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.setViewportSize({width:390,height:844});await page.goto('/evidence/');
 await page.locator('a[data-figure-title]').first().click();const viewer=page.getByRole('dialog');await expect(viewer).toBeVisible();
 expect(await viewer.evaluate(e=>getComputedStyle(e).animationName)).toBe('none');await viewer.getByRole('button',{name:'Zoom in'}).click();
 await expect(viewer.locator('img')).toHaveAttribute('style',/scale\(1.5\)/);await viewer.getByRole('button',{name:'Close figure'}).click();await expect(viewer).not.toBeVisible();
});
