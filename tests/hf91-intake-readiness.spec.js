'use strict';
const {test,expect}=require('@playwright/test');
const readinessPath='**/api/v1850/intake-status?channel=';
for(const user of [
 {page:'/learn/enroll/',form:'#v1850-enroll-form',kind:'enroll',post:'**/api/v1850/enroll',label:'Submit enrollment inquiry',success:'Inquiry received.'},
 {page:'/learn/teach-with-us/',form:'#v1850-staff-form',kind:'teacher',post:'**/api/v1850/teacher-applications',label:'Submit teaching application',success:'Application received.'}
]){
 test('HF91 '+user.kind+' unavailable status never transmits personal details',async({page})=>{
  let statusCalls=0,submitted=0;
  await page.route(readinessPath+user.kind,route=>{statusCalls++;expect(route.request().method()).toBe('GET');expect(route.request().postData()).toBeNull();expect(route.request().headers()).not.toHaveProperty('cookie');return route.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"ready":false}'});});
  await page.route(user.post,route=>{submitted++;return route.abort()});
  await page.goto(user.page);
  await expect(page.locator(user.form+' button[type=button]')).toHaveCount(1);
  expect(statusCalls).toBe(0); // voluntary check, not auto networked
  await page.locator(user.form+' input[name=full_name]').fill('Fictional Adult');
  await page.locator(user.form+' input[name=email]').fill('fictional@example.test');
  if(user.kind==='teacher'){
   await page.locator(user.form+' textarea[name=qualifications]').fill('Fictional English-teaching experience in international workplaces.');
   await page.locator(user.form+' textarea[name=weekly_availability]').fill('Tuesday evenings');
  }
  await page.getByRole('button',{name:user.label}).click();
  await expect(page.locator(user.form)).toContainText(user.kind==='enroll'?'Request NOT sent.':'Application NOT sent.');
  expect(statusCalls).toBe(1);expect(submitted).toBe(0);
  await expect(page.locator(user.form+' input[name=email]')).toHaveValue('fictional@example.test');
 });
 test('HF91 '+user.kind+' successful readiness precedes synthetic accepted form request',async({page})=>{
  let order=[];let posted=null;
  await page.route(readinessPath+user.kind,route=>{order.push('GET');expect(route.request().postData()).toBeNull();return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,ready:true,channel:user.kind,stripe_enabled:false})})});
  await page.route(user.post,route=>{order.push('POST');posted=route.request().postDataJSON();return route.fulfill({status:201,contentType:'application/json',body:'{"ok":true,"received":true,"reference":"SYNTHETIC-ONLY"}'})});
  await page.goto(user.page);
  await page.locator(user.form+' input[name=full_name]').fill('Fictional Adult');
  await page.locator(user.form+' input[name=email]').fill('fictional@example.test');
  if(user.kind==='teacher'){
   await page.locator(user.form+' textarea[name=qualifications]').fill('Fictional English-teaching experience in international workplaces.');
   await page.locator(user.form+' textarea[name=weekly_availability]').fill('Tuesday evenings');
  }
  await page.getByRole('button',{name:user.label}).click();
  await expect(page.locator(user.kind==='enroll'?'#v1850-enrollment-app':'#v1850-teacher-apply')).toContainText('SYNTHETIC-ONLY');
  expect(order).toEqual(['GET','POST']);expect(posted.email).toBe('fictional@example.test');
  expect(posted).not.toHaveProperty('card');
 });
}
test('HF91 explicit check button reveals status without reading or submitting form details',async({page})=>{
 let requests=[];
 await page.route(readinessPath+'enroll',route=>{requests.push({method:route.request().method(),body:route.request().postData()});return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"ready":true,"stripe_enabled":false}'})});
 await page.goto('/learn/enroll/');
 await page.getByRole('button',{name:'Check request availability'}).click();
 await expect(page.locator('#v1850-enroll-form [role=status]').first()).toContainText('service is available');
 expect(requests).toEqual([{method:'GET',body:null}]);
});
