'use strict';
const {test,expect}=require('@playwright/test');
test('HF35 original twelve lessons provide 3 credible alternatives and variable answer placement',async({page},info)=>{
 await page.goto('/learn/continuing-practice/');
 await expect(page.getByRole('heading',{name:/Continuing Legal English/})).toBeVisible();
 const lessons=page.locator('article.v1971-lesson');
 await expect(lessons).toHaveCount(12);
 const checks=page.locator('fieldset[data-v1980-check]');
 await expect(checks).toHaveCount(12);
 const slots=[];
 for(let i=0;i<12;i++){
  const f=checks.nth(i);
  await expect(f.locator('input[type=radio]')).toHaveCount(3);
  await expect(f.getByRole('button',{name:'Check answer'})).toBeEnabled();
  slots.push(Number(await f.getAttribute('data-correct')));
 }
 expect(new Set(slots)).toEqual(new Set([0,1,2]));
 expect(slots.filter(n=>n===0)).toHaveLength(4);
 expect(slots.filter(n=>n===1)).toHaveLength(4);
 expect(slots.filter(n=>n===2)).toHaveLength(4);
 await page.screenshot({path:info.outputPath('hf35-practice-desktop-mobile.png'),fullPage:true});
 const sizes=await page.evaluate(()=>({content:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(sizes.content).toBeLessThanOrEqual(sizes.viewport+2);
});
test('HF35 self-check gives context-specific explanation for correct and incorrect choices, then resets',async({page})=>{
 const methods=[];
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))methods.push(r.method()+' '+r.url());});
 await page.goto('/learn/continuing-practice/');
 const checks=page.locator('fieldset[data-v1980-check]');
 for(const i of [0,1,2,4,8,11]){
  const f=checks.nth(i),right=Number(await f.getAttribute('data-correct'));
  await f.getByRole('button',{name:'Check answer'}).click();
  await expect(f.getByRole('status')).toContainText('Select one answer');
  await f.locator('input[type=radio]').nth((right+1)%3).check();
  await expect(f.getByRole('status')).toBeEmpty();
  await f.getByRole('button',{name:'Check answer'}).click();
  await expect(f.getByRole('status')).toContainText('Review this choice.');
  await expect(f.getByRole('status')).toContainText('You can change your answer and try again.');
  await expect(f.getByRole('status')).toHaveAttribute('data-outcome','review');
  await f.locator('input[type=radio]').nth(right).check();
  await expect(f.getByRole('status')).toBeEmpty();
  await f.getByRole('button',{name:'Check answer'}).click();
  await expect(f.getByRole('status')).toContainText('Correct.');
  await expect(f.getByRole('status')).toHaveAttribute('data-outcome','correct');
 }
 expect(methods).toEqual([]);
});
test('HF35 different lesson feedback stays independent and private writing remains unchanged',async({page})=>{
 await page.goto('/learn/continuing-practice/');
 const one=page.locator('article.v1971-lesson').nth(0),two=page.locator('article.v1971-lesson').nth(1);
 await one.getByRole('textbox',{name:'Optional private practice draft'}).fill('Invented scenario only.');
 await one.getByRole('radio').nth(1).check();
 await one.getByRole('button',{name:'Check answer'}).click();
 await expect(one.getByRole('status')).toContainText('An intake note');
 await expect(two.getByRole('status')).toBeEmpty();
 await two.getByRole('radio').nth(0).check();
 await two.getByRole('button',{name:'Check answer'}).click();
 await expect(two.getByRole('status')).toContainText('Before calculating');
 await expect(one.getByRole('textbox',{name:'Optional private practice draft'})).toHaveValue('Invented scenario only.');
 await page.reload();
 await expect(one.getByRole('textbox',{name:'Optional private practice draft'})).toHaveValue('');
 await expect(one.getByRole('status')).toBeEmpty();
});
