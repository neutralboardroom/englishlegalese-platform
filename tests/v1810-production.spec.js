const {test,expect}=require('@playwright/test');
test('v1.81 real apex and www display honest researched pricing and preserved free resources',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  const response=await page.goto(domain+'/');expect(response.status()).toBeLessThan(400);
  expect(response.headers()['x-englishlegalese-release']).toBe('1.83.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.84.0');
  await page.goto(domain+'/#pricing');await page.locator('body.v1590-ready').waitFor();
  const p=page.locator('#pricing');await expect(p).toBeVisible();
  for(const price of ['$12/month','$19/month','$29/month','$24','$79 total','$59','$219 total','From $499'])await expect(p).toContainText(price);
  await expect(p).toContainText('not available for purchase today');
  await expect(page.locator('#mainNav a[href="#pricing"]')).toHaveCount(1);
  await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
  await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
  await expect(page.locator('#v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 }
});