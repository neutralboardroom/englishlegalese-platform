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
 test(`HF105 file:// ${track} case ${index+1}: print paper pair worksheet with privacy and opt-in key`,async({page})=>{
  const network=[];page.on('request',r=>{if(!r.url().startsWith('file://'))network.push(r.url())});
  await page.goto(url);await page.locator('#subject').selectOption(track);await page.locator('#case').selectOption(String(index));
  await expect(page.locator('#hf105-sheet')).toBeHidden();
  await expect(page.locator('#hf105-key-toggle')).not.toBeChecked();
  await page.locator('#hf105-preview').click();
  await expect(page.locator('#hf105-sheet')).toBeVisible();await expect(page.locator('#hf105-key')).toBeHidden();
  for(const id of ['hf105-sheet-a1','hf105-sheet-a2','hf105-sheet-a4','hf105-sheet-a5'])await expect(page.locator('#'+id+' li')).toHaveCount(3);
  await expect(page.locator('#hf105-sheet-role-a')).not.toBeEmpty();
  await page.locator('#hf105-key-toggle').check();await expect(page.locator('#hf105-key')).toBeVisible();
  await expect(page.locator('#hf105-key-m5')).not.toBeEmpty();
  await page.locator('#hf105-key-toggle').uncheck();await expect(page.locator('#hf105-key')).toBeHidden();
  await page.locator('#start').click();await page.locator('#answers button').nth(first[track][index]).click();
  await page.locator('#questions button').nth(second[track][index]).click();await page.locator('#reveal').click();
  await page.locator('#change-options button').nth(changed[track][index]).click();await page.locator('#change-reveal').click();
  await page.locator('#evidence-options button').nth(evidence[track][index]).click();
  await page.locator('#draft').fill('secret private draft must not print');
  await page.locator('#change-draft').fill('secret changed facts must not print');
  await page.locator('#evidence-draft').fill('secret evidence must not print');
  await page.locator('#hf105-preview').click();
  const paper=await page.locator('#hf105-sheet').innerText();
  expect(paper).not.toContain('secret private draft');expect(paper).not.toContain('secret changed facts');expect(paper).not.toContain('secret evidence');
  await page.emulateMedia({media:'print'});await expect(page.locator('#hf105-sheet')).toBeVisible();
  await expect(page.locator('#hf105-key')).toBeHidden();
  await page.emulateMedia({media:'screen'});
  await page.locator('#case').selectOption(String((index+1)%3));await expect(page.locator('#hf105-sheet')).toBeHidden();await expect(page.locator('#hf105-key-toggle')).not.toBeChecked();
  expect(network).toEqual([]);
 });
}
test('HF105 print user gesture and paper-only print CSS; no learner draft exported',async({page})=>{
 await page.goto(url);await page.evaluate(()=>{window.__paperCalls=0;window.print=()=>{window.__paperCalls++}});
 await page.locator('#hf105-print').click();expect(await page.evaluate(()=>window.__paperCalls)).toBe(1);
 await page.locator('#hf105-key-toggle').check();await page.locator('#hf105-print').click();expect(await page.evaluate(()=>window.__paperCalls)).toBe(2);
 await expect(page.locator('#hf105-key')).toBeVisible();
 await page.locator('#hf105-close').click();await expect(page.locator('#hf105-sheet')).toBeHidden();await expect(page.locator('#hf105-key-toggle')).not.toBeChecked();
});
