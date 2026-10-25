const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('HF7 complete curricula filter all 48 subjects on '+host,async({page})=>{
  let r=await page.goto(host+'/learn/complete-programs/');expect(r.status()).toBeLessThan(400);
  const search=page.locator('#v1880-topic-discovery');await expect(search).toContainText('Showing 48 of 48 topics');
  await search.getByLabel('Show topic category').selectOption('investor');
  await expect(search).toContainText('Showing 8 of 48 topics');
  await expect(page.locator('#v1850-complete-business-list article:visible')).toHaveCount(8);
  await search.getByRole('button',{name:'Clear search and category'}).click();
  await expect(search).toContainText('Showing 48 of 48 topics');
 });
 test('HF7 employer quote is local, arithmetic correct and can hand off to inquiry on '+host,async({page})=>{
  let r=await page.goto(host+'/pricing/');expect(r.status()).toBeLessThan(400);
  const tool=page.locator('#v1880-group-estimator');await expect(tool).toContainText('Estimated group total: $424.65');
  await tool.getByLabel('Teaching pathway').selectOption('business');
  await tool.getByLabel('Lessons per employee').selectOption('24');
  await tool.getByLabel('Number of participating employees (3–999)').fill('12');
  await expect(tool).toContainText('Estimated group total: $3,559.80');
  await tool.getByRole('link',{name:'Request an employer quote with these selections'}).click();
  await expect(page.locator('select[name=program]')).toHaveValue('business');
  await expect(page.locator('select[name=interest]')).toHaveValue('full24');
  await expect(page.locator('input[name=employee_seats]')).toHaveValue('12');
  await expect(page.locator('input[name=organization]')).toHaveValue('');
 });
}