const {test,expect}=require('@playwright/test');
// Public page inspections, with no intake, mail, payments or external requests.
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('HF9 Legal: 24 distinct evidence labs are usable on '+host,async({page})=>{
  const res=await page.goto(host+'/learn/legal-english/');expect(res.status()).toBeLessThan(400);
  const labs=page.locator('#v1860-legal-catalog .v1900-evidence-lab');
  await expect(labs).toHaveCount(24);
  const ids=await labs.evaluateAll(els=>els.map(e=>e.dataset.courseId));
  expect(new Set(ids).size).toBe(24);
  const first=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await first.locator('.v1870-toggle input').check();
  await first.locator('.v1900-evidence-lab input[value="correct"]').check();
  await expect(first.locator('.v1900-feedback')).toContainText('Responsible starting point');
 });
 test('HF9 Business/Investor: 16+8 distinct case labs preserve HF8 on '+host,async({page})=>{
  const res=await page.goto(host+'/learn/business-english/');expect(res.status()).toBeLessThan(400);
  await expect(page.locator('#v1850-business-cards .v1900-evidence-lab')).toHaveCount(16);
  await expect(page.locator('#v1850-investor-cards .v1900-evidence-lab')).toHaveCount(8);
  await expect(page.locator('.v1890-stage')).toHaveCount(96);
  const first=page.locator('#v1850-investor-cards .v1850-course-card').first();
  await first.locator('.v1870-toggle input').check();
  await expect(first.locator('.v1900-contrast')).toContainText('Follow-up question');
 });
 test('HF9 privacy: wrong answer feedback and writing never POST on '+host,async({page})=>{
  const posts=[];page.on('request',r=>{if(r.method()==='POST')posts.push(r.url())});
  await page.goto(host+'/learn/legal-english/');
  const first=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await first.locator('.v1870-toggle input').check();
  await first.locator('.v1900-evidence-lab input[value="wrong"]').check();
  await expect(first.locator('.v1900-feedback')).toContainText('Better evidence step');
  await first.locator('.v1900-evidence-lab textarea').fill('Fictional case: the original record should be checked.');
  await expect(first.locator('.v1900-evidence-lab textarea')).toHaveValue(/original record/);
  expect(posts).toHaveLength(0);
 });
}
