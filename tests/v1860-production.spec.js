const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('Complete 24-course Legal English page and 16 sessions public on '+host,async({page})=>{
  const res=await page.goto(host+'/learn/legal-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('.v1860-overview')).toContainText('24 subject-specific');
  await expect(page.locator('#v1860-legal-catalog .v1860-course-card')).toHaveCount(24);
  await expect(page.locator('#v1860-legal-catalog .v1860-always-outline li')).toHaveCount(96);
  await expect(page.locator('#v1850-legal-sessions article')).toHaveCount(16);
  await page.locator('.v1860-course-card summary').first().click();
  await expect(page.locator('.v1860-course-card').first().locator('.v1860-glossary dt')).toHaveCount(5);
  await expect(page.locator('.v1860-overview')).toContainText('$289');
 });
 test('Complete 24-course Business English page and 16 sessions public on '+host,async({page})=>{
  const res=await page.goto(host+'/learn/business-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('.v1860-overview')).toContainText('24 detailed courses');
  await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
  await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
  await expect(page.locator('.v1850-course-card .v1860-always-outline li')).toHaveCount(96);
  await expect(page.locator('#v1850-business-sessions article')).toHaveCount(16);
  await page.locator('#v1850-business-cards .v1850-course-card summary').first().click();
  await expect(page.locator('#v1850-business-cards .v1850-course-card').first().locator('dt')).toHaveCount(5);
  await expect(page.locator('.v1860-overview')).toContainText('$799');
 });
}