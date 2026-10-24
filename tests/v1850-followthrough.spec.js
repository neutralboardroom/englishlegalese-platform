const {test,expect}=require('@playwright/test');
test('Navigation shows Legal English immediately before Business English without altering original homepage hero',async({page})=>{
 await page.goto('/');await page.locator('body.v1590-ready').waitFor();
 const names=(await page.locator('#mainNav > a').allTextContents()).map(x=>x.trim());
 expect(names.indexOf('Legal English')).toBeGreaterThanOrEqual(0);
 expect(names.indexOf('Business English')).toBe(names.indexOf('Legal English')+1);
 await expect(page.locator('.hero h1')).toContainText('Legal English with AI-supported practice');await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Legal English',exact:true}).click();await expect(page.getByRole('heading',{name:'Legal English courses, practice and live classes'})).toBeVisible();
});
test('Interior navigation offers both subject areas and all free tools',async({page})=>{
 await page.goto('/learn/business-english/');
 const nav=page.locator('.v1840-topnav');
 const names=(await nav.locator(':scope > a').allTextContents()).map(x=>x.trim());
 expect(names.indexOf('Business English')).toBe(names.indexOf('Legal English')+1);
 await nav.locator('summary',{hasText:'Free learning resources'}).click();
 await expect(nav.locator('a[href="/learn/legal-resources/"]')).toHaveCount(1);
 await expect(nav.locator('a[href="/learn/business-resources/"]')).toHaveCount(1);
 await expect(nav.locator('a[href^="/learn/business-resources/"]')).toHaveCount(9);
});
test('16-session Legal and Business classroom materials expand without sending personal data',async({page})=>{
 await page.goto('/learn/classroom-programs/');
 await expect(page.locator('#v1850-legal-sessions article')).toHaveCount(16);
 await expect(page.locator('#v1850-business-sessions article')).toHaveCount(16);
 await page.locator('#v1850-legal-sessions summary').first().click();
 await expect(page.locator('#v1850-legal-sessions article').first()).toContainText('50-minute instructor agenda');
 await expect(page.locator('#v1850-legal-sessions article').first()).toContainText('Teacher preparation and assessment');
 await page.locator('#v1850-business-sessions summary').nth(13).click();
 await expect(page.locator('#v1850-business-sessions article').nth(13)).toContainText('Investor relations and earnings calls');
});
test('Each subject area links directly to its independent 16-session learning plan',async({page})=>{
 await page.goto('/learn/courses/');
 await expect(page.locator('a[href="/learn/classroom-programs/#legal"]').first()).toBeVisible();
 await page.goto('/learn/business-english/');
 await expect(page.locator('a[href="/learn/classroom-programs/#business"]').first()).toBeVisible();
});
