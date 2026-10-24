const {test,expect}=require('@playwright/test');
async function open(page){await page.goto('/#v1820-learning-studio');await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#v1820-learning-studio')).toBeVisible();}
test('v1.82 studio adds a real navigable guided learner/teacher curriculum for 28 topics',async({page})=>{
 await open(page);const s=page.locator('#v1820-learning-studio');
 await expect(page.locator('#mainNav a[href="/learn/study-planner/"]')).toHaveCount(1);
 await expect(page.locator('.v1770-footer-group a[href="/learn/study-planner/"]')).toHaveCount(1);
 await expect(s.locator('#v1820-course option')).toHaveCount(28);
 await expect(s.locator('.v1820-session')).toHaveCount(4);
 await expect(s.locator('.v1820-session .v1820-task')).toHaveCount(8);
 await expect(s.locator('.v1820-session .v1820-vocab')).toHaveCount(4);
 await expect(s.locator('.v1820-homework li')).toHaveCount(4);
 await expect(s.locator('.v1820-teacher')).toContainText('Fictional classroom case');
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.85.0');
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.84.0');
});
test('v1.82 filters all tracks and uses every preserved topic-specific lesson',async({page})=>{
 await open(page);const s=page.locator('#v1820-learning-studio');
 for(const [name,count] of [['Core professional',8],['Legal specialties',12],['International & academic',4],['Professional & Business English',4]]){
 await s.locator('#v1820-track').selectOption(name);await expect(s.locator('#v1820-course option')).toHaveCount(count);
 const option=await s.locator('#v1820-course option').first().textContent();
 await expect(s.locator('.v1820-progress')).toContainText(option.split(' · ')[0]);
 await expect(s.locator('.v1820-session')).toHaveCount(4);
 }
 await s.locator('#v1820-track').selectOption('all');
 await expect(s.locator('#v1820-course option')).toHaveCount(28);
});
test('v1.82 learner checkboxes and notes are independent, clearable and intentionally ephemeral',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await open(page);const s=page.locator('#v1820-learning-studio');
 await s.locator('.v1820-session input[type="checkbox"]').nth(0).check();
 await expect(s.locator('.v1820-progress')).toContainText('1 of 4');
 await s.locator('#v1820-goal').fill('Clarify conditional promises');
 await s.locator('#v1820-note').fill('Only fictional examples.');
 await s.locator('#v1820-course').selectOption('class-02');
 await expect(s.locator('.v1820-progress')).toContainText('0 of 4');
 await expect(s.locator('#v1820-note')).toHaveValue('');
 await s.locator('#v1820-course').selectOption('class-01');
 await expect(s.locator('.v1820-session input[type="checkbox"]').first()).toBeChecked();
 await expect(s.locator('#v1820-goal')).toHaveValue('Clarify conditional promises');
 await expect(s.locator('.v1820-characters')).toContainText('characters remaining');
 await s.getByRole('button',{name:'Clear this topic’s plan'}).click();
 await expect(s.locator('.v1820-progress')).toContainText('0 of 4');
 await expect(s.locator('#v1820-goal')).toHaveValue('');
 await page.reload();await page.locator('body.v1590-ready').waitFor();
 await expect(s.locator('.v1820-progress')).toContainText('0 of 4');
 expect(writes).toEqual([]);
});
test('v1.82 local study/teacher pack and four tentative calendar reminders download without network',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await open(page);const s=page.locator('#v1820-learning-studio');
 await s.locator('#v1820-track').selectOption('Legal specialties');
 await s.locator('#v1820-frequency').selectOption('2');
 await s.locator('#v1820-start-date').fill('2026-11-02');
 await expect(s.locator('.v1820-date').first()).toContainText('Nov');
 const plan=page.waitForEvent('download');await s.getByRole('button',{name:'Download study & teacher packet'}).click();
 expect((await plan).suggestedFilename()).toMatch(/EnglishLegalese-class-\d\d-four-session-plan\.txt/);
 await expect(s.locator('.v1820-status')).toContainText('No data was sent');
 const calendar=page.waitForEvent('download');await s.getByRole('button',{name:'Download unconfirmed personal study reminders'}).click();
 expect((await calendar).suggestedFilename()).toContain('personal-study-holds.ics');
 await expect(s.locator('.v1820-status')).toContainText('UNCONFIRMED');
 expect(writes).toEqual([]);
});
test('v1.82 preserves previous public pricing, all 14 free resources and 28 classes',async({page})=>{
 await open(page);
 await expect(page.locator('#pricing')).toContainText('$26');
 await expect(page.locator('#pricing')).toContainText('Class schedules and enrollment requests are open');
 await expect(page.locator('#v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
 await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
 const dims=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(dims.page).toBeLessThanOrEqual(dims.viewport+5);
});
