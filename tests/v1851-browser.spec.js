const {test,expect}=require('@playwright/test');
test('v1.85.1 homepage and dedicated navigation place Legal English before Business English',async({page})=>{
 await page.goto('/');await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.85.1');
 const links=await page.locator('#mainNav > a').evaluateAll(nodes=>nodes.map(n=>({href:n.getAttribute('href'),label:n.textContent.trim()})));
 const idx=links.findIndex(x=>x.href==='/learn/legal-english/');expect(idx).toBeGreaterThanOrEqual(0);expect(links[idx].label).toBe('Legal English');expect(links[idx+1].href).toBe('/learn/business-english/');
 await expect(page.locator('#courses #v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 for(const path of ['/learn/courses/','/learn/business-english/','/learn/enroll/','/learn/teach-with-us/','/pricing/']){
  await page.goto(path);const pair=await page.locator('.v1840-topnav > a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));const n=pair.indexOf('/learn/legal-english/');expect(n).toBeGreaterThanOrEqual(0);expect(pair[n+1]).toBe('/learn/business-english/');
 }
 await page.goto('/learn/legal-english/');await expect(page.locator('h1')).toContainText('Legal English courses');await expect(page.locator('a[href="/learn/courses/"]').first()).toBeAttached();
});
test('v1.85.1 32 session plans include original practice, homework and human-teacher feedback guidance',async({page})=>{
 await page.goto('/learn/classroom-programs/');await expect(page.locator('#v1851-legal-sessions .v1851-session')).toHaveCount(16);await expect(page.locator('#v1851-business-sessions .v1851-session')).toHaveCount(16);
 const card=page.locator('#v1851-legal-sessions .v1851-session').first();await card.locator('summary').click();await expect(card.locator('dl dt')).toHaveCount(4);await expect(card.locator('ol li')).toHaveCount(5);await expect(card).toContainText('Teacher preparation');await expect(card).toContainText('Homework deliverable');
 await card.locator('button').click();await expect(card.locator('.v1850-feedback')).toContainText('Choose a response first.');
 await card.locator('input[type="radio"]').first().check();await card.locator('button').click();await expect(card.locator('.v1850-feedback')).toContainText('Correct.');
 await page.locator('#v1851-business-sessions .v1851-session').last().locator('summary').click();await expect(page.locator('#v1851-business-sessions .v1851-session').last()).toContainText('Capstone');
});
