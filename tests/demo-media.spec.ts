import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {DASHBOARD_URL,RECORDING} from '../src/lib/demo';

test('recording loads only on request, closes with focus return and stops offscreen',async({page})=>{
 const requests:string[]=[];
 await page.route('https://drive.google.com/**',route=>{requests.push(route.request().url());return route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="en"><title>Recording test</title><body><p>External player stand-in</p></body></html>'})});
 await page.goto('/');await page.locator('#demo').scrollIntoViewIfNeeded();
 expect(requests).toEqual([]);await expect(page.locator('.recording-frame iframe')).toHaveCount(0);
 const launch=page.getByRole('link',{name:/Watch the walkthrough/});await launch.focus();await launch.press('Enter');
 const player=page.getByTitle('AVOLITE dashboard prototype recording');await expect(player).toHaveAttribute('src',RECORDING.preview);
 await expect.poll(()=>requests.length).toBe(1);
 await page.getByRole('button',{name:'Close recording'}).click();await expect(player).toHaveCount(0);await expect(launch).toBeFocused();
 await launch.click();await expect(player).toHaveCount(1);await page.locator('#why').scrollIntoViewIfNeeded();await expect(player).toHaveCount(0);
});

test('prototype captures keep source context and scene bookmarks',async({page})=>{
 await page.goto('/');await page.locator('#demo').scrollIntoViewIfNeeded();
 await expect(page.locator('#demo .scope-banner')).toContainText('do not validate');
 await expect(page.getByRole('link',{name:'Explore the dashboard',exact:true})).toHaveAttribute('href',DASHBOARD_URL);
 await expect(page.locator('.recording-scenes a').nth(1)).toHaveAttribute('href',RECORDING.view+'?t=90');
 await page.getByText('Inspect unknown signals',{exact:true}).click();const figure=page.locator('.dashboard-capture').last();
 await expect(figure).toContainText('Interface values are illustrative');await expect(figure.locator('img')).toBeVisible();
 await figure.locator('img').scrollIntoViewIfNeeded();
 await expect.poll(()=>figure.locator('img').evaluate(img=>({filter:getComputedStyle(img).filter,opacity:getComputedStyle(img).opacity,loaded:(img as HTMLImageElement).naturalWidth>0})),{timeout:10000}).toEqual({filter:'none',opacity:'1',loaded:true});
 expect((await page.request.get((await figure.locator('.dashboard-plate').getAttribute('href'))!)).ok()).toBe(true);
});

test('phone media remains accessible with reduced motion and player fallback',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.route('https://drive.google.com/**',route=>route.abort());await page.goto('/');await page.locator('#demo').scrollIntoViewIfNeeded();
 await page.getByRole('link',{name:/Watch the walkthrough/}).click();await expect(page.getByRole('link',{name:'Open recording in Drive',exact:true})).toHaveAttribute('href',RECORDING.view);
 await expect(page.getByRole('button',{name:'Close recording'})).toBeVisible();await page.getByRole('button',{name:'Close recording'}).click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
});

test('recording and dashboard source links work without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();await page.goto('/');
 await expect(page.getByRole('link',{name:/Watch the walkthrough/})).toHaveAttribute('href',RECORDING.view);
 await expect(page.getByRole('link',{name:'Explore the dashboard',exact:true})).toHaveAttribute('href',DASHBOARD_URL);
 await expect(page.locator('.recording-frame iframe')).toHaveCount(0);await context.close();
});
