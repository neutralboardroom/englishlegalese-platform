const {test,expect}=require('@playwright/test');
async function open(page,id){await page.goto('/#'+id);await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#'+id)).toBeVisible();}
test('v1.78 homepage explicitly presents live human video teaching while preserving the approved original guidance',async({page})=>{
 await open(page,'home');
 await expect(page.locator('#home h1')).toContainText('live online classes with human teachers');
 await expect(page.locator('#home .trust-row')).toContainText('Human teacher guidance available');
 await expect(page.locator('#home .trust-row')).toContainText('Live online video classrooms');
 await expect(page.locator('#home a[href="#live-classes"]')).toBeVisible();
 await expect(page.locator('.site-header .brand img')).toBeVisible();
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.81.0');
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.81.0');
});
test('v1.78 homepage preserves comprehensive paths, new classroom and courses while no paid service is activated',async({page})=>{
 await open(page,'home');
 for(const id of ['home','start','learning-pathways','courses','smartteacher','teachers','live-classes','trust'])await expect(page.locator('#'+id)).toBeVisible();
 await expect(page.locator('#learning-pathways .v1780-goal-card')).toHaveCount(6);
 await expect(page.locator('#live-classes .v1780-benefit')).toHaveCount(3);
 await expect(page.locator('#live-classes .v1780-provider-pill')).toHaveCount(5);
 await expect(page.locator('#smartteacher .v1770-files')).toBeVisible();
});
test('v1.78 goal navigator opens real existing lessons and existing listening practice',async({page})=>{
 await open(page,'learning-pathways');const sec=page.locator('#learning-pathways');
 await sec.locator('.v1780-goal-card').first().getByRole('button',{name:'Open course lesson'}).click();
 await expect(page.locator('#courses')).toBeVisible();
 await expect(page.locator('#v1770-course-lesson')).toBeVisible();
 await page.goto('/#learning-pathways');
 await sec.locator('a[href="#conversation-rehearsal-lab"]').click();
 await expect(page.locator('#conversation-rehearsal-lab')).toBeVisible();
});
test('v1.78 six second course units add eighteen explained questions without pretending to be certification',async({page})=>{
 await open(page,'courses');const sec=page.locator('#courses');
 await expect(sec.locator('.v1780-next-action')).toHaveCount(6);
 await sec.getByRole('button',{name:/View all 9 courses/}).click();
 for(const i of [2,3,4,5,6,7]){
  await sec.locator('.v1580-course-card').nth(i).getByRole('button',{name:'Continue: sample lesson 2'}).click();
  const unit=sec.locator('#v1780-second-unit');
  await expect(unit).toBeVisible();await expect(unit.locator('fieldset')).toHaveCount(3);
  await unit.getByRole('button',{name:'Check my answers'}).click();
  await expect(unit.locator('.v1780-unit-status')).toContainText('Please choose');
  for(let j=0;j<3;j++)await unit.locator('input[name="v1780-q-'+j+'"]').first().check();
  await unit.getByRole('button',{name:'Check my answers'}).click();
  await expect(unit.locator('.v1780-unit-status')).toContainText('of 3');
  await expect(unit.locator('.v1780-unit-status li')).toHaveCount(3);
  await unit.getByRole('button',{name:'Close lesson'}).click();
  await expect(unit).toBeHidden();
 }
});
test('v1.78 classroom planner handles invalid times, provider selection and calendar download without transmitting data',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await open(page,'live-classes');const sec=page.locator('#live-classes');
 await expect(sec.locator('.v1780-room-stage')).toContainText('Teacher-led learning');
 await expect(sec.locator('.v1780-class-result')).toBeHidden();
 await expect(sec.getByRole('button',{name:'Add an unconfirmed calendar hold'})).toBeDisabled();
 await sec.locator('#v1780-when').fill('2020-01-01T09:00');
 await sec.getByRole('button',{name:'Preview class plan'}).click();
 await expect(sec.locator('.v1780-class-status')).toContainText('Choose a future');
 await sec.locator('#v1780-provider').selectOption('teams');
 await sec.locator('#v1780-focus').selectOption('2');
 await sec.locator('#v1780-length').selectOption('45');
 await sec.locator('#v1780-when').fill('2035-04-17T14:30');
 await sec.getByRole('button',{name:'Preview class plan'}).click();
 await expect(sec.locator('.v1780-class-result')).toBeVisible();
 await expect(sec.locator('.v1780-class-result')).toContainText('Microsoft Teams');
 await expect(sec.locator('.v1780-class-result')).toContainText('Not booked');
 const downloaded=page.waitForEvent('download');
 await sec.getByRole('button',{name:'Add an unconfirmed calendar hold'}).click();
 const d=await downloaded;expect(d.suggestedFilename()).toContain('unconfirmed');
 await expect(sec.locator('.v1780-class-status')).toContainText('not a class booking');
 expect(writes).toEqual([]);
});
test('v1.78 classroom planning changes invalidate stale previews and support region alternatives',async({page})=>{
 await open(page,'live-classes');const sec=page.locator('#live-classes');
 await sec.locator('#v1780-when').fill('2035-04-17T14:30');
 await sec.getByRole('button',{name:'Preview class plan'}).click();
 await expect(sec.locator('.v1780-class-result')).toBeVisible();
 await sec.locator('#v1780-provider').selectOption('voov');
 await expect(sec.locator('.v1780-class-result')).toBeHidden();
 await expect(sec.getByRole('button',{name:'Add an unconfirmed calendar hold'})).toBeDisabled();
 await sec.getByRole('button',{name:'Preview class plan'}).click();
 await expect(sec.locator('.v1780-class-result')).toContainText('Tencent / VooV');
 await page.reload();await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#live-classes .v1780-class-result')).toBeHidden();
});
test('v1.78 teachers explain video classroom access without inventing immediate appointment availability',async({page})=>{
 await open(page,'teachers');
 await expect(page.locator('#v1780-teacher-handoff')).toContainText('human-led Legal English classes');
 await page.locator('#v1780-teacher-handoff a[href="#live-classes"]').click();
 await expect(page.locator('#live-classes')).toBeVisible();
 await expect(page.locator('#live-classes')).toContainText('Actual classes are confirmed only after teacher assignment');
 await open(page,'employers');
 await expect(page.locator('#v1780-teacher-handoff')).toBeHidden();
});
