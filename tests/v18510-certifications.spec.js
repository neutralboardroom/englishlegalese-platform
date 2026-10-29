'use strict';
const {test,expect}=require('@playwright/test');
test('HF24 homepage presents two separate branded pathways and their employer value',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.hero-copy .lead')).toContainText('Legal English and Business English certifications');
 await expect(page.locator('.hero-copy .lead')).toContainText('current and prospective employers');
 await expect(page.locator('#mainNav a[href="/learn/certifications/"]')).toHaveCount(1);
});
for(const [slug,label] of [['legal','Legal'],['business','Business']]){
 test('HF24 '+label+' certification page lists six original levels and live teacher assessment',async({page})=>{
  await page.goto('/learn/'+slug+'-english-certification/');
  await expect(page.getByRole('heading',{name:label+' English Certification',exact:true})).toBeVisible();
  const rows=page.locator('main table tbody th[scope="row"]');
  await expect(rows).toHaveCount(6);
  for(const level of ['A1','A2','B1','B2','C1','C2'])await expect(rows.filter({hasText:level})).toHaveCount(1);
  await expect(page.locator('main')).toContainText('live human-proctored');
  await expect(page.locator('main')).toContainText('will issue a uniquely numbered');
  await expect(page.locator('main')).toContainText('not CEFR-issued');
  await expect(page.locator('main')).toContainText('do not transfer or automatically establish a level');
 });
}
test('HF24 certification directory offers independent Legal and Business tracks',async({page})=>{
 await page.goto('/learn/certifications/');
 await expect(page.getByRole('link',{name:'Explore Legal English certification'})).toHaveAttribute('href','/learn/legal-english-certification/');
 await expect(page.getByRole('link',{name:'Explore Business English certification'})).toHaveAttribute('href','/learn/business-english-certification/');
 await expect(page.locator('main')).toContainText('not CEFR-issued');
});
