'use strict';
const {test,expect}=require('@playwright/test');
test.use({serviceWorkers:'block',reducedMotion:'reduce'});
for(const route of ['/learn/legal-english/','/learn/business-english/']){
 test('HF119 mobile navigation and complete privacy notice '+route,async({page})=>{
  await page.setViewportSize({width:390,height:844});
  const writes=[];
  await page.route('**/*',r=>{const q=r.request(),u=new URL(q.url());if(u.origin==='http://127.0.0.1:4173'&&['GET','HEAD'].includes(q.method()))return r.continue();if(['data:','blob:','about:'].includes(u.protocol))return r.continue();if(!['GET','HEAD'].includes(q.method()))writes.push(u.origin);return r.abort();});
  await page.goto(route);
  const nav=page.locator('.v1840-header .v1840-topnav'),header=page.locator('.v1840-header'),notice=page.locator('.v1940-account');
  await expect(nav).toBeVisible();await expect(notice).toBeVisible();
  await expect(nav.locator(':scope > a')).toHaveCount(7);
  await expect(nav.locator(':scope > details')).toHaveCount(2);
  for(const link of await nav.locator(':scope > a, :scope > details > summary').all()){
   await expect(link).toBeVisible();expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  expect(await nav.evaluate(e=>getComputedStyle(e).display)).toBe('grid');
  expect((await header.boundingBox()).height).toBeLessThan(300);
  await expect(notice).toContainText('only after the server confirms it');
  await expect(notice).toContainText('NOT backed up to your account');
  await expect(notice).toContainText('do not enter confidential client details');
  await expect(notice.locator('.v1940-global-status')).toBeVisible();
  const resource=nav.locator(':scope > details').first();
  await resource.locator('summary').click();
  await expect(resource).toHaveJSProperty('open',true);
  await expect(resource.getByRole('link',{name:'Free Professional Conversation Rehearsal'})).toBeVisible();
  await resource.locator('summary').click();
  await expect(resource).toHaveJSProperty('open',false);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(4);
  expect(writes).toEqual([]);
 });
}
test('HF119 mobile learning logo retains approved asset on light surface',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/learn/app/');
 const logo=page.locator('.site-head>a:first-child img'),link=page.locator('.site-head>a:first-child');
 await expect(logo).toBeVisible();
 await expect(logo).toHaveAttribute('src','/assets/englishlegalese-logo.png');
 await expect(logo).toHaveAttribute('alt','EnglishLegalese.com');
 expect(await link.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(255, 255, 255)');
 expect((await link.boundingBox()).height).toBeGreaterThanOrEqual(44);
 await expect(page.locator('.catalog-nav>summary')).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(4);
});
