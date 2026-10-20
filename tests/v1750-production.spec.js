const {test,expect}=require('@playwright/test');
const hosts=['https://englishlegalese.com','https://www.englishlegalese.com'];
test('v1.75 real apex and www provide working fictional listening and clarification lab',async({page},testInfo)=>{
 for(const host of hosts){
  const response=await page.goto(host+'/');
  expect(response.status()).toBeLessThan(400);
  expect(response.headers()['x-englishlegalese-release']).toBe('1.78.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.78.0');
  await expect(page.locator('.site-footer a[href="#listening-clarification-lab"]')).toHaveCount(1);
  await expect(page.locator('#listening-clarification-lab')).toBeHidden();
  await page.goto(host+'/#listening-clarification-lab');
  await expect(page.locator('#listening-clarification-lab')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.78.0');
  const lab=page.locator('#listening-clarification-lab');
  await lab.getByRole('button',{name:'Show transcript'}).click();
  await expect(lab.locator('#v1750-transcript')).toContainText('receipt');
  for(const [i,choice] of [[0,1],[1,0],[2,2]])await lab.locator('input[name="answer-'+i+'"][value="'+choice+'"]').check();
  await lab.getByRole('button',{name:'Check my answers'}).click();
  await expect(lab.locator('.v1750-feedback')).toContainText('3 of 3');
  await page.screenshot({path:testInfo.outputPath('v1750-'+(host.includes('www.')?'www':'apex')+'.png'),fullPage:true,animations:'disabled'});
 }
});
test('v1.75 real production listener remains private and resets on refresh',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PATCH','PUT'].includes(r.method()))writes.push(r.url());});
 await page.goto('https://englishlegalese.com/#listening-clarification-lab');
 await expect(page.locator('#listening-clarification-lab')).toBeVisible();
 await page.locator('input[name="answer-0"][value="1"]').check();
 await page.reload();
 await expect(page.locator('input[name="answer-0"]:checked')).toHaveCount(0);
 await expect(page.locator('#professional-message-builder')).toBeHidden();
 expect(writes).toEqual([]);
});
