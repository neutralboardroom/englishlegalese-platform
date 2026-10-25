const {test,expect}=require('@playwright/test');
// Public acceptance observes only educational pages and fictional in-tab practice.
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('HF12 24 Legal speaking simulations preserve the original course depth at '+host,async({page})=>{
  const res=await page.goto(host+'/learn/legal-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('#v1860-legal-catalog .v1930-simulation')).toHaveCount(24);
  await expect(page.locator('#v1860-legal-catalog .v1890-stage')).toHaveCount(96);
  const c=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await c.locator('.v1870-toggle input').check();
  await expect(c.locator('.v1930-round-two')).toBeHidden();
  await expect(c.locator('.v1930-brief')).toContainText('Counterpart says');
  await expect(c.locator('.v1910-path')).toHaveCount(1);
 });
 test('HF12 16 Business and 8 Investor speaking simulations stay independent at '+host,async({page})=>{
  const res=await page.goto(host+'/learn/business-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('#v1850-business-cards .v1930-simulation')).toHaveCount(16);
  await expect(page.locator('#v1850-investor-cards .v1930-simulation')).toHaveCount(8);
  const a=page.locator('#v1850-business-cards .v1850-course-card').first(),b=page.locator('#v1850-investor-cards .v1850-course-card').first();
  await a.locator('.v1870-toggle input').check();await b.locator('.v1870-toggle input').check();
  expect(await a.locator('.v1930-brief').textContent()).not.toEqual(await b.locator('.v1930-brief').textContent());
  await expect(b.locator('.v1900-evidence-lab')).toHaveCount(1);
 });
 test('HF12 fictional dialogue prevents empty reveal, clears locally, never POSTs at '+host,async({page})=>{
  const posts=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url())});
  const res=await page.goto(host+'/learn/legal-english/');expect(res.status()).toBeLessThan(400);
  const c=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await c.locator('.v1870-toggle input').check();
  const lab=c.locator('.v1930-simulation');
  await lab.locator('.v1930-reveal').click();
  await expect(lab.locator('.v1930-status')).toContainText('Write a Round 1 reply');
  await lab.locator('textarea').first().fill('This is a fictional intake situation. The original notice must be checked first.');
  await lab.locator('.v1930-reveal').click();
  await expect(lab.locator('.v1930-round-two')).toBeVisible();
  await lab.locator('.v1930-reset').click();
  await expect(lab.locator('textarea').first()).toHaveValue('');
  expect(posts).toHaveLength(0);
 });
}