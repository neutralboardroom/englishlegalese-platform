const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
test('v1.85 live Business and Legal English accepted: '+host,async({page})=>{
 const root=await page.goto(host+'/');expect(root.status()).toBeLessThan(400);
 expect(root.headers()['x-englishlegalese-release']).toBe('1.85.0');
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.85.0');
 await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 await page.goto(host+'/learn/business-english/');
 await expect(page.locator('.v1850-course-card')).toHaveCount(24);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await page.goto(host+'/pricing/#extended-programs');
 await expect(page.locator('#extended-programs .v1850-course-card')).toHaveCount(2);
 await page.goto(host+'/learn/teach-with-us/');
 await expect(page.locator('main')).toContainText('No open position');
});
}
