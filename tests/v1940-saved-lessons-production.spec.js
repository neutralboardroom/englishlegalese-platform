const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('HF13 Legal workbooks offer consent-first pause/resume on '+host,async({page})=>{
  const posts=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url())});
  const res=await page.goto(host+'/learn/legal-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('.v1940-controls')).toHaveCount(24);
  const c=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await c.locator('.v1870-toggle input').check();
  await page.locator('.v1940-account button').filter({hasText:'Enable saving on this device'}).click();
  await c.locator('.v1930-simulation textarea').first().fill('Fictional professional reply: I would verify the notice first.');
  await c.locator('.v1940-controls button').filter({hasText:'Pause & save'}).click();
  await expect(c.locator('.v1940-state')).toContainText('Saved on this device');
  await page.reload();
  await expect(c.locator('.v1930-simulation textarea').first()).toHaveValue(/verify the notice first/);
  expect(posts).toHaveLength(0);
 });
 test('HF13 Business/Investor workbooks preserve earlier exercises and cloud privacy messaging on '+host,async({page})=>{
  const res=await page.goto(host+'/learn/business-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('#v1850-business-cards .v1940-controls')).toHaveCount(16);
  await expect(page.locator('#v1850-investor-cards .v1940-controls')).toHaveCount(8);
  await expect(page.locator('.v1890-stage')).toHaveCount(96);
  await expect(page.locator('.v1910-path')).toHaveCount(24);
  await expect(page.locator('.v1940-account')).toContainText('Device-only drafts');
 });
}