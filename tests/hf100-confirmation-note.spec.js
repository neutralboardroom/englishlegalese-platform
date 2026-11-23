'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce'});
const original={legal:[1,2,0],business:[1,1,2]};
const correctRepair={legal:[1,2,0],business:[2,0,1]};
const noteRisk={legal:[0,1,2],business:[0,1,2]};
async function reach(page,track,index){
 await page.locator(`input[name="hf93-subject"][value="${track}"]`).check();
 await page.locator('#hf93-start').click();
 for(let i=0;i<=index;i++){
  await page.locator('#hf93-answers button').nth(original[track][i]).click();
  await page.locator('#hf93-to-transfer').click();
  await page.locator('#hf93-reveal').click();
  await page.locator('#hf98-show-model').click();
  await page.locator('#hf99-choices button').nth(correctRepair[track][i]).click();
  await page.locator('#hf99-show-sample').click();
  if(i<index)await page.locator('#hf93-next').click();
 }
}
// HF101 WebKit reliability repair: same six scenarios and assertions, with one 30-second
// Playwright test budget per scenario instead of one timeout shared across all six.
for(const track of ['legal','business']){
 for(let index=0;index<3;index++){
  test(`HF100: authored fictional confirmation-note case ${track} ${index+1}, gated behind original sequence`,async({page})=>{
   const unexpected=[];
   page.on('request',r=>{if(r.method()!=='GET'||/\/api\//.test(r.url()))unexpected.push(r.method()+' '+r.url());});
   await page.goto('/learn/app/');
   await expect(page.locator('#hf100-note')).toBeHidden();
   await page.locator(`input[name="hf93-subject"][value="${track}"]`).check();
   await page.locator('#hf93-start').click();
   for(let previous=0;previous<index;previous++){
    await page.locator('#hf93-answers button').nth(original[track][previous]).click();
    await page.locator('#hf93-to-transfer').click();
    await page.locator('#hf93-reveal').click();
    await page.locator('#hf98-show-model').click();
    await page.locator('#hf99-choices button').nth(correctRepair[track][previous]).click();
    await page.locator('#hf99-show-sample').click();
    await page.locator('#hf93-next').click();
   }
   await expect(page.locator('#hf100-note')).toBeHidden();
   await page.locator('#hf93-answers button').nth(original[track][index]).click();
   await page.locator('#hf93-to-transfer').click();await page.locator('#hf93-reveal').click();
   await page.locator('#hf98-show-model').click();
   await expect(page.locator('#hf100-note')).toBeHidden();
   await page.locator('#hf99-choices button').nth(correctRepair[track][index]).click();
   await expect(page.locator('#hf100-note')).toBeHidden();
   await page.locator('#hf99-show-sample').click();
   await expect(page.locator('#hf100-note')).toBeVisible();
   await expect(page.locator('#hf100-choices button')).toHaveCount(3);
   await expect(page.locator('#hf100-subject')).toBeDisabled();
   await page.locator('#hf100-choices button').nth((noteRisk[track][index]+1)%3).click();
   await expect(page.locator('#hf100-subject')).toBeDisabled();
   await page.locator('#hf100-choices button').nth(noteRisk[track][index]).click();
   await expect(page.locator('#hf100-body')).toBeEnabled();
   await page.locator('#hf100-subject').fill('A cautious fictional subject');
   await page.locator('#hf100-body').fill('We need confirmation before changing any deadline or responsibility. Please obtain the agreed next step.');
   await page.locator('#hf100-review').click();await expect(page.locator('#hf100-checklist')).toBeVisible();
   await page.locator('#hf100-model-button').click();await expect(page.locator('#hf100-model')).toBeVisible();
   await expect(page.locator('#hf100-model-body')).not.toBeEmpty();
   await page.locator('#hf93-next').click();
   await expect(page.locator('#hf100-note')).toBeHidden();
   await expect(page.locator('#hf100-body')).toHaveValue('');
   await expect(page.locator('#hf100-subject')).toHaveValue('');
   expect(unexpected).toEqual([]);
  });
 }
}
test('HF100: Stop, Restart, pagehide, tamper and no-voice all clear and fail closed',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true});});
 await page.goto('/learn/app/');await reach(page,'legal',0);
 await page.locator('#hf100-choices button').first().click();
 await page.locator('#hf100-body').fill('Private message must be cleared.');
 await page.locator('#hf100-clear').click();await expect(page.locator('#hf100-body')).toHaveValue('');
 await page.locator('#hf100-body').fill('Stop should erase me.');
 await page.locator('#hf93-stop').click();await expect(page.locator('#hf100-note')).toBeHidden();
 await expect(page.locator('#hf100-body')).toHaveValue('');
 await page.locator('#hf93-restart').click();await expect(page.locator('#hf100-subject')).toHaveValue('');
 await page.reload();await reach(page,'legal',0);
 await page.locator('#hf100-choices button').first().click();
 await page.locator('#hf100-body').fill('Tamper must erase me.');
 await page.evaluate(()=>{document.getElementById('hf99-misunderstanding').textContent='UNVERIFIED REPLACEMENT';});
 await expect(page.locator('#hf100-note')).toBeHidden();await expect(page.locator('#hf100-body')).toHaveValue('');
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#hf100-subject')).toHaveValue('');
 const width=await page.evaluate(()=>({page:document.documentElement.scrollWidth,screen:innerWidth}));
 expect(width.page).toBeLessThanOrEqual(width.screen+1);
});
