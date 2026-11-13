'use strict';
/* HF59 real DOM interaction with mocked authentication/server endpoints only.
 * No live account, calendar, email, payment or class record is contacted. */
const {test,expect}=require('@playwright/test');
const ID='EL-ENERGY-11111111-1111-4111-8111-111111111111';
const START=new Date(Date.now()+7*86400000).toISOString();
const LESSON={number:2,title:'Conforming bids',goal:'Explain fictional contract conditions',
 vocabulary:['conforming bid','offer'],scenario:'Fictional buyer asks for a change',
 model:'We should verify the applicable conditions.',homework:'Practice a clear spoken summary.'};
async function setup(page,role){
 await page.addInitScript(r=>sessionStorage.setItem(r==='student'?'el1940.student.session':'el2150.teacher.session','LOCAL_TEST_ONLY'),role);
 let status='pending',last=null;
 await page.route('**/api/v119/auth/me',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,user:{id:role+'-one',role}})}));
 await page.route('**/api/v2150/private-energy/capabilities',route=>route.fulfill({status:200,contentType:'application/json',
  body:'{"ok":true,"google_meet_auto_creation":false}'}));
 await page.route('**/api/v2150/private-energy/lessons',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role,agenda:[{start:0,end:60,label:'Teacher speaking lesson'}],lessons:[LESSON]})}));
 await page.route('**/api/v2150/private-energy/sessions/*/review-change',route=>{
  last=route.request().postDataJSON();
  status=last.decision==='coordinate'?'coordination_required':'declined';
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
   ok:true,request:{kind:'reschedule',status},calendar_event_changed:false,charge_applied:false,
   message:'Original class remains unchanged.'})});
 });
 await page.route('**/api/v2150/private-energy/sessions',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role,sessions:[{id:ID,lesson_number:2,lesson_title:LESSON.title,
   starts_at:START,status:'scheduled',provider:'Google Meet',meet_ready:true,
   meet_url:'https://meet.google.com/abc-defg-hij',notice_policy_hours:null,
   change_request:{kind:'reschedule',status,proposed_at:new Date(Date.now()+8*86400000).toISOString()}}]})}));
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-authorized')).toBeVisible();
 return {last:()=>last};
}
test('HF59 assigned teacher can record coordination without confirming reschedule',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const state=await setup(page,'teacher');
 await expect(page.locator('.energy-review-queue')).toBeVisible();
 await expect(page.locator('.energy-review-queue')).toContainText('not alter the confirmed class');
 page.on('dialog',dialog=>dialog.accept());
 await page.getByRole('button',{name:'Mark for manual coordination'}).click();
 await expect(page.locator('#energy-schedule')).toContainText('awaiting manual teacher/student coordination');
 await expect(page.locator('#energy-schedule')).toContainText('original class time and Meet remain in effect');
 expect(state.last()).toEqual({decision:'coordinate',reason:'manual_coordination'});
 await expect(page.locator('.energy-review-queue')).toHaveCount(0);
 expect(errors).toEqual([]);
});
test('HF59 student is never shown teacher decision controls',async({page})=>{
 await setup(page,'student');
 await expect(page.locator('.energy-review-queue')).toHaveCount(0);
 await expect(page.getByRole('button',{name:'Decline change request'})).toHaveCount(0);
 await expect(page.locator('#energy-schedule')).toContainText('pending teacher review');
});
