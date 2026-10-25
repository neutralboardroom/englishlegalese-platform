const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('Complete real 24+24 pathways and eight-session teaching plans on '+host,async({page})=>{
  const r=await page.goto(host+'/learn/complete-programs/');expect(r.status()).toBeLessThan(400);
  await expect(page.locator('#v1850-complete-legal-list article')).toHaveCount(24);
  await expect(page.locator('#v1850-complete-business-list article')).toHaveCount(24);
  await page.goto(host+'/learn/classroom-programs/');
  await expect(page.locator('#v1850-legal-eight article')).toHaveCount(8);
  await expect(page.locator('#v1850-business-eight article')).toHaveCount(8);
 });
 test('New published six-tier prices and real form choices on '+host,async({page})=>{
  await page.goto(host+'/pricing/');
  for(const rate of ['$24','$79','$149','$249','$349','$649','$45','$169','$319','$599','$849','$1,599'])await expect(page.locator('main')).toContainText(rate);
  await page.goto(host+'/learn/enroll/');
  const f=page.locator('#v1850-enroll-form');
  await f.locator('select[name=interest]').selectOption('eight');
  await expect(f.locator('select[name=format] option[value=group]')).toContainText('$149');
  await f.locator('select[name=program]').selectOption('complete');
  await expect(f.locator('select[name=interest]')).toHaveValue('full48');
  await expect(f.locator('select[name=format] option[value=private]')).toContainText('$1599');
  const schedules=await page.request.get(host+'/api/v1850/schedules');expect(schedules.status()).toBe(200);
  const data=await schedules.json();expect(data.schedules).toHaveLength(2);
  expect(data.schedules[0].price_usd).toBe(249);expect(data.schedules[1].price_usd).toBe(249);expect(data.stripe_enabled).toBe(false);
 });
}
