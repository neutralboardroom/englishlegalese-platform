'use strict';
const {test,expect}=require('@playwright/test');
const id=n=>'EL-ENERGY-'+String(n).padStart(8,'0')+'-1111-4111-8111-111111111111';
const date=new Date(Date.now()+5*86400000).toISOString();
const course=[{number:1,title:'Fictional terms and speaking',goal:'Communicate precisely.',
 scenario:'A fictional contract term.',model:'Please clarify the wording.',
 vocabulary:['term','agreement'],homework:'Practice speaking in English.'}];
test('HF62 teacher can find and review the 51st assigned request without exposing unrelated records or sending messages',async({page})=>{
 const errors=[],writes=[],detailRequests=[],queueOffsets=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.addInitScript(()=>sessionStorage.setItem('el2150.teacher.session','HF62_SYNTHETIC'));
 await page.route('**/api/v119/auth/me',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"teacher","role":"teacher"}}'}));
 await page.route('**/api/v2150/private-energy/capabilities',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"google_meet_auto_creation":false}'}));
 await page.route('**/api/v2150/private-energy/lessons',r=>r.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',agenda:[{start:0,end:60,label:'Human-led class'}],lessons:course})}));
 await page.route('**/api/v2150/private-energy/review-queue**',r=>{
  const off=new URL(r.request().url()).searchParams.get('offset')||'0';queueOffsets.push(off);
  const requests=(off==='0'?Array.from({length:50},(_,i)=>i+1):[51]).map(n=>({
   id:id(n),lesson_number:1,status:'scheduled',starts_at:date,
   change_request:{kind:'cancel',status:'pending'}
  }));
  return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
   ok:true,requests,has_more:off==='0',partial:off==='0',next_offset:off==='0'?50:51,
   google_calendars_checked:false})});
 });
 await page.route('**/api/v2150/private-energy/sessions/'+id(51),r=>{
  detailRequests.push(r.request().url());
  return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
   ok:true,session:{id:id(51),lesson_number:1,lesson_title:'Fictional terms',starts_at:date,
   status:'scheduled',provider:'Google Meet',meet_ready:false,meet_url:null,
   change_request:{kind:'cancel',status:'pending'}},
   google_calendars_checked:false,student_record_unmodified:true})});
 });
 await page.route('**/api/v2150/private-energy/sessions',r=>r.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',sessions:[{id:id(99),lesson_number:1,
   lesson_title:'Already-loaded class',starts_at:date,status:'requested',
   provider:'Google Meet',meet_ready:false,meet_url:null}],partial:false})}));
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-authorized')).toBeVisible();
 const board=page.locator('#energy-hf61-review-board');
 await expect(board.locator('summary')).toContainText('Pending student change requests (50+)');
 await board.locator('summary').click();
 await board.getByRole('button',{name:'Load more pending change requests (50 per page)'}).click();
 await expect(board.locator('summary')).toContainText('Pending student change requests (51)');
 const item=board.locator('.energy-review-board-item').last();
 await expect(item).toContainText('Lesson 1');
 await item.getByRole('button',{name:'Go to this class for review'}).click();
 await expect(page.locator('#energy-class-'+id(51))).toHaveCount(1);
 await expect(page.locator('#energy-class-'+id(51)+' .energy-review-queue')).toHaveCount(1);
 await expect(page.locator('#energy-schedule a.join')).toHaveCount(0);
 await expect(page.locator('.energy-readiness-status')).toHaveCount(2);
 expect(queueOffsets).toEqual(['0','50']);expect(detailRequests).toHaveLength(1);
 expect(writes).toEqual([]);expect(errors).toEqual([]);
});
