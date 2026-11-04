'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF42 fifty-minute teacher facilitation / separate learner slides: '+path,async({page},info)=>{
  const writes=[];page.on('request',req=>{if(['POST','PUT','PATCH','DELETE'].includes(req.method()))writes.push(req.url());});
  await page.goto(path);
  await expect(page.locator('.v2040-teacher')).toHaveCount(12);
  const guide=page.locator('article.v1971-lesson').first().locator('.v2040-teacher');
  await guide.locator('summary').first().click();
  await expect(guide.locator('.v2040-timeline li')).toHaveCount(8);
  await guide.getByRole('button',{name:'Preview student-only projector slides'}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.v2040-progress')).toContainText('1 of 8');
  await dialog.getByRole('button',{name:'Next',exact:true}).click();
  await expect(dialog.locator('.v2040-progress')).toContainText('2 of 8');
  await expect(dialog.locator('.v2040-stage-prompt')).not.toContainText('Teacher model:');
  await page.screenshot({path:info.outputPath('hf42-learner-projector.png'),fullPage:false});
  await dialog.getByRole('button',{name:'Close projector view'}).click();
  await expect(dialog).toHaveCount(0);
  expect(writes).toEqual([]);
  const d=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
  expect(d[0]).toBeLessThanOrEqual(d[1]+2);
  await page.screenshot({path:info.outputPath('hf42-teacher-view.png'),fullPage:false});
 });
}
