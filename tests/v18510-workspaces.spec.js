'use strict';
const {test,expect}=require('@playwright/test');
async function mockLogin(page,role){
 await page.route('**/api/v119/auth/login',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,token:'fictional.'+role+'.session',user:{role}})}));
}
test('HF24 owner dashboard: existing authorized owner login, operational counts, refresh and safe signout',async({page})=>{
 await mockLogin(page,'owner');
 let reads=0;
 await page.route('**/api/v18510/owner/overview',r=>{reads++;r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,role:'owner',counts:{active_user_roles:{student:7,teacher:2,employer:1,owner:1},active_organizations:1,class_sessions:{scheduled:4},teacher_submission_review_states:{awaiting_review:3},progress_report_states:{published:2}},notice:'Read-only verified counts'})})});
 await page.route('**/api/v18510/workspace/logout',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"session_revoked":true}'}));
 await page.goto('/learn/owner-dashboard/');
 await expect(page.getByRole('heading',{name:'Owner / Admin Operations'})).toBeVisible();
 await expect(page.locator('#el18510-output')).not.toContainText('Active account roles');
 await page.locator('#el18510-login input[name=email]').fill('owner@example.test');
 await page.locator('#el18510-login input[name=password]').fill('not-a-real-password');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 await expect(page.locator('#el18510-output')).toContainText('Active organizations: 1');
 await expect(page.locator('#el18510-output')).toContainText('awaiting_review');
 await page.getByRole('button',{name:'Refresh current data'}).click();
 await expect.poll(()=>reads,{message:'Refresh must request fresh authorized owner counts'}).toBe(2);
 await page.getByRole('button',{name:'Sign out securely'}).click();
 await expect(page.locator('#el18510-output')).not.toContainText('Active organizations: 1');
 await expect(page.locator('#el18510-status')).toContainText('server session revoked');
});
test('HF24 employer dashboard: shows only consented published employee results and downloads explicitly',async({page})=>{
 await mockLogin(page,'employer');
 let reads=0;
 await page.route('**/api/v18510/employer/progress',r=>{reads++;r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,organizations:[{id:'org-fictional',name:'Example Firm'}],organization:{id:'org-fictional',name:'Example Firm'},employees:[{name:'Fictional Employee',has_published_report:true,reported_at:'2026-10-28T10:00:00Z',completion_percent:60,attendance_percent:80,score_percent:91,milestones_completed:5,level:'B2'},{name:'Other Fictional Colleague',has_published_report:false,reported_at:null,completion_percent:null,attendance_percent:null,score_percent:null,milestones_completed:null,level:''}],notice:'Only consented published reports.'})})});
 await page.goto('/learn/employer-dashboard/');
 await expect(page.locator('.v1940-employer-report')).toHaveCount(0);
 await page.locator('#el18510-login input[name=email]').fill('employer@example.test');
 await page.locator('#el18510-login input[name=password]').fill('fictional-pass');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 const table=page.locator('.v1940-employer-report');
 await expect(table).toContainText('Fictional Employee');
 await expect(table).toContainText('91%');
 await expect(table).toContainText('Not reported');
 await expect(page.locator('#el18510-output')).toContainText('2 consented employees shown · 1 with published progress reports');
 page.once('dialog',d=>d.accept());
 const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:/Download these consented, published results/}).click()]);
 expect(download.suggestedFilename()).toMatch(/englishlegalese-private-employer-progress/);
 expect(reads).toBe(1);
});
test('HF24 employer role mismatch must never display owner counts',async({page})=>{
 await page.route('**/api/v119/auth/login',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"token":"mock","user":{"role":"student"}}'}));
 await page.goto('/learn/owner-dashboard/');
 await page.locator('#el18510-login input[name=email]').fill('wrong@example.test');
 await page.locator('#el18510-login input[name=password]').fill('fictional-pass');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 await expect(page.locator('#el18510-status')).toContainText('An authorized owner account is required');
 await expect(page.locator('#el18510-output')).not.toContainText('Active organizations');
});
