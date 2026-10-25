const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('HF11 source-aware Legal feedback stays local on '+host,async({page})=>{
  const posts=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url())});
  const response=await page.goto(host+'/learn/legal-english/');expect(response.status()).toBeLessThan(400);
  await expect(page.locator('#v1860-legal-catalog .v1870-workbook')).toHaveCount(24);
  const card=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await card.locator('.v1870-toggle input').check();
  await card.locator('.v1870-question').first().locator('.v1870-answer').filter({hasText:'The filing deadline is definitely Friday'}).locator('input').check();
  await expect(card.locator('.v1870-question').first().locator('.v1870-check-feedback')).toContainText('Scenario reasoning');
  await expect(card.locator('.v1870-question').first().locator('.v1870-check-feedback')).toContainText('Could you show me the notice');
  expect(posts).toHaveLength(0);
 });
 test('HF11 source-aware Business feedback corrects conditional-discount overclaim on '+host,async({page})=>{
  const response=await page.goto(host+'/learn/business-english/');expect(response.status()).toBeLessThan(400);
  await expect(page.locator('#v1850-business-cards .v1870-workbook')).toHaveCount(16);
  const card=page.locator('#v1850-business-cards .v1850-course-card').filter({hasText:'Business Negotiations'}).first();
  await card.locator('.v1870-toggle input').check();
  await card.locator('.v1870-question').first().locator('.v1870-answer').filter({hasText:'The buyer can treat the discount'}).locator('input').check();
  const fb=card.locator('.v1870-question').first().locator('.v1870-check-feedback');
  await expect(fb).toContainText('Scenario reasoning');
  await expect(fb).toContainText('revised delivery date');
  await expect(card.locator('.v1910-path')).toHaveCount(1);
 });
 test('HF11 Investor feedback contrasts terms and avoids generic distractors on '+host,async({page})=>{
  const response=await page.goto(host+'/learn/business-english/');expect(response.status()).toBeLessThan(400);
  await expect(page.locator('#v1850-investor-cards .v1870-workbook')).toHaveCount(8);
  const card=page.locator('#v1850-investor-cards .v1850-course-card').first();
  await card.locator('.v1870-toggle input').check();
  await card.locator('.v1870-question').first().locator('.v1870-answer').filter({hasText:"Today's eight-percent increase"}).locator('input').check();
  await expect(card.locator('.v1870-question').first().locator('.v1870-check-feedback')).toContainText('Scenario reasoning');
  await card.locator('.v1870-question').nth(1).locator('input[type=radio]').first().check();
  await expect(card.locator('.v1870-question').nth(1).locator('.v1870-check-feedback')).toContainText('Vocabulary reasoning');
  await expect(card.locator('.v1890-stage')).toHaveCount(4);
 });
}