const {test,expect}=require('@playwright/test');
// No send, external learner data, payment or signup in test.
test('HF11 gives source-specific reasoning for all three checks and preserves progress',async({page})=>{
 const posted=[];page.on('request',r=>{if(r.method()==='POST')posted.push(r.url())});
 await page.goto('/learn/legal-english/');
 const card=page.locator('#v1860-legal-catalog .v1860-course-card').first();
 await card.locator('.v1870-toggle input').check();
 await card.locator('.v1870-question').first().locator('input[type=radio]').first().check();
 await expect(card.locator('.v1870-question').first().locator('.v1870-check-feedback')).toContainText('Scenario reasoning');
 await card.locator('.v1870-question').nth(1).locator('input[type=radio]').first().check();
 await expect(card.locator('.v1870-question').nth(1).locator('.v1870-check-feedback')).toContainText('Vocabulary reasoning');
 await card.locator('.v1870-question').nth(2).locator('input[type=radio]').first().check();
 await expect(card.locator('.v1870-question').nth(2).locator('.v1870-check-feedback')).toContainText('Terminology reasoning');
 await expect(card.locator('.v1880-progress')).toContainText('3 of 3');
 expect(posted).toHaveLength(0);
});
test('HF11 Business and Investor show differentiated second distractors and tailored feedback',async({page})=>{
 await page.goto('/learn/business-english/');
 const cards=page.locator('#v1850-business-cards .v1850-course-card, #v1850-investor-cards .v1850-course-card');
 await expect(cards).toHaveCount(24);
 await expect(page.locator('.v1870-workbook')).toHaveCount(24);
 const texts=await cards.locator('.v1870-workbook .v1870-question:first-child').allTextContents();
 expect(texts).not.toContain('The outcome is guaranteed and does not need independent verification.');
 const business=page.locator('#v1850-business-cards .v1850-course-card').first();
 await business.locator('.v1870-toggle input').check();
 const answer=business.locator('.v1870-question').first().locator('.v1870-answer').filter({hasText:'The buyer can treat the discount'});
 await answer.locator('input').check();
 await expect(business.locator('.v1870-question').first().locator('.v1870-check-feedback')).toContainText('Scenario reasoning');
 const investor=page.locator('#v1850-investor-cards .v1850-course-card').first();
 await investor.locator('.v1870-toggle input').check();
 await investor.locator('.v1870-question').first().locator('.v1870-answer').filter({hasText:"Today's eight-percent increase"}).locator('input').check();
 await expect(investor.locator('.v1870-question').first().locator('.v1870-check-feedback')).toContainText('Scenario reasoning');
});
test('HF11 keeps all 48 teaching paths and in-tab privacy at mobile width',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/learn/legal-english/');
 await expect(page.locator('.v1910-path')).toHaveCount(24);
 await expect(page.locator('.v1900-evidence-lab')).toHaveCount(24);
 await page.goto('/learn/business-english/');
 await expect(page.locator('.v1910-path')).toHaveCount(24);
 await expect(page.locator('.v1890-stage')).toHaveCount(96);
 await expect(page.locator('.v1900-evidence-lab')).toHaveCount(24);
});