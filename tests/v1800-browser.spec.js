const {test,expect}=require('@playwright/test');
async function open(page){await page.goto('/#courses');await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#courses')).toBeVisible();}
test('v1.80 study plan is present alongside all existing sample learning tools',async({page})=>{
 await open(page);
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.80.0');
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.80.0');
 await expect(page.locator('#v1800-study-planner > summary')).toBeVisible();
 await expect(page.locator('#courses .v1790-third-action')).toHaveCount(6);
 await expect(page.locator('#courses .v1780-next-action')).toHaveCount(6);
});
test('v1.80 tracks independent self-reported progress across all six courses',async({page})=>{
 await open(page);const p=page.locator('#v1800-study-planner');await p.locator('summary').click();
 await expect(p.locator('#v1800-course-select option')).toHaveCount(6);
 await expect(p.locator('.v1800-check')).toHaveCount(3);
 await p.locator('.v1800-check input').nth(0).check();
 await expect(p.locator('.v1800-progress')).toContainText('1 of 3');
 await p.locator('#v1800-course-select').selectOption('1');
 await expect(p.locator('.v1800-progress')).toContainText('0 of 3');
 await p.locator('.v1800-check input').nth(1).check();
 await p.locator('#v1800-course-select').selectOption('0');
 await expect(p.locator('.v1800-check input').nth(0)).toBeChecked();
 await expect(p.locator('.v1800-check input').nth(1)).not.toBeChecked();
});
test('v1.80 study goals, countdown and reset are functional and optional',async({page})=>{
 await open(page);const p=page.locator('#v1800-study-planner');await p.locator('summary').click();
 await p.locator('.v1800-label input[type="text"]').fill('Practise source accuracy');
 await p.locator('textarea').fill('Five notes');
 await expect(p.locator('.v1800-small').filter({hasText:'characters remaining'})).toContainText('490 characters remaining');
 await p.locator('.v1800-check input').nth(2).check();
 await expect(p.locator('.v1800-next')).toContainText('lesson 1');
 await p.getByRole('button',{name:'Clear this course'}).click();
 await expect(p.locator('.v1800-progress')).toContainText('0 of 3');
 await expect(p.locator('textarea')).toHaveValue('');
 await expect(p.locator('.v1800-label input[type="text"]')).toHaveValue('');
});
test('v1.80 study plan download is local only and all six plans can be erased',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await open(page);const p=page.locator('#v1800-study-planner');await p.locator('summary').click();
 await p.locator('.v1800-check input').nth(0).check();
 await p.locator('#v1800-course-select').selectOption('2');
 await p.locator('.v1800-check input').nth(2).check();
 const dl=page.waitForEvent('download');await p.getByRole('button',{name:'Download my private study plan'}).click();
 const file=await dl;expect(file.suggestedFilename()).toContain('private-study-plan');
 await expect(p).toContainText('No information was transmitted');
 await p.getByRole('button',{name:'Clear all six plans'}).click();
 await p.locator('#v1800-course-select').selectOption('0');
 await expect(p.locator('.v1800-progress')).toContainText('0 of 3');
 expect(writes).toEqual([]);
});
test('v1.80 planner does not persist learner choices across reload',async({page})=>{
 await open(page);const p=page.locator('#v1800-study-planner');await p.locator('summary').click();
 await p.locator('.v1800-check input').first().check();await p.locator('textarea').fill('Private notes');
 await page.reload();await page.locator('body.v1590-ready').waitFor();
 await p.locator('summary').click();
 await expect(p.locator('.v1800-progress')).toContainText('0 of 3');
 await expect(p.locator('textarea')).toHaveValue('');
});
