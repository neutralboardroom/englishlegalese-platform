'use strict';
const {test,expect}=require('@playwright/test');
test('HF36: 24 free original lessons are discoverable by Legal and Business learners',async({page},info)=>{
 await page.goto('/learn/continuing-practice/');
 await expect(page.locator('.v1971-lesson')).toHaveCount(12);
 await expect(page.getByRole('link',{name:'Open the next 12 Legal and Business English lessons'})).toHaveAttribute('href','/learn/continuing-practice/advanced/');
 await page.getByRole('link',{name:'Open the next 12 Legal and Business English lessons'}).click();
 await expect(page).toHaveURL(/\/learn\/continuing-practice\/advanced\/$/);
 await expect(page.getByRole('heading',{name:'Further Legal English & Business English practice'})).toBeVisible();
 await expect(page.locator('.v1971-lesson')).toHaveCount(12);
 await expect(page.locator('#advanced-legal + p + .v1981-grid article')).toHaveCount(6);
 await expect(page.locator('#advanced-business + p + .v1981-grid article')).toHaveCount(6);
 await expect(page.locator('main')).toContainText('No subscription, payment, booking, user account or personal-data submission is required');
 await page.screenshot({path:info.outputPath('hf36-advanced-desktop-tablet-mobile.png'),fullPage:true});
 const widths=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(widths.scroll).toBeLessThanOrEqual(widths.viewport+2);
});
test('HF36: advanced lesson checks are varied, accessible, specific and never transmit writing',async({page})=>{
 const writes=[];
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.goto('/learn/continuing-practice/advanced/');
 const fields=page.locator('fieldset[data-v1980-check]');
 await expect(fields).toHaveCount(12);
 const slots=[];
 for(let i=0;i<12;i++){
  const f=fields.nth(i),pos=Number(await f.getAttribute('data-correct'));
  slots.push(pos);
  await expect(f.locator('input[type=radio]')).toHaveCount(3);
  await expect(f.getByRole('status')).toBeEmpty();
 }
 expect(slots.filter(n=>n===0)).toHaveLength(4);
 expect(slots.filter(n=>n===1)).toHaveLength(4);
 expect(slots.filter(n=>n===2)).toHaveLength(4);
 for(const i of [0,1,2,6,7,8]){
  const f=fields.nth(i),correct=Number(await f.getAttribute('data-correct'));
  const reason=await f.getAttribute('data-explanation');
  await f.getByRole('button',{name:'Check answer'}).click();
  await expect(f.getByRole('status')).toContainText('Select one answer');
  await f.locator('input[type=radio]').nth((correct+1)%3).check();
  await f.getByRole('button',{name:'Check answer'}).click();
  await expect(f.getByRole('status')).toContainText('Review this choice.');
  await expect(f.getByRole('status')).toContainText(reason);
  await f.locator('input[type=radio]').nth(correct).check();
  await expect(f.getByRole('status')).toBeEmpty();
  await f.getByRole('button',{name:'Check answer'}).click();
  await expect(f.getByRole('status')).toContainText('Correct.');
  await expect(f.getByRole('status')).toContainText(reason);
 }
 const draft=page.locator('.v1971-lesson').first().getByRole('textbox',{name:'Your private practice draft'});
 await draft.fill('Fictional only; never a real case.');
 await expect(draft).toHaveValue('Fictional only; never a real case.');
 await page.reload();
 await expect(page.locator('.v1971-lesson').first().getByRole('textbox',{name:'Your private practice draft'})).toBeEmpty();
 expect(writes).toEqual([]);
});
test('HF36: Legal and Business course/resource pages link to correct free learning tracks',async({page})=>{
 for(const [route,first,next] of [
  ['/learn/legal-english/','/learn/continuing-practice/#legal-track','/learn/continuing-practice/advanced/#advanced-legal'],
  ['/learn/business-english/','/learn/continuing-practice/#business-track','/learn/continuing-practice/advanced/#advanced-business'],
  ['/learn/legal-resources/','/learn/continuing-practice/#legal-track','/learn/continuing-practice/advanced/#advanced-legal'],
  ['/learn/business-resources/','/learn/continuing-practice/#business-track','/learn/continuing-practice/advanced/#advanced-business']
 ]){
  await page.goto(route);
  await expect(page.locator('main').getByRole('link',{name:/first six/i})).toHaveAttribute('href',first);
  await expect(page.locator('main').getByRole('link',{name:/next six|six further/i})).toHaveAttribute('href',next);
 }
 await page.goto('/learn/memberships/');
 await expect(page.getByRole('link',{name:/Continue with 12 additional original Legal and Business English lessons/})).toHaveAttribute('href','/learn/continuing-practice/advanced/');
 await expect(page.locator('main')).toContainText('continue automatically');
 await expect(page.locator('main')).toContainText('Cancel any time before the next renewal');
});
