/* HF89 standalone adult workshop navigator: genuine keyboard navigation, no data loss. */
'use strict';
const {test,expect}=require('@playwright/test'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.resolve(__dirname,'../labs/hf89-professional-writing-navigator-offline.html'),'utf8');
test('HF89 keyboard-accessible activity selector preserves drafts within a lesson and clears on STOP',async({page})=>{
 const requests=[],errors=[];page.on('request',r=>requests.push(r.url()));page.on('pageerror',e=>errors.push(e.message));
 await page.setContent(html,{waitUntil:'load'});
 await expect(page.getByText('Avatar not connected')).toBeVisible();
 await expect(page.locator('#workshop-navigator')).toBeHidden();
 for(let i=0;i<3;i++){await page.locator('#next').focus();await page.keyboard.press('Enter');}
 await expect(page.locator('#workshop-navigator')).toBeVisible();
 await expect(page.locator('#navigator-activity option')).toHaveCount(7);
 await page.locator('#navigator-activity').selectOption('revision-clinic');
 await page.locator('#navigator-open').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#writing-workshop')).toHaveAttribute('open','');
 await expect(page.locator('#revision-clinic')).toHaveAttribute('open','');
 await page.locator('#revision-draft').fill('A protected learner-authored fictional revision.');
 await page.locator('#writing-draft').fill('Preserve this original professional writing.');
 await page.locator('#navigator-activity').selectOption('minutes-lab');
 await page.locator('#navigator-open').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#revision-clinic')).not.toHaveAttribute('open','');
 await expect(page.locator('#minutes-lab')).toHaveAttribute('open','');
 await expect(page.locator('#revision-draft')).toHaveValue('A protected learner-authored fictional revision.');
 await expect(page.locator('#writing-draft')).toHaveValue('Preserve this original professional writing.');
 await page.locator('#minutes-topic').fill('Private fictional discussion');
 await page.locator('#navigator-activity').selectOption('original');
 await page.locator('#navigator-open').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#minutes-lab')).not.toHaveAttribute('open','');
 await expect(page.locator('#writing-draft')).toHaveValue('Preserve this original professional writing.');
 await page.locator('#dialogue-scene').selectOption('1');
 await expect(page.locator('#writing-draft')).toHaveValue('');
 await expect(page.locator('#revision-draft')).toHaveValue('');
 await expect(page.locator('#minutes-topic')).toHaveValue('');
 await expect(page.locator('#navigator-activity')).toHaveValue('original');
 await page.locator('#locale').selectOption('th-TH');
 for(let i=0;i<3;i++){await page.locator('#next').focus();await page.keyboard.press('Enter');}
 await expect(page.locator('#navigator-intro')).toHaveAttribute('lang','th-TH');
 await page.locator('#navigator-activity').selectOption('followup-lab');
 await page.locator('#navigator-open').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#followup-lab')).toHaveAttribute('open','');
 await page.locator('#followup-subject').fill('Fictional private follow-up');
 await page.locator('#stop').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#followup-subject')).toHaveValue('');
 await expect(page.locator('#workshop-navigator')).toBeHidden();
 await expect(page.locator('#writing-workshop')).toBeHidden();
 expect(errors).toEqual([]);expect(requests).toEqual([]);
 const x=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,w:innerWidth}));expect(x.sw).toBeLessThanOrEqual(x.w+2);
});
