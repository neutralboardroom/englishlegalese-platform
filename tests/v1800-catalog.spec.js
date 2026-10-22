const {test,expect}=require('@playwright/test');
async function open(page){await page.goto('/#live-classes');await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#v1800-class-catalog')).toBeVisible();}
test('v1.80 catalog lists all 28 class topics and keeps the old live classroom and resources',async({page})=>{
 await open(page);const c=page.locator('#v1800-class-catalog');
 await expect(c.locator('.v1800-class-count')).toContainText('28 class topics');
 await expect(c.locator('.v1800-class-card')).toHaveCount(6);
 await expect(page.locator('#v1780-provider')).toBeVisible();
 await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
 await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
 await c.getByRole('button',{name:'Show all class topics'}).click();
 await expect(c.locator('.v1800-class-card')).toHaveCount(28);
 await expect(c).toContainText('TOLES Preparation');
 await expect(c).toContainText('Business Emails & Meetings');
});
test('v1.80 search and category filter return genuine class choices',async({page})=>{
 await open(page);const c=page.locator('#v1800-class-catalog'),group=c.locator('#v1800-class-track'),query=c.locator('#v1800-class-search');
 await group.selectOption('Legal specialties');
 await expect(c.locator('.v1800-class-card')).toHaveCount(12);
 await group.selectOption('International & academic');
 await expect(c.locator('.v1800-class-card')).toHaveCount(4);
 await group.selectOption('Professional & Business English');
 await expect(c.locator('.v1800-class-card')).toHaveCount(4);
 await group.selectOption('all');await query.fill('cybersecurity');
 await expect(c.locator('.v1800-class-card')).toHaveCount(1);
 await expect(c.locator('.v1800-class-card')).toContainText('Privacy, Technology');
 await query.fill('nothingmatchingthis');
 await expect(c.locator('.v1800-class-card')).toHaveCount(0);
 await expect(c).toContainText('No class topic matches');
});
test('v1.80 each curriculum track includes lesson outlines, vocabulary, exercises, homework and teacher brief',async({page})=>{
 await open(page);const c=page.locator('#v1800-class-catalog'),v=c.locator('#v1800-class-viewer'),group=c.locator('#v1800-class-track');
 for(const name of ['Core professional','Legal specialties','International & academic','Professional & Business English']){
  await group.selectOption(name);
  await c.locator('.v1800-class-card').first().getByRole('button',{name:'View lesson & teacher materials'}).click();
  await expect(v).toBeVisible();
  await expect(v.locator('.v1800-material-block').first().locator('ol > li')).toHaveCount(4);
  await expect(v.locator('.v1800-glossary dt')).toHaveCount(5);
  await expect(v.locator('.v1800-quiz-question')).toHaveCount(3);
  await expect(v).toContainText('At-home practice and self-check');
  await v.locator('.v1800-teacher summary').click();
  await expect(v.locator('.v1800-teacher')).toContainText('Suggested 50-minute teacher-led lesson');
  await expect(v.locator('.v1800-teacher ol > li')).toHaveCount(5);
  await v.getByRole('button',{name:'Close class materials'}).click();
  await expect(v).toBeHidden();
 }
});
test('v1.80 practice quiz validates incomplete answers, explains results, resets and keeps all data private',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await open(page);const v=page.locator('#v1800-class-viewer');
 await page.locator('#v1800-class-catalog .v1800-class-card').first().getByRole('button',{name:'View lesson & teacher materials'}).click();
 await v.getByRole('button',{name:'Check my answers'}).click();
 await expect(v.locator('.v1800-quiz-feedback')).toContainText('Choose an answer to each');
 for(let i=0;i<3;i++)await v.locator('.v1800-quiz-question').nth(i).locator('input').first().check();
 await v.getByRole('button',{name:'Check my answers'}).click();
 await expect(v.locator('.v1800-quiz-feedback')).toContainText('of 3 practice answers');
 await expect(v.locator('.v1800-quiz-feedback li')).toHaveCount(3);
 const ready=page.waitForEvent('download');
 await v.getByRole('button',{name:'Download curriculum and teacher brief'}).click();
 const file=await ready;expect(file.suggestedFilename()).toContain('curriculum.txt');
 await v.getByRole('button',{name:'Clear quiz answers'}).click();
 await expect(v.locator('.v1800-quiz-feedback')).toContainText('Answers cleared');
 await expect(v.locator('.v1800-quiz-question input:checked')).toHaveCount(0);
 expect(writes).toEqual([]);
});
test('v1.80 preview is responsive and claims no live booking or certification',async({page})=>{
 await open(page);const c=page.locator('#v1800-class-catalog');
 await expect(c).toContainText('not bookable teacher sessions');
 await c.locator('.v1800-class-card').first().getByRole('button',{name:'View lesson & teacher materials'}).click();
 await expect(c.locator('#v1800-class-viewer')).toContainText('NOT BOOKABLE');
 const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
 expect(sizes.scroll).toBeLessThanOrEqual(sizes.width+4);
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.81.0');
});
