'use strict';
const {test,expect}=require('@playwright/test');
async function login(page,role){
 await page.route('**/api/v119/auth/login',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,token:'fictional.'+role+'.session',user:{role}})}));
}
async function ownerAPIs(page){
 await page.route('**/api/v18510/owner/overview',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,role:'owner',counts:{active_user_roles:{owner:1},active_organizations:0,class_sessions:{},teacher_submission_review_states:{},progress_report_states:{}},notice:'Verified counts'})}));
 await page.route('**/api/v18511/owner/triage',r=>r.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"error":"No verified queues"}'}));
 await page.route('**/api/v18512/owner/intake-summary',r=>r.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"error":"Intake not provisioned"}'}));
}
test('HF33 privileged owner can revoke sessions on every device without exposing data',async({page},testInfo)=>{
 await login(page,'owner');await ownerAPIs(page);
 let requests=0;
 await page.route('**/api/v18510/workspace/logout-everywhere',r=>{
  requests++;expect(r.request().headers().authorization).toBe('Bearer fictional.owner.session');
  return r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"signed_out_everywhere":true,"session_revoked":true}'});
 });
 await page.goto('/learn/owner-dashboard/');
 await expect(page.getByRole('button',{name:'Sign out on all devices'})).toBeHidden();
 await page.locator('#el18510-login input[name=email]').fill('owner@example.test');
 await page.locator('#el18510-login input[name=password]').fill('fictional');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 await expect(page.getByRole('button',{name:'Sign out on all devices'})).toBeVisible();
 await expect(page.locator('#el18510-output')).toContainText('Operational snapshot');
 await page.screenshot({path:testInfo.outputPath('hf33-owner-dashboard.png'),fullPage:true});
 page.once('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Sign out on all devices'}).click();
 await expect(page.locator('#el18510-status')).toContainText('Signed out on all devices');
 await expect(page.locator('#el18510-output')).not.toContainText('Active account roles');
 expect(requests).toBe(1);
});
test('HF33 all-device revocation error preserves signed-in controls and says not confirmed',async({page})=>{
 await login(page,'employer');
 await page.route('**/api/v18510/employer/progress**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"organizations":[],"employees":[],"notice":"Verified company not linked"}'}));
 await page.route('**/api/v18510/workspace/logout-everywhere',r=>r.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"error":"Database is unavailable"}'}));
 await page.goto('/learn/employer-dashboard/');
 await page.locator('#el18510-login input[name=email]').fill('hr@example.test');
 await page.locator('#el18510-login input[name=password]').fill('fictional');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 await expect(page.getByRole('button',{name:'Sign out on all devices'})).toBeVisible();
 page.once('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Sign out on all devices'}).click();
 await expect(page.locator('#el18510-status')).toContainText('NOT confirmed');
 await expect(page.getByRole('button',{name:'Sign out on all devices'})).toBeVisible();
});
test('HF33 changed employer enrollment must not replay an earlier idempotency key',async({page})=>{
 await login(page,'employer');
 await page.route('**/api/v18510/employer/progress**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,organizations:[{id:'EL-ORG-example',name:'Example Inc'}],organization:{id:'EL-ORG-example',name:'Example Inc'},employees:[],notice:'Only consented company progress'})}));
 await page.route('**/api/v18510/employer/roster**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,employees:[{id:'student-one',name:'Alice Example'},{id:'student-two',name:'Bob Example'}],truncated:false})}));
 await page.route('**/api/v18510/employer/enrollment-requests?*',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"requests":[]}'}));
 const bodies=[];
 await page.route('**/api/v18510/employer/enrollment-requests',async route=>{
  bodies.push(JSON.parse(route.request().postData()||'{}'));
  if(bodies.length===1)return route.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"error":"Not confirmed"}'});
  return route.fulfill({status:201,contentType:'application/json',body:'{"ok":true,"reference":"request-2","notice":"Pending staff review"}'});
 });
 await page.goto('/learn/employer-dashboard/');
 await page.locator('#el18510-login input[name=email]').fill('hr@example.test');
 await page.locator('#el18510-login input[name=password]').fill('fictional');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 await expect(page.getByRole('heading',{name:'Enroll employees in a training package'})).toBeVisible();
 await page.getByLabel('Alice Example').check();
 await page.getByRole('button',{name:'Submit employee class enrollment request'}).click();
 await expect(page.locator('.v1940-enrollment-form [role=status]')).toContainText('NOT confirmed');
 await page.getByLabel('Bob Example').check();
 await page.getByRole('button',{name:'Submit employee class enrollment request'}).click();
 await expect(page.locator('.v1940-enrollment-form [role=status]')).toContainText('Request recorded');
 expect(bodies.length).toBe(2);
 expect(bodies[0].client_request_id).not.toBe(bodies[1].client_request_id);
 expect(bodies[0].employee_user_ids).toEqual(['student-one']);
 expect(bodies[1].employee_user_ids).toEqual(['student-one','student-two']);
});
test('HF33 account hub links directly to actual secure dashboards and makes no false employer claim',async({page},testInfo)=>{
 await page.goto('/learn/account/');
 await expect(page.getByRole('link',{name:'Open secure employer dashboard'})).toHaveAttribute('href','/learn/employer-dashboard/');
 await expect(page.locator('main')).not.toContainText('Employer logins, employee-private reports, payment and automatic scheduling are not active');
 await expect(page.getByRole('link',{name:'Open student saved-work dashboard'})).toHaveAttribute('href','/learn/my-work/');
 await expect(page.getByRole('link',{name:'Open teacher review dashboard'})).toHaveAttribute('href','/learn/teacher-submissions/');
 await expect(page.getByRole('link',{name:'Open owner/admin dashboard'})).toHaveAttribute('href','/learn/owner-dashboard/');
 await page.screenshot({path:testInfo.outputPath('hf33-account-hub.png'),fullPage:true});
});
