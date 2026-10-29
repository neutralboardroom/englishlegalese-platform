'use strict';
const {test,expect}=require('@playwright/test');
const lesson={lesson_key:'workbook:history-one',lesson_title:'Fictional Legal Workbook',origin_path:'/learn/legal-english/',status:'submitted',updated_at:'2026-10-29T04:00:00Z'};
async function setup(page,provider){
 await page.addInitScript(()=>sessionStorage.setItem('el1940.student.session','mock.verified.session'));
 await page.route('**/api/v1940/lessons/capabilities',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v119/auth/me',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"mock-student","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,lessons:[lesson],has_more:false,next_offset:null})}));
 await page.route('**/api/v1940/lessons/workbook%3Ahistory-one/submissions',provider);
}
test('HF22 preserves latest submission state and securely discloses older genuine teacher feedback only after explicit click',async({page})=>{
 let requests=0,mutations=0;
 page.on('request',r=>{if(r.url().includes('/submissions'))requests++;if(['POST','PUT','DELETE'].includes(r.method())&&r.url().includes('/api/v1940/'))mutations++;});
 await setup(page,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submissions:[
  {review_status:'awaiting_review',created_at:'2026-10-29T03:00:00Z',teacher_feedback:null},
  {review_status:'reviewed',created_at:'2026-10-27T03:00:00Z',reviewed_at:'2026-10-28T03:00:00Z',teacher_feedback:'Real older tutor remarks <img src=x onerror=alert(1)>'},
  {review_status:'pending_assignment',created_at:'2026-10-20T03:00:00Z',teacher_feedback:null}
 ]})}));
 await page.goto('/learn/my-work/');
 const hub=page.locator('[data-el1940-hub]'),button=hub.getByRole('button',{name:/Check submission and teacher feedback for Fictional Legal Workbook/});
 expect(requests).toBe(0);
 await button.click();
 await expect(hub.locator('.v1940-review-result')).toContainText('feedback has not been recorded yet');
 const history=hub.locator('details.v1940-review-history');
 await expect(history).toHaveCount(1);
 await expect(history.locator('summary')).toContainText('Earlier submissions (2 shown');
 await history.locator('summary').click();
 await expect(history.locator('.v1940-review-entry')).toHaveCount(2);
 await expect(history).toContainText('Real older tutor remarks');
 await expect(history).toContainText('teacher assignment or review was not confirmed');
 await expect(history.locator('img')).toHaveCount(0);
 expect(requests).toBe(1);expect(mutations).toBe(0);
});
test('HF22 a single submission displays no history, and over-limit results fail closed',async({page})=>{
 let many=false;
 await setup(page,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submissions:many?Array.from({length:21},()=>({review_status:'reviewed'})):[{review_status:'reviewed',teacher_feedback:'Only genuine latest note'}]})}));
 await page.goto('/learn/my-work/');
 const btn=page.getByRole('button',{name:/Check submission and teacher feedback for Fictional Legal Workbook/}),hub=page.locator('[data-el1940-hub]');
 await btn.click();
 await expect(hub).toContainText('Only genuine latest note');
 await expect(hub.locator('.v1940-review-history')).toHaveCount(0);
 many=true;await btn.click();
 await expect(hub).toContainText('history could not be validated');
 await expect(hub).not.toContainText('Only genuine latest note');
 await expect(hub.locator('.v1940-review-history')).toHaveCount(0);
});
test('HF22 private older review cannot appear after logout while a history request is in flight',async({page})=>{
 let release;const gate=new Promise(resolve=>{release=resolve;});let started=0;
 await setup(page,async r=>{
  started++;await gate;
  return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submissions:[{review_status:'awaiting_review'},{review_status:'reviewed',teacher_feedback:'PRIVATE HISTORY FROM PRIOR ACCOUNT'}]})});
 });
 await page.route('**/api/v1940/student/auth/logout',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"signed_out":true,"session_revoked":true}'}));
 await page.goto('/learn/my-work/');
 await page.getByRole('button',{name:/Check submission and teacher feedback for Fictional Legal Workbook/}).click();
 await expect.poll(()=>started).toBe(1);
 await page.getByRole('button',{name:'Sign out',exact:true}).click();
 release();
 await expect(page.locator('[data-el1940-hub]')).not.toContainText('PRIVATE HISTORY FROM PRIOR ACCOUNT');
 await expect(page.getByRole('button',{name:'Sign in to my account'})).toBeVisible();
});
