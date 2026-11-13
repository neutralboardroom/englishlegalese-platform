'use strict';
const {test,expect}=require('@playwright/test');
const upcoming=new Date(Date.now()+5*86400000).toISOString();
const history=new Date(Date.now()-5*86400000).toISOString();
const sample={number:2,title:'Contract conditions',goal:'Use clear hypothetical wording.',
 scenario:'Fictional terms only.',model:'We need to verify.',vocabulary:['contract','approval'],
 homework:'Summarize a fictional term.'};
const id=n=>'EL-ENERGY-'+n+'11111111-1111-4111-8111-111111111111'.slice(n.length);
test('HF60 past students and lessons stay in history, not upcoming classes or active Meet links',async({page})=>{
 const pageErrors=[],writes=[];
 page.on('pageerror',e=>pageErrors.push(e.message));
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.addInitScript(()=>sessionStorage.setItem('el2150.teacher.session','HF60_TEST_SESSION'));
 await page.route('**/api/v119/auth/me',route=>route.fulfill({status:200,contentType:'application/json',
  body:'{"ok":true,"user":{"id":"teacher","role":"teacher"}}'}));
 await page.route('**/api/v2150/private-energy/capabilities',route=>route.fulfill({status:200,contentType:'application/json',
  body:'{"ok":true,"google_meet_auto_creation":false}'}));
 await page.route('**/api/v2150/private-energy/sessions',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',sessions:[
   {id:id('1'),lesson_number:2,lesson_title:'Future class',starts_at:upcoming,status:'scheduled',
    provider:'Google Meet',meet_ready:true,meet_url:'https://meet.google.com/abc-defg-hij'},
   {id:id('2'),lesson_number:3,lesson_title:'Past scheduled class',starts_at:history,status:'scheduled',
    provider:'Google Meet',meet_ready:true,meet_url:'https://meet.google.com/def-ghij-klm'},
   {id:id('3'),lesson_number:4,lesson_title:'Completed class',starts_at:history,status:'completed',
    provider:'Google Meet',meet_ready:false,meet_url:null}
  ]})}));
 await page.route('**/api/v2150/private-energy/lessons',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role:'teacher',agenda:[{start:0,end:60,label:'Speaking lesson'}],lessons:[sample]})}));
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-authorized')).toBeVisible();
 const status=page.locator('#energy-schedule-status');
 await expect(status).toContainText('Current/upcoming class records: 1');
 await expect(status).toContainText('Past or closed records: 2');
 await expect(status).toContainText('A historical record is not an active student');
 await expect(page.locator('.energy-history-list')).toHaveCount(1);
 await expect(page.locator('#energy-schedule a.join')).toHaveCount(1);
 await expect(page.locator('#energy-schedule a.join')).toHaveAttribute('href','https://meet.google.com/abc-defg-hij');
 await page.locator('.energy-history-list summary').click();
 await expect(page.locator('.energy-history-items .session')).toHaveCount(2);
 await expect(page.locator('.energy-history-items')).toContainText('Past or closed class record');
 await expect(page.locator('.energy-history-items a.join')).toHaveCount(0);
 expect(writes).toEqual([]);expect(pageErrors).toEqual([]);
});
