'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../labs/hf81-adult-conversation-coach-offline.html'),'utf8');
test('HF81 12-turn adult dialogue rehearsal: correct, wrong, reveal, next, privacy and reset',async({page})=>{
 const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.setContent(html,{waitUntil:'load'});
 await expect(page.getByText('Avatar not connected')).toBeVisible();
 await expect(page.locator('#dialogue-panel')).toBeHidden();
 for(let i=0;i<3;i++)await page.locator('#next').click();
 await expect(page.locator('#dialogue-panel')).toBeVisible();
 await expect(page.locator('#dialogue-count')).toContainText('1 of 3');
 await expect(page.locator('#dialogue-feedback')).toBeHidden();
 // No selection: do not show correct answer.
 await page.locator('#dialogue-check').click();await expect(page.locator('#dialogue-feedback')).toBeHidden();
 // Deliberate wrong response remains unrevealed and allows another attempt.
 await page.locator('#dialogue-options input[value="1"]').check();await page.locator('#dialogue-check').click();
 await expect(page.locator('#dialogue-feedback')).toContainText('not the strongest scripted response');
 await expect(page.locator('#dialogue-feedback')).not.toContainText('English model:');
 await expect(page.locator('#dialogue-check')).toBeEnabled();
 await page.locator('#dialogue-options input[value="0"]').check();await page.locator('#dialogue-check').click();
 await expect(page.locator('#dialogue-feedback')).toContainText('English model:');
 await expect(page.locator('#dialogue-feedback p[lang="ko-KR"]')).toBeVisible();
 await expect(page.locator('#dialogue-check')).toBeDisabled();
 await page.locator('#dialogue-next').click();await expect(page.locator('#dialogue-count')).toContainText('2 of 3');
 await expect(page.locator('#dialogue-feedback')).toBeHidden();
 await page.locator('#dialogue-reveal').click();await expect(page.locator('#dialogue-feedback')).toContainText('deliberately revealed');
 await page.locator('#dialogue-scene').selectOption('1');await expect(page.locator('#dialogue-count')).toContainText('1 of 3');
 await page.locator('#locale').selectOption('th-TH');await expect(page.locator('#dialogue-panel')).toBeHidden();
 for(let i=0;i<3;i++)await page.locator('#next').click();await expect(page.locator('#dialogue-panel')).toBeVisible();
 await expect(page.locator('#dialogue-direction-native')).toHaveAttribute('lang','th-TH');
 await page.locator('#dialogue-reveal').click();await expect(page.locator('#dialogue-feedback p[lang="th-TH"]')).toBeVisible();
 await page.locator('#track').selectOption('business-english');await expect(page.locator('#dialogue-panel')).toBeHidden();
 for(let i=0;i<3;i++)await page.locator('#next').click();await expect(page.locator('#dialogue-prompt')).toContainText('manager');
 await page.locator('#stop').click();await expect(page.locator('#dialogue-panel')).toBeHidden();
 await page.locator('#reset').click();await expect(page.locator('#dialogue-feedback')).toBeHidden();
 expect(requests).toEqual([]);expect(errors).toEqual([]);
 const dimensions=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport+2);
});
