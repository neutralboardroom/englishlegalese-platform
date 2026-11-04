'use strict';
const {test,expect}=require('@playwright/test');
for(const route of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF40 paired professional dialogue: '+route,async({page},testInfo)=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.goto(route);const lessons=page.locator('article.v1971-lesson');
 await expect(lessons).toHaveCount(12);
 await expect(page.locator('.v2020-dialogue')).toHaveCount(12);
 const first=lessons.first();await first.locator('.v2020-dialogue>summary').click();
 await expect(first.locator('.v2020-lines li')).toHaveCount(3);
 await expect(first.locator('.v2020-model')).not.toHaveAttribute('open','');
 await first.locator('.v2020-model>summary').click();
 await expect(first.locator('.v2020-model p')).toBeVisible();
 await expect(first.locator('.v2010-review')).toHaveCount(1);
 expect(writes).toEqual([]);
 const dim=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 expect(dim[0]).toBeLessThanOrEqual(dim[1]+2);
 await page.screenshot({path:testInfo.outputPath('hf40-dialogue.png'),fullPage:false});
 });
}
