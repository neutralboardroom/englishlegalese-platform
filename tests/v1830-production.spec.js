const {test,expect}=require('@playwright/test');
test('v1.83 real apex/www displays latest workshop, four source stages, pricing and resources',async({page})=>{
 for(const d of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 const r=await page.goto(d+'/');expect(r.status()).toBeLessThan(400);
 expect(r.headers()['x-englishlegalese-release']).toBe('1.83.0');
 await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.83.0');
 await page.goto(d+'/#v1830-writing-lab');await page.locator('body.v1590-ready').waitFor();
 const lab=page.locator('#v1830-writing-lab');
 await expect(lab).toBeVisible();await expect(lab.locator('#v1830-topic option')).toHaveCount(28);
 await expect(lab.locator('.v1830-check')).toHaveCount(4);
 await expect(page.locator('#v1820-learning-studio')).toBeVisible();
 await expect(page.locator('#pricing')).toContainText('$24');
 await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
 await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
 }
});
