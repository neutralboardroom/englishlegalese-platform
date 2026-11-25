'use strict';
const {test,expect}=require('@playwright/test');

// HF75: actual Chromium/WebKit DOM regression for the HF74 R2 failure where
// translated instruction blocks were duplicated outside the main landmark.
// This tests the genuine install route; no private account or signup required.
test('HF75 one complete Thai Vietnamese Chinese help section inside main, public-only opt-in checks',async({page})=>{
 const errors=[],writes=[],privateRequests=[];
 page.on('pageerror',error=>errors.push(error.message));
 page.on('request',request=>{
  if(['POST','PUT','PATCH','DELETE'].includes(request.method()))writes.push(request.url());
  if(new URL(request.url()).pathname.startsWith('/api/'))privateRequests.push(request.url());
 });
 await page.goto('/learn/install/');
 await expect(page.getByRole('heading',{name:'Take EnglishLegalese with you.'})).toBeVisible();
 await expect(page.locator('#el-install-languages')).toHaveCount(1);
 await expect(page.locator('#el-install-multilingual')).toHaveCount(1);
 for(const [language,device,privacy] of [
  ['th','Android / Chrome','บัญชีผู้เรียน'],
  ['vi','Cài đặt ứng dụng','bài làm đã lưu'],
  ['zh-Hans','安装应用','已保存的学习内容']
 ]){
  const all=page.locator(`details[lang="${language}"]`);
  await expect(all).toHaveCount(1);
  await expect(page.locator(`main details[lang="${language}"]`)).toHaveCount(1);
  await all.locator('summary').click();
  await expect(all).toContainText(device);
  await expect(all).toContainText(privacy);
  await expect(all).toContainText('Safari');
 }
 const check=page.getByRole('button',{name:'Check my device and public app files'});
 const copy=page.locator('#el-device-check-copy');
 await expect(copy).toBeHidden();
 await check.click();
 await expect(page.locator('#el-device-check-results li')).toHaveCount(7);
 await expect(copy).toBeVisible();
 // Never use clipboard without the visitor's second, separate click.
 await expect(page.locator('#el-device-check-copy-status')).toContainText('requires another click');
 expect(writes).toEqual([]);
 expect(privateRequests).toEqual([]);
 expect(errors).toEqual([]);
 const layout=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth}));
 expect(layout.width).toBeLessThanOrEqual(layout.viewport+2);
});
