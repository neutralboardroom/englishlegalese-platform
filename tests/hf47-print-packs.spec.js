'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF47 privacy-safe student and teacher print-preview modes: '+path,async({page},info)=>{
  const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
  await page.goto(path);
  const cards=page.locator('article.v1971-lesson');
  await expect(cards).toHaveCount(12);
  await expect(page.locator('.v2090-actions')).toHaveCount(12);
  await cards.first().locator('textarea').fill('PRIVATE FICTITIOUS STUDENT DRAFT NEVER PRINT 749182');
  await page.evaluate(()=>{window.print=()=>{};});
  await cards.first().getByRole('button',{name:'Preview student worksheet'}).click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Student practice worksheet');
  await expect(dialog).not.toContainText('PRIVATE FICTITIOUS STUDENT DRAFT NEVER PRINT');
  await expect(dialog).not.toContainText('Instructor-only answer key');
  await expect(dialog.locator('.v2090-writing-line')).toHaveCount(3);
  await page.emulateMedia({media:'print'});
  await expect(dialog).toBeVisible();
  await page.screenshot({path:info.outputPath('hf47-student-print-view.png'),fullPage:false});
  await page.emulateMedia({media:'screen'});
  await dialog.getByRole('button',{name:'Close preview'}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await cards.first().getByRole('button',{name:'Preview teacher notes'}).click();
  const teacher=page.getByRole('dialog');
  await expect(teacher).toContainText('Instructor-only answer key');
  await expect(teacher).not.toContainText('PRIVATE FICTITIOUS STUDENT DRAFT NEVER PRINT');
  await expect(teacher.locator('.v2090-lines')).toHaveCount(6);
  await teacher.getByRole('button',{name:'Close preview'}).click();
  expect(writes).toEqual([]);
  const widths=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
  expect(widths[0]).toBeLessThanOrEqual(widths[1]+2);
 });
}
