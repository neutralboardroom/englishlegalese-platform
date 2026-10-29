'use strict';
const {test,expect}=require('@playwright/test');
test('HF26 owner sees separate verified private intake counts with no personal applicant data',async({page})=>{
 await page.route('**/api/v119/auth/login',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,token:'owner.test',user:{role:'owner'}})}));
 await page.route('**/api/v18510/owner/overview',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,counts:{active_user_roles:{owner:1},active_organizations:0,class_sessions:{},teacher_submission_review_states:{},progress_report_states:{}}})}));
 await page.route('**/api/v18511/owner/triage',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,verified_at:'2026-10-30T02:00:00Z',notice:'Aggregates only',teacher_applications:{},class_readiness:{},class_statuses:{},progress_report_states:{},employer_enrollment:{schema_installed:false,counts:null}})}));
 await page.route('**/api/v18512/owner/intake-summary',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,verified_at:'2026-10-30T02:00:00Z',queues:{enrollment:[{status:'new',total:3,due:2}],teacher:[{status:'screening',total:4,due:1}]},notes:'Verified aggregate status only'})}));
 await page.goto('/learn/owner-dashboard/');
 await page.locator('#el18510-login input[name=email]').fill('owner@example.test');
 await page.locator('#el18510-login input[name=password]').fill('fictional');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 const area=page.locator('.v18512-owner-intake');
 await expect(area).toContainText('Class enrollment requests');
 await expect(area).toContainText('new: 3 recorded; 2 due for follow-up');
 await expect(area).toContainText('screening: 4 recorded; 1 due for follow-up');
 await expect(area).toContainText('Total due follow-ups across verified intake queues: 3');
 await expect(area).not.toContainText('owner@example.test');
});
