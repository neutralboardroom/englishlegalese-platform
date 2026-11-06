'use strict';
const {test,expect}=require('@playwright/test');
for(const path of ['/learn/continuing-practice/','/learn/continuing-practice/advanced/']){
 test('HF49 intelligibility: phrase chunks, stress, listening and private reflection: '+path,async({page},info)=>{
  const writes=[];
  page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
  await page.goto(path);
  const cards=page.locator('article.v1971-lesson');
  await expect(cards).toHaveCount(12);
  await expect(page.locator('.v2110-prosody')).toHaveCount(12);
  const first=cards.first();
  await first.locator('details.v1990-speaking > summary').click();
  await first.locator('details.v2100-more-tools > summary').click();
  const panel=first.locator('details.v2110-prosody');
  await panel.locator('summary').first().click();
  await expect(panel.locator('.v2110-chunk-progress')).toContainText('1 of 3');
  await panel.getByRole('button',{name:'Next thought group'}).click();
  await expect(panel.locator('.v2110-chunk-progress')).toContainText('2 of 3');
  await panel.getByRole('button',{name:'Next thought group'}).click();
  await expect(panel.locator('.v2110-chunk-progress')).toContainText('3 of 3');
  await expect(panel.getByRole('button',{name:'Next thought group'})).toBeDisabled();
  await panel.getByRole('button',{name:'Start groups again'}).click();
  await expect(panel.locator('.v2110-chunk-progress')).toContainText('1 of 3');
  await expect(panel.locator('.v2110-listener-model p')).toBeHidden();
  await panel.locator('.v2110-listener-model summary').click();
  await expect(panel.locator('.v2110-listener-model p')).toBeVisible();
  const boxes=panel.locator('.v2110-selfcheck input[type=checkbox]');
  await expect(boxes).toHaveCount(3);
  await boxes.nth(0).check();await boxes.nth(2).check();
  await panel.getByRole('button',{name:'Reset my private checklist'}).click();
  for(let i=0;i<3;i++)await expect(boxes.nth(i)).not.toBeChecked();
  await expect(first.locator('fieldset[data-v1980-check] [role=status]')).toHaveCount(1);
  const aud=panel.getByRole('button',{name:'Hear the full phrase'});
  const supported=await page.evaluate(()=>typeof speechSynthesis==='object'&&typeof SpeechSynthesisUtterance==='function');
  if(supported)await expect(aud).toBeEnabled();else await expect(aud).toBeDisabled();
  expect(writes).toEqual([]);
  const dims=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
  expect(dims[0]).toBeLessThanOrEqual(dims[1]+2);
  await page.screenshot({path:info.outputPath('hf49-clarity-coach.png'),fullPage:false});
 });
}
test('HF49 long pages remain safely collapsed by default for earlier layout tests',async({page})=>{
 await page.goto('/learn/continuing-practice/advanced/');
 const panels=page.locator('.v2110-prosody');
 await expect(panels).toHaveCount(12);
 await expect(page.locator('details.v2100-more-tools')).toHaveCount(12);
 for(let i=0;i<12;i++){
  await expect(page.locator('details.v2100-more-tools').nth(i)).not.toHaveAttribute('open');
  await expect(panels.nth(i)).not.toHaveAttribute('open');
 }
 await expect(page.locator('.v2100-path')).toHaveCount(1);
});
