'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF44: supported and challenging speaking exercises stay private: '+path,async({page},info)=>{
  const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
  await page.goto(path);const cards=page.locator('article.v1971-lesson');
  await expect(cards).toHaveCount(12);
  await expect(page.locator('details.v2060-differentiation')).toHaveCount(12);
  const p=cards.first().locator('details.v2060-differentiation');
  await p.locator('summary').first().click();
  await expect(p.locator('.v2060-option')).toHaveCount(2);
  await expect(p.locator('.v2060-option h4').first()).toContainText('Supported');
  await expect(p.locator('.v2060-answer p')).toBeHidden();
  await p.locator('.v2060-answer summary').click();
  await expect(p.locator('.v2060-answer p')).toBeVisible();
  expect(writes).toEqual([]);
  const widths=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
  expect(widths[0]).toBeLessThanOrEqual(widths[1]+2);
  await page.screenshot({path:info.outputPath('hf44-differentiation.png'),fullPage:false});
 });
}
