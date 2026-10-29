'use strict';
const {test,expect}=require('@playwright/test');
const saved=[
 {lesson_key:'workbook:submitted-one',lesson_title:'Fictional legal response',origin_path:'/learn/legal-english/',status:'submitted',updated_at:'2026-10-29T00:00:00Z'},
 {lesson_key:'workbook:draft-one',lesson_title:'Fictional draft',origin_path:'/learn/business-english/',status:'draft',updated_at:'2026-10-28T00:00:00Z'}
];
async function setup(page,lookup){
 await page.addInitScript(()=>sessionStorage.setItem('el1940.student.session','mock.verified.session'));
 await page.route('**/api/v1940/lessons/capabilities',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v119/auth/me',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"mock-student","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,lessons:saved,has_more:false,next_offset:null})}));
 await page.route('**/api/v1940/lessons/workbook%3Asubmitted-one/submissions',lookup);
}
test('HF21 authenticated student fetches real reviewed teacher feedback only on explicit request, renders as text not markup',async({page})=>{
 let requests=0,mutations=0;
 page.on('request',r=>{if(r.url().includes('/submissions'))requests++;if(['POST','PUT','DELETE'].includes(r.method())&&r.url().includes('/api/v1940/'))mutations++;});
 await setup(page,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submissions:[{review_status:'reviewed',teacher_feedback:'Helpful, specific teacher note. <img src=x onerror=alert(1)>',reviewed_at:'2026-10-29T00:00:00Z'}]})}));
 await page.goto('/learn/my-work/');
 const hub=page.locator('[data-el1940-hub]');
 await expect(hub.locator('.v1940-saved-card')).toHaveCount(2);
 await expect(hub.locator('.v1940-review-button')).toHaveCount(1);
 expect(requests).toBe(0);
 await hub.getByRole('button',{name:/Check submission and teacher feedback for Fictional legal response/}).click();
 await expect(hub.locator('.v1940-review-result')).toContainText('Helpful, specific teacher note.');
 await expect(hub.locator('.v1940-review-result')).toContainText('Reviewed by your assigned teacher');
 await expect(hub.locator('.v1940-review-result img')).toHaveCount(0);
 expect(requests).toBe(1);expect(mutations).toBe(0);
});
test('HF21 accurately distinguishes awaiting teacher, missing assignment and server errors without claiming a review',async({page})=>{
 let status='awaiting_review',error=false;
 await setup(page,r=>r.fulfill({status:error?503:200,contentType:'application/json',body:error?'{"ok":false,"error":"Temporary database failure"}':JSON.stringify({ok:true,submissions:[{review_status:status,teacher_feedback:null}]})}));
 await page.goto('/learn/my-work/');
 const btn=page.getByRole('button',{name:/Check submission and teacher feedback for Fictional legal response/}),panel=page.locator('.v1940-review-result');
 await btn.click();await expect(panel).toContainText('feedback has not been recorded yet');
 status='pending_assignment';await btn.click();await expect(panel).toContainText('Teacher assignment or review has not been confirmed');
 error=true;await btn.click();await expect(panel).toContainText('Feedback could not be loaded: Temporary database failure');
 await expect(panel).not.toContainText('Reviewed by your assigned teacher');
});
test('HF21 signout invalidates an in-flight private review and erases prior account work',async({page})=>{
 let release;const gate=new Promise(resolve=>release=resolve);let started=0;
 await setup(page,async r=>{
  started++;await gate;
  return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submissions:[{review_status:'reviewed',teacher_feedback:'PRIVATE PRIOR-ACCOUNT COMMENT'}]})});
 });
 await page.route('**/api/v1940/student/auth/logout',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"signed_out":true,"session_revoked":true}'}));
 await page.goto('/learn/my-work/');
 await page.getByRole('button',{name:/Check submission and teacher feedback for Fictional legal response/}).click();
 await expect.poll(()=>started).toBe(1);
 await page.getByRole('button',{name:'Sign out',exact:true}).click();
 release();
 await expect(page.locator('[data-el1940-hub]')).not.toContainText('PRIVATE PRIOR-ACCOUNT COMMENT');
 await expect(page.getByRole('button',{name:'Sign in to my account'})).toBeVisible();
});
