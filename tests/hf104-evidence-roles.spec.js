'use strict';
const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const url=pathToFileURL(path.resolve(__dirname,'../assets/EnglishLegalese_Offline_Pocket_Lab_HF102.html')).href;
const first={legal:[1,1,0],business:[1,1,2]};
const second={legal:[0,1,0],business:[1,2,0]};
const changed={legal:[1,2,0],business:[1,2,0]};
const evidence={legal:[1,2,0],business:[1,0,2]};
test.use({reducedMotion:'reduce'});
for(const track of ['legal','business'])for(let index=0;index<3;index++){
 test(`HF104 offline ${track} case ${index+1}: optional evidence + two speaking roles stay source-bound`,async({page})=>{
  const outbound=[];page.on('request',r=>{if(!r.url().startsWith('file:'))outbound.push(r.url());});
  await page.goto(url);
  await page.locator('#subject').selectOption(track);await page.locator('#case').selectOption(String(index));await page.locator('#start').click();
  await expect(page.locator('#evidence')).toBeHidden();
  await page.locator('#answers button').nth(first[track][index]).click();
  await page.locator('#questions button').nth(second[track][index]).click();
  await page.locator('#reveal').click();
  await expect(page.locator('#evidence')).toBeHidden();
  await page.locator('#change-options button').nth(changed[track][index]).click();
  await expect(page.locator('#end-actions')).toBeVisible(); // prior HF103 navigation remains available
  await expect(page.locator('#evidence')).toBeHidden();
  await page.locator('#change-reveal').click();
  await expect(page.locator('#evidence')).toBeVisible();
  await expect(page.locator('#stage-5')).toHaveAttribute('aria-current','step');
  await expect(page.locator('#evidence-practice')).toBeHidden();
  const right=evidence[track][index];
  await page.locator('#evidence-options button').nth((right+1)%3).click();
  await expect(page.locator('#evidence-practice')).toBeHidden();
  await page.locator('#evidence-options button').nth(right).click();
  await expect(page.locator('#evidence-practice')).toBeVisible();
  await expect(page.locator('#evidence-role-a')).not.toBeEmpty();await expect(page.locator('#evidence-role-b')).not.toBeEmpty();
  await page.locator('#evidence-draft').fill('Fictional evidence rationale that must not persist.');
  await page.locator('#evidence-review').click();await expect(page.locator('#evidence-checklist')).toBeVisible();
  await page.locator('#evidence-reveal').click();await expect(page.locator('#evidence-example')).not.toBeEmpty();
  await page.locator('#evidence-clear').click();await expect(page.locator('#evidence-draft')).toHaveValue('');await expect(page.locator('#evidence-example')).toBeHidden();
  await page.locator('#evidence-draft').fill('Forget me when changing cases');
  await page.locator('#case').selectOption(String((index+1)%3));
  await expect(page.locator('#lab')).toBeHidden();await expect(page.locator('#evidence-draft')).toHaveValue('');
  expect(outbound).toEqual([]);
 });
}
test('HF104 private evidence writing clears on pagehide and Stage 5 resets when prior comparison clears',async({page})=>{
 await page.goto(url);await page.locator('#start').click();
 await page.locator('#answers button').nth(1).click();await page.locator('#questions button').nth(0).click();await page.locator('#reveal').click();
 await page.locator('#change-options button').nth(1).click();await page.locator('#change-reveal').click();
 await expect(page.locator('#evidence')).toBeVisible();
 await page.locator('#evidence-options button').nth(1).click();await page.locator('#evidence-draft').fill('No persisted private work');
 await page.locator('#change-clear').click();
 await expect(page.locator('#evidence')).toBeHidden();await expect(page.locator('#evidence-draft')).toHaveValue('');
 await page.locator('#change-reveal').click();await page.locator('#evidence-options button').nth(1).click();
 await page.locator('#evidence-draft').fill('Clear on navigation');
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#evidence-draft')).toHaveValue('');await expect(page.locator('#lab')).toBeHidden();
});
