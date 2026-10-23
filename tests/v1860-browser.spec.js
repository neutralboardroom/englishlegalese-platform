const {test,expect}=require('@playwright/test');
test('v1.86 desktop homepage navigation has Legal English directly before Business English',async({page})=>{
 await page.goto('/');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.86.0');
 const items=await page.locator('#mainNav > a').allTextContents();const legal=items.indexOf('Legal English'),business=items.indexOf('Business English');
 expect(legal).toBeGreaterThanOrEqual(0);expect(business).toBe(legal+1);
 await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 await page.locator('#mainNav a[href="/learn/courses/"]').click();await expect(page).toHaveURL(/\/learn\/courses\/$/);
 await page.locator('.v1840-topnav a[href="/learn/business-english/"]').click();await expect(page).toHaveURL(/\/learn\/business-english\/$/);
});
for(const [slug,other] of [['legal-english-program','business-english-program'],['business-english-program','legal-english-program']]){
test('v1.86 comprehensive live 16-session instructional guide '+slug,async({page})=>{
 await page.goto('/learn/'+slug+'/');await expect(page.locator('.v1860-session')).toHaveCount(16);
 const first=page.locator('.v1860-session').first();await first.locator('summary').click();
 await expect(first.locator('ol li')).toHaveCount(5);await expect(first.locator('dt')).toHaveCount(5);
 const input=first.locator('textarea');await input.fill('A private practice draft for a fictional educational scenario.');
 await first.locator('button').click();await expect(first).toContainText('Illustrative response:');
 await page.reload();await expect(page.locator('.v1860-session').first().locator('textarea')).toHaveValue('');
 await expect(page.locator('a[href="/learn/'+other+'/"]').first()).toBeVisible();
});
}
test('v1.86 legacy curriculum and enrollment links remain available from both tracks',async({page})=>{
 await page.goto('/learn/courses/');await expect(page.locator('a[href="/learn/legal-english-program/"]').first()).toHaveCount(1);
 await page.goto('/learn/business-english/');await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await expect(page.locator('a[href="/learn/business-english-program/"]').first()).toHaveCount(1);
 await page.goto('/learn/enroll/');await expect(page.locator('#v1850-enroll-form')).toHaveCount(1);
});
