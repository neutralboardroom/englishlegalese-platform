const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('v1.84 live standalone page and pricing parity — '+host,async({page,request})=>{
  const root=await page.goto(host+'/');expect(root.status()).toBeLessThan(400);
  expect(root.headers()['x-englishlegalese-release']).toBe('1.84.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.84.0');
  await expect(page.locator('#pricing')).toContainText('$79 total');
  await expect(page.locator('#mainNav a[href="/pricing/"]')).toHaveCount(1);
  await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
  await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
  await expect(page.locator('#v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
  await page.goto(host+'/pricing/');
  await expect(page.locator('#pricing')).toContainText('From $499');
  await expect(page.locator('.v1840-foot-resources a')).toHaveCount(14);
  await page.goto(host+'/learn/courses/');
  await expect(page.locator('#v1840-course-mount #v1800-class-catalog .v1800-class-card')).toHaveCount(28);
  await expect(page.locator('#v1840-course-mount .v1800-class-count')).toContainText('28 class topics');
  await page.goto(host+'/#courses');await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#courses .section-head h2')).toContainText('28 class topics');
  await expect(page.locator('#courses .v1800-class-card')).toHaveCount(12);
  await expect(page.locator('#v1840-sample-lessons')).not.toHaveAttribute('open');
  await page.goto(host+'/learn/legal-vocabulary/');
  await expect(page.locator('#v1840-content')).toContainText('Vocabulary');
  await expect(page.locator('#v1840-content button')).toHaveCount(1);
 });
}
