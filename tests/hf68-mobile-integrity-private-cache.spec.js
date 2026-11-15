'use strict';
const {test,expect}=require('@playwright/test');

test('HF68 mobile install readiness validates real PNG dimensions and manifest icon identity, never signs in or installs',async({page})=>{
 const writes=[],privateRequests=[],errors=[];
 page.on('request',r=>{
  if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());
  if(r.url().includes('/api/'))privateRequests.push(r.url());
 });
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/learn/install/');
 const start=page.locator('#el-device-check-status');
 await expect(start).toContainText('No check has run');
 const go=page.getByRole('button',{name:'Check my device and public app files'});
 await go.click();
 await expect(start).toContainText('check finished');
 const results=page.locator('#el-device-check-results li');
 await expect(results).toHaveCount(7);
 await expect(results.filter({hasText:'App manifest: Present and configured'})).toHaveCount(1);
 for(const size of [192,512]){
  await expect(results.filter({hasText:'App icon '+size+'px: Valid '+size+'×'+size+' PNG'})).toHaveCount(1);
 }
 expect(writes).toEqual([]);expect(privateRequests).toEqual([]);expect(errors).toEqual([]);
 const dim=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
 expect(dim.scroll).toBeLessThanOrEqual(dim.width+2);
});

test('HF68 corrupt icon cannot be reported as install-ready, with no account or install side effects',async({page})=>{
 const writes=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 // Intercept the app's *explicit fetch*, not a network request already
 // satisfied from WebKit's icon/service-worker cache. A Playwright route
 // added after navigation can be bypassed on tablet WebKit. This injection
 // guarantees the readiness checker receives the corrupt PNG across engines.
 await page.addInitScript(()=>{
  const nativeFetch=window.fetch.bind(window);
  window.__hf68CorruptIconFetchCount=0;
  window.fetch=(input,options)=>{
   const url=typeof input==='string'?input:input?.url;
   if(url==='/assets/englishlegalese-app-icon-192.png'){
    window.__hf68CorruptIconFetchCount++;
    return Promise.resolve(new Response('INVALID_PNG_HF68',{
     status:200,headers:{'content-type':'image/png'}
    }));
   }
   return nativeFetch(input,options);
  };
 });
 await page.goto('/learn/install/');
 const button=page.getByRole('button',{name:'Check my device and public app files'});
 await button.click();
 await expect(page.locator('#el-device-check-status')).toContainText('check finished');
 const iconResult=page.locator('#el-device-check-results li').filter({hasText:'App icon 192px:'});
 await expect(iconResult).toHaveCount(1);
 await expect(iconResult).toContainText('Public file did not match the expected PNG dimensions');
 await expect(iconResult).not.toContainText('Valid 192×192 PNG');
 expect(await page.evaluate(()=>window.__hf68CorruptIconFetchCount)).toBe(1);
 // Browser may OFFER installation, but this test never clicks or prompts it.
 expect(writes).toEqual([]);expect(errors).toEqual([]);
});

test('HF68 all nested private workspace routes reject intermediary/browser HTTP caching',async({page})=>{
 const base=['/learn/account','/learn/my-work','/learn/private-energy-contracts',
  '/learn/owner-dashboard','/learn/teacher-submissions','/learn/employer-dashboard',
  '/learn/teacher-dashboard','/learn/student-dashboard','/learn/progress'];
 for(const prefix of base){
  for(const suffix of ['/','/index.html','/nested-private-content','/%69ndex.html']){
   const response=await page.request.get(prefix+suffix,{maxRedirects:0});
   expect(response.headers()['cache-control'],prefix+suffix).toContain('private, no-store');
   expect(response.headers()['pragma'],prefix+suffix).toContain('no-cache');
   expect(response.headers()['vary']||'',prefix+suffix).toContain('Authorization');
  }
 }
 for(const path of ['/api/v119/auth/me','/api/v2150/private-energy/sessions']){
  const response=await page.request.get(path);
  expect(response.headers()['cache-control'],path).toContain('no-store');
 }
 const publicPage=await page.request.get('/learn/business-english/');
 expect(publicPage.ok()).toBe(true);
 expect(publicPage.headers()['cache-control']||'').not.toContain('private, no-store');
});
