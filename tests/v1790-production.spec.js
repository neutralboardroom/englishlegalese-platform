const {test,expect}=require('@playwright/test');
test('v1.79 both public domains serve current release and usable course 3 lessons',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  const response=await page.goto(domain+'/');expect(response.status()).toBeLessThan(400);
  expect(response.headers()['x-englishlegalese-release']).toBe('1.79.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.79.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.79.0');
  await page.goto(domain+'/#courses');await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#courses .v1790-third-action')).toHaveCount(6);
  await page.goto(domain+'/#live-classes');await page.locator('body.v1590-ready').waitFor();
  const prep=page.locator('#v1790-class-prep');await prep.locator('summary').click();
  await expect(prep.locator('.v1790-times tbody tr')).toHaveCount(8);
  await expect(prep).toContainText('not request, book or pay for a class');
 }
});
