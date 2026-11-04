'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF48 four-week practice path with 24 distinct curriculum links: '+path,async({page},info)=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.goto(path);
 await expect(page.locator('article.v1971-lesson')).toHaveCount(12);
 const panel=page.locator('.v2100-path');
 await expect(panel).toHaveCount(1);
 await panel.locator('summary').first().click();
 await expect(panel.locator('.v2100-week')).toHaveCount(4);
 await expect(panel.locator('.v2100-links li')).toHaveCount(12);
 await expect(panel.locator('.v2100-week h3').first()).toContainText('Week 1');
 const links1=await panel.locator('.v2100-links a').allTextContents();
 await panel.getByLabel('Practice-path subject').selectOption('Business and Investor English');
 await expect(panel.locator('.v2100-week')).toHaveCount(4);
 const links2=await panel.locator('.v2100-links a').allTextContents();
 expect(links2.join('|')).not.toBe(links1.join('|'));
 await panel.getByLabel('Practice-path approach').selectOption('teacher');
 await expect(panel.locator('.v2100-mode').first()).toContainText('Teacher approach');
 await expect(page.locator('article.v1971-lesson')).toHaveCount(12);
 expect(writes).toEqual([]);
 const dims=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 expect(dims[0]).toBeLessThanOrEqual(dims[1]+2);
 await page.screenshot({path:info.outputPath('hf48-four-week-guided-path.png'),fullPage:false});
 });
}
