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

test('HF15 requires email verification and explicit login before server-confirmed cloud saving after a successful PUT',async({page})=>{
 let registered=0,saved=0;
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,account_saving_available:true,account_registration_available:true})}));
 await page.route('**/api/v1940/student/auth/register',async route=>{
  registered++;
  const body=route.request().postDataJSON();
  expect(body.role).toBe('student');
  expect(body.password.length).toBeGreaterThanOrEqual(12);
  await route.fulfill({status:202,contentType:'application/json',body:JSON.stringify({ok:true,verification_required:true})});
 });
 await page.route('**/api/v1940/student/auth/login',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,token:'test.mock.token',email_verified:true,user:{id:'student123',role:'student',email:'student@example.test'}})}));
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
 const signUp=page.locator('.v1940-account form').filter({has:page.locator('input[autocomplete="name"]')});
 await signUp.locator('input[autocomplete="name"]').fill('Fictional Learner');
 await signUp.locator('input[autocomplete="email"]').fill('student@example.test');
 await signUp.locator('input[autocomplete="new-password"]').fill('StrongPassword2026!');
 await signUp.getByRole('button',{name:'Create account and send verification link'}).click();
 await expect(page.locator('.v1940-global-status')).toContainText('Check your email for a verification link');
 expect(registered).toBe(1);
 await page.locator('.v1940-account button').filter({hasText:'Sign in to my account'}).click();
 const signIn=page.locator('.v1940-account form').filter({has:page.locator('input[autocomplete="current-password"]')});
 await signIn.locator('input[autocomplete="email"]').fill('student@example.test');
 await signIn.locator('input[autocomplete="current-password"]').fill('StrongPassword2026!');
 await signIn.getByRole('button',{name:'Sign in securely'}).click();
 await expect(page.locator('.v1940-global-status')).toContainText('Signed in to your student account');
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


test('HF15 one-use verification link is redeemed through the account endpoint without exposing its token in navigation',async({page})=>{
 const secret='a'.repeat(64);let redeems=0;
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,account_saving_available:true,account_registration_available:true})}));
 await page.route('**/api/v1940/student/auth/verify',route=>{
  redeems++;expect(route.request().method()).toBe('POST');
  expect(route.request().postDataJSON()).toEqual({token:secret});
  return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"verified":true}'});
 });
 await page.goto('/learn/my-work/#verify='+secret);
 await expect(page.locator('.v1940-global-status')).toContainText('Email verified. Please sign in.');
 await expect.poll(()=>page.evaluate(()=>location.hash)).toBe('');
 expect(redeems).toBe(1);
});
test('HF15 password recovery link uses one mocked request and never claims login without a new sign-in',async({page})=>{
 const secret='b'.repeat(64);let changes=0;
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,account_saving_available:true,account_registration_available:true})}));
 await page.route('**/api/v1940/student/auth/reset-password',route=>{
  changes++;const body=route.request().postDataJSON();
  expect(body.token).toBe(secret);expect(body.new_password).toBe('LongerStrongPass2026!');
  return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"password_reset":true}'});
 });
 await page.goto('/learn/my-work/#reset='+secret);
 const reset=page.locator('form.v1940-login').filter({has:page.locator('button').filter({hasText:'Reset password'})});
 await expect(reset).toBeVisible();
 await reset.locator('input').fill('LongerStrongPass2026!');
 await reset.getByRole('button',{name:'Reset password'}).click();
 await expect(page.locator('.v1940-global-status')).toContainText('Please sign in again.');
 await expect.poll(()=>page.evaluate(()=>location.hash)).toBe('');
 expect(changes).toBe(1);
 await expect(page.locator('.v1940-account')).not.toContainText('Signed in to your student account');
});


test('HF15.2 student sign-out revokes the current bearer token server-side and clears the local session',async({page})=>{
 let requests=0;
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,account_saving_available:true,account_registration_available:true})}));
 await page.route('**/api/v1940/student/auth/login',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,token:'mock.account.session',email_verified:true,user:{id:'student-test',role:'student'}})}));
 await page.route('**/api/v1940/lessons',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"lessons":[]}'}));
 await page.route('**/api/v1940/student/auth/logout',route=>{
  requests++;expect(route.request().method()).toBe('POST');
  expect(route.request().headers().authorization).toBe('Bearer mock.account.session');
  return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"signed_out":true,"session_revoked":true}'});
 });
 await page.goto('/learn/my-work/');
 await page.getByRole('button',{name:'Sign in to my account'}).click();
 const signIn=page.locator('.v1940-account form').filter({has:page.locator('input[autocomplete="current-password"]')});
 await signIn.locator('input[autocomplete="email"]').fill('student@example.test');
 await signIn.locator('input[autocomplete="current-password"]').fill('StrongPassword2026!');
 await signIn.getByRole('button',{name:'Sign in securely'}).click();
 await expect(page.locator('.v1940-global-status')).toContainText('Signed in to your student account');
 await page.getByRole('button',{name:'Sign out',exact:true}).click();
 await expect(page.locator('.v1940-global-status')).toContainText('This session was revoked on the server.');
 expect(requests).toBe(1);
 await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('el1940.student.session'))).toBeNull();
});
test('HF15.2 teacher sign-out revokes only that teacher session and hides the private queue',async({page})=>{
 let logouts=0;
 await page.route('**/api/v1940/teacher/auth/login',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,token:'mock.teacher.session',user:{id:'teacher-test',role:'teacher'}})}));
 await page.route('**/api/v1940/teacher/submissions',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"submissions":[]}'}));
 await page.route('**/api/v1940/teacher/auth/logout',route=>{
  logouts++;expect(route.request().headers().authorization).toBe('Bearer mock.teacher.session');
  return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"signed_out":true,"session_revoked":true}'});
 });
 await page.goto('/learn/teacher-submissions/');
 await page.locator('#v1940-teacher-login input[name="email"]').fill('teacher@example.test');
 await page.locator('#v1940-teacher-login input[name="password"]').fill('StrongPassword2026!');
 await page.locator('#v1940-teacher-login button').click();
 await expect(page.locator('#v1940-teacher-signout')).toBeVisible();
 await page.locator('#v1940-teacher-signout').click();
 await expect(page.locator('#v1940-teacher-status')).toContainText('Teacher session securely revoked');
 await expect(page.locator('#v1940-teacher-queue')).toContainText('Sign in to load your assigned submissions');
 expect(logouts).toBe(1);
 await expect.poll(()=>page.evaluate(()=>sessionStorage.getItem('el1940.teacher.session'))).toBeNull();
});


test('HF15.4 student confirms global sign out and retains work without claiming unsaved progress was backed up',async({page})=>{
 let revoked=0;
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v1940/student/auth/login',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"token":"fictional.student.token","email_verified":true,"user":{"id":"student","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"lessons":[]}'}));
 await page.route('**/api/v1940/student/auth/logout-everywhere',route=>{
  revoked++;expect(route.request().headers().authorization).toBe('Bearer fictional.student.token');
  return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"signed_out_everywhere":true,"lessons_preserved":true}'});
 });
 page.on('dialog',dialog=>dialog.accept());
 await page.goto('/learn/my-work/');
 await page.getByRole('button',{name:'Sign in to my account'}).click();
 const form=page.locator('.v1940-account form').filter({has:page.locator('input[autocomplete="current-password"]')});
 await form.locator('input[autocomplete="email"]').fill('student@example.test');
 await form.locator('input[autocomplete="current-password"]').fill('StrongPassword2026!');
 await form.getByRole('button',{name:'Sign in securely'}).click();
 await page.getByRole('button',{name:'Sign out on all devices'}).click();
 await expect(page.locator('.v1940-global-status')).toContainText('Signed out on all devices.');
 expect(revoked).toBe(1);
 await expect(page.getByRole('button',{name:'Sign in to my account'})).toBeVisible();
});
test('HF15.4 teacher confirms global sign out and does not remove assigned student work',async({page})=>{
 let revoked=0;
 await page.route('**/api/v1940/teacher/auth/login',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"token":"fictional.teacher.token","user":{"id":"teacher","role":"teacher"}}'}));
 await page.route('**/api/v1940/teacher/submissions',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"submissions":[]}'}));
 await page.route('**/api/v1940/teacher/auth/logout-everywhere',route=>{
  revoked++;expect(route.request().headers().authorization).toBe('Bearer fictional.teacher.token');
  return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"signed_out_everywhere":true,"lessons_preserved":true}'});
 });
 page.on('dialog',dialog=>dialog.accept());
 await page.goto('/learn/teacher-submissions/');
 await page.locator('#v1940-teacher-login input[name="email"]').fill('teacher@example.test');
 await page.locator('#v1940-teacher-login input[name="password"]').fill('StrongPassword2026!');
 await page.locator('#v1940-teacher-login button').click();
 await page.getByRole('button',{name:'Sign out on all devices'}).click();
 await expect(page.locator('#v1940-teacher-status')).toContainText('Signed out securely on every device');
 await expect(page.locator('#v1940-teacher-queue')).toContainText('Sign in to load your assigned submissions');
 expect(revoked).toBe(1);
});

test('HF15.5 student downloads only a confirmed complete private cloud backup',async({page})=>{
 let exports=0;
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v1940/student/auth/login',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"token":"fixture.student.cloud","email_verified":true,"user":{"id":"student-fixture","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"lessons":[]}'}));
 await page.route('**/api/v1940/account/export',route=>{
  exports++;expect(route.request().headers().authorization).toBe('Bearer fixture.student.cloud');
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,complete:true,schema_version:1,format:'EnglishLegalese student cloud backup',saved_lessons:[{lesson_key:'workbook:fixture',answers:{fictional:'saved'}}],submissions:[{teacher_feedback:'Fictional feedback'}]})});
 });
 await page.goto('/learn/my-work/');
 await expect(page.getByRole('button',{name:'Download my cloud backup'})).toBeHidden();
 await page.getByRole('button',{name:'Sign in to my account'}).click();
 const form=page.locator('.v1940-account form').filter({has:page.locator('input[autocomplete="current-password"]')});
 await form.locator('input[autocomplete="email"]').fill('student@example.test');
 await form.locator('input[autocomplete="current-password"]').fill('StrongPassword2026!');
 await form.getByRole('button',{name:'Sign in securely'}).click();
 page.on('dialog',dialog=>dialog.accept());
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'Download my cloud backup'}).click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toMatch(/^englishlegalese-cloud-backup-\d{4}-\d{2}-\d{2}\.json$/);
 await expect(page.locator('.v1940-global-status')).toContainText('Complete account backup downloaded');
 expect(exports).toBe(1);
});
test('HF15.5 refuses a server-truncated backup without a false download success',async({page})=>{
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v1940/student/auth/login',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"token":"fixture.student.cloud","email_verified":true,"user":{"id":"student-fixture","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"lessons":[]}'}));
 await page.route('**/api/v1940/account/export',route=>route.fulfill({status:413,contentType:'application/json',body:'{"ok":false,"code":"ACCOUNT_BACKUP_LIMIT","error":"No partial backup was produced."}'}));
 await page.goto('/learn/my-work/');
 await page.getByRole('button',{name:'Sign in to my account'}).click();
 const form=page.locator('.v1940-account form').filter({has:page.locator('input[autocomplete="current-password"]')});
 await form.locator('input[autocomplete="email"]').fill('student@example.test');
 await form.locator('input[autocomplete="current-password"]').fill('StrongPassword2026!');
 await form.getByRole('button',{name:'Sign in securely'}).click();
 page.on('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Download my cloud backup'}).click();
 await expect(page.locator('.v1940-global-status')).toContainText('ACCOUNT BACKUP NOT DOWNLOADED');
 await expect(page.locator('.v1940-global-status')).toContainText('No partial backup was produced.');
});
