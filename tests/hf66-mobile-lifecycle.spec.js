'use strict';
const {test,expect}=require('@playwright/test');
test('HF66 installable app supports Thai Vietnamese Chinese instructions and explicitly checked updates',async({page,browserName})=>{
 const errors=[],writes=[],navigations=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 page.on('framenavigated',f=>{if(f===page.mainFrame())navigations.push(f.url());});
 await page.goto('/learn/install/');
 await expect(page.getByRole('heading',{name:'Take EnglishLegalese with you.'})).toBeVisible();
 await expect(page.getByText('Installation is your choice.',{exact:false})).toBeVisible();
 for(const [language,text] of [['th','Android'],['vi','Cài đặt ứng dụng'],['zh-Hans','安装应用']]){
  const section=page.locator('details[lang="'+language+'"]');
  await expect(section).toHaveCount(1);
  await section.locator('summary').click();
  await expect(section).toContainText(text);
 }
 await expect(page.locator('nav.v1840-topnav a[href="/learn/legal-english/"]')).toBeVisible();
 await expect(page.locator('nav.v1840-topnav a[href="/learn/business-english/"]')).toBeVisible();
 const manifest=await page.request.get('/manifest.webmanifest');
 expect(manifest.ok()).toBe(true);
 const data=await manifest.json();
 expect(data.shortcuts.map(x=>x.url)).toEqual([
  '/learn/legal-english/','/learn/business-english/','/learn/account/'
 ]);
 const apply=page.getByRole('button',{name:'Apply update and reload this page'});
 await expect(apply).toBeHidden();
 const status=page.locator('#el-update-status');
 await expect(status).toBeVisible();
 await expect(page.locator('#el-app-network-status')).toContainText('device reports a network connection');
 if(browserName==='chromium'){
  const check=page.getByRole('button',{name:'Check for app updates'});
  await expect(check).toBeVisible({timeout:15000});
  await expect(check).toBeEnabled();
  await check.click();
  await expect(check).toBeEnabled({timeout:15000});
  await expect(status).not.toContainText('checking for an app update');
  await expect(apply).toBeHidden();
 }
 expect(navigations).toHaveLength(1);
 expect(writes).toEqual([]);
 expect(errors).toEqual([]);
 const widths=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
 expect(widths.document).toBeLessThanOrEqual(widths.viewport+2);
});
test('HF66 mobile app limits offline fallback to public landing pages and never stores private lessons',async({page,context,browserName})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/learn/install/');
 if(browserName!=='chromium'){await expect(page.locator('#el-install-status')).toBeVisible();return;}
 await expect.poll(()=>page.evaluate(()=>navigator.serviceWorker?.controller?.scriptURL?.endsWith('/sw.js')===true),
  {timeout:15000}).toBe(true);
 const worker=await page.request.get('/sw.js');
 expect(worker.ok()).toBe(true);
 const source=await worker.text();
 expect(source).toContain('PUBLIC_FALLBACK_PATHS');
 expect(source).toContain('ENGLISHLEGALESE_APPLY_UPDATE');
 expect(source).toContain('cache.add(new Request(PUBLIC_OFFLINE_PAGE');
 expect(source).not.toContain('cache.put(');
 await context.setOffline(true);
 try{
  await page.goto('/learn/business-english/');
  await expect(page.getByRole('heading',{name:'EnglishLegalese is offline'})).toBeVisible();
  await expect(page.getByText('Your private student records',{exact:false})).toBeVisible();
  await expect(page.locator('input[type=password]')).toHaveCount(0);
 }finally{await context.setOffline(false);}
 expect(errors).toEqual([]);
});
