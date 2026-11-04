'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF45 teacher bank: 3 unique followups with hidden sample responses: '+path,async({page},info)=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.goto(path);await expect(page.locator('article.v1971-lesson')).toHaveCount(12);
 await expect(page.locator('details.v2070-questions')).toHaveCount(12);
 const panel=page.locator('article.v1971-lesson').first().locator('.v2070-questions');
 await panel.locator('summary').first().click();
 await expect(panel.locator('.v2070-list>li')).toHaveCount(3);
 await expect(panel.locator('.v2070-answer p').first()).toBeHidden();
 await panel.locator('.v2070-answer summary').first().click();
 await expect(panel.locator('.v2070-answer p').first()).toBeVisible();
 expect(writes).toEqual([]);
 const dims=await page.evaluate(()=>({w:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(dims.w).toBeLessThanOrEqual(dims.viewport+2);
 await page.screenshot({path:info.outputPath('hf45-teacher-question-bank.png'),fullPage:false});
 });
}
