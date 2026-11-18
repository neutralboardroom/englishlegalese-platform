'use strict';
const {test,expect}=require('@playwright/test');
const id=n=>'EL-ENERGY-'+String(n).padStart(8,'0')+'-1111-4111-8111-111111111111';
const next=new Date(Date.now()+6*86400000).toISOString();
const past=new Date(Date.now()-7*86400000).toISOString();
const sample={number:2,title:'Fictional conditions',goal:'Clarify a legal English term.',
 scenario:'Fictional contract discussion.',model:'Please confirm the stated conditions.',
 vocabulary:['agreement','qualification'],homework:'Practice a short spoken explanation.'};
test('HF61 teacher pending review, honest list limits and private paged history',async({page})=>{
 const errors=[],writes=[],historyCalls=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',request=>{if(['POST','PATCH','PUT','DELETE'].includes(request.method()))writes.push(request.url());});
 await page.addInitScript(()=>sessionStorage.setItem('el2150.teacher.session','HF61_MOCK_SESSION'));
 await page.route('**/api/v119/auth/me',route=>route.fulfill({status:200,contentType:'application/json',
  body:'{"ok":true,"user":{"id":"teacher","role":"teacher"}}'}));
 await page.route('**/api/v2150/private-energy/capabilities',route=>route.fulfill({status:200,contentType:'application/json',
  body:'{"ok":true,"google_meet_auto_creation":false}'}));
 await page.route('**/api/v2150/private-energy/lessons',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',agenda:[{start:0,end:60,label:'Human-led speaking'}],lessons:[sample]})}));
 await page.route('**/api/v2150/private-energy/review-queue',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,partial:true,google_calendars_checked:false,requests:[{
   id:id(1),lesson_number:2,status:'scheduled',starts_at:next,change_request:{kind:'cancel',status:'pending'}
  }]})}));
 await page.route('**/api/v2150/private-energy/sessions/history?*',route=>{
  historyCalls.push(new URL(route.request().url()).searchParams.get('offset'));
  return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
   ok:true,sessions:[{id:id(2),lesson_number:2,lesson_title:'Past lesson',
    starts_at:past,status:'completed',provider:'Google Meet',meet_ready:false,meet_url:null}],
   has_more:false,next_offset:1,includes_active_bookings:false})});
 });
 await page.route('**/api/v2150/private-energy/sessions',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',partial:true,sessions:[{
   id:id(1),lesson_number:2,lesson_title:'Upcoming lesson',starts_at:next,status:'scheduled',
   provider:'Google Meet',meet_ready:true,meet_url:'https://meet.google.com/abc-defg-hij',
   change_request:{kind:'cancel',status:'pending'}
  }]})}));
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-authorized')).toBeVisible();
 await expect(page.locator('#energy-schedule-status')).toContainText('Showing only the first 50 prioritized records');
 const board=page.locator('#energy-hf61-review-board');
 await expect(board).toHaveCount(1);
 await expect(board.locator('summary')).toContainText('Pending student change requests (1+)');
 await board.locator('summary').click();
 await expect(board).toContainText('first 50 pending requests');
 await board.getByRole('button',{name:'Go to this class for review'}).click();
 await expect(page.locator('.energy-review-queue')).toHaveCount(1);
 await page.locator('.energy-history-list summary').click();
 await page.getByRole('button',{name:'Load older class records (25 per page)'}).click();
 await expect(page.locator('.energy-history-items .session')).toHaveCount(1);
 await expect(page.locator('.energy-history-items a.join')).toHaveCount(0);
 await expect(page.locator('.energy-load-history')).toHaveCount(0);
 expect(historyCalls).toEqual(['0']);
 expect(writes).toEqual([]);
 expect(errors).toEqual([]);
});
