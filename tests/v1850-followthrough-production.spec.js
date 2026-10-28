const {test,expect}=require('@playwright/test');
const releaseVersion=require('../package.json').version;
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('Navigation and 32 real teaching plans are public on '+host,async({page})=>{
  const res=await page.goto(host+'/');expect(res.status()).toBeLessThan(400);
  expect(res.headers()['x-englishlegalese-release']).toBe(releaseVersion);
  const titles=(await page.locator('#mainNav > a').allTextContents()).map(x=>x.trim());
  expect(titles.indexOf('Business English')).toBe(titles.indexOf('Legal English')+1);
  await page.goto(host+'/learn/legal-english/');await expect(page.getByRole('heading',{name:'Legal English courses, practice and live classes'})).toBeVisible();await page.goto(host+'/learn/classroom-programs/');
  await expect(page.getByRole('heading',{name:/Legal English and Business English: 8- and 16-session learning plans/})).toBeVisible();
  await expect(page.locator('#v1850-legal-eight article')).toHaveCount(8);
  await expect(page.locator('#v1850-business-eight article')).toHaveCount(8);
  await expect(page.locator('#v1850-legal-sessions article')).toHaveCount(16);
  await expect(page.locator('#v1850-business-sessions article')).toHaveCount(16);
  await page.locator('#v1850-business-sessions summary').first().click();
  await expect(page.locator('#v1850-business-sessions article').first()).toContainText('Homework');
  await page.goto(host+'/learn/enroll/');
  const ready=await page.request.get(host+'/api/v1850/intake-status');expect(ready.status()).toBe(200);
 });
}
