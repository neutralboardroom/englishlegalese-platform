const {test,expect}=require('@playwright/test');
test('v1.85 homepage retains original Legal English hero but links to Business English',async({page})=>{
 await page.goto('/');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.85.0');
 await expect(page.locator('.hero h1')).toContainText('Legal English with AI-supported practice and live online classes with human teachers');
 await expect(page.locator('.site-footer')).toContainText('Legal English and Business English');
 await expect(page.locator('#mainNav a[href="/learn/business-english/"]')).toHaveCount(1);
 await expect(page.locator('.site-footer a[href="/learn/business-english/"]')).toHaveCount(2);
 await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
});
test('v1.85 all Business English courses have interactive practice and teacher materials',async({page})=>{
 await page.goto('/learn/business-english/');
 await expect(page.getByRole('heading',{name:/Business English for work/})).toBeVisible();
 await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await expect(page.locator('.v1850-course-card')).toHaveCount(24);
 const card=page.locator('#v1850-investor-cards .v1850-course-card').first();
 await card.locator('summary').click();await expect(card.locator('.v1850-material li')).toHaveCount(4);
 await expect(card.locator('dt')).toHaveCount(5);
 await expect(card.locator('fieldset label')).toHaveCount(3);
 await card.locator('button').click();await expect(card.locator('.v1850-feedback')).toContainText('Choose a response first');
 await card.locator('input[type=radio]').first().check();await card.locator('button').click();
 await expect(card.locator('.v1850-feedback')).toContainText('Correct.');
});
test('v1.85 private study planner operates without account or server submission',async({page})=>{
 await page.goto('/learn/business-english/');
 await expect(page.locator('#v1850-plan-select option')).toHaveCount(25);
 await page.locator('#v1850-plan-select').selectOption('ws-03');
 await page.locator('#v1850-plan-build').click();
 await expect(page.locator('#v1850-plan-result li')).toHaveCount(4);
 await expect(page.locator('#v1850-plan-result')).toContainText('Earnings Calls');
});
test('v1.85 separate extended classroom packages and multi-teacher recruitment are proposals',async({page})=>{
 await page.goto('/pricing/#extended-programs');
 await expect(page.locator('#extended-programs .v1850-course-card')).toHaveCount(2);
 await expect(page.locator('#extended-programs')).toContainText('$249');
 await expect(page.locator('#extended-programs')).toContainText('$699');
 await expect(page.locator('#extended-programs')).toContainText('independent');
 await expect(page.locator('input[type="payment"]')).toHaveCount(0);
 await page.goto('/learn/teach-with-us/');
 await expect(page.getByRole('heading',{name:/Teach Legal English or Business English/})).toBeVisible();
 await expect(page.locator('main')).toContainText('No open position');
 await expect(page.locator('main form')).toHaveCount(0);
});
test('v1.85 Business English is independently accessible from header/footer of legal pages',async({page})=>{
 await page.goto('/learn/courses/');
 await expect(page.locator('.v1840-topnav a[href="/learn/business-english/"]')).toHaveCount(1);
 await expect(page.locator('.v1840-footer a[href="/learn/business-english/"]')).toHaveCount(1);
 await page.locator('.v1840-topnav a[href="/learn/business-english/"]').click();
 await expect(page).toHaveURL(/\/learn\/business-english\/$/);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
});
