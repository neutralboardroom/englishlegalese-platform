const {test,expect}=require('@playwright/test');
test('Legal English appears immediately before Business English in the main menu',async({page})=>{
 await page.goto('/'); await page.locator('body.v1590-ready').waitFor();
 const items=await page.locator('#mainNav > a').allTextContents();
 expect(items.indexOf('Business English')-items.indexOf('Legal English')).toBe(1);
 await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
});
test('Legal English has a standalone 16-session teaching pathway',async({page})=>{
 await page.goto('/learn/legal-english/');
 await expect(page.getByRole('heading',{name:/Legal English for lawyers/})).toBeVisible();
 await expect(page.locator('#v1850-legal-16-week details[data-week]')).toHaveCount(16);
 const first=page.locator('#v1850-legal-16-week details[data-week]').first();
 await first.locator('summary').click();
 await expect(first).toContainText('Vocabulary and definitions');
 await expect(first).toContainText('Teacher materials and assessment');
});
test('Business English retains all courses and adds 16 full weekly outlines',async({page})=>{
 await page.goto('/learn/business-english/');
 await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await expect(page.locator('#v1850-business-16-week details[data-week]')).toHaveCount(16);
});
test('pricing and both request forms show consistent paired language navigation',async({page})=>{
 for(const path of ['/pricing/','/learn/enroll/','/learn/teach-with-us/']){
  await page.goto(path);
  const items=await page.locator('.v1840-topnav > a').allTextContents();
  expect(items.indexOf('Business English')-items.indexOf('Legal English')).toBe(1);
 }
});
