const {test,expect}=require('@playwright/test');
test('v1.82 real apex/www displays 28-topic personal four-session plans with older pricing intact',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  const response=await page.goto(domain+'/');expect(response.status()).toBeLessThan(400);
  expect(response.headers()['x-englishlegalese-release']).toBe('1.83.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.83.0');
  await page.goto(domain+'/#v1820-learning-studio');await page.locator('body.v1590-ready').waitFor();
  const s=page.locator('#v1820-learning-studio');
  await expect(s).toBeVisible();
  await expect(s.locator('#v1820-course option')).toHaveCount(28);
  await expect(s.locator('.v1820-session')).toHaveCount(4);
  await s.locator('#v1820-track').selectOption('Legal specialties');
  await expect(s.locator('#v1820-course option')).toHaveCount(12);
  await expect(s.locator('.v1820-homework li')).toHaveCount(4);
  await expect(s).toContainText('no teacher or class is booked');
  await expect(page.locator('#pricing')).toContainText('$24');
  await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
  await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
 }
});
