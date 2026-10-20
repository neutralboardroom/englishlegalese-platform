const {test,expect}=require('@playwright/test');
test('v1.77 real apex and www show main source, concise footer and functional learning actions',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  const resp=await page.goto(domain+'/');expect(resp.status()).toBeLessThan(400);
  expect(resp.headers()['x-englishlegalese-release']).toBe('1.77.0');
  await page.locator('body.v1590-ready').waitFor();await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.77.0');
  await page.goto(domain+'/#smartteacher');await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#v1770-main-counter')).toBeVisible();
  await page.goto(domain+'/#language-bridge');await page.locator('body.v1590-ready').waitFor();await page.locator('#language-bridge select').selectOption({label:'Georgian (ქართული)'});
  await page.getByRole('button',{name:'Explain in my language'}).click();await expect(page.locator('.v1770-language-output')).toContainText('შეხვედრის');
  await page.goto(domain+'/#courses');await page.locator('body.v1590-ready').waitFor();await page.locator('.v1580-course-card').nth(2).getByRole('button',{name:'Start a sample lesson'}).click();await expect(page.locator('#v1770-course-lesson')).toBeVisible();
  await page.goto(domain+'/#home');await page.locator('body.v1590-ready').waitFor();await expect(page.locator('.site-footer #v1770-all-resources')).toHaveCount(1);
 }
});
