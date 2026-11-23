'use strict';
const {test,expect}=require('@playwright/test');
const sessionId='EL-ENERGY-11111111-1111-4111-8111-111111111111';
const lesson={
 number:2,title:'Conforming bids and qualifying conditions',
 goal:'Explain qualification conditions clearly in a fictional energy sale.',
 scenario:'A fictional buyer asks if a price alone makes an offer qualifying.',
 model:'We need to check the stated conditions before treating a bid as conforming.',
 vocabulary:['conforming bid','qualification','crude oil'],
 pronunciation:'Crude oil /kruːd ɔɪl/: crew, crude, crude oil sales agreement.',
 teacherPronunciationPrompt:'Model the /kr/ blend and prompt one natural sentence.',
 teacherPrompt:'Play an overseas buyer asking whether the highest price always qualifies.',
 homework:'Prepare one short qualified bidder update.'
};
const agenda=[
 {start:0,end:5,label:'Recall'}, {start:5,end:15,label:'Words'},
 {start:15,end:25,label:'Clause'}, {start:25,end:45,label:'Negotiation'},
 {start:45,end:55,label:'Second attempt'}, {start:55,end:60,label:'Recap'}
];
async function setup(page,role='student'){
 const errors=[],writes=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',request=>{
  if(['POST','PUT','PATCH','DELETE'].includes(request.method()))writes.push(request.url());
 });
 await page.addInitScript(type=>{
  sessionStorage.setItem(type==='student'?'el1940.student.session':'el2150.teacher.session','SIMULATED-IN-BROWSER-ONLY');
 },role);
 await page.route('**/api/v119/auth/me',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,user:{id:role==='student'?'student1':'teacher1',role}})}));
 await page.route('**/api/v2150/private-energy/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,google_meet_auto_creation:false})}));
 await page.route('**/api/v2150/private-energy/sessions',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,role,sessions:[{
  id:sessionId,lesson_number:2,lesson_title:lesson.title,starts_at:'2026-12-01T10:00:00Z',
  status:'scheduled',provider:'Google Meet',meet_ready:true,meet_url:'https://meet.google.com/abc-defg-hij'}]})}));
 await page.route('**/api/v2150/private-energy/lessons',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,role,lessons:[role==='student'?Object.fromEntries(Object.entries(lesson).filter(([k])=>k!=='teacherPrompt'&&k!=='teacherPronunciationPrompt')):lesson],agenda})}));
 await page.route('**/api/v2150/private-energy/sessions/*/readiness',route=>route.fulfill({
  status:200,contentType:'application/json',
  body:JSON.stringify({ok:true,session_id:sessionId,role,state:'ready',join_available:true,duration_minutes:60,
   recording_enabled:false,next_action:'Open Google Meet from your EnglishLegalese class card and test mic/speakers before joining.'})
 }));
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-authorized')).toBeVisible();
 return {errors,writes};
}
test('HF57 student receives six guided speaking stages, privacy checklist and 60-minute local timer',async({page})=>{
 const {errors,writes}=await setup(page);
 const lessonCard=page.locator('details.energy-lesson').first();
 await lessonCard.locator(':scope > summary').click();
 const tool=lessonCard.locator('.energy-live-conductor');
 await expect(tool).toHaveCount(1);
 await tool.locator(':scope > summary').click();
 await expect(tool.locator('.energy-live-check')).toHaveCount(3);
 await expect(tool.locator('.energy-live-current')).toContainText('Stage 1 of 6');
 await expect(tool).not.toContainText('Teacher-only buyer/counsel prompts');
 await tool.getByRole('button',{name:'Next stage'}).click();
 await expect(tool.locator('.energy-live-current')).toContainText('Stage 2 of 6');
 await expect(tool).toContainText('Crude oil');
 await tool.getByRole('button',{name:'Next stage'}).click();
 await tool.getByRole('button',{name:'Next stage'}).click();
 await expect(tool.locator('.energy-live-current')).toContainText('Stage 4 of 6');
 await expect(tool).not.toContainText('Play an overseas buyer');
 await tool.getByRole('button',{name:'Previous stage'}).click();
 await expect(tool.locator('.energy-live-current')).toContainText('Stage 3 of 6');
 const firstCheck=tool.locator('.energy-live-check input').first();
 await firstCheck.check();
 await expect(firstCheck).toBeChecked();
 await tool.getByRole('button',{name:'Start or resume timer'}).click();
 await expect(tool.locator('.energy-live-timer')).toContainText('Running locally');
 await tool.getByRole('button',{name:'Pause timer'}).click();
 await expect(tool.locator('.energy-live-timer')).toContainText('Paused');
 await tool.getByRole('button',{name:'Reset timer'}).click();
 await expect(tool.locator('.energy-live-clock')).toHaveText('60:00');
 await tool.getByRole('button',{name:'Restart stages'}).click();
 await expect(tool.locator('.energy-live-current')).toContainText('Stage 1 of 6');
 await expect(firstCheck).not.toBeChecked();
 await page.getByRole('button',{name:'Check class readiness'}).click();
 await expect(page.locator('.energy-readiness-status')).toContainText('Ready for Google Meet');
 const widths=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
 expect(widths[0]).toBeLessThanOrEqual(widths[1]+2);
 expect(writes).toEqual([]);expect(errors).toEqual([]);
});
test('HF57 teacher-only buyer role and pronunciation coaching never enter student view',async({page})=>{
 const {errors,writes}=await setup(page,'teacher');
 const card=page.locator('.energy-lesson').first();
 await card.locator(':scope > summary').click();
 const tool=card.locator('.energy-live-conductor');
 await tool.locator(':scope > summary').click();
 await tool.getByRole('button',{name:'Next stage'}).click();
 await expect(tool).toContainText('Teacher-only pronunciation direction');
 await tool.getByRole('button',{name:'Next stage'}).click();
 await tool.getByRole('button',{name:'Next stage'}).click();
 await expect(tool).toContainText('Teacher-only buyer/counsel prompts');
 expect(writes).toEqual([]);expect(errors).toEqual([]);
});
test('HF57 unsigned visitors have no private rehearsal, lesson prompts or meeting details',async({page})=>{
 await page.goto('/learn/private-energy-contracts/');
 await expect(page.locator('#energy-login-form')).toBeVisible();
 await expect(page.locator('.energy-live-conductor')).toHaveCount(0);
 await expect(page.locator('a[href^="https://meet.google.com/"]')).toHaveCount(0);
 const r=await page.request.get('/api/v2150/private-energy/sessions/'+sessionId+'/readiness');
 expect(r.status()).toBe(401);
});
