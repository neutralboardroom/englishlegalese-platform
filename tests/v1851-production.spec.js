const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com'])test('v1.85.1 public Legal-first navigation, courses and 32 session plans '+host,async({page})=>{
 const res=await page.goto(host+'/');expect(res.status()).toBeLessThan(400);expect(res.headers()['x-englishlegalese-release']).toBe('1.85.1');
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.85.1');await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 const links=await page.locator('#mainNav > a').evaluateAll(nodes=>nodes.map(x=>x.getAttribute('href')));const n=links.indexOf('/learn/legal-english/');expect(n).toBeGreaterThanOrEqual(0);expect(links[n+1]).toBe('/learn/business-english/');
 await page.goto(host+'/learn/legal-english/');await expect(page.locator('h1')).toContainText('Legal English courses');
 await page.goto(host+'/learn/business-english/');await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await page.goto(host+'/learn/classroom-programs/');await expect(page.locator('#v1851-legal-sessions .v1851-session')).toHaveCount(16);await expect(page.locator('#v1851-business-sessions .v1851-session')).toHaveCount(16);
 await page.goto(host+'/learn/enroll/');await expect(page.locator('#v1850-enroll-form')).toHaveCount(1);const db=await page.request.get(host+'/api/v1850/intake-status');expect(db.status()).toBe(200);expect((await db.json()).ready).toBe(true);
 await page.goto(host+'/learn/teach-with-us/');await expect(page.locator('#v1850-teacher-apply form')).toHaveCount(1);
 const hostile=await page.request.post(host+'/api/v1850/enroll',{data:{},headers:{origin:'https://untrusted.test'}});expect(hostile.status()).toBe(403);
 await page.goto(host+'/learn/business-resources/business-email/');await expect(page.locator('#v1850-resource-app fieldset')).toHaveCount(3);
});
