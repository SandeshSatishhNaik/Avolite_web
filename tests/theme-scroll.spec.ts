import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for(const width of [1440,768])test(`system trace connects stage centers at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.evaluate(()=>document.fonts.ready);
 const offsets=await page.locator('.system-canvas').evaluate(canvas=>[...canvas.querySelectorAll<SVGCircleElement>('.canvas-port')].map((port,i)=>{
  const point=new DOMPoint(port.cx.baseVal.value,port.cy.baseVal.value).matrixTransform(port.ownerSVGElement!.getScreenCTM()!);
  const row=canvas.querySelectorAll('.stage-index li')[i].getBoundingClientRect();return Math.abs(point.y-row.top-row.height/2);
 }));
 expect(offsets).toHaveLength(7);offsets.forEach(offset=>expect(offset).toBeLessThan(1));
});

for(const width of [1440,390])test(`theme choice persists across pages at ${width}`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:width<768?'reduce':'no-preference'});await page.goto('/');
 await expect(page.locator('html')).toHaveAttribute('data-theme','pearl');
 if(width<768)await page.locator('#menu>summary').click();
 await page.getByRole('button',{name:'Switch to plum theme'}).filter({visible:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','plum');
 await page.goto('/evidence/');await expect(page.locator('html')).toHaveAttribute('data-theme','plum');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','plum');
 if(width<768)await page.locator('#menu>summary').click();
 await page.getByRole('button',{name:'Switch to light theme'}).filter({visible:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','pearl');
 await page.goto('/system/');await expect(page.locator('html')).toHaveAttribute('data-theme','pearl');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('theme switch still works when preference storage is unavailable',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage unavailable','SecurityError')}})});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');
 await page.getByRole('button',{name:'Switch to plum theme'}).filter({visible:true}).click();
 await expect(page.locator('html')).toHaveAttribute('data-theme','plum');
 await page.getByRole('button',{name:'Switch to light theme'}).filter({visible:true}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','pearl');
});

test('scroll changes schematic position while preserving issued measurements',async({page})=>{
 await page.setViewportSize({width:1440,height:900});await page.goto('/');
 await page.locator('#problem').scrollIntoViewIfNeeded();await page.waitForTimeout(750);
 const marker=()=>page.locator('.schedule').first().evaluate(node=>getComputedStyle(node,'::after').transform);
 const before=await marker();await page.evaluate(()=>scrollBy({top:230,behavior:'instant'}));
 await expect.poll(marker).not.toBe(before);
 await page.locator('#how').scrollIntoViewIfNeeded();await page.waitForTimeout(750);
 const spine=()=>page.locator('.scroll-spine').evaluate(node=>getComputedStyle(node).strokeDashoffset);
 const old=await spine();await page.evaluate(()=>scrollBy({top:200,behavior:'instant'}));await expect.poll(spine).not.toBe(old);
 const values=await page.locator('#built data').allTextContents();await page.locator('#built').scrollIntoViewIfNeeded();await page.waitForTimeout(750);
 expect(await page.locator('#built data').allTextContents()).toEqual(values);
 const img=page.locator('#built .plate img').first();expect(await img.evaluate(node=>({opacity:getComputedStyle(node).opacity,filter:getComputedStyle(node).filter}))).toEqual({opacity:'1',filter:'none'});
});

test('reduced motion removes scroll movement and leaves chapters readable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.locator('#problem').scrollIntoViewIfNeeded();
 expect(await page.locator('.schedule').first().evaluate(node=>getComputedStyle(node,'::after').transform)).toBe('none');
 expect(await page.locator('#problem-h').evaluate(node=>node.getAnimations().length)).toBe(0);
 await page.locator('#roadmap').scrollIntoViewIfNeeded();expect(await page.locator('.milestones').evaluate(node=>getComputedStyle(node,'::before').transform)).toBe('none');
 await expect(page.locator('#roadmap-h')).toBeVisible();await page.locator('#roadmap summary').first().click();await expect(page.locator('#roadmap details').first()).toHaveAttribute('open','');
});

test('plum theme retains accessible contrast and navigation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await page.getByRole('button',{name:'Switch to plum theme'}).filter({visible:true}).click();
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
});
