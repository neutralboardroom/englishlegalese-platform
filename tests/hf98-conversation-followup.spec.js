'use strict';
const {test,expect}=require('@playwright/test');
// Preserve normal app behavior while making touch/scroll stability deterministic.
test.use({reducedMotion:'reduce'});
const tracks={
 legal:{right:[1,2,0],markers:['extension until Monday','already publicly available','three main risks']},
 business:{right:[1,1,2],markers:['final report needs two more days','budget update by Thursday','higher orders as encouraging']}
};
test('HF98 six original full-conversation cases reveal a second contextual question only after genuine comprehension and transfer',async({page})=>{
 const outgoing=[];page.on('request',req=>{if(req.method()!=='GET'||/\/api\//.test(req.url()))outgoing.push(req.method()+' '+req.url());});
 await page.goto('/learn/app/');
 await expect(page.locator('#hf98-challenge')).toBeHidden();
 for(const track of ['legal','business']){
  await page.locator(`input[name="hf93-subject"][value="${track}"]`).check();
  await page.locator('#hf93-start').click();
  for(let i=0;i<3;i++){
   await expect(page.locator('#hf98-challenge')).toBeHidden();
   await page.locator('#hf93-answers button').nth(tracks[track].right[i]).click();
   await page.locator('#hf93-to-transfer').click();
   await expect(page.locator('#hf98-challenge')).toBeHidden();
   await page.locator('#hf93-reveal').click();
   await expect(page.locator('#hf98-challenge')).toBeVisible();
   await expect(page.locator('#hf98-question')).toContainText(tracks[track].markers[i],{ignoreCase:true});
   await expect(page.locator('#hf98-draft')).toBeEnabled();
   await expect(page.locator('#hf98-model')).toBeHidden();
   await expect(page.locator('#hf98-self-review')).toBeDisabled();
   await page.locator('#hf98-draft').fill('I would clarify the relevant conditions and confirm the next professional action in a complete sentence.');
   await page.locator('#hf98-self-review').click();
   await expect(page.locator('#hf98-review-guide')).toBeVisible();
   await page.locator('#hf98-show-model').click();
   await expect(page.locator('#hf98-model')).toBeVisible();
   await expect(page.locator('#hf98-model-text')).not.toBeEmpty();
   await page.locator('#hf93-next').click();
   await expect(page.locator('#hf98-draft')).toHaveValue('');
  }
 }
 expect(outgoing).toEqual([]);
});
test('HF98 keeps authored follow-up private, clears it on Stop, Restart, changed subject and pagehide',async({page})=>{
 await page.goto('/learn/app/');
 await page.locator('#hf93-start').click();
 await page.locator('#hf93-answers button').nth(1).click();
 await page.locator('#hf93-to-transfer').click();
 await page.locator('#hf93-reveal').click();
 await page.locator('#hf98-draft').fill('The extension needs agreement before we may rely on Monday.');
 await page.locator('#hf98-show-model').click();
 await expect(page.locator('#hf98-model')).toBeVisible();
 await page.locator('#hf98-clear').click();
 await expect(page.locator('#hf98-draft')).toHaveValue('');
 await expect(page.locator('#hf98-model')).toBeHidden();
 await page.locator('#hf98-draft').fill('A second private complete sentence.');
 await page.locator('#hf93-stop').click();
 await expect(page.locator('#hf98-challenge')).toBeHidden();
 await expect(page.locator('#hf98-draft')).toHaveValue('');
 await page.locator('#hf93-restart').click();
 await page.locator('input[name="hf93-subject"][value="business"]').check();
 await page.locator('#hf93-start').click();
 await page.locator('#hf93-answers button').nth(1).click();
 await page.locator('#hf93-to-transfer').click();
 await page.locator('#hf93-reveal').click();
 await page.locator('#hf98-draft').fill('The first draft is due Wednesday, and a review still follows.');
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#hf98-draft')).toHaveValue('');
 await expect(page.locator('#hf98-self-review')).toBeDisabled();
});
test('HF98 identifies Human Teacher Roger, AI Teacher Roger and Owner/Admin without falsely representing the scripted exercise',async({page})=>{
 await page.goto('/learn/app/');
 await page.locator('#hf98-identity summary').click();
 const panel=page.locator('#hf98-identity');
 await expect(panel).toContainText('Human Teacher Roger');
 await expect(panel).toContainText('AI Teacher Roger');
 await expect(panel).toContainText('Owner/Admin');
 await expect(panel).toContainText('not connected to this scripted practice');
 await page.goto('/learn/teachers/');
 const names=page.locator('#hf98-teacher-identity');
 await expect(names).toContainText('Human Teacher Roger');
 await expect(names).toContainText('AI Teacher Roger');
 await expect(names).toContainText('Owner/Admin');
});
test('HF98 works without Web Speech API, does not grade writing, or overflow the current viewport',async({page})=>{
 await page.addInitScript(()=>{
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:undefined});
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:undefined});
 });
 const outgoing=[];page.on('request',req=>{if(req.method()!=='GET')outgoing.push(req.method());});
 await page.goto('/learn/app/');
 await page.locator('#hf93-start').click();await page.locator('#hf93-answers button').nth(1).click();
 await page.locator('#hf93-to-transfer').click();await page.locator('#hf93-reveal').click();
 await expect(page.locator('#hf95-turn-listen')).toBeDisabled();
 await expect(page.locator('#hf98-show-model')).toBeEnabled();
 await page.locator('#hf98-show-model').click();await expect(page.locator('#hf98-model')).toContainText('not assume');
 const dims=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,screen:innerWidth}));
 expect(dims.doc).toBeLessThanOrEqual(dims.screen+1);
 expect(outgoing).toEqual([]);
});
