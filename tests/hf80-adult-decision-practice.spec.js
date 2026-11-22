'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../labs/hf80-interactive-adult-practice-offline.html'),'utf8');
// Runs in isolated in-memory page; no real user, model, avatar or provider.
test('HF80 adult bilingual interactive practice is explicit, ephemeral and keyboard accessible',async({page})=>{
 const requests=[],errors=[];
 page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.setContent(html,{waitUntil:'load'});
 await expect(page.getByText('Avatar not connected')).toBeVisible();
 await expect(page.locator('#practice-panel')).toBeHidden();
 await page.locator('#next').click();await page.locator('#next').click();
 await expect(page.locator('#practice-panel')).toBeVisible();
 await expect(page.locator('#practice-counter')).toContainText('1 of 2');
 await expect(page.locator('#practice-feedback')).toBeHidden();
 // No selection: safe non-reveal of answer, feedback stays hidden.
 await page.locator('#practice-check').click();await expect(page.locator('#practice-feedback')).toBeHidden();
 await page.locator('#practice-options input[value="1"]').check();await page.locator('#practice-check').click();
 await expect(page.locator('#practice-feedback')).toBeVisible();
 await expect(page.locator('#practice-feedback')).toContainText('English model:');
 await expect(page.locator('#practice-feedback p[lang="ko-KR"]')).toContainText('계약');
 await expect(page.locator('#practice-check')).toBeDisabled();
 await page.locator('#practice-next').click();
 await expect(page.locator('#practice-feedback')).toBeHidden();
 await expect(page.locator('#practice-counter')).toContainText('2 of 2');
 await page.locator('#practice-reveal').click();await expect(page.locator('#practice-feedback')).toContainText('intentionally revealed');
 await page.locator('#locale').selectOption('th-TH');await expect(page.locator('#practice-panel')).toBeHidden();
 await page.locator('#next').click();await page.locator('#next').click();await page.locator('#practice-reveal').click();
 await expect(page.locator('#practice-feedback p[lang="th-TH"]')).toBeVisible();
 await page.locator('#stop').click();await expect(page.locator('#practice-panel')).toBeHidden();
 await page.locator('#reset').click();await expect(page.locator('#practice-feedback')).toBeHidden();
 expect(errors).toEqual([]);expect(requests).toEqual([]);
 const metrics=await page.evaluate(()=>({screen:innerWidth,body:document.documentElement.scrollWidth}));
 expect(metrics.body).toBeLessThanOrEqual(metrics.screen+2);
});
