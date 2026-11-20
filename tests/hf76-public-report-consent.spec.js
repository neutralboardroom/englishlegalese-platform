'use strict';
const {test,expect}=require('@playwright/test');
// Real desktop/tablet/mobile Chromium and tablet WebKit acceptance, using the
// public route only; clipboard permissions are not requested or auto-granted.
test('HF76 public diagnostic says copy requires a second click and resets across runs',async({page})=>{
 const privateCalls=[],writes=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',request=>{
  const url=new URL(request.url());
  if(url.pathname.startsWith('/api/')||url.pathname.startsWith('/learn/private/'))privateCalls.push(url.pathname);
  if(['POST','PUT','PATCH','DELETE'].includes(request.method()))writes.push(request.url());
 });
 await page.goto('/learn/install/');
 const check=page.getByRole('button',{name:'Check my device and public app files'});
 const copy=page.locator('#el-device-check-copy');
 const status=page.locator('#el-device-check-copy-status');
 await expect(copy).toBeHidden();
 await check.click();
 await expect(page.locator('#el-device-check-results li')).toHaveCount(7);
 await expect(copy).toBeVisible();
 await expect(status).toContainText('requires another click');
 await expect(status).toContainText('Nothing has been copied or shared');
 expect(privateCalls).toEqual([]);expect(writes).toEqual([]);expect(errors).toEqual([]);
 // A new check must not reuse the previous report or claim a copy happened.
 await check.click();
 await expect(page.locator('#el-device-check-results li')).toHaveCount(7);
 await expect(copy).toBeVisible();
 await expect(status).toContainText('requires another click');
 expect(privateCalls).toEqual([]);expect(writes).toEqual([]);expect(errors).toEqual([]);
});
