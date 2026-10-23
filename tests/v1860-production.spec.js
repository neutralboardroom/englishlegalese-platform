const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
test('v1.86 public Legal and Business course guide acceptance '+host,async({page})=>{
 const root=await page.goto(host+'/');expect(root.status()).toBeLessThan(400);expect(root.headers()['x-englishlegalese-release']).toBe('1.86.0');
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.86.0');
 const labels=await page.locator('#mainNav > a').allTextContents();expect(labels.indexOf('Business English')).toBe(labels.indexOf('Legal English')+1);
 for(const slug of ['legal-english-program','business-english-program']){await page.goto(host+'/learn/'+slug+'/');await expect(page.locator('.v1860-session')).toHaveCount(16);await page.locator('.v1860-session summary').first().click();await expect(page.locator('.v1860-session').first().locator('dt')).toHaveCount(5);}
 await page.goto(host+'/learn/business-english/');await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 const r=await page.request.get(host+'/api/v1850/intake-status');expect(r.status()).toBe(200);expect((await r.json()).ready).toBe(true);
 await page.goto(host+'/learn/enroll/');await expect(page.locator('#v1850-enroll-form')).toHaveCount(1);
});
}