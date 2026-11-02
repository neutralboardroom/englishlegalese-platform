'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF39: private lesson-specific writing review with revision reset: '+path,async({page},info)=>{
  const writes=[];
  page.on('request',req=>{if(['POST','PUT','PATCH','DELETE'].includes(req.method()))writes.push(req.url());});
  await page.goto(path);
  const cards=page.locator('article.v1971-lesson');
  await expect(cards).toHaveCount(12);
  await expect(page.locator('.v2010-review')).toHaveCount(12);
  await expect(page.locator('.v2000-draft-tools')).toHaveCount(12);
  await expect(page.locator('.v1990-speaking')).toHaveCount(12);
  const first=cards.first(),second=cards.nth(1);
  await expect(first.locator('.v2010-word-counter')).toContainText('0 words · 0 of');
  await first.locator('textarea').fill('The client reports a delay. We will verify the schedule.');
  await expect(first.locator('.v2010-word-counter')).toContainText('10 words');
  const panel=first.locator('details.v2010-panel');
  await panel.locator('summary').click();
  await expect(panel.locator('input[type=checkbox]')).toHaveCount(3);
  await expect(panel.locator('.v2010-challenge')).toContainText('unconfirmed');
  await panel.locator('input[type=checkbox]').first().check();
  await expect(panel.locator('.v2010-review-status')).toContainText('1 of 3');
  await first.locator('textarea').fill('We will verify the schedule before advising.');
  await expect(panel.locator('input[type=checkbox]').first()).not.toBeChecked();
  await expect(panel.locator('.v2010-review-status')).toContainText('draft changed');
  await expect(second.locator('.v2010-word-counter')).toContainText('0 words');
  const secondTitle=await second.locator('h3').innerText();
  await second.locator('details.v2010-panel summary').click();
  await expect(second.locator('.v2010-check-label')).toHaveCount(3);
  const secondCopy=(await second.locator('.v2010-check-label').allTextContents()).join(' ');
  expect(secondCopy).not.toContain('Attribute the client');
  expect(secondTitle.length).toBeGreaterThan(10);
  expect(writes).toEqual([]);
  const dim=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
  expect(dim.scroll).toBeLessThanOrEqual(dim.w+2);
  await page.screenshot({path:info.outputPath('hf39-review-expanded.png'),fullPage:false});
 });
}
