'use strict';
const {test,expect}=require('@playwright/test');
const lesson={lesson_key:'workbook:history-one',lesson_title:'Fictional Legal Workbook',origin_path:'/learn/legal-english/',status:'submitted',updated_at:'2026-10-29T04:00:00Z'};
async function student(page,submissions){
 await page.addInitScript(()=>sessionStorage.setItem('el1940.student.session','mock.verified.session'));
 await page.route('**/api/v1940/lessons/capabilities',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v119/auth/me',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"mock-student","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,lessons:[lesson],has_more:false,next_offset:null})}));
 await page.route('**/api/v1940/lessons/workbook%3Ahistory-one/submissions',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submissions})}));
}
test('HF24 student dashboard filters genuine earlier reviews without modifying data',async({page})=>{
 let reads=0,writes=0;
 page.on('request',r=>{if(r.url().includes('/submissions'))reads++;if(['POST','PUT','DELETE'].includes(r.method())&&r.url().includes('/api/v1940'))writes++;});
 await student(page,[{review_status:'awaiting_review',created_at:'2026-10-29T10:00:00Z'},{review_status:'reviewed',created_at:'2026-10-28T10:00:00Z',teacher_feedback:'Actual teacher correction'},{review_status:'pending_assignment',created_at:'2026-10-27T10:00:00Z',teacher_feedback:'UNREVIEWED SHOULD NOT SHOW'},{review_status:'reviewed',created_at:'2026-10-26T10:00:00Z',teacher_feedback:'Another teacher note'}]);
 await page.goto('/learn/my-work/');
 await expect(page.locator('.v1940-review-counts')).toHaveCount(0);
 await page.getByRole('button',{name:/Check submission and teacher feedback for Fictional Legal Workbook/}).click();
 const area=page.locator('.v1940-review-result');
 await expect(area.locator('.v1940-review-counts')).toContainText('Recent records returned: 4 · Reviewed: 2 · Awaiting teacher review: 1 · Assignment/review unconfirmed: 1');
 await area.locator('.v1940-review-history summary').click();
 await expect(area.locator('.v1940-review-entry')).toHaveCount(3);
 await area.getByRole('button',{name:'Show only earlier reviewed submissions'}).click();
 await expect(area.locator('.v1940-review-entry')).toHaveCount(2);
 await expect(area.locator('.v1940-history-status')).toContainText('Showing 2 of 3 earlier');
 await expect(area).toContainText('Actual teacher correction');
 await expect(area).not.toContainText('UNREVIEWED SHOULD NOT SHOW');
 await area.getByRole('button',{name:'Show all earlier submissions'}).click();
 await expect(area.locator('.v1940-review-entry')).toHaveCount(3);
 expect(reads).toBe(1);expect(writes).toBe(0);
});
test('HF24 teacher dashboard filters assigned queue and opens only mocked authorized work',async({page})=>{
 let queueGets=0,postReviews=0;
 await page.route('**/api/v1940/teacher/auth/login',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"token":"mock.teacher.session","user":{"role":"teacher"}}'}));
 await page.route('**/api/v1940/teacher/submissions',r=>{queueGets++;r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submissions:[{id:'1',lesson_title:'Contract language',review_status:'awaiting_review',created_at:'2026-10-28T10:00:00Z'},{id:'2',lesson_title:'Investor English',review_status:'reviewed',created_at:'2026-10-27T10:00:00Z'},{id:'3',lesson_title:'Client meeting',review_status:'pending_assignment',created_at:'2026-10-26T10:00:00Z'}]})})});
 await page.route('**/api/v1940/teacher/submissions/1',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,submission:{id:'1',lesson_title:'Contract language',created_at:'2026-10-28T10:00:00Z',review_status:'awaiting_review',answers:{fictional:'Practice only'}}})}));
 page.on('request',r=>{if(r.method()==='POST'&&r.url().includes('/submissions/'))postReviews++});
 await page.goto('/learn/teacher-submissions/');
 await page.locator('#v1940-teacher-login input[name=email]').fill('teacher@example.test');
 await page.locator('#v1940-teacher-login input[name=password]').fill('fictional-password');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 await expect(page.locator('.v1940-teacher-summary')).toContainText('Awaiting review: 1 · Reviewed: 1');
 await expect(page.locator('.v1940-teacher-list article')).toHaveCount(1);
 await page.getByRole('combobox',{name:'Filter assigned submissions by status'}).selectOption('all');
 await expect(page.locator('.v1940-teacher-list article')).toHaveCount(3);
 await page.getByRole('searchbox',{name:'Search assigned lesson titles'}).fill('Investor');
 await expect(page.locator('.v1940-teacher-list article')).toHaveCount(1);
 await page.getByRole('searchbox',{name:'Search assigned lesson titles'}).fill('');
 await page.getByRole('combobox',{name:'Filter assigned submissions by status'}).selectOption('awaiting_review');
 await page.getByRole('button',{name:'Open assigned submission'}).click();
 await expect(page.locator('#v1940-teacher-answers')).toContainText('Practice only');
 expect(postReviews).toBe(0);expect(queueGets).toBe(1);
});
test('HF24 employer dashboard provides actual quote estimator and inquiry route without employer sign-in or private data',async({page})=>{
 await page.goto('/learn/employers/');
 await expect(page.getByRole('heading',{name:'Employer training workspace'})).toBeVisible();
 const box=page.locator('[data-v1880-quote-planner]');
 await expect(box).toContainText('Estimated group total');
 await expect(page.locator('#hf24-employer-workspace')).toContainText('not yet enabled');
 await expect(page.locator('#hf24-employer-workspace a[href="/learn/enroll/"]')).toHaveCount(1);
 await expect(page.locator('#hf24-employer-workspace a[href="#v1880-employer-estimate"]')).toHaveCount(1);
});
test('HF24 account landing routes each role to accurate existing workspace',async({page})=>{
 await page.goto('/learn/account/');
 await expect(page.getByRole('link',{name:'Open student saved-work dashboard'})).toHaveAttribute('href','/learn/my-work/');
 await expect(page.getByRole('link',{name:'Open teacher review dashboard'})).toHaveAttribute('href','/learn/teacher-submissions/');
 await expect(page.getByRole('link',{name:'Open employer training workspace'})).toHaveAttribute('href','/learn/employers/');
 await expect(page.getByRole('link',{name:'Open owner/admin dashboard'})).toHaveAttribute('href','/learn/owner-dashboard/');
 await expect(page.locator('.v1940-role-grid article')).toHaveCount(4);
});
