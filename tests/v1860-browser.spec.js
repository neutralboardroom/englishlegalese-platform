const {test,expect}=require('@playwright/test');
test('v1.86 homepage Legal English sits before Business English and remains original design',async({page})=>{
 await page.goto('/');await page.locator('body.v1590-ready').waitFor();
 const nav=page.locator('#mainNav'),links=await nav.locator('a').evaluateAll(a=>a.map(x=>x.getAttribute('href')));
 expect(links).toContain('/learn/legal-english/');
 expect(links.indexOf('/learn/legal-english/')).toBeLessThan(links.indexOf('/learn/business-english/'));
 await expect(page.locator('.hero h1')).toContainText('Legal English with AI-supported practice and live online classes with human teachers');
 await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
});
test('v1.86 Legal English 24 independent topics and sixteen detailed classroom sessions',async({page})=>{
 await page.goto('/learn/legal-english/');
 await expect(page.getByRole('heading',{name:'Legal English courses and classroom program'})).toBeVisible();
 await expect(page.locator('#v1860-legal-topics .v1850-course-card')).toHaveCount(24);
 await expect(page.locator('#v1860-legal-sessions details.v1860-session')).toHaveCount(16);
 const first=page.locator('#v1860-legal-sessions details.v1860-session').first();
 await first.locator('summary').click();await expect(first.locator('dt')).toHaveCount(5);
 await expect(first.locator('li')).toHaveCount(9);
 await first.locator('input[type=radio]').first().check();await first.locator('button').click();
 await expect(first.locator('.v1860-feedback')).toContainText('Correct.');
});
test('v1.86 Business English classroom has sixteen sessions alongside 16 business and 8 investor topics',async({page})=>{
 await page.goto('/learn/business-english/');
 await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await expect(page.locator('#v1860-business-sessions details.v1860-session')).toHaveCount(16);
 await page.locator('#v1860-business-sessions details.v1860-session').last().locator('summary').click();
 await expect(page.locator('#v1860-business-sessions details.v1860-session').last().locator('dt')).toHaveCount(5);
});
test('v1.86 Legal and Business navigation parity on dedicated pages',async({page})=>{
 for(const u of ['/pricing/','/learn/enroll/','/learn/teachers/','/learn/business-resources/']){
  await page.goto(u);const nav=page.locator('.v1840-topnav');
  const links=await nav.locator('a').evaluateAll(a=>a.map(x=>x.getAttribute('href')));
  expect(links.indexOf('/learn/legal-english/')).toBeGreaterThanOrEqual(0);
  expect(links.indexOf('/learn/legal-english/')).toBeLessThan(links.indexOf('/learn/business-english/'));
 }
});
