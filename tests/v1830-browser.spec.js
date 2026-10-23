const {test,expect}=require('@playwright/test');
async function open(page){await page.goto('/#v1830-writing-lab');await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#v1830-writing-lab')).toBeVisible();}
test('v1.83 writing lab presents 28 topic-specific fictional professional cases',async({page})=>{
 await open(page);const p=page.locator('#v1830-writing-lab');
 await expect(p.locator('#v1830-topic option')).toHaveCount(28);
 await expect(p).toContainText('This is not automated legal review');
 await expect(p.locator('.v1830-case')).toContainText('fictional case');
 await expect(p.locator('.v1830-brief')).toContainText('Topic-specific vocabulary');
 await expect(p.locator('.v1830-check')).toHaveCount(4);
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.85.1');
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.84.0');
});
test('v1.83 track filtering works for core, specialty, international and business',async({page})=>{
 await open(page);const p=page.locator('#v1830-writing-lab');
 for(const [v,n] of [['Core professional',8],['Legal specialties',12],['International & academic',4],['Professional & Business English',4]]){
 await p.locator('#v1830-track').selectOption(v);await expect(p.locator('#v1830-topic option')).toHaveCount(n);
 await expect(p.locator('.v1830-case')).toContainText('fictional case');}
 await p.locator('#v1830-track').selectOption('all');
 await expect(p.locator('#v1830-topic option')).toHaveCount(28);
});
test('v1.83 local caution cues avoid pretending to grade student work',async({page})=>{
 await open(page);const p=page.locator('#v1830-writing-lab');
 await p.getByRole('button',{name:'Review wording cues'}).click();
 await expect(p.locator('.v1830-feedback')).toContainText('Write a first draft');
 await p.locator('#v1830-first').fill('We definitely guarantee the claim will be approved. Please confirm the actual notice.');
 await expect(p.locator('.v1830-counter').first()).toContainText('characters remaining');
 await p.getByRole('button',{name:'Review wording cues'}).click();
 await expect(p.locator('.v1830-feedback')).toContainText('guarantee');
 await expect(p.locator('.v1830-feedback')).toContainText('definitely');
 await expect(p.locator('.v1830-feedback')).toContainText('cannot detect');
 await p.getByRole('button',{name:'Show source-faithful example'}).click();
 await expect(p.locator('.v1830-examples')).toHaveAttribute('open','');
});
test('v1.83 self-review and drafts remain independent by topic and clear without network writes',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await open(page);const p=page.locator('#v1830-writing-lab');
 await p.locator('#v1830-first').fill('This is a first fictional draft.');
 await p.locator('#v1830-revision').fill('This is a careful updated draft.');
 await p.locator('.v1830-check input').first().check();
 await expect(p.locator('.v1830-score')).toContainText('1 of 4');
 await p.locator('#v1830-topic').selectOption('class-02');
 await expect(p.locator('#v1830-first')).toHaveValue('');
 await expect(p.locator('.v1830-score')).toContainText('0 of 4');
 await p.locator('#v1830-topic').selectOption('class-01');
 await expect(p.locator('#v1830-first')).toHaveValue('This is a first fictional draft.');
 await expect(p.locator('.v1830-check input').first()).toBeChecked();
 await p.getByRole('button',{name:'Clear this topic'}).click();
 await expect(p.locator('#v1830-first')).toHaveValue('');
 await p.getByRole('button',{name:'Clear all 28 topics'}).click();
 await page.reload();await page.locator('body.v1590-ready').waitFor();
 await expect(p.locator('#v1830-first')).toHaveValue('');
 expect(writes).toEqual([]);
});
test('v1.83 learner and teacher workbook downloads locally and older work remains',async({page})=>{
 await open(page);const p=page.locator('#v1830-writing-lab');
 await p.locator('#v1830-first').fill('Could you confirm the proposed date?');
 const dl=page.waitForEvent('download');await p.getByRole('button',{name:'Download writing & teacher workbook'}).click();
 const file=await dl;expect(file.suggestedFilename()).toContain('-writing-workbook.txt');
 await expect(p.locator('.v1830-status')).toContainText('downloaded locally');
 await p.locator('.v1830-teacher summary').click();await expect(p.locator('.v1830-teacher li')).toHaveCount(6);
 await expect(page.locator('#v1820-learning-studio')).toBeVisible();
 await expect(page.locator('#v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 await expect(page.locator('#pricing')).toContainText('$24');
 await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
 await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
 const dim=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
 expect(dim.scroll).toBeLessThanOrEqual(dim.width+5);
});
