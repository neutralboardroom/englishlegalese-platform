'use strict';
const {test,expect}=require('@playwright/test');
test.use({reducedMotion:'reduce'});
const original={legal:[1,2,0],business:[1,1,2]};
const correctRepair={legal:[1,2,0],business:[2,0,1]};
async function current(page,step){
 await expect(page.locator('#hf101-steps [aria-current="step"]')).toHaveCount(step<0?0:1);
 if(step>=0){
  await expect(page.locator(`#hf101-steps [data-hf101-stage="${step}"]`)).toHaveAttribute('aria-current','step');
  await expect(page.locator('#hf101-route-status')).toContainText(`Stage ${step+1} of 6`);
 }
}
for(const track of ['legal','business']){
 for(let index=0;index<3;index++){
 test(`HF101 ${track} case ${index+1}: six-step route follows original gates, focus works, privacy remains intact`,async({page})=>{
  const requests=[];page.on('request',r=>{if(r.method()!=='GET'||/\/api\//.test(r.url()))requests.push(r.url());});
  await page.goto('/learn/app/');
  await current(page,-1);await expect(page.locator('#hf101-route-focus')).toBeDisabled();
  await page.locator(`input[name="hf93-subject"][value="${track}"]`).check();
  await page.locator('#hf93-start').click();
  for(let previous=0;previous<index;previous++){
   await page.locator('#hf93-answers button').nth(original[track][previous]).click();
   await page.locator('#hf93-to-transfer').click();await page.locator('#hf93-reveal').click();
   await page.locator('#hf98-show-model').click();
   await page.locator('#hf99-choices button').nth(correctRepair[track][previous]).click();
   await page.locator('#hf99-show-sample').click();await page.locator('#hf93-next').click();
  }
  await current(page,0);
  await page.locator('#hf101-route-focus').click();
  await expect(page.locator('#hf93-answers button').first()).toBeFocused();
  await page.locator('#hf93-answers button').nth(original[track][index]).click();
  await current(page,1);
  await page.locator('#hf93-to-transfer').click();await current(page,2);
  await page.locator('#hf93-reveal').click();await current(page,3);
  await page.locator('#hf98-show-model').click();await current(page,4);
  await page.locator('#hf99-choices button').nth(correctRepair[track][index]).click();await current(page,4);
  await page.locator('#hf99-show-sample').click();await current(page,5);
  await page.locator('#hf101-route-focus').click();
  await expect(page.locator('#hf100-choices button').first()).toBeFocused();
  await page.locator('#hf100-choices button').nth(index).click();
  await page.locator('#hf100-model-button').click();
  await expect(page.locator('#hf101-route-status')).toContainText('authored confirmation-note example');
  await page.locator('#hf93-next').click();await current(page,index===2?-1:0);
  expect(requests).toEqual([]);
 });
 }
}
test('HF101: Stop, subject changes, pagehide and source tamper reset guide truthfully, with no hidden stage bypass',async({page})=>{
 await page.addInitScript(()=>Object.defineProperty(window,'speechSynthesis',{value:undefined,configurable:true}));
 await page.goto('/learn/app/');
 await page.locator('#hf93-start').click();await current(page,0);
 await page.locator('#hf93-answers button').nth(1).click();await current(page,1);
 await page.locator('#hf93-stop').click();await current(page,-1);
 await page.locator('#hf93-restart').click();await current(page,-1);
 await page.locator('input[name="hf93-subject"][value="business"]').check();await current(page,-1);
 await page.locator('#hf93-start').click();await current(page,0);
 await page.locator('#hf93-answers button').nth(1).click();await page.locator('#hf93-to-transfer').click();await page.locator('#hf93-reveal').click();
 await page.locator('#hf98-show-model').click();await page.locator('#hf99-choices button').nth(2).click();await page.locator('#hf99-show-sample').click();await current(page,5);
 await page.evaluate(()=>document.getElementById('hf99-misunderstanding').textContent='SOURCE MODIFIED');
 await expect(page.locator('#hf100-note')).toBeHidden();await current(page,4);
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#hf101-route-focus')).toBeDisabled();
 await expect(page.locator('#hf101-route-status')).toContainText('kept no record');
});
