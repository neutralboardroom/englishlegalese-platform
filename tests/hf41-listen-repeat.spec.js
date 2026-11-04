'use strict';
const {test,expect}=require('@playwright/test');
for(const route of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF41 optional English listen/repeat without recording: '+route,async({page},info)=>{
  const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
  await page.goto(route);
  const cards=page.locator('article.v1971-lesson');
  await expect(cards).toHaveCount(12);
  await expect(page.locator('.v2030-audio')).toHaveCount(12);
  const first=cards.first();
  await expect(first.locator('.v2030-controls select option')).toHaveCount(3);
  await expect(first.locator('.v2030-transcript')).toHaveCount(1);
  await first.locator('.v2030-transcript summary').click();
  await expect(first.locator('.v2030-transcript p')).toBeVisible();
  await expect(first.locator('.v2030-controls button').first()).toBeVisible();
  const speech=await page.evaluate(()=>typeof speechSynthesis==='object'&&typeof SpeechSynthesisUtterance==='function');
  if(speech){
   await first.getByRole('button',{name:'Play sample sentence'}).click();
   await expect(first.locator('.v2030-status')).not.toBeEmpty();
   await first.getByRole('button',{name:'Stop playback'}).click({force:true}).catch(()=>{});
  }else{
   await expect(first.getByRole('button',{name:'Play sample sentence'})).toBeDisabled();
  }
  expect(writes).toEqual([]);
  const d=await page.evaluate(()=>({pageWidth:document.documentElement.scrollWidth,viewport:innerWidth}));
  expect(d.pageWidth).toBeLessThanOrEqual(d.viewport+2);
  await page.screenshot({path:info.outputPath('hf41-device-speech.png'),fullPage:false});
 });
}
