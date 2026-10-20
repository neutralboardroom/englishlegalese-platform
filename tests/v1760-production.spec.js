const {test,expect}=require('@playwright/test');
test('v1.76 actual apex and www serve updated combined teaching journey',async({page},info)=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  const r=await page.goto(domain+'/');expect(r.status()).toBeLessThan(400);
  expect(r.headers()['x-englishlegalese-release']).toBe('1.76.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.76.0');
  await expect(page.locator('#home')).toContainText('Human teacher guidance available');
  await page.goto(domain+'/#conversation-rehearsal-lab');
  await expect(page.locator('#conversation-rehearsal-lab')).toBeVisible();
  await page.locator('#v1760-conversation').selectOption('permission');
  await page.getByRole('button',{name:'Show teaching example'}).click();
  await expect(page.locator('.v1760-example')).toBeVisible();
  await page.goto(domain+'/#reading-precision-lab');
  await expect(page.locator('#reading-precision-lab')).toBeVisible();
  await page.screenshot({path:info.outputPath('v1760-'+(domain.includes('www.')?'www':'apex')+'.png'),fullPage:true,animations:'disabled'});
 }
});
test('v1.76 real site retains legacy listening lab and private input reset',async({page})=>{
 await page.goto('https://englishlegalese.com/#listening-clarification-lab');
 await expect(page.locator('#listening-clarification-lab')).toBeVisible();
 await page.goto('https://englishlegalese.com/#conversation-rehearsal-lab');
 await page.locator('#v1760-notes').fill('Synthetic only');
 await page.reload();await expect(page.locator('#v1760-notes')).toHaveValue('');
});
