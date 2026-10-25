const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('HF10: 24 Legal workbooks offer structured navigation on '+host,async({page})=>{
  const response=await page.goto(host+'/learn/legal-english/');expect(response.status()).toBeLessThan(400);
  await expect(page.locator('#v1860-legal-catalog .v1910-path')).toHaveCount(24);
  const card=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await card.locator('.v1870-toggle input').check();
  await expect(card.locator('.v1910-path-links a')).toHaveCount(8);
  await card.locator('.v1910-path-links a').first().click();
  await expect(card.locator('.v1900-evidence-lab')).toBeFocused();
 });
 test('HF10: Business and Investor keep all 24 local workbook maps on '+host,async({page})=>{
  const response=await page.goto(host+'/learn/business-english/');expect(response.status()).toBeLessThan(400);
  await expect(page.locator('#v1850-business-cards .v1910-path')).toHaveCount(16);
  await expect(page.locator('#v1850-investor-cards .v1910-path')).toHaveCount(8);
  const card=page.locator('#v1850-investor-cards .v1850-course-card').first();
  await card.locator('.v1870-toggle input').check();
  await expect(card.locator('.v1910-path-links a')).toHaveCount(8);
  await expect(card.locator('.v1890-stage')).toHaveCount(4);
 });
 test('HF10: navigation and practice progress stay local and do not POST on '+host,async({page})=>{
  const requests=[];page.on('request',r=>{if(r.method()==='POST')requests.push(r.url())});
  await page.goto(host+'/learn/legal-english/');
  const card=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await card.locator('.v1870-toggle input').check();
  await card.locator('.v1900-evidence-lab input[value="correct"]').check();
  await expect(card.locator('.v1910-status')).toContainText('1 of 7');
  await expect(card.locator('.v1910-status')).toContainText('Not a grade');
  expect(requests).toHaveLength(0);
 });
}
