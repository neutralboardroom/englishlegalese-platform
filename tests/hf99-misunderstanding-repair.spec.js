'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce'});
const tracks={legal:[1,2,0],business:[1,1,2]};
const repairs={legal:[1,2,0],business:[2,0,1]};
async function reach(page,track,index){
 await page.locator(`input[name="hf93-subject"][value="${track}"]`).check();
 await page.locator('#hf93-start').click();
 for(let i=0;i<=index;i++){
  await page.locator('#hf93-answers button').nth(tracks[track][i]).click();
  await page.locator('#hf93-to-transfer').click();
  await page.locator('#hf93-reveal').click();
  if(i<index)await page.locator('#hf93-next').click();
 }
 await page.locator('#hf98-show-model').click();
 await expect(page.locator('#hf99-repair')).toBeVisible();
}
test('HF99: all six professional misunderstanding corrections require HF98 model, then prompt a complete next-action sentence',async({page})=>{
 const unexpected=[];page.on('request',r=>{if(r.method()!=='GET'||/\/api\//.test(r.url()))unexpected.push(r.method()+' '+r.url());});
 await page.goto('/learn/app/');
 await expect(page.locator('#hf99-repair')).toBeHidden();
 for(const track of ['legal','business']){
  await page.locator(`input[name="hf93-subject"][value="${track}"]`).check();
  await page.locator('#hf93-start').click();
  for(let index=0;index<3;index++){
   await expect(page.locator('#hf99-repair')).toBeHidden();
   await page.locator('#hf93-answers button').nth(tracks[track][index]).click();
   await page.locator('#hf93-to-transfer').click();
   await page.locator('#hf93-reveal').click();
   await expect(page.locator('#hf99-repair')).toBeHidden();
   await page.locator('#hf98-show-model').click();
   await expect(page.locator('#hf99-repair')).toBeVisible();
   await expect(page.locator('#hf99-choices button')).toHaveCount(3);
   await expect(page.locator('#hf99-draft')).toBeDisabled();
   const wrong=(repairs[track][index]+1)%3;
   await page.locator('#hf99-choices button').nth(wrong).click();
   await expect(page.locator('#hf99-feedback')).not.toBeEmpty();
   await expect(page.locator('#hf99-draft')).toBeDisabled();
   await page.locator('#hf99-choices button').nth(repairs[track][index]).click();
   await expect(page.locator('#hf99-next-prompt')).toBeVisible();
   await expect(page.locator('#hf99-draft')).toBeEnabled();
   await expect(page.locator('#hf99-show-sample')).toBeEnabled();
   await page.locator('#hf99-draft').fill('Please confirm the responsible person and proposed next step before the deadline.');
   await page.locator('#hf99-self-check').click();
   await expect(page.locator('#hf99-check-guide')).toBeVisible();
   await page.locator('#hf99-show-sample').click();
   await expect(page.locator('#hf99-sample')).toBeVisible();
   await expect(page.locator('#hf99-sample-text')).not.toBeEmpty();
   await page.locator('#hf93-next').click();
   await expect(page.locator('#hf99-repair')).toBeHidden();
   await expect(page.locator('#hf99-draft')).toHaveValue('');
  }
 }
 expect(unexpected).toEqual([]);
});
test('HF99: privacy reset, original source mismatch, voice-free access and overflow',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:undefined});});
 await page.goto('/learn/app/');
 await reach(page,'legal',0);
 await page.locator('#hf99-choices button').nth(1).click();
 await page.locator('#hf99-draft').fill('A private sentence that must be erased on Clear.');
 await page.locator('#hf99-clear').click();
 await expect(page.locator('#hf99-draft')).toHaveValue('');
 await page.locator('#hf99-draft').fill('A private sentence that must be erased on Stop.');
 await page.locator('#hf93-stop').click();
 await expect(page.locator('#hf99-repair')).toBeHidden();
 await expect(page.locator('#hf99-draft')).toHaveValue('');
 await page.locator('#hf93-restart').click();
 await reach(page,'business',0);
 await page.locator('#hf99-choices button').nth(2).click();
 await page.locator('#hf99-draft').fill('Another private sentence.');
 await page.evaluate(()=>{document.getElementById('hf93-transfer-prompt').textContent='UNVERIFIED REPLACEMENT';});
 await expect(page.locator('#hf99-repair')).toBeHidden();
 await expect(page.locator('#hf99-draft')).toHaveValue('');
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#hf99-draft')).toHaveValue('');
 const width=await page.evaluate(()=>({page:document.documentElement.scrollWidth,screen:innerWidth}));
 expect(width.page).toBeLessThanOrEqual(width.screen+1);
});
