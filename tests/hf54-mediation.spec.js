'use strict';
const {test,expect}=require('@playwright/test');

for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF54: private adult mediation turns preserve collapsed lesson layout on '+path,async({page})=>{
  const writes=[],errors=[],speech=[];
  page.on('request',request=>{
   if(['POST','PUT','PATCH','DELETE'].includes(request.method()))writes.push(request.url());
   if(/tr-clone|teacherroger|recording/i.test(request.url()))speech.push(request.url());
  });
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(path);
  await expect(page.locator('article.v1971-lesson')).toHaveCount(12);
  await expect(page.locator('details.v2150-mediation-turns')).toHaveCount(12);
  await expect(page.locator('details.v2100-more-tools').first()).not.toHaveAttribute('open');
  const initialWidth=await page.evaluate(()=>document.documentElement.scrollWidth);
  const card=page.locator('article.v1971-lesson').first();
  await card.locator('details.v1990-speaking > summary').click();
  await card.locator('details.v2100-more-tools > summary').click();
  await card.locator('details.v2150-mediation-turns > summary').click();
  const module=card.locator('details.v2150-mediation-turns');
  await expect(module.locator('h4')).toHaveText(/Turn 1 of 4/);
  await expect(module).toContainText('No microphone');
  await expect(module.locator('.v2150-model')).not.toHaveAttribute('open');
  const previous=module.getByRole('button',{name:'Previous turn'});
  const next=module.getByRole('button',{name:'Next turn'});
  await expect(previous).toBeDisabled();
  for(let i=2;i<=4;i++){
   await next.click();
   await expect(module.locator('h4')).toContainText('Turn '+i+' of 4');
  }
  await expect(next).toBeDisabled();
  await module.locator('.v2150-model summary').click();
  await expect(module.locator('.v2150-model p')).toHaveCount(2);
  await previous.click();
  await expect(module.locator('h4')).toContainText('Turn 3 of 4');
  const bounds=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
  expect(bounds[0]).toBeLessThanOrEqual(bounds[1]+2);
  expect(initialWidth).toBeLessThanOrEqual(bounds[1]+2);
  expect(writes).toEqual([]);
  expect(speech).toEqual([]);
  expect(errors).toEqual([]);
 });
}
