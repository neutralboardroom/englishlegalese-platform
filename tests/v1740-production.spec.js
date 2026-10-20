const { test, expect } = require('@playwright/test');
const sites=['https://englishlegalese.com','https://www.englishlegalese.com'];
test('v1.74 real apex and www deliver the new private professional message builder',async({page},testInfo)=>{
 for(const site of sites){
   const res=await page.goto(site+'/');
   expect(res?.status()).toBeLessThan(400);
   expect(res.headers()['x-englishlegalese-release']).toBe('1.76.0');
   await page.locator('body.v1590-ready').waitFor();
   await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.76.0');
   await expect(page.locator('#professional-message-builder')).toBeHidden();
   await expect(page.locator('.site-footer a[href="#professional-message-builder"]')).toBeVisible();
   await page.goto(site+'/#professional-message-builder');
   await expect(page.locator('#professional-message-builder')).toBeVisible();
   await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.76.0');
   const section=page.locator('#professional-message-builder');
   await section.locator('#v1740-kind').selectOption('client');
   await section.getByRole('button',{name:'Load a fictional example'}).click();
   await section.getByRole('button',{name:'Build my practice message'}).click();
   await expect(section.locator('.v1740-draft')).toContainText('Confirmed information:');
   await expect(section.locator('.v1740-draft')).toContainText('Still to check:');
   await expect(section.locator('.v1740-draft')).toContainText('Next step:');
   await section.getByRole('button',{name:'Clear everything'}).click();
   await expect(section.locator('.v1740-preview')).toBeHidden();
   await page.screenshot({path:testInfo.outputPath('v1740-'+(site.includes('www')?'www':'apex')+'.png'),fullPage:true,animations:'disabled'});
 }
});
test('v1.74 production never transmits browser-only fictional learner drafts',async({page})=>{
 const requests=[];
 page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))requests.push(r.url());});
 await page.goto('https://englishlegalese.com/#professional-message-builder');
 await expect(page.locator('#professional-message-builder')).toBeVisible();
 await page.locator('#v1740-matter').fill('Fictional case');
 await page.locator('#v1740-confirmed').fill('The fictional report was received.');
 await page.locator('#v1740-next').fill('Request a revised invented schedule.');
 await page.getByRole('button',{name:'Build my practice message'}).click();
 await expect(page.locator('.v1740-preview')).toBeVisible();
 await page.reload();
 await expect(page.locator('#v1740-matter')).toHaveValue('');
 expect(requests).toEqual([]);
});
