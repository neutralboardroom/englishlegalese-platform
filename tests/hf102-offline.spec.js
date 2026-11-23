'use strict';
const {test,expect}=require('@playwright/test');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const file=pathToFileURL(path.resolve(__dirname,'../learn/offline-practice/index.html')).href;
test.use({reducedMotion:'reduce'});
const answers={legal:[1,1,0],business:[1,1,2]},clarifications={legal:[0,1,0],business:[1,2,0]};
for(const track of ['legal','business'])for(let n=0;n<3;n++){
 test(`HF102 offline file protocol ${track} lesson ${n+1}: fully independent comprehension, clarification and no-store writing`,async({page})=>{
  const external=[];page.on('request',r=>{if(!r.url().startsWith('file:'))external.push(r.method()+' '+r.url());});
  await page.goto(file);await expect(page.locator('#lab')).toBeHidden();
  await page.locator('#subject').selectOption(track);await page.locator('#case').selectOption(String(n));await page.locator('#start').click();
  await expect(page.locator('#lab')).toBeVisible();await expect(page.locator('#clarify')).toBeHidden();
  await page.locator('#answers button').nth((answers[track][n]+1)%3).click();await expect(page.locator('#clarify')).toBeHidden();
  await page.locator('#answers button').nth(answers[track][n]).click();await expect(page.locator('#clarify')).toBeVisible();await expect(page.locator('#write')).toBeHidden();
  await page.locator('#questions button').nth((clarifications[track][n]+1)%3).click();await expect(page.locator('#write')).toBeHidden();
  await page.locator('#questions button').nth(clarifications[track][n]).click();await expect(page.locator('#write')).toBeVisible();
  await page.locator('#draft').fill('A fictional training sentence that must be cleared on restart.');
  await page.locator('#self-check').click();await expect(page.locator('#review')).toBeVisible();
  await page.locator('#reveal').click();await expect(page.locator('#model-body')).not.toBeEmpty();
  await page.locator('#clear-writing').click();await expect(page.locator('#draft')).toHaveValue('');
  await page.locator('#draft').fill('Must not survive switching cases');await page.locator('#case').selectOption(String((n+1)%3));
  await expect(page.locator('#draft')).toHaveValue('');await expect(page.locator('#lab')).toBeHidden();
  expect(external).toEqual([]);
 });
}
test('HF102 offline pack: accessible explicit save link and pagehide erasure of optional writing',async({page})=>{
 await page.goto(file);await expect(page.locator('header h1')).toContainText('without an internet connection');
 await page.locator('#start').click();await page.locator('#answers button').nth(1).click();await page.locator('#questions button').nth(0).click();
 await page.locator('#draft').fill('Sensitive fictional draft');await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#draft')).toHaveValue('');await expect(page.locator('#lab')).toBeHidden();
});
test('HF102 web-app surface exposes a saveable single-file HTML page without enabling private offline account data',async({page})=>{
 await page.goto('/learn/app/');await expect(page.getByRole('link',{name:'save the single-file offline exercise'})).toHaveAttribute('download','EnglishLegalese_Offline_Pocket_Lab_HF102.html');
 await page.goto('/learn/offline-practice/index.html');await expect(page.locator('header h1')).toContainText('without an internet connection');
});
