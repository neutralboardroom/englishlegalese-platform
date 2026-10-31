'use strict';
const {test,expect}=require('@playwright/test');
test('HF24 homepage presents separate EnglishLegalese certificate pathways and value for employers',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.hero-copy .lead')).toContainText('EnglishLegalese offers its own separate Legal English and Business English certifications');
 await expect(page.locator('.hero-copy .lead')).not.toContainText('EnglishLegalese will offer');
 await expect(page.locator('.hero-copy .lead')).toContainText('current and prospective employers gauge professional communication skills');
 await expect(page.locator('#mainNav a[href="/learn/certifications/"]')).toHaveCount(1);
});
for(const [slug,label,prefix]of [['legal','Legal','EL-LEG'],['business','Business','EL-BUS']]){
 test('HF24 original '+label+' certification page has six separate live-assessed levels and limits',async({page})=>{
  await page.goto('/learn/'+slug+'-english-certification/');
  await expect(page.getByRole('heading',{name:label+' English Certification',exact:true})).toBeVisible();
  for(const level of ['A1','A2','B1','B2','C1','C2']){
   await expect(page.locator('main')).toContainText(prefix+'-'+level);
  }
  await expect(page.locator('main')).toContainText('CEFR-informed, not CEFR-issued');
  await expect(page.locator('main')).toContainText('before any credential can be issued');
  await expect(page.locator('main')).toContainText('Scores in the other specialist track do not transfer');
 });
}
test('HF24 certification directory offers both independent tracks',async({page})=>{
 await page.goto('/learn/certifications/');
 await expect(page.getByRole('link',{name:/Explore Legal English certification/})).toHaveAttribute('href','/learn/legal-english-certification/');
 await expect(page.getByRole('link',{name:/Explore Business English certification/})).toHaveAttribute('href','/learn/business-english-certification/');
 await expect(page.locator('main')).toContainText('Assessment booking and certificate issuance are not yet active');
 await expect(page.getByRole('link',{name:/Check the status of an issued EnglishLegalese certificate/})).toHaveAttribute('href','/learn/certificate-verification/');
});
