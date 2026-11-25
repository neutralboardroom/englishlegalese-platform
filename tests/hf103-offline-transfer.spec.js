'use strict';
const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const url=pathToFileURL(path.resolve(__dirname,'../assets/EnglishLegalese_Offline_Pocket_Lab_HF102.html')).href;
const first={legal:[1,1,0],business:[1,1,2]};
const second={legal:[0,1,0],business:[1,2,0]};
const changed={legal:[1,2,0],business:[1,2,0]};
test.use({reducedMotion:'reduce'});
for(const track of ['legal','business'])for(let idx=0;idx<3;idx++){
 test(`HF103 standalone saved-file ${track} case ${idx+1}: new facts require a truthful second reply`,async({page})=>{
  const outbound=[];page.on('request',q=>{if(!q.url().startsWith('file:'))outbound.push(q.url());});
  await page.goto(url);await page.locator('#subject').selectOption(track);
  await page.locator('#case').selectOption(String(idx));await page.locator('#start').click();
  await expect(page.locator('#change')).toBeHidden();await expect(page.locator('#end-actions')).toBeHidden();
  await page.locator('#answers button').nth(first[track][idx]).click();
  await page.locator('#questions button').nth(second[track][idx]).click();
  await expect(page.locator('#write')).toBeVisible();await expect(page.locator('#change')).toBeHidden();
  await page.locator('#draft').fill('Fictional private confirmation.');
  await page.locator('#reveal').click();
  await expect(page.locator('#change')).toBeVisible();await expect(page.locator('#change-compose')).toBeHidden();
  await expect(page.locator('#stage-4')).toHaveAttribute('aria-current','step');
  const right=changed[track][idx];await page.locator('#change-options button').nth((right+1)%3).click();
  await expect(page.locator('#change-compose')).toBeHidden();
  await page.locator('#change-options button').nth(right).click();
  await expect(page.locator('#change-compose')).toBeVisible();
  await page.locator('#change-draft').fill('Private changed-fact reply that must be cleared.');
  await page.locator('#change-review').click();await expect(page.locator('#change-checklist')).toBeVisible();
  await page.locator('#change-reveal').click();await expect(page.locator('#change-example')).not.toBeEmpty();
  await expect(page.locator('#end-actions')).toBeVisible();
  await page.locator('#change-clear').click();await expect(page.locator('#change-draft')).toHaveValue('');
  await expect(page.locator('#change-example')).toBeHidden();
  await page.locator('#change-draft').fill('Must disappear on case switch.');
  await page.locator('#case').selectOption(String((idx+1)%3));
  await expect(page.locator('#lab')).toBeHidden();await expect(page.locator('#change-draft')).toHaveValue('');
  expect(outbound).toEqual([]);
 });
}
test('HF103 private revised writing clears on pagehide; no active lesson is retained',async({page})=>{
 await page.goto(url);await page.locator('#start').click();
 await page.locator('#answers button').nth(1).click();await page.locator('#questions button').nth(0).click();
 await page.locator('#reveal').click();await page.locator('#change-options button').nth(1).click();
 await page.locator('#change-draft').fill('Never persist this fictional draft');
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#change-draft')).toHaveValue('');await expect(page.locator('#lab')).toBeHidden();
});
