const {test,expect}=require('@playwright/test');
test('v1.85 homepage retains original Legal English hero but links to Business English',async({page})=>{
 await page.goto('/');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.85.1');
 await expect(page.locator('.hero h1')).toContainText('Legal English with AI-supported practice and live online classes with human teachers');
 await expect(page.locator('.site-footer')).toContainText('Legal English and Business English');
 await expect(page.locator('#mainNav a[href="/learn/business-english/"]')).toHaveCount(1);
 await expect(page.locator('.site-footer a[href="/learn/business-english/"]')).toHaveCount(1);
 await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
});
test('v1.85 all Business English courses have interactive practice and teacher materials',async({page})=>{
 await page.goto('/learn/business-english/');
 await expect(page.getByRole('heading',{name:/Business English for work/})).toBeVisible();
 await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
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
test('v1.85 extended Legal and Business classrooms, enrollment and teacher recruitment workflows',async({page})=>{
 await page.goto('/pricing/#extended-programs');
 await expect(page.locator('#extended-programs .v1850-course-card')).toHaveCount(2);
 await expect(page.locator('#extended-programs')).toContainText('$249');
 await expect(page.locator('#extended-programs')).toContainText('$699');
 await expect(page.locator('#extended-programs')).toContainText('independent');
 await expect(page.locator('input[type="payment"]')).toHaveCount(0);
 await page.goto('/learn/teach-with-us/');
 await expect(page.getByRole('heading',{name:/Teach Legal English or Business English/})).toBeVisible();
 await expect(page.locator('#v1850-teacher-apply form')).toHaveCount(1);
 await expect(page.locator('#v1850-staff-form input[name="email"]')).toHaveCount(1);
});
test('v1.85 Business English is independently accessible from header/footer of legal pages',async({page})=>{
 await page.goto('/learn/courses/');
 await expect(page.locator('.v1840-topnav a[href="/learn/business-english/"]')).toHaveCount(1);
 await expect(page.locator('.v1840-footer a[href="/learn/business-english/"]')).toHaveCount(1);
 await page.locator('.v1840-topnav a[href="/learn/business-english/"]').click();
 await expect(page).toHaveURL(/\/learn\/business-english\/$/);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
});

test('v1.85 enrollment submits a valid intake request without payment',async({page})=>{
 await page.route('**/api/v1850/enroll',route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,received:true,reference:'TEST-RECEIVED-ONLY'})}));
 await page.goto('/learn/enroll/');await page.locator('#v1850-enroll-form input[name="full_name"]').fill('Fictional Learner');
 await page.locator('#v1850-enroll-form input[name="email"]').fill('example@example.net');
 await page.locator('#v1850-enroll-form select[name="program"]').selectOption('business');
 await expect(page.locator('#v1850-enroll-form select[name="schedule_id"]')).toHaveValue('business-group-wed');
 await page.locator('#v1850-enroll-form button[type="submit"]').click();
 await expect(page.locator('#v1850-enrollment-app')).toContainText('TEST-RECEIVED-ONLY');
 await expect(page.locator('#v1850-enrollment-app')).toContainText('No payment was taken');
});
test('v1.85 teacher application submits for staffing review',async({page})=>{
 await page.route('**/api/v1850/teacher-applications',route=>route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,received:true,reference:'TEACHER-TEST-ONLY'})}));
 await page.goto('/learn/teach-with-us/');await page.locator('#v1850-staff-form input[name="full_name"]').fill('Fictional Teacher');
 await page.locator('#v1850-staff-form input[name="email"]').fill('teacher@example.net');
 await page.locator('#v1850-staff-form textarea[name="qualifications"]').fill('Five years teaching professional English to fictional students.');
 await page.locator('#v1850-staff-form textarea[name="weekly_availability"]').fill('Wednesday 10am to 2pm');
 await page.locator('#v1850-staff-form button[type="submit"]').click();
 await expect(page.locator('#v1850-teacher-apply')).toContainText('TEACHER-TEST-ONLY');
});
test('v1.85 eight dedicated free Business English labs work and do not retain private drafting',async({page})=>{
 await page.goto('/learn/business-resources/business-email/');
 await expect(page.getByRole('heading',{name:'Business Email Writing Lab'})).toBeVisible();
 await expect(page.locator('#v1850-resource-app fieldset')).toHaveCount(3);
 await page.locator('#v1850-resource-app fieldset').first().locator('input[type=radio]').first().check();
 await page.locator('#v1850-resource-app button[type=submit]').click();
 await expect(page.locator('.v1850-free-status')).toContainText('still missing');
 await page.locator('#v1850-resource-app textarea').fill('This fictional draft stays in memory.');
 await page.reload();await expect(page.locator('#v1850-resource-app textarea')).toHaveValue('');
});
