const {test,expect}=require('@playwright/test');
async function open(page,id){await page.goto('/#'+id);await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#'+id)).toBeVisible();}
test('v1.76 homepage explains the real combined teaching method without altering branding',async({page})=>{
 await page.goto('/');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#home h1')).toContainText('live online classes with human teachers');
 await expect(page.locator('#home .v1760-method-note')).toContainText('human teachers lead live video-class discussions');
 await expect(page.locator('#home .trust-row')).toContainText('Human teacher guidance available');
 await expect(page.locator('.site-header .brand img')).toBeVisible();
 await expect(page.locator('.site-footer a[href="#conversation-rehearsal-lab"]')).toHaveCount(1);
 await expect(page.locator('.site-footer a[href="#reading-precision-lab"]')).toHaveCount(1);
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.79.0');
});
test('v1.76 practice route preserves direct navigation, three fictional conversations and private feedback',async({page})=>{
 await open(page,'conversation-rehearsal-lab');const s=page.locator('#conversation-rehearsal-lab');
 for(const kind of ['clarify','deadline','permission']){
  await s.locator('#v1760-conversation').selectOption(kind);
  await expect(s.locator('.v1760-example')).toBeHidden();
  await s.locator('#v1760-notes').fill('Fictional draft clarification');
  await expect(s.locator('.v1760-count')).toContainText('29 of 700');
  await s.getByRole('button',{name:'Show teaching example'}).click();
  await expect(s.locator('.v1760-example')).toBeVisible();
  await expect(s.locator('.v1760-check-label')).toHaveCount(3);
  await s.locator('.v1760-check-label input').first().check();
  await expect(s.locator('.v1760-progress')).toContainText('1 of 3');
  await s.getByRole('button',{name:'Clear my practice'}).click();
  await expect(s.locator('#v1760-notes')).toHaveValue('');
  await expect(s.locator('.v1760-example')).toBeHidden();
 }
});
test('v1.76 typing changes invalidate conversation checklist and do not silently evaluate user text',async({page})=>{
 await open(page,'conversation-rehearsal-lab');const s=page.locator('#conversation-rehearsal-lab');
 await s.getByRole('button',{name:'Show teaching example'}).click();
 await s.locator('.v1760-check-label input').first().check();
 await expect(s.locator('.v1760-progress')).toContainText('1 of 3');
 await s.locator('#v1760-notes').fill('Practice with fictional facts.');
 await expect(s.locator('.v1760-progress')).toContainText('0 of 3');
 await expect(s.locator('.v1760-check-label input:checked')).toHaveCount(0);
});
test('v1.76 reading three cases and nine explanations reflect only fictional source evidence',async({page})=>{
 await open(page,'reading-precision-lab');const s=page.locator('#reading-precision-lab');
 for(const [kind,choices] of [['notice',[1,2,0]],['approval',[1,2,0]],['evidence',[1,2,0]]]){
  await s.locator('#v1760-reading').selectOption(kind);
  await expect(s.locator('.v1760-question')).toHaveCount(3);
  await s.getByRole('button',{name:'Check my reading'}).click();
  await expect(s.locator('.v1760-feedback')).toContainText('Please answer all three');
  for(let i=0;i<3;i++)await s.locator('input[name="v1760-answer-'+i+'"][value="'+choices[i]+'"]').check();
  await s.getByRole('button',{name:'Check my reading'}).click();
  await expect(s.locator('.v1760-feedback')).toContainText('3 of 3');
  await expect(s.locator('.v1760-reasons li')).toHaveCount(3);
  await s.locator('input[name="v1760-answer-0"][value="0"]').check();
  await expect(s.locator('.v1760-reasons')).toBeHidden();
  await s.getByRole('button',{name:'Start this document again'}).click();
  await expect(s.locator('input[name="v1760-answer-0"]:checked')).toHaveCount(0);
 }
});
test('v1.76 no typed response or reading choice persisted or posted across refresh',async({page})=>{
 const writes=[];page.on('request',req=>{if(['POST','PATCH','PUT'].includes(req.method()))writes.push(req.url());});
 await open(page,'conversation-rehearsal-lab');await page.locator('#v1760-notes').fill('Private fictional rehearsal');
 await page.reload();await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#v1760-notes')).toHaveValue('');
 await page.goto('/#reading-precision-lab');await page.locator('input[name="v1760-answer-0"][value="1"]').check();
 await page.reload();await page.locator('body.v1590-ready').waitFor();await expect(page.locator('input[name="v1760-answer-0"]:checked')).toHaveCount(0);
 expect(writes).toEqual([]);
});
test('v1.76 exercise links lead to retained original listening and writing labs',async({page})=>{
 await open(page,'conversation-rehearsal-lab');const s=page.locator('#conversation-rehearsal-lab');
 await s.getByRole('link',{name:'Listening practice'}).click();await expect(page.locator('#listening-clarification-lab')).toBeVisible();
 await page.goto('/#reading-precision-lab');await page.getByRole('link',{name:'Rehearse a response'}).click();
 await expect(page.locator('#conversation-rehearsal-lab')).toBeVisible();
});
