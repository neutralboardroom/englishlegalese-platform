'use strict';
const {test,expect}=require('@playwright/test');
const id=n=>'EL-ENERGY-'+String(n).padStart(8,'0')+'-1111-4111-8111-111111111111';
const starts=new Date(Date.now()+7*86400000).toISOString();
const course=[{number:1,title:'Private lesson with fictional contracts',
 goal:'Explain English contract language.',scenario:'Fictional legal scenario.',
 model:'Please clarify the terms before agreement.',vocabulary:['agreement','notice'],
 homework:'Practice a short explanation.'}];
test('HF63 manual teacher Meet confirmation requires external conflict acknowledgement and cannot replace scheduled or pending class',async({page})=>{
 const errors=[],posts=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))posts.push(r.url());});
 await page.addInitScript(()=>sessionStorage.setItem('el2150.teacher.session','HF63_SYNTHETIC'));
 await page.route('**/api/v119/auth/me',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"teacher","role":"teacher"}}'}));
 await page.route('**/api/v2150/private-energy/capabilities',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"google_meet_auto_creation":false}'}));
 await page.route('**/api/v2150/private-energy/lessons',r=>r.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',agenda:[{start:0,end:60,label:'Human-led class'}],lessons:course})}));
 await page.route('**/api/v2150/private-energy/review-queue',r=>r.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,requests:[],has_more:false,partial:false,next_offset:0})}));
 const records=[
  {id:id(1),lesson_number:1,lesson_title:'Requested unbooked class',starts_at:starts,status:'requested',
   provider:'Google Meet',meet_ready:false,meet_url:null},
  {id:id(2),lesson_number:1,lesson_title:'Confirmed scheduled class',starts_at:starts,status:'scheduled',
   provider:'Google Meet',meet_ready:true,meet_url:'https://meet.google.com/jkl-mnop-qrs'},
  {id:id(3),lesson_number:1,lesson_title:'Pending student change',starts_at:starts,status:'requested',
   provider:'Google Meet',meet_ready:false,meet_url:null,change_request:{kind:'reschedule',status:'pending'}}
 ];
 await page.route('**/api/v2150/private-energy/sessions',r=>r.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',sessions:records,partial:false})}));
 await page.route('**/api/v2150/private-energy/sessions/'+id(1)+'/attach-meet',r=>r.fulfill({
  status:409,contentType:'application/json',
  body:'{"ok":false,"error":"Concurrent appointment update prevented confirmation. No calendar change."}'}));
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-authorized')).toBeVisible();
 const requested=page.locator('#energy-class-'+id(1));
 await expect(requested.locator('.teacher-form')).toHaveCount(1);
 const confirmed=page.locator('#energy-class-'+id(2));
 await expect(confirmed.locator('.teacher-form')).toHaveCount(0);
 const pending=page.locator('#energy-class-'+id(3));
 await expect(pending.locator('.teacher-form')).toHaveCount(0);
 const form=requested.locator('.teacher-form');
 await form.locator('input[type=url]').fill('https://meet.google.com/abc-defg-hij');
 await form.getByRole('button',{name:'Confirm unbooked class and attach Meet'}).click();
 await expect(page.locator('#energy-teacher-status')).toContainText('Check your external Google calendars');
 expect(posts).toEqual([]);
 await form.locator('input.energy-manual-meet-confirm').check();
 await form.getByRole('button',{name:'Confirm unbooked class and attach Meet'}).click();
 await expect(page.locator('#energy-teacher-status')).toContainText('Concurrent appointment update prevented confirmation');
 expect(posts).toHaveLength(1);
 expect(posts[0]).toContain('/attach-meet');
 expect(errors).toEqual([]);
});
