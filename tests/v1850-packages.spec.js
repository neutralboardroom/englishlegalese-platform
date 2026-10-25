const {test,expect}=require('@playwright/test');
// Purely local enrollment mocks; never sends email, payment, real enrollment or provider messages.
test('8-session Legal and Business foundations expose eight real original teacher plans',async({page})=>{
 await page.goto('/learn/classroom-programs/');
 await expect(page.locator('#v1850-legal-eight article')).toHaveCount(8);
 await expect(page.locator('#v1850-business-eight article')).toHaveCount(8);
 await page.locator('#v1850-legal-eight summary').first().click();
 await expect(page.locator('#v1850-legal-eight .v1850-session-body').first()).toContainText('Learning outcome');
 await expect(page.locator('#v1850-business-eight article').first()).toContainText('Session 1');
});
test('Complete pathways render exactly 24 genuine course outlines per subject, 48 total',async({page})=>{
 const res=await page.goto('/learn/complete-programs/');expect(res.status()).toBe(200);
 await expect(page.locator('#v1850-complete-legal-list article')).toHaveCount(24);
 await expect(page.locator('#v1850-complete-business-list article')).toHaveCount(24);
 await page.locator('#v1850-complete-legal-list summary').first().click();
 const first=page.locator('#v1850-complete-legal-list .v1850-session-body').first();
 for(const word of ['Learning objective','Four independent practice stages','Vocabulary and meaning','Fictional subject-specific situation','Homework','Teacher preparation and assessment'])await expect(first).toContainText(word);
 await page.locator('#v1850-complete-business-list summary').last().click();
 await expect(page.locator('#v1850-complete-business-list .v1850-session-body').last()).toContainText('Homework');
});
test('Enrollment supports 8, 24 and 48 topics with lower per-lesson prices',async({page})=>{
 await page.goto('/learn/enroll/');const f=page.locator('#v1850-enroll-form');
 await f.locator('select[name=interest]').selectOption('eight');
 await expect(f.locator('select[name=format] option[value=group]')).toContainText('$149');
 await expect(f.locator('select[name=format] option[value=private]')).toContainText('$319');
 await f.locator('select[name=interest]').selectOption('full24');
 await expect(f.locator('select[name=format] option[value=group]')).toContainText('$349');
 await f.locator('select[name=program]').selectOption('complete');
 await expect(f.locator('select[name=interest]')).toHaveValue('full48');
 await expect(f.locator('select[name=format] option[value=group]')).toContainText('$649');
 await expect(f.locator('select[name=format] option[value=private]')).toContainText('$1599');
 await expect(f.locator('select[name=schedule_id]')).toHaveValue('topic-time-request');
});
test('Employer quote stores only organization and employee count in mocked request',async({page})=>{
 let sent;await page.route('**/api/v1850/enroll',route=>{sent=route.request().postDataJSON();return route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,reference:'EMPLOYER-MOCK-ONLY'})})});
 await page.goto('/learn/enroll/');const f=page.locator('#v1850-enroll-form');
 await f.locator('select[name=program]').selectOption('complete');
 await f.locator('input[name=employer_interest]').check();
 await f.locator('input[name=organization]').fill('Fictional Learning Group');
 await f.locator('input[name=employee_seats]').fill('12');
 await expect(f.locator('.v1850-boundary').first()).toContainText('15%');
 await f.locator('input[name=full_name]').fill('Fictional Human');
 await f.locator('input[name=email]').fill('fictional@example.org');
 await f.getByRole('button',{name:'Submit enrollment inquiry'}).click();
 await expect(page.locator('#v1850-enrollment-app')).toContainText('EMPLOYER-MOCK-ONLY');
 expect(sent.program).toBe('complete');expect(sent.schedule_id).toBe('topic-time-request');
 expect(sent.note).toContain('sessions=48');expect(sent.note).toContain('employer_seats=12');
 expect(sent.note).toContain('Fictional Learning Group');
 expect(sent).not.toHaveProperty('employee_seats');expect(sent).not.toHaveProperty('organization');
});
test('Employer policy exposes 5/10/15 percent tiers and preserves private/business bounds',async({page})=>{
 await page.goto('/learn/employers/');
 await expect(page.locator('#employer-group-training')).toContainText('3–5');
 await expect(page.locator('#employer-group-training')).toContainText('11+');
 await expect(page.locator('#employer-group-training')).toContainText('15%');
 await page.goto('/pricing/');
 const content=page.locator('#comprehensive-options');
 for(const x of ['$149','$319','$249','$599','$349','$849','$649','$1,599'])await expect(content).toContainText(x);
 await expect(page.locator('#employer-seats')).toContainText('10%');
});
