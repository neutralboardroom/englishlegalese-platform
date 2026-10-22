const {test,expect}=require('@playwright/test');
test('v1.78 public apex and www preserve live video classroom teaching journey and versioned assets',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  const r=await page.goto(domain+'/');expect(r.status()).toBeLessThan(400);
  expect(r.headers()['x-englishlegalese-release']).toBe('1.83.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.83.0');
  await expect(page.locator('#home h1')).toContainText('live online classes with human teachers');
  await expect(page.locator('#live-classes')).toBeVisible();
  await page.goto(domain+'/#live-classes');await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#v1780-provider')).toBeVisible();
  await page.locator('#v1780-provider').selectOption('zoom');
  await page.locator('#v1780-when').fill('2035-04-17T14:30');
  await page.getByRole('button',{name:'Preview class plan'}).click();
  await expect(page.locator('.v1780-class-result')).toContainText('Not booked');
  await page.goto(domain+'/#courses');await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('.v1780-next-action')).toHaveCount(6);
 }
});
test('v1.78 live route still preserves earlier SmartTeacher character count, Georgian and expandable footer',async({page})=>{
 await page.goto('https://englishlegalese.com/#smartteacher');await expect(page.locator('#v1770-main-counter')).toBeVisible();
 await page.goto('https://englishlegalese.com/#language-bridge');
 await expect(page.locator('#language-bridge .js-language-select')).toContainText('Georgian');
 await page.goto('https://englishlegalese.com/#home');
 await expect(page.locator('.site-footer #v1770-all-resources')).not.toHaveAttribute('open');
 await page.locator('.site-footer #v1770-all-resources summary').click();
 await expect(page.locator('.site-footer a[href="#reading-precision-lab"]')).toBeVisible();
});
