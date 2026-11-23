const {test,expect}=require('@playwright/test');
test('HF93 real Legal English meaning gate, full-sentence rehearsal and context transfer',async({page})=>{
 await page.goto('/learn/app/');
 await expect(page.locator('#hf93-conversation-lab')).toBeVisible();
 await page.locator('#hf93-start').click();
 await expect(page.locator('#hf93-case-title')).toContainText('Clarifying a contract deadline');
 await expect(page.locator('#hf93-answers button')).toHaveCount(3);
 await page.locator('#hf93-answers button').nth(0).click();
 await expect(page.locator('#hf93-feedback')).toContainText('Not quite');
 await expect(page.locator('#hf93-speak')).toBeHidden();
 await page.locator('#hf93-answers button').nth(1).click();
 await expect(page.locator('#hf93-feedback')).toContainText('Correct interpretation');
 await expect(page.locator('#hf93-speak')).toBeVisible();
 await expect(page.locator('#hf93-speak-model')).toContainText('Friday is the deadline for comments');
 await page.locator('#hf93-to-transfer').click();
 await expect(page.locator('#hf93-transfer')).toBeVisible();
 await expect(page.locator('#hf93-transfer-answer')).toBeHidden();
 await expect(page.locator('#hf93-next')).toBeDisabled();
 await page.locator('#hf93-reveal').click();
 await expect(page.locator('#hf93-transfer-answer')).toBeVisible();
 await page.locator('#hf93-next').click();
 await expect(page.locator('#hf93-case-title')).toContainText('confidentiality');
 await page.locator('#hf93-stop').click();
 await expect(page.locator('#hf93-case')).toBeHidden();
 await expect(page.locator('#hf93-status')).toContainText('No answers were saved');
 await page.locator('#hf93-restart').click();
 await expect(page.locator('#hf93-start')).toBeEnabled();
 await expect(page.locator('#hf93-case')).toBeHidden();
});
test('HF93 Business English has full 3-stage completion without claiming speech grade',async({page})=>{
 await page.goto('/learn/app/');
 await page.locator('input[value=business][name=hf93-subject]').check();
 await page.locator('#hf93-start').click();
 const indices=[1,1,2];
 for(let i=0;i<3;i++){
  await expect(page.locator('#hf93-case-title')).toContainText('Conversation '+(i+1)+' of 3');
  await page.locator('#hf93-answers button').nth(indices[i]).click();
  await expect(page.locator('#hf93-speak')).toBeVisible();
  await expect(page.locator('#hf93-speak')).toContainText('cannot hear, record, or assess pronunciation');
  await page.locator('#hf93-to-transfer').click();
  await page.locator('#hf93-reveal').click();
  await page.locator('#hf93-next').click();
 }
 await expect(page.locator('#hf93-case')).toBeHidden();
 await expect(page.locator('#hf93-status')).toContainText('You finished all three Business English');
 await expect(page.locator('#hf93-status')).toContainText('not graded');
});
test('HF93 mobile viewport, keyboard focus, and no private API/network writes',async({page})=>{
 const unsafe=[];
 page.on('request',req=>{if(req.method()!=='GET'||new URL(req.url()).pathname.startsWith('/api/'))unsafe.push(req.method()+' '+req.url());});
 await page.goto('/learn/app/');
 await page.locator('#hf93-start').focus();await page.keyboard.press('Enter');
 await expect(page.locator('#hf93-case-title')).toBeFocused();
 let w=await page.evaluate(()=>({client:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(w.client).toBeLessThanOrEqual(w.viewport+1);
 await page.locator('#hf93-stop').click();
 expect(unsafe).toEqual([]);
});
