const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('v1.86 actual live legal/business course pathways '+host,async({page})=>{
  const response=await page.goto(host+'/');expect(response.status()).toBeLessThan(400);
  expect(response.headers()['x-englishlegalese-release']).toBe('1.86.0');
  const nav=page.locator('#mainNav');
  await expect(nav.locator('a[href="/learn/legal-english/"]')).toHaveCount(1);
  await expect(nav.locator('a[href="/learn/business-english/"]')).toHaveCount(1);
  await page.goto(host+'/learn/legal-english/');
  await expect(page.locator('#v1860-legal-topics .v1850-course-card')).toHaveCount(24);
  await expect(page.locator('#v1860-legal-sessions details.v1860-session')).toHaveCount(16);
  await page.goto(host+'/learn/business-english/');
  await expect(page.locator('#v1860-business-sessions details.v1860-session')).toHaveCount(16);
  await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
  await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
  const r=await page.request.get(host+'/api/v1850/intake-status');expect(r.status()).toBe(200);expect((await r.json()).ready).toBe(true);
 });
}
