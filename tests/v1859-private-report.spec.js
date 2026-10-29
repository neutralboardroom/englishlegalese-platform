'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const lesson={lesson_key:'workbook:history-one',lesson_title:'Fictional Legal Workbook',origin_path:'/learn/legal-english/',status:'submitted',updated_at:'2026-10-29T04:00:00Z'};
async function setup(page,submissions){
 await page.addInitScript(()=>sessionStorage.setItem('el1940.student.session','mock.verified.session'));
 await page.route('**/api/v1940/lessons/capabilities',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v119/auth/me',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"mock-student","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,lessons:[lesson],has_more:false,next_offset:null})}));
 await page.route('**/api/v1940/lessons/workbook%3Ahistory-one/submissions',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submissions})}));
}
test('HF23 on-demand private download contains genuine teacher history but never answers, tokens or unreviewed comments',async({page})=>{
 let mutations=0,queries=0;
 page.on('request',r=>{if(r.url().includes('/submissions'))queries++;if(['POST','PUT','DELETE'].includes(r.method())&&r.url().includes('/api/v1940/'))mutations++;});
 await setup(page,[
  {review_status:'awaiting_review',created_at:'2026-10-29T10:00:00Z',answers:'STUDENT RESPONSE SECRET',teacher_feedback:'UNREVIEWED COMMENT NEVER EXPORT'},
  {review_status:'reviewed',created_at:'2026-10-27T10:00:00Z',reviewed_at:'2026-10-28T11:00:00Z',teacher_feedback:'Genuine teacher note <script>invalid</script>',answers:'PAST ANSWERS SECRET'}
 ]);
 await page.goto('/learn/my-work/');
 const hub=page.locator('[data-el1940-hub]');
 await expect(hub.locator('.v1940-review-export')).toHaveCount(0);
 expect(queries).toBe(0);
 await hub.getByRole('button',{name:/Check submission and teacher feedback for Fictional Legal Workbook/}).click();
 await expect(hub.locator('.v1940-review-export')).toHaveCount(1);
 page.once('dialog',d=>d.accept());
 const [file]=await Promise.all([page.waitForEvent('download'),hub.getByRole('button',{name:'Download private submission history (.txt)'}).click()]);
 const content=fs.readFileSync(await file.path(),'utf8');
 expect(content).toContain('PRIVATE student submission');
 expect(content).toContain('Fictional Legal Workbook');
 expect(content).toContain('Awaiting teacher feedback');
 expect(content).toContain('Genuine teacher note <script>invalid</script>');
 expect(content).toContain('not necessarily all');
 expect(content).not.toContain('PAST ANSWERS SECRET');
 expect(content).not.toContain('STUDENT RESPONSE SECRET');
 expect(content).not.toContain('UNREVIEWED COMMENT NEVER EXPORT');
 expect(content).not.toContain('mock.verified.session');
 expect(mutations).toBe(0);expect(queries).toBe(1);
});
test('HF23 canceling download triggers no file and existing lesson work remains',async({page})=>{
 await setup(page,[{review_status:'reviewed',teacher_feedback:'Feedback remains private'}]);
 await page.goto('/learn/my-work/');
 await page.getByRole('button',{name:/Check submission and teacher feedback for Fictional Legal Workbook/}).click();
 let downloads=0;page.on('download',()=>downloads++);
 page.once('dialog',d=>d.dismiss());
 await page.getByRole('button',{name:'Download private submission history (.txt)'}).click();
 expect(downloads).toBe(0);
 await expect(page.locator('.v1940-saved-card')).toHaveCount(1);
 await expect(page.locator('.v1940-review-result')).toContainText('Feedback remains private');
});
test('HF23 signing out removes any private download control and review data',async({page})=>{
 await setup(page,[{review_status:'reviewed',teacher_feedback:'Sensitive tutor note'}]);
 await page.route('**/api/v1940/student/auth/logout',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"signed_out":true,"session_revoked":true}'}));
 await page.goto('/learn/my-work/');
 await page.getByRole('button',{name:/Check submission and teacher feedback for Fictional Legal Workbook/}).click();
 await expect(page.locator('.v1940-review-export')).toHaveCount(1);
 await page.getByRole('button',{name:'Sign out',exact:true}).click();
 await expect(page.locator('.v1940-review-export')).toHaveCount(0);
 await expect(page.locator('[data-el1940-hub]')).not.toContainText('Sensitive tutor note');
});
