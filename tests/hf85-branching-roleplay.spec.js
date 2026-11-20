/* HF85 browser: a real authored 3-exchange branching flow, never a model call. */
'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../labs/hf85-branching-professional-roleplay-offline.html'),'utf8');
test('HF85 three stakeholder reactions branch without network or unwanted writing replacement',async({page})=>{
 const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.setContent(html,{waitUntil:'load'});
 await expect(page.getByText('Avatar not connected')).toBeVisible();
 for(let i=0;i<3;i++){await page.locator('#next').focus();await page.keyboard.press('Enter');}
 await page.locator('#writing-workshop > summary').focus();await page.keyboard.press('Enter');await page.locator('#branch-lab > summary').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#branch-counter')).toContainText('1 of 3');
 await expect(page.locator('#branch-outcome')).toBeHidden();
 await expect(page.locator('#branch-next')).toBeDisabled();
 await page.locator('#branch-check').click();await expect(page.locator('#branch-outcome')).toBeHidden();
 await page.locator('#branch-choices input[value="1"]').check();await page.locator('#branch-check').click();
 await expect(page.locator('#branch-outcome')).toContainText('Stakeholder reaction:');
 await expect(page.locator('#branch-outcome p[lang="ko-KR"]')).toHaveCount(3);
 await expect(page.locator('#branch-next')).toBeEnabled();
 await page.locator('#branch-next').click();await expect(page.locator('#branch-counter')).toContainText('2 of 3');
 await expect(page.locator('#branch-previous')).toContainText('That sounds uncertain');
 for(const choice of [0,1]){await page.locator('#branch-choices input[value="'+choice+'"]').check();await page.locator('#branch-check').click();await page.locator('#branch-next').click();}
 await expect(page.locator('#branch-counter')).toContainText('Three exchanges completed');
 await expect(page.locator('#branch-transcript')).toContainText('Your reply');
 await expect(page.locator('#branch-copy')).toBeEnabled();
 await page.locator('#writing-draft').fill('Do not overwrite my first original English draft.');
 await page.locator('#branch-copy').focus();await page.keyboard.press('Enter');await expect(page.locator('#writing-draft')).toHaveValue('Do not overwrite my first original English draft.');
 await expect(page.locator('#branch-copy')).toContainText('Confirm replacing');
 await page.locator('#writing-draft').fill('A newly edited draft must invalidate old confirmation.');
 await expect(page.locator('#branch-copy')).not.toContainText('Confirm replacing');
 await page.locator('#branch-copy').focus();await page.keyboard.press('Enter');await expect(page.locator('#writing-draft')).toHaveValue('A newly edited draft must invalidate old confirmation.');
 await page.locator('#branch-copy').focus();await page.keyboard.press('Enter');await expect(page.locator('#writing-draft')).toHaveValue(/Friday is only a friendly suggestion/);
 await page.locator('#branch-reset').focus();await page.keyboard.press('Enter');await expect(page.locator('#branch-counter')).toContainText('1 of 3');
 await page.locator('#dialogue-scene').selectOption('1');await expect(page.locator('#branch-lab')).not.toHaveAttribute('open','');
 await expect(page.locator('#writing-draft')).toHaveValue('');
 await page.locator('#locale').selectOption('th-TH');for(let i=0;i<3;i++){await page.locator('#next').focus();await page.keyboard.press('Enter');}
 await page.locator('#writing-workshop > summary').focus();await page.keyboard.press('Enter');await page.locator('#branch-lab > summary').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#branch-intro-native')).toHaveAttribute('lang','th-TH');
 await page.locator('#branch-choices input[value="0"]').focus();await page.keyboard.press('Space');await expect(page.locator('#branch-choices input[value="0"]')).toBeChecked();await page.locator('#branch-check').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#branch-outcome p[lang="th-TH"]')).toHaveCount(3);
 await page.locator('#writing-workshop > summary').focus();await page.keyboard.press('Enter');await expect(page.locator('#writing-workshop')).not.toHaveAttribute('open','');
 await page.locator('#stop').focus();await page.keyboard.press('Enter');await expect(page.locator('#writing-draft')).toHaveValue('');await expect(page.locator('#writing-workshop')).toBeHidden();
 expect(requests).toEqual([]);expect(errors).toEqual([]);
 const d=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));expect(d.scroll).toBeLessThanOrEqual(d.viewport+2);
});
