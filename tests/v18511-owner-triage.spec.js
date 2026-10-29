'use strict';
const {test,expect}=require('@playwright/test');
test('HF25 authorized owner sees verified teacher, class, employer schema and report queues',async({page})=>{
 await page.route('**/api/v119/auth/login',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"token":"mock.owner","user":{"role":"owner"}}'}));
 await page.route('**/api/v18510/owner/overview',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,counts:{active_user_roles:{owner:1},active_organizations:1,class_sessions:{requested:4},teacher_submission_review_states:{awaiting_review:2},progress_report_states:{draft:2}}})}));
 let reads=0;
 await page.route('**/api/v18511/owner/triage',r=>{reads++;r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,verified_at:'2026-10-29T11:00:00.000Z',notice:'Read-only verified',teacher_applications:{applied:3,approved:2},class_readiness:{needs_staff_review:4},class_statuses:{requested:4},progress_report_states:{draft:2},employer_enrollment:{schema_installed:false,counts:null},certification_issuance_active:false,employer_checkout_active:false})})});
 await page.route('**/api/v18510/workspace/logout',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"session_revoked":true}'}));
 await page.goto('/learn/owner-dashboard/');
 await page.locator('#el18510-login input[name=email]').fill('owner@example.test');
 await page.locator('#el18510-login input[name=password]').fill('fictional');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 const area=page.locator('.v18511-owner-triage');
 await expect(area).toContainText('Teacher application approval states');
 await expect(area).toContainText('applied: 3');
 await expect(area).toContainText('needs_staff_review: 4');
 await expect(area).toContainText('migration not installed');
 await expect(area).toContainText('Certification issuance: not active');
 await page.getByRole('button',{name:'Refresh current data'}).click();
 await expect.poll(()=>reads).toBe(2);
 await page.getByRole('button',{name:'Sign out securely'}).click();
 await expect(page.locator('.v18511-owner-triage')).toHaveCount(0);
});
test('HF25 both professional certification tracks explain separate supervised assessment plans at six levels',async({page})=>{
 for(const [track,word]of [['legal','contract'],['business','investor']]){
  await page.goto('/learn/'+track+'-english-certification/');
  const s=page.locator('.v18511-assessment');
  await expect(s).toContainText('exam blueprints, not live exams or earned credentials');
  await expect(s.locator('details.v18511-assessment-level')).toHaveCount(6);
  for(const level of ['A1','A2','B1','B2','C1','C2'])await expect(s.locator('summary').filter({hasText:level})).toHaveCount(1);
  await s.locator('summary').last().click();
  await expect(s).toContainText('Live listening / speaking evidence');
  await expect(s).toContainText('Supervised reading / written evidence');
  await expect(s).toContainText(word);
 }
});
