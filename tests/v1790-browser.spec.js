const {test,expect}=require('@playwright/test');
async function visit(page,hash){await page.goto('/#'+hash);await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#'+hash)).toBeVisible();}
test('v1.79 is the current material release while prior tools and branding are preserved',async({page})=>{
 await visit(page,'home');
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.79.0');
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.79.0');
 await expect(page.locator('.site-header .brand img')).toBeVisible();
 await expect(page.locator('#home h1')).toContainText('live online classes with human teachers');
 await expect(page.locator('#live-classes #v1790-class-prep summary')).toBeVisible();
 await expect(page.locator('#courses .v1790-third-action')).toHaveCount(6);
});
test('v1.79 adds six genuine third lesson exercises with eighteen explanations',async({page})=>{
 await visit(page,'courses');const course=page.locator('#courses');
 const expand=course.getByRole('button',{name:/View all 9 courses/});
 if(await expand.count())await expand.click();
 const cards=course.locator('.v1580-course-card');
 for(const i of [2,3,4,5,6,7]){
  await cards.nth(i).getByRole('button',{name:'Continue: practical lesson 3'}).click();
  const u=course.locator('#v1790-third-unit');
  await expect(u).toBeVisible();await expect(u.locator('fieldset')).toHaveCount(3);
  await u.getByRole('button',{name:'Check lesson 3 answers'}).click();
  await expect(u.locator('.v1790-feedback')).toContainText('Choose answers to all three');
  for(let j=0;j<3;j++)await u.locator('input[name="v1790-q-'+j+'"]').first().check();
  await u.getByRole('button',{name:'Check lesson 3 answers'}).click();
  await expect(u.locator('.v1790-feedback')).toContainText('of 3 answers');
  await expect(u.locator('.v1790-feedback li')).toHaveCount(3);
  await u.getByRole('button',{name:'Close lesson 3'}).click();
  await expect(u).toBeHidden();
 }
});
test('v1.79 classroom preparation is interactive, optional and never a fabricated booking',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await visit(page,'live-classes');const pane=page.locator('#v1790-class-prep');
 await expect(pane).not.toHaveAttribute('open');
 await pane.locator('summary').click();
 await expect(pane).toHaveAttribute('open','');
 await expect(pane.locator('.v1790-times tbody tr')).toHaveCount(8);
 await pane.locator('.v1790-checks input').nth(0).check();
 await pane.locator('.v1790-checks input').nth(1).check();
 await expect(pane.locator('.v1790-progress')).toContainText('2 of 4');
 await pane.locator('textarea').fill('How do I politely clarify a deadline?');
 await expect(pane.locator('.v1790-small').filter({hasText:'characters remaining'})).toContainText('563 characters remaining');
 const done=page.waitForEvent('download');
 await pane.getByRole('button',{name:'Download class preparation brief'}).click();
 const downloaded=await done;
 expect(downloaded.suggestedFilename()).toContain('private-class-preparation');
 await expect(pane.locator('.v1790-status')).toContainText('No booking or message was sent');
 expect(writes).toEqual([]);
});
test('v1.79 timezone comparison follows user date changes and class prep reset works',async({page})=>{
 await visit(page,'live-classes');const section=page.locator('#live-classes'),pane=section.locator('#v1790-class-prep');
 await pane.locator('summary').click();
 await section.locator('#v1780-when').fill('2035-07-01T14:30');
 await expect(pane.locator('.v1790-times tbody tr')).toHaveCount(8);
 const london=await pane.locator('.v1790-times tbody tr').nth(2).textContent();
 const bangkok=await pane.locator('.v1790-times tbody tr').nth(4).textContent();
 expect(london).not.toBe(bangkok);
 await pane.locator('textarea').fill('Fictional language question');
 await pane.locator('.v1790-checks input').first().check();
 await pane.getByRole('button',{name:'Clear private notes'}).click();
 await expect(pane.locator('textarea')).toHaveValue('');
 await expect(pane.locator('.v1790-progress')).toContainText('0 of 4');
});
test('v1.79 preserves previous course units, SmartTeacher 2500 countdown and Georgian',async({page})=>{
 await visit(page,'courses');
 await expect(page.locator('#courses .v1780-next-action')).toHaveCount(6);
 await expect(page.locator('#courses .v1770-course-action')).toHaveCount(9);
 await page.goto('/#smartteacher');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#v1770-main-counter')).toBeVisible();
 await page.goto('/#language-bridge');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#language-bridge .js-language-select')).toContainText('Georgian');
});
