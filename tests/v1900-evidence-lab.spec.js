const {test,expect}=require('@playwright/test');
// No real submissions or outbound messages: all answers are fictional and in browser memory.
test('HF9 extends all 48 existing course workbooks, retaining lessons and quizzes',async({page})=>{
 await page.goto('/learn/legal-english/');
 await expect(page.locator('#v1860-legal-catalog .v1900-evidence-lab')).toHaveCount(24);
 await expect(page.locator('#v1860-legal-catalog .v1890-stage')).toHaveCount(96);
 await page.goto('/learn/business-english/');
 await expect(page.locator('#v1850-business-cards .v1900-evidence-lab')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1900-evidence-lab')).toHaveCount(8);
 await expect(page.locator('.v1870-question')).toHaveCount(72);
});
test('HF9 explains both safe evidence and a wrong shortcut without posting learner work',async({page})=>{
 const posts=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url())});
 await page.goto('/learn/legal-english/');
 const card=page.locator('#v1860-legal-catalog .v1860-course-card').first();
 await card.locator('.v1870-toggle input').check();
 const lab=card.locator('.v1900-evidence-lab');
 await lab.locator('input[value="wrong"]').check();
 await expect(lab.locator('.v1900-feedback')).toContainText('Better evidence step');
 await lab.locator('input[value="correct"]').check();
 await expect(lab.locator('.v1900-feedback')).toContainText('Responsible starting point');
 await expect(lab.locator('.v1900-contrast')).toContainText('Careful professional-language example');
 await lab.locator('textarea').fill('The fictional notice has not been confirmed. We should check its wording and receipt date.');
 await expect(lab.locator('textarea')).toHaveValue(/fictional notice/);
 expect(posts).toEqual([]);
 await page.reload();
 await card.locator('.v1870-toggle input').check();
 await expect(card.locator('.v1900-evidence-lab textarea')).toHaveValue('');
});
test('HF9 course-specific evidence differs between Business and Investor on mobile',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/learn/business-english/');
 const b=page.locator('#v1850-business-cards .v1850-course-card').first(),i=page.locator('#v1850-investor-cards .v1850-course-card').first();
 await b.locator('.v1870-toggle input').check();await i.locator('.v1870-toggle input').check();
 const t1=await b.locator('.v1900-option').first().textContent(),t2=await i.locator('.v1900-option').first().textContent();
 expect(t1).not.toEqual(t2);
 await expect(i.locator('.v1900-contrast')).toContainText('Follow-up question');
 await expect(i.locator('.v1900-evidence-lab textarea')).toHaveCount(1);
});
