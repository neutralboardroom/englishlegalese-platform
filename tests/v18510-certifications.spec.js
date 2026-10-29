'use strict';
const {test,expect}=require('@playwright/test');
test('HF24 homepage promotes separate proposed certificates without implying award or accreditation',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.hero-copy')).toContainText('Legal English and Business English certificates');
 await expect(page.locator('.hero-copy')).toContainText('credentials not yet issued');
 await expect(page.locator('#mainNav a[href="/learn/certifications/"]')).toHaveCount(1);
});
for(const [slug,label,prefix]of [['legal','Legal','EL-LEG'],['business','Business','EL-BUS']]){
 test('HF24 original '+label+' certification page has six separate live-assessed levels and limits',async({page})=>{
  await page.goto('/learn/'+slug+'-english-certification/');
  await expect(page.getByRole('heading',{name:label+' English Certification',exact:true})).toBeVisible();
  for(const level of ['A1','A2','B1','B2','C1','C2']){
   await expect(page.locator('#'+level.toLowerCase())).toContainText(prefix+'-'+level);
  }
  await expect(page.locator('main')).toContainText('The Council of Europe does not endorse');
  await expect(page.locator('main')).toContainText('no certificate is issued');
  await expect(page.locator('main')).toContainText('not imply the corresponding level in the other');
 });
}
test('HF24 certification directory offers both independent tracks',async({page})=>{
 await page.goto('/learn/certifications/');
 await expect(page.getByRole('link',{name:/Explore Legal English A1/})).toHaveAttribute('href','/learn/legal-english-certification/');
 await expect(page.getByRole('link',{name:/Explore Business English A1/})).toHaveAttribute('href','/learn/business-english-certification/');
 await expect(page.locator('main')).toContainText('not yet activated');
});
