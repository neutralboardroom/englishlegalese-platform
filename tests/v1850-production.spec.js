const {test,expect}=require('@playwright/test');
const releaseVersion=require('../package.json').version;
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
test('v1.85 live Business and Legal English accepted: '+host,async({page})=>{
 const root=await page.goto(host+'/');expect(root.status()).toBeLessThan(400);
 expect(root.headers()['x-englishlegalese-release']).toBe(releaseVersion);
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content',releaseVersion);
 await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 await page.goto(host+'/learn/business-english/');
 await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await page.goto(host+'/pricing/#extended-programs');
 await expect(page.locator('#extended-programs .v1850-course-card')).toHaveCount(2);
 await page.goto(host+'/learn/teach-with-us/');
 await expect(page.locator('#v1850-teacher-apply form')).toHaveCount(1);
 await page.goto(host+'/learn/enroll/');
 await expect(page.locator('#v1850-enroll-form')).toHaveCount(1);
 const health=await page.request.get(host+'/api/v1850/intake-status');
 expect(health.status()).toBe(200);
 const intake=await health.json();expect(intake.ready).toBe(true);
 const schedule=await page.request.get(host+'/api/v1850/schedules');expect(schedule.status()).toBe(200);
 const scheduleData=await schedule.json();expect(scheduleData.schedules).toHaveLength(2);expect(scheduleData.stripe_enabled).toBe(false);
 await page.goto(host+'/learn/business-resources/business-email/');
 await expect(page.locator('#v1850-resource-app fieldset')).toHaveCount(3);
});
}
