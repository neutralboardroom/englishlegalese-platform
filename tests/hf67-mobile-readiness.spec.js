'use strict';
const {test,expect}=require('@playwright/test');
test('HF67 device-readiness check runs only after click and never sends authenticated API or form writes',async({page})=>{
 const errors=[],writes=[],apiCalls=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{
  if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());
  if(r.url().includes('/api/'))apiCalls.push(r.url());
 });
 await page.goto('/learn/install/');
 await expect(page.getByRole('heading',{name:'Take EnglishLegalese with you.'})).toBeVisible();
 const check=page.getByRole('button',{name:'Check my device and public app files'});
 const status=page.locator('#el-device-check-status');
 const results=page.locator('#el-device-check-results');
 await expect(status).toContainText('No check has run');
 await expect(results.locator('li')).toHaveCount(0);
 await check.click();
 await expect(status).toContainText('check finished');
 await expect(results.locator('li')).toHaveCount(7);
 for(const label of ['Secure connection','Installed window','Browser support','App manifest','App icon 192px','App icon 512px','App setup'])
  await expect(results.locator('li',{hasText:label})).toHaveCount(1);
 expect(writes).toEqual([]);expect(apiCalls).toEqual([]);expect(errors).toEqual([]);
 const sizes=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
 expect(sizes.document).toBeLessThanOrEqual(sizes.viewport+2);
});
test('HF67 API and private account/course-work shells have HTTP no-store headers',async({page})=>{
 const api=await page.request.get('/api/v119/auth/me');
 expect(api.headers()['cache-control']).toContain('no-store');
 for(const url of ['/learn/account/','/learn/my-work/','/learn/private-energy-contracts/',
  '/learn/owner-dashboard/','/learn/teacher-submissions/','/learn/employer-dashboard/']){
  const response=await page.request.get(url);
  expect(response.ok(),url).toBeTruthy();
  expect(response.headers()['cache-control'],url).toContain('private, no-store');
  expect(response.headers()['pragma'],url).toContain('no-cache');
 }
 const course=await page.request.get('/learn/business-english/');
 expect(course.ok()).toBeTruthy();
 expect(course.headers()['cache-control']||'').not.toContain('no-store');
});
