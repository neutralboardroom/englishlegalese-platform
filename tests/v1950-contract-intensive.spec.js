'use strict';
const {test,expect}=require('@playwright/test');
for(const track of ['legal','business']){
 test('HF32 '+track+' Contracts, Agreements and Negotiation intensive has 8 distinct actual lessons with roleplay, quiz and focused domain language',async({page},testInfo)=>{
  const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url())});
  await page.goto('/learn/'+track+'-english/');
  const section=page.locator('#v1950-'+track+'-contracts');
  await expect(section).toBeVisible();
  await expect(section.getByRole('heading',{level:2})).toContainText('Contracts, Agreements & Negotiation');
  await expect(section.locator('details.v1950-lesson')).toHaveCount(track==='legal'?16:8);
  await expect(section.locator('.v1950-kicker')).toContainText(/self-guided/i);
  await expect(section).toContainText('Nothing on this page is a booked class');
  await section.locator('details.v1950-lesson').first().locator('summary').click();
  const first=section.locator('details.v1950-lesson').first();
  await expect(first).toHaveAttribute('open','');
  for(const h of ['Communication goal','Key language','Fictional situation','Model professional English','Independent task','Teacher-led roleplay option']){
   await expect(first.getByRole('heading',{name:h})).toBeVisible();
  }
  await first.getByRole('button',{name:'Check my understanding'}).click();
  await expect(first.locator('.v1950-feedback')).toContainText('Choose an answer');
  await first.locator('.v1950-answer input').nth(1).check();
  await first.getByRole('button',{name:'Check my understanding'}).click();
  await expect(first.locator('.v1950-feedback')).toContainText('Correct.');
  await section.locator('.v1950-preparation summary').click();
  await expect(section.locator('.v1950-preparation li')).toHaveCount(8);
  await expect(section.locator('.v1950-course-nav a')).toHaveAttribute('href',track==='legal'?'/learn/business-english/#v1950-business-contracts':'/learn/legal-english/#v1950-legal-contracts');
  await expect(section.locator('a.v1950-request-class')).toHaveAttribute('href','/learn/enroll/');
  await expect(section.locator('.v1950-sources a')).toHaveCount(3);
  expect(writes,'No student data, booking, payment or answer may leave the browser').toEqual([]);
  await section.screenshot({path:testInfo.outputPath('HF32-'+track+'-contracts-course-'+testInfo.project.name+'.png'),animations:'disabled'});
 });
}
test('HF32 original 24-topic Legal and 16+8 Business catalogs and HF31 homepage remain unchanged and course links are visible',async({page})=>{
 await page.goto('/learn/legal-english/');
 await expect(page.locator('#v1860-legal-catalog .v1860-course-card')).toHaveCount(24);
 await expect(page.locator('nav.v1860-subject-jump a[href="#v1950-legal-contracts"]')).toBeVisible();
 await page.goto('/learn/business-english/');
 await expect(page.locator('#v1850-business-cards .v1850-course-card')).toHaveCount(16);
 await expect(page.locator('#v1850-investor-cards .v1850-course-card')).toHaveCount(8);
 await expect(page.locator('a[href="#v1950-business-contracts"]')).toBeVisible();
 await page.goto('/#home');
 await expect(page.locator('#v18531-integrated-hero')).toBeVisible();
 await expect(page.locator('#v18512-home-preview .v18512-pathway-card')).toHaveCount(5);
});
