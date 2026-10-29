'use strict';
const {test,expect}=require('@playwright/test');
test('HF24 homepage briefly promotes honest original EnglishLegalese certification pathways',async({page})=>{
 await page.goto('/');
 await expect(page.locator('.v1940-cert-hero')).toBeVisible();
 await expect(page.locator('.v1940-cert-hero')).toContainText('EnglishLegalese-branded');
 await expect(page.locator('.v1940-cert-hero')).toContainText('Certificates are not issued yet');
 await expect(page.getByRole('link',{name:'Certifications',exact:true}).first()).toHaveAttribute('href','/learn/certifications/');
});
test('HF24 certifications stay distinctly branded with separate legal and business A1–C2 frameworks',async({page})=>{
 await page.goto('/learn/certifications/');
 await expect(page.getByRole('heading',{name:'EnglishLegalese Professional English Certifications'})).toBeVisible();
 await expect(page.getByRole('link',{name:'Explore Legal English certification'})).toHaveAttribute('href','/learn/legal-english-certification/');
 await expect(page.getByRole('link',{name:'Explore Business English certification'})).toHaveAttribute('href','/learn/business-english-certification/');
 for(const [slug,name] of [['legal-english-certification','Legal English'],['business-english-certification','Business English']]){
  await page.goto('/learn/'+slug+'/');
  await expect(page.getByRole('heading',{name:name+' Certification',exact:true}).first()).toBeVisible();
  await expect(page.locator('.v1940-table-scroll tbody tr')).toHaveCount(6);
  await expect(page.locator('.v1940-cert-page')).toContainText('solely by EnglishLegalese');
  await expect(page.locator('.v1940-cert-page')).toContainText('No certificate examination or issuance');
 }
});
