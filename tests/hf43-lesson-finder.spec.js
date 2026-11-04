'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF43 searchable 24-lesson finder with safe reset: '+path,async({page},info)=>{
 const writes=[];page.on('request',request=>{if(['POST','PUT','PATCH','DELETE'].includes(request.method()))writes.push(request.url());});
 await page.goto(path);
 await expect(page.locator('article.v1971-lesson')).toHaveCount(12);
 const panel=page.locator('.v2050-finder');
 await expect(panel).toHaveCount(1);
 await panel.locator('summary').click();
 await expect(panel.locator('.v2050-results li')).toHaveCount(24);
 const search=panel.locator('input[type=search]');
 await search.fill('negotiation');
 const count=await panel.locator('.v2050-results li').count();
 expect(count).toBeGreaterThan(0);expect(count).toBeLessThan(24);
 await panel.locator('select').selectOption('Legal English');
 await expect(panel.locator('.v2050-results-count')).toContainText('of 24 lessons found');
 await panel.getByRole('button',{name:'Clear search and subject'}).click();
 await expect(panel.locator('.v2050-results li')).toHaveCount(24);
 await expect(page.locator('article.v1971-lesson')).toHaveCount(12);
 await expect(panel.locator('.v2050-results a').first()).toHaveAttribute('href',/\/learn\/continuing-practice\/#practice-lesson-1$/);
 expect(writes).toEqual([]);
 const viewport=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 expect(viewport[0]).toBeLessThanOrEqual(viewport[1]+2);
 await page.screenshot({path:info.outputPath('hf43-finder.png'),fullPage:false});
 });
}
