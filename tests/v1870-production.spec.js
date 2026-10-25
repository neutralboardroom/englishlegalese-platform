const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('Human versus AI learning paths and actual 24 detailed Legal English workbooks on '+host,async({page})=>{
  const res=await page.goto(host+'/learn/legal-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('.v1870-learning-modes[aria-labelledby="v1870-legal-modes"]')).toContainText('Human-taught classes');
  await expect(page.locator('.v1870-learning-modes[aria-labelledby="v1870-legal-modes"]')).toContainText('SmartTeacher AI');
  await expect(page.locator('#v1860-legal-catalog .v1870-workbook')).toHaveCount(24);
  await expect(page.locator('#v1850-legal-sessions article')).toHaveCount(16);
  const a=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await a.locator('.v1870-toggle input').check();
  await expect(a.locator('.v1870-module')).toHaveCount(4);
  await expect(a.locator('.v1870-question')).toHaveCount(3);
  await expect(a.locator('.v1880-targeted-task')).toHaveCount(4);
  await expect(a.locator('.v1870-rubric-item')).toHaveCount(4);
  await expect(a.locator('.v1880-targeted-task')).toHaveCount(4);
  await expect(a.locator('.v1880-progress')).toContainText('0 of 3');
  await a.locator('.v1870-question').first().locator('input[type=radio]').first().check();
  await expect(a.locator('.v1880-progress')).toContainText('1 of 3');
 });
 test('Human versus AI learning paths and actual 24 detailed Business/Investor workbooks on '+host,async({page})=>{
  const res=await page.goto(host+'/learn/business-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('.v1870-learning-modes[aria-labelledby="v1870-business-modes"]')).toContainText('Human-taught classes');
  await expect(page.locator('.v1870-learning-modes[aria-labelledby="v1870-business-modes"]')).toContainText('not an activated AI-led course');
  await expect(page.locator('#v1850-business-cards .v1870-workbook')).toHaveCount(16);
  await expect(page.locator('#v1850-investor-cards .v1870-workbook')).toHaveCount(8);
  const a=page.locator('#v1850-investor-cards .v1850-course-card').first();
  await a.locator('.v1870-toggle input').check();
  await expect(a.locator('.v1870-module')).toHaveCount(4);
  await expect(a.locator('.v1870-question')).toHaveCount(3);
  await expect(a.locator('.v1880-targeted-task')).toHaveCount(4);
 });
 test('Real nontransactional topic-interest form and current group schedule metadata on '+host,async({page})=>{
  await page.goto(host+'/learn/enroll/');
  const form=page.locator('#v1850-enroll-form');
  await form.locator('select[name=interest]').selectOption('four');
  await form.locator('select[name=topic]').selectOption('class-01');
  await expect(form.locator('select[name=schedule_id]')).toHaveValue('topic-time-request');
  await expect(form.locator('select[name=format] option[value=group]')).toContainText('$79');
  const schedules=await page.request.get(host+'/api/v1850/schedules');
  expect(schedules.status()).toBe(200);
  const body=await schedules.json();
  expect(body.schedules).toHaveLength(2);
  expect(body.schedules[0].price_usd).toBe(249);
  expect(body.schedules[1].price_usd).toBe(249);
  expect(body.stripe_enabled).toBe(false);
 });
}