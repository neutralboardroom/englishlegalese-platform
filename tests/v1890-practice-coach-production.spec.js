const {test,expect}=require('@playwright/test');
for(const host of ['https://englishlegalese.com','https://www.englishlegalese.com']){
 test('HF8 all 24 Legal workbooks have local four-stage writing feedback on '+host,async({page})=>{
  const r=await page.goto(host+'/learn/legal-english/');expect(r.status()).toBeLessThan(400);
  await expect(page.locator('#v1860-legal-catalog .v1890-stage')).toHaveCount(96);
  await expect(page.locator('.v1890-writing-summary')).toHaveCount(24);
  const a=page.locator('#v1860-legal-catalog .v1860-course-card').first();
  await a.locator('.v1870-toggle input').check();
  const first=a.locator('.v1890-stage').first();
  await first.locator('textarea').fill('The fictional example has a missing assumption that must be checked before a conclusion.');
  await first.locator('button').click();
  await expect(first.locator('.v1890-stage-feedback')).toContainText('Structure cues found:');
  await expect(a.locator('.v1890-writing-summary')).toContainText('Writing drafts reviewed: 1 of 4');
  await expect(a.locator('.v1870-question')).toHaveCount(3);
 });
 test('HF8 all 24 Business/Investor workbooks have the subject-specific writing coach on '+host,async({page})=>{
  const r=await page.goto(host+'/learn/business-english/');expect(r.status()).toBeLessThan(400);
  await expect(page.locator('#v1850-business-cards .v1890-stage')).toHaveCount(64);
  await expect(page.locator('#v1850-investor-cards .v1890-stage')).toHaveCount(32);
  const a=page.locator('#v1850-investor-cards .v1850-course-card').first();
  await a.locator('.v1870-toggle input').check();
  await expect(a.locator('.v1890-writing-summary')).toContainText('0 of 4');
  await expect(a.locator('.v1890-word-counter').first()).toContainText('Course terminology cue');
  await expect(a.locator('.v1870-module')).toHaveCount(4);
 });
}
