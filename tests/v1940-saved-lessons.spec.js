const {test,expect}=require('@playwright/test');
test('HF13 all 48 workbooks and 24 practice tools are save-enabled without touching the protected homepage',async({page})=>{
 await page.goto('/learn/legal-english/');
 await expect(page.locator('.v1940-controls')).toHaveCount(24);
 await expect(page.locator('.v1930-simulation')).toHaveCount(24);
 await expect(page.locator('.v1910-path')).toHaveCount(24);
 await page.goto('/learn/business-english/');
 await expect(page.locator('.v1940-controls')).toHaveCount(24);
 await expect(page.locator('.v1900-evidence-lab')).toHaveCount(24);
 await page.goto('/learn/free-writing-exercise/');
 await expect(page.locator('#v1840-content .v1940-controls')).toHaveCount(1);
 await page.goto('/learn/business-resources/business-meetings/');
 await expect(page.locator('#v1850-resource-app .v1940-controls')).toHaveCount(1);
});
test('HF13 device save is opt-in, restores submitted fields and returns to the exact workbook',async({page})=>{
 await page.goto('/learn/legal-english/');
 const c=page.locator('#v1860-legal-catalog .v1860-course-card').first();
 await c.locator('.v1870-toggle input').check();
 const wb=c.locator('.v1870-workbook');
 await expect(wb.locator('.v1940-state')).toContainText('Not saved yet');
 await page.locator('.v1940-account button').filter({hasText:'Enable saving on this device'}).click();
 await wb.locator('.v1890-stage textarea').first().fill('Fact 1: This is fictional. Fact 2: The notice was not produced. Assumption: The deadline was next Friday.');
 await wb.locator('.v1930-simulation textarea').first().fill('Please show the notice so I can verify the date.');
 await wb.locator('.v1940-controls button').filter({hasText:'Pause & save'}).click();
 await expect(wb.locator('.v1940-state')).toContainText('Saved on this device');
 await page.reload();
 await expect(c.locator('.v1890-stage textarea').first()).toHaveValue(/Fact 1/);
 await expect(c.locator('.v1930-simulation textarea').first()).toHaveValue(/Please show the notice/);
 await page.goto('/learn/my-work/');
 await expect(page.locator('[data-el1940-hub]')).toContainText('Client Interviewing');
 await page.locator('[data-el1940-hub] a').filter({hasText:'Resume this lesson'}).first().click();
 await expect(page).toHaveURL(/resume=workbook%3Aclass-01/);
 await expect(page.locator('#v1860-legal-catalog .v1860-course-card').first().locator('.v1930-simulation textarea').first()).toHaveValue(/Please show the notice/);
});
test('HF13 never claims a submission without cloud account and supports explicit clear',async({page})=>{
 const posts=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url())});
 await page.goto('/learn/business-english/');
 const wb=page.locator('#v1850-business-cards .v1850-course-card').first().locator('.v1870-workbook');
 await wb.locator('.v1870-toggle input').check();
 await wb.locator('.v1940-controls button').filter({hasText:'Submit for teacher review'}).click();
 await expect(wb.locator('.v1940-state')).toContainText('requires a secure signed-in account');
 expect(posts).toHaveLength(0);
 await page.locator('.v1940-account button').filter({hasText:'Enable saving on this device'}).click();
 await wb.locator('.v1940-controls button').filter({hasText:'Save now'}).click();
 await expect(wb.locator('.v1940-state')).toContainText('Saved on this device');
 page.once('dialog',d=>d.accept());
 await page.locator('.v1940-account button').filter({hasText:'Clear saved device copies'}).click();
 await page.reload();
 await expect(wb.locator('.v1940-state')).toContainText('Not saved yet');
});
test('HF13 teacher review page never exposes student records anonymously',async({page})=>{
 await page.goto('/learn/teacher-submissions/');
 await expect(page.locator('#v1940-teacher-login')).toBeVisible();
 await expect(page.locator('#v1940-teacher-detail')).toBeHidden();
 await expect(page.locator('#v1940-teacher-queue')).toContainText('Sign in');
 await page.goto('/learn/my-work/');
 await expect(page.locator('[data-el1940-hub]')).toContainText('No saved lessons');
});

test('HF13 transparently presents account creation and shows server-confirmed cloud saving only after a successful PUT',async({page})=>{
 let registered=0,saved=0;
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,account_saving_available:true,account_registration_available:true})}));
 await page.route('**/api/v119/auth/register',async route=>{
  registered++;
  const body=route.request().postDataJSON();
  expect(body.role).toBe('student');
  expect(body.password.length).toBeGreaterThanOrEqual(12);
  await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,token:'test.mock.token',user:{id:'student123',role:'student',email:body.email}})});
 });
 await page.route('**/api/v1940/lessons/*',async route=>{
  if(route.request().url().endsWith('/capabilities'))return route.fallback();
  if(route.request().method()==='GET')return route.fulfill({status:404,contentType:'application/json',body:'{"ok":false,"error":"No existing save"}'});
  if(route.request().method()==='PUT'){
   saved++;
   const work=route.request().postDataJSON();
   expect(Number.isSafeInteger(work.expected_revision)).toBe(true);
   expect(work.expected_revision).toBeGreaterThanOrEqual(0);
   return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,saved:true,revision:work.expected_revision+1,status:'draft',updated_at:new Date().toISOString()})});
  }
  return route.abort();
 });
 await page.goto('/learn/legal-english/');
 await expect(page.locator('.v1940-account')).toContainText('create a free student account');
 await expect(page.locator('.v1940-global-status')).toContainText('NOT SAVED TO AN ACCOUNT');
 await page.locator('.v1940-account button').filter({hasText:'Create a free student account'}).click();
 const signUp=page.locator('.v1940-account form').filter({has:page.locator('input[autocomplete="new-password"]')});
 await signUp.locator('input[autocomplete="name"]').fill('Fictional Learner');
 await signUp.locator('input[autocomplete="email"]').fill('student@example.test');
 await signUp.locator('input[autocomplete="new-password"]').fill('StrongPassword2026!');
 await signUp.getByRole('button',{name:'Create account and sign in'}).click();
 await expect(page.locator('.v1940-global-status')).toContainText('Account created and signed in');
 expect(registered).toBe(1);
 const course=page.locator('#v1860-legal-catalog .v1860-course-card').first();
 await course.locator('.v1870-toggle input').check();
 await course.locator('.v1930-simulation textarea').first().fill('An appropriate response asks to see the fictional notice first.');
 await course.locator('.v1940-controls button').filter({hasText:'Save now'}).click();
 await expect(course.locator('.v1940-state')).toContainText('Saved to your account');
 expect(saved).toBeGreaterThanOrEqual(1);
});
test('HF13 account saving unavailable never offers a broken registration or claims cloud backup',async({page})=>{
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,account_saving_available:true,account_registration_available:false})}));
 await page.goto('/learn/legal-english/');
 await expect(page.locator('.v1940-account')).toContainText('New student registrations are currently unavailable');
 await expect(page.locator('.v1940-account button').filter({hasText:'Create a free student account'})).toBeHidden();
 await expect(page.locator('.v1940-account button').filter({hasText:'Sign in to my account'})).toBeVisible();
 await page.locator('.v1940-account button').filter({hasText:'Enable saving on this device'}).click();
 const course=page.locator('#v1860-legal-catalog .v1860-course-card').first();
 await course.locator('.v1870-toggle input').check();
 await course.locator('.v1930-simulation textarea').first().fill('Only a local fictional draft.');
 await course.locator('.v1940-controls button').filter({hasText:'Save now'}).click();
 await expect(course.locator('.v1940-state')).toContainText('NOT saved to your account');
});
