'use strict';
const {test,expect}=require('@playwright/test');
for(const [path,expected]of [
 ['/learn/continuing-practice/','Client intake: verified facts'],
 ['/learn/continuing-practice/advanced/','Research summary: sources versus conclusions']
]){
 test('HF37: tailored speaking rehearsals are usable and private on '+path,async({page},info)=>{
  const writes=[];
  page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
  await page.goto(path);
  const cards=page.locator('details.v1990-speaking');
  await expect(cards).toHaveCount(12);
  const first=cards.first();
  await expect(first).toHaveAttribute('data-v1990-speaking',expected);
  await first.locator('summary').first().click();
  await expect(first.getByText('Use only invented examples.')).toBeVisible();
  await expect(first).toContainText('No microphone access, recording, speech recognition, grading, storage or submission');
  await expect(first.getByRole('heading',{name:/1. Listen to the client question/})).toBeVisible();
  await expect(first.getByRole('heading',{name:/2. Answer in full sentences/})).toBeVisible();
  await expect(first.getByRole('heading',{name:/3. Handle one follow-up question/})).toBeVisible();
  const hint=first.locator('details.v1990-hint');
  await expect(hint).not.toHaveAttribute('open');
  await hint.locator('summary').click();
  await expect(hint.locator('p')).toBeVisible();
  const start=first.getByRole('button',{name:'Start a 45-second speaking turn'});
  const pause=first.getByRole('button',{name:'Pause timer'});
  const clock=first.getByRole('timer');
  await expect(clock).toHaveText('0:45');
  await start.click();
  await expect(start).toBeDisabled();
  await expect(pause).toBeEnabled();
  await page.waitForTimeout(1150);
  await expect(clock).not.toHaveText('0:45');
  await pause.click();
  await expect(start).toBeEnabled();
  await expect(pause).toBeDisabled();
  await expect(first.getByRole('status')).toContainText('paused');
  const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
  expect(sizes.scroll).toBeLessThanOrEqual(sizes.width+2);
  await page.screenshot({path:info.outputPath(path.includes('advanced')?'hf37-advanced-speaking.png':'hf37-original-speaking.png'),fullPage:false});
  await page.reload();
  await expect(page.locator('details.v1990-speaking').first()).not.toHaveAttribute('open');
  expect(writes).toEqual([]);
 });
}
test('HF37: each lesson has unique role-play prompts and the existing self-check still works',async({page})=>{
 await page.goto('/learn/continuing-practice/');
 const cards=page.locator('details.v1990-speaking');
 const titles=await cards.evaluateAll(nodes=>nodes.map(n=>n.dataset.v1990Speaking));
 expect(new Set(titles).size).toBe(12);
 const first=page.locator('article.v1971-lesson').first();
 await first.locator('details.v1990-speaking summary').first().click();
 await first.getByRole('button',{name:'Start a 45-second speaking turn'}).click();
 const second=page.locator('article.v1971-lesson').nth(1);
 await second.locator('details.v1990-speaking summary').first().click();
 await second.getByRole('button',{name:'Start a 45-second speaking turn'}).click();
 await expect(first.getByRole('button',{name:'Start a 45-second speaking turn'})).toBeEnabled();
 await expect(second.getByRole('button',{name:'Start a 45-second speaking turn'})).toBeDisabled();
 await second.getByRole('button',{name:'Pause timer'}).click();
 await first.locator('input[type=radio]').nth(1).check();
 await first.getByRole('button',{name:'Check answer'}).click();
 await expect(first.locator('fieldset[data-v1980-check] [role=status]')).toContainText('Correct.');
});
