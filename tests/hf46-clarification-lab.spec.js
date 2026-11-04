'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF46 information-gap clarification practice: '+path,async({page},info)=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.goto(path);await expect(page.locator('article.v1971-lesson')).toHaveCount(12);
 await expect(page.locator('.v2080-clarification')).toHaveCount(12);
 const p=page.locator('article.v1971-lesson').first().locator('.v2080-clarification');
 await p.locator('summary').first().click();
 await expect(p.locator('.v2080-tasks li')).toHaveCount(3);
 await expect(p.locator('.v2080-model p').first()).toBeHidden();
 await p.locator('.v2080-model summary').click();
 await expect(p.locator('.v2080-model p')).toHaveCount(3);
 await expect(p.locator('.v2080-model p').first()).toBeVisible();
 expect(writes).toEqual([]);
 const dims=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 expect(dims[0]).toBeLessThanOrEqual(dims[1]+2);
 await page.screenshot({path:info.outputPath('hf46-clarify.png'),fullPage:false});
 });
}
