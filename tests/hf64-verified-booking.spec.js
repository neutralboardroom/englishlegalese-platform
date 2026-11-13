'use strict';
const {test,expect}=require('@playwright/test');
const id='EL-ENERGY-00000001-1111-4111-8111-111111111111';
const next=new Date(Date.now()+7*86400000).toISOString();
const lesson={number:2,title:'Fictional contract terms and conditions',goal:'Explain a hypothetical term.',
 scenario:'A fictional company asks about a contract change.',model:'We need to review the exact wording.',
 vocabulary:['contract','term','approval'],homework:'Summarize a fictional example.'};
test('HF64 human teacher requires manual external calendar attestation for class create and private Meet confirmation',async({page})=>{
 const errors=[],creates=[],attaches=[],preflights=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>sessionStorage.setItem('el2150.teacher.session','HF64_SYNTHETIC'));
 await page.route('**/api/v119/auth/me',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"teacher","role":"teacher"}}'}));
 await page.route('**/api/v2150/private-energy/capabilities',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"google_meet_auto_creation":false}'}));
 await page.route('**/api/v2150/private-energy/lessons',r=>r.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',agenda:[{start:0,end:60,label:'Human-led roleplay'}],lessons:[lesson]})}));
 await page.route('**/api/v2150/private-energy/review-queue**',r=>r.fulfill({status:200,contentType:'application/json',
  body:'{"ok":true,"requests":[],"partial":false,"has_more":false,"next_offset":0}'}));
 await page.route('**/api/v2150/private-energy/sessions/'+id+'/confirmation-preflight?*',r=>{
  preflights.push(r.request().url());
  return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
   ok:true,eligible_for_manual_confirmation:true,internal_conflict:false,
   google_calendars_checked:false,notice:'No other EnglishLegalese class overlaps.'})});
 });
 await page.route('**/api/v2150/private-energy/sessions/'+id+'/attach-meet',r=>{
  attaches.push(r.request().postDataJSON());
  return r.fulfill({status:409,contentType:'application/json',
   body:'{"ok":false,"error":"HF64 synthetic conflict, no booking was created."}'});
 });
 await page.route('**/api/v2150/private-energy/sessions',r=>{
  if(r.request().method()==='POST'){
   creates.push(r.request().postDataJSON());
   return r.fulfill({status:409,contentType:'application/json',
    body:'{"ok":false,"error":"HF64 synthetic duplicate booking, no data changed."}'});
  }
  return r.fulfill({status:200,contentType:'application/json',
   body:JSON.stringify({ok:true,role:'teacher',sessions:[{
    id,lesson_number:2,lesson_title:lesson.title,starts_at:next,status:'requested',
    provider:'Google Meet',meet_ready:false,meet_url:null}],partial:false})});
 });
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-authorized')).toBeVisible();
 const form=page.locator('#energy-class-'+id+' .teacher-form');
 await expect(form).toBeVisible();
 const preflight=form.getByRole('button',{name:'Check this class for EnglishLegalese conflicts'});
 await preflight.click();
 await expect(form.locator('.energy-manual-meet-preflight-status')).toContainText('External Google calendars');
 expect(preflights).toHaveLength(1);
 await form.locator('input[type=url]').fill('https://meet.google.com/abc-defg-hij');
 await form.getByRole('button',{name:'Confirm unbooked class and attach Meet'}).click();
 await expect(page.locator('#energy-teacher-status')).toContainText('Check your external Google calendars');
 expect(attaches).toHaveLength(0);
 await form.locator('.energy-manual-meet-confirm').check();
 await form.getByRole('button',{name:'Confirm unbooked class and attach Meet'}).click();
 await expect(page.locator('#energy-teacher-status')).toContainText('HF64 synthetic conflict');
 expect(attaches).toHaveLength(1);
 expect(attaches[0].external_calendar_acknowledged).toBe(true);
 const studentEmail=page.locator('#energy-student-email');
 await studentEmail.fill('synthetic@example.invalid');
 await page.locator('#energy-start').fill(new Date(Date.now()+9*86400000+7*3600000).toISOString().slice(0,16));
 const submit=page.locator('#energy-create-form button[type=submit]');
 await submit.click();
 await expect(page.locator('#energy-teacher-status')).toContainText('Check your Google calendars');
 expect(creates).toHaveLength(0);
 await page.locator('#energy-create-form input[type=checkbox]').check();
 await submit.click();
 await expect(page.locator('#energy-teacher-status')).toContainText('HF64 synthetic duplicate booking');
 expect(creates).toHaveLength(1);
 expect(creates[0].external_calendar_acknowledged).toBe(true);
 expect(errors).toEqual([]);
});
