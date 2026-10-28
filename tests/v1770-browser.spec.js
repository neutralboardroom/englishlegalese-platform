const {test,expect}=require('@playwright/test');
async function ready(page,hash){await page.goto('/#'+hash);await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#'+hash)).toBeVisible();}

test('v1.77 comprehensive homepage remains intact with condensed headline and teacher claim',async({page})=>{
 await ready(page,'home');await expect(page.locator('#home h1')).toContainText('live online classes with human teachers');
 await expect(page.locator('#home')).toContainText('Human teacher guidance available');
 await expect(page.locator('#start')).toBeVisible();await expect(page.locator('#courses')).toBeVisible();
 await expect(page.locator('.site-header .brand img')).toBeVisible();
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content',require('../package.json').version);
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.84.0');
});
test('v1.77 all 23 old footer destinations retained with compact resource directory',async({page})=>{
 await ready(page,'home');const footer=page.locator('.site-footer');
 const hrefs=['/learn/courses/','/learn/free-writing-exercise/','/learn/ai-draft-review/','/learn/clause-reading/','/learn/meeting-followup/','/learn/email-clarity/','/learn/guided-practice/','/learn/case-brief/','/learn/legal-vocabulary/','/learn/revision-studio/','/learn/professional-message/','/learn/listening-clarification/','/learn/conversation-rehearsal/','/learn/reading-precision/','/learn/smartteacher-free-trial/','/learn/scenario-practice/','/learn/learning-path/','/learn/smartteacher/','/learn/teachers/','/learn/language-support/','/learn/employers/','/learn/progress/','/learn/trust/'];
 for(const href of hrefs)await expect(footer.locator('a[href="'+href+'"]')).toHaveCount(1);
 await expect(footer.locator('#v1770-all-resources')).not.toHaveAttribute('open');
 await expect(footer.locator('a[href="/learn/reading-precision/"]')).toBeHidden();
 await footer.locator('#v1770-all-resources summary').click();
 await expect(footer.locator('a[href="/learn/reading-precision/"]')).toBeVisible();
 await footer.locator('#v1770-all-resources summary').click();
 await expect(footer.locator('a[href="/learn/reading-precision/"]')).toBeHidden();
 await expect(footer.locator('.footer-logo')).toBeVisible();
});
test('v1.77 six course sample lessons are actionable and explain answers',async({page})=>{
 await ready(page,'courses');let s=page.locator('#courses');await s.locator('#v1840-sample-lessons summary').click();await expect(s.locator('.v1770-course-action')).toHaveCount(9);
 for(const idx of [2,3,4,5,6,7]){
  if(idx===3)await s.getByRole('button',{name:/See all sample lessons/}).click();
  await s.locator('.v1580-course-card').nth(idx).getByRole('button',{name:'Start a sample lesson'}).click();
  const lesson=s.locator('#v1770-course-lesson');
  await expect(lesson).toBeVisible();await expect(lesson.locator('fieldset')).toHaveCount(3);
  for(let i=0;i<3;i++)await lesson.locator('input[name="v1770-q-'+i+'"]').first().check();
  await lesson.getByRole('button',{name:'Check my learning'}).click();
  await expect(lesson.locator('.v1770-lesson-status')).toContainText('of 3');
  await expect(lesson.locator('.v1770-lesson-status li')).toHaveCount(3);
  await lesson.getByRole('button',{name:'Close lesson'}).click();
  await expect(lesson).toBeHidden();
 }
});
test('v1.77 main AI prompt counter, local file selectors and no external transmission',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await ready(page,'smartteacher');const s=page.locator('#smartteacher'),input=s.locator('#el-practice-topic');
 await expect(input).toHaveAttribute('maxlength','2500');
 await input.fill('Fictional case question');
 await expect(s.locator('#v1770-main-counter')).toContainText('of 2,500');
 await expect(s.locator('#v1770-file-0')).toHaveAttribute('accept',/\.pdf/);
 await expect(s.locator('#v1770-file-1')).toHaveAttribute('accept',/\.png/);
 await s.locator('#v1770-file-1').setInputFiles({name:'practice.png',mimeType:'image/png',buffer:Buffer.from('fake local screenshot')});
 await expect(s.locator('.v1770-file-status')).toContainText('Local selection only');
 expect(writes).toEqual([]);
});
test('v1.77 Georgian alphabetic list is persistent and modes actually work',async({page})=>{
 await ready(page,'language-bridge');const s=page.locator('#language-bridge'),sel=s.locator('select.js-language-select');
 const opts=await sel.locator('option').allTextContents();expect(opts.length).toBe(35);
 expect(opts.indexOf('French')).toBeLessThan(opts.indexOf('Georgian (ქართული)'));
 expect(opts.indexOf('Georgian (ქართული)')).toBeLessThan(opts.indexOf('German'));
 await sel.selectOption({label:'Georgian (ქართული)'});
 await s.getByRole('button',{name:'Explain in my language'}).click();
 await expect(s.locator('.v1770-language-output')).toContainText('შეხვედრის');
 await s.getByRole('button',{name:'Show Simple English'}).click();
 await expect(s.locator('.v1770-language-output')).toContainText('Please check');
 await s.getByRole('button',{name:'Practice in Legal English'}).click();
 await s.locator('input[name="v1770-language-answer"][value="0"]').check();
 await s.getByRole('button',{name:'Check my answer'}).click();
 await expect(s.locator('.v1770-language-score')).toContainText('Correct');
 await page.reload();await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#language-bridge select.js-language-select')).toHaveValue('Georgian (ქართული)');
});
test('v1.77 role-focused pages are not two duplicate promotional cards',async({page})=>{
 await ready(page,'teachers');const s=page.locator('#teachers');await expect(s.locator('.v1770-role-cards article')).toHaveCount(3);await expect(s.locator('.grid>article').nth(1)).toBeHidden();await expect(s.locator('.v1770-role-details')).toContainText('Learn with a human teacher');
 await ready(page,'employers');const e=page.locator('#teachers');await expect(e.locator('.grid>article').first()).toBeHidden();await expect(e.locator('.v1770-role-details')).toContainText('Employer learning and team training');
});
test('v1.77 trust protections honest and prior education boundaries intact',async({page})=>{
 await ready(page,'trust');const s=page.locator('#trust');await expect(s).toContainText('Not a law firm');await expect(s).toContainText('browser-only exercises');await expect(s).toContainText('separate launch requirements');
});
