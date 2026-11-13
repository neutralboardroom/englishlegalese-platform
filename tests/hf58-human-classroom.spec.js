'use strict';
const {test,expect}=require('@playwright/test');
const ID='EL-ENERGY-11111111-1111-4111-8111-111111111111';
const NEXT=new Date(Date.now()+10*86400000).toISOString();
const lesson={number:2,title:'Conforming bids and qualifying conditions',
 goal:'Explain proposed conditions clearly using professional English.',
 scenario:'A fictional buyer asks whether an offer satisfies all bidding terms.',
 model:'The proposal needs review against the stated qualification requirements.',
 vocabulary:['conforming bid','qualification','crude oil'],
 homework:'Explain the difference between proposed and confirmed terms.',
 teacherPrompt:'TEACHER_ONLY_PRIVATE_NEGOTIATION_PROMPT'};
const agenda=[{start:0,end:60,label:'Teacher-guided speaking exercise'}];
async function setup(page,role){
 const errors=[],writes=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.addInitScript(accountRole=>{
  sessionStorage.setItem(accountRole==='student'?'el1940.student.session':'el2150.teacher.session','MOCKED-LOCAL-SESSION');
 },role);
 await page.route('**/api/v119/auth/me',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,user:{id:role+'-one',role}})}));
 await page.route('**/api/v2150/private-energy/capabilities',route=>route.fulfill({status:200,contentType:'application/json',
  body:'{"ok":true,"google_meet_auto_creation":false}'}));
 let request=null;
 await page.route('**/api/v2150/private-energy/sessions/*/change-request',route=>{
  request=route.request().postDataJSON();
  return route.fulfill({status:202,contentType:'application/json',body:JSON.stringify({
   ok:true,charge_applied:false,calendar_event_changed:false,message:'Request saved for teacher review. No charge was made.'})});
 });
 await page.route('**/api/v2150/private-energy/sessions',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role,sessions:[{id:ID,lesson_number:2,lesson_title:lesson.title,
   starts_at:NEXT,status:'scheduled',provider:'Google Meet',meet_ready:true,meet_url:'https://meet.google.com/abc-defg-hij',
   notice_policy_hours:null,change_request:request?{kind:request.kind,status:'pending'}:null}]})}));
 await page.route('**/api/v2150/private-energy/lessons',route=>route.fulfill({status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,role,agenda,lessons:[role==='student'?Object.fromEntries(Object.entries(lesson).filter(([key])=>key!=='teacherPrompt')):lesson]})}));
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-authorized')).toBeVisible();
 return {errors,writes,getRequest:()=>request};
}
test('HF58 assigned student can request cancellation; does not silently charge or cancel',async({page})=>{
 const result=await setup(page,'student');
 await expect(page.locator('.energy-change-form')).toHaveCount(1);
 await expect(page.locator('.energy-change-form')).toContainText('notice period and credit/fee terms are not yet confirmed');
 await expect(page.locator('.energy-presentation-open')).toHaveCount(0);
 await page.getByRole('button',{name:'Send change request for teacher review'}).click();
 expect(result.getRequest()).toEqual({kind:'cancel'});
 await expect(page.locator('#energy-schedule')).toContainText('pending teacher review');
 await expect(page.locator('#energy-schedule')).toContainText('original appointment is unchanged');
 await expect(page.locator('.energy-change-form')).toHaveCount(0);
 expect(result.writes.length).toBe(1);
 expect(result.errors).toEqual([]);
});
test('HF58 teacher can launch a student-only slide presentation without private prompt leakage',async({page,context})=>{
 const result=await setup(page,'teacher');
 await expect(page.getByRole('button',{name:'Check EnglishLegalese calendar conflicts'})).toBeVisible();
 await page.locator('details.energy-lesson').first().locator(':scope > summary').click();
 await expect(page.getByRole('button',{name:'Open student presentation for Google Meet'})).toBeVisible();
 const narrow=await page.evaluate(()=>matchMedia('(max-width: 700px)').matches);
 if(narrow){
  // A popup can be blocked by real mobile browsers. Verify the alternate
  // full-screen screen-sharing view instead of waiting forever for a new page.
  await page.getByRole('button',{name:'Open student presentation for Google Meet'}).click();
  const slides=page.locator('.energy-slide-inline');
  await expect(slides).toBeVisible();
  await expect(slides.getByRole('heading',{name:'Welcome'})).toBeVisible();
  await expect(slides).toContainText('HUMAN-LED CLASS');
  await expect(slides).not.toContainText('TEACHER_ONLY_PRIVATE_NEGOTIATION_PROMPT');
  await slides.getByRole('button',{name:'Next'}).click();
  await expect(slides.getByRole('heading',{name:'Today’s speaking goal'})).toBeVisible();
  await expect(slides.locator('footer')).toContainText('Slide 2 of 7');
  await slides.getByRole('button',{name:'Close presentation'}).click();
  await expect(slides).toHaveCount(0);
 }else{
  const popupEvent=page.waitForEvent('popup',{timeout:15000});
  await page.getByRole('button',{name:'Open student presentation for Google Meet'}).click();
  const popup=await popupEvent;
  await expect(popup.getByRole('heading',{name:'Welcome'})).toBeVisible();
  await expect(popup.locator('body')).toContainText('HUMAN-LED CLASS');
  await expect(popup.locator('body')).not.toContainText('TEACHER_ONLY_PRIVATE_NEGOTIATION_PROMPT');
  await popup.getByRole('button',{name:'Next'}).click();
  await expect(popup.getByRole('heading',{name:'Today’s speaking goal'})).toBeVisible();
  await expect(popup.locator('footer')).toContainText('Slide 2 of 7');
  await popup.close();
 }
 expect(result.writes).toEqual([]);
 expect(result.errors).toEqual([]);
});
test('HF58 unsigned visitors see neither meeting links nor a presentation',async({page})=>{
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-login-form')).toBeVisible();
 await expect(page.locator('.energy-presentation-open')).toHaveCount(0);
 await expect(page.locator('.energy-change-form')).toHaveCount(0);
 await expect(page.locator('a[href^="https://meet.google.com/"]')).toHaveCount(0);
});
