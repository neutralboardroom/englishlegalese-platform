'use strict';
const {test,expect}=require('@playwright/test');
test('HF65 optional EnglishLegalese app installation is discoverable on mobile and never auto-prompts',async({page})=>{
 const errors=[],writes=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await page.goto('/');
 await expect(page.locator('a[href="/learn/install/"]')).toBeVisible();
 await expect(page.locator('link[rel=manifest]')).toHaveAttribute('href','/manifest.webmanifest');
 await expect(page.locator('.brand img')).toHaveAttribute('src',/englishlegalese-logo\.png/);
 await page.goto('/learn/install/');
 await expect(page.getByRole('heading',{name:'Take EnglishLegalese with you.'})).toBeVisible();
 await expect(page.getByText('Installation is your choice.',{exact:false})).toBeVisible();
 await expect(page.getByRole('heading',{name:'iPhone and iPad'})).toBeVisible();
 await expect(page.getByText('Add to Home Screen',{exact:false}).first()).toBeVisible();
 const install=page.getByRole('button',{name:'Install EnglishLegalese'});
 await expect(install).toBeHidden();
 const manifest=await page.request.get('/manifest.webmanifest');
 expect(manifest.ok()).toBeTruthy();
 expect(manifest.headers()['content-type']).toMatch(/application\/manifest\+json/);
 const data=await manifest.json();
 expect(data.id).toBe('/');expect(data.display).toBe('standalone');
 expect(data.icons.filter(x=>x.type==='image/png').map(x=>x.sizes)).toEqual(['192x192','512x512']);
 for(const size of [192,512]){
  const icon=await page.request.get('/assets/englishlegalese-app-icon-'+size+'.png');
  expect(icon.ok()).toBeTruthy();
  expect(icon.headers()['content-type']).toMatch(/image\/png/);
  const body=await icon.body();
  expect(body.readUInt32BE(16)).toBe(size);
  expect(body.readUInt32BE(20)).toBe(size);
 }
 const worker=await page.request.get('/sw.js');
 expect(worker.ok()).toBeTruthy();
 expect(worker.headers()['service-worker-allowed']).toBe('/');
 expect(worker.headers()['cache-control']).toMatch(/no-cache/);
 const status=page.locator('#el-install-status');
 // Synthesize the browser's permitted prompt event to test UX. This alone
 // does NOT claim Playwright installed a real native/PWA app.
 await page.evaluate(()=>{
  window.__hf65PromptCount=0;
  const e=new Event('beforeinstallprompt',{cancelable:true});
  Object.defineProperty(e,'prompt',{value:async()=>{window.__hf65PromptCount++;}});
  Object.defineProperty(e,'userChoice',{value:Promise.resolve({outcome:'accepted'})});
  window.dispatchEvent(e);
 });
 await expect(install).toBeVisible();
 expect(await page.evaluate(()=>window.__hf65PromptCount)).toBe(0);
 await install.click();
 await expect(status).toContainText('Install request accepted');
 expect(await page.evaluate(()=>window.__hf65PromptCount)).toBe(1);
 expect(writes).toEqual([]);
 expect(errors).toEqual([]);
 const widths=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth}));
 expect(widths.document).toBeLessThanOrEqual(widths.viewport+2);
});

test('HF65 installed web-app worker uses a public offline notice, never cached account or lesson data',async({page,context,browserName})=>{
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/learn/install/');
 const offline=await page.request.get('/learn/install/offline.html');
 expect(offline.ok()).toBeTruthy();
 expect(await offline.text()).toContain('Your private student records');
 await page.goto('/learn/account/');
 await expect(page.getByRole('link',{name:'Install the optional EnglishLegalese phone app'})).toBeVisible();
 if(browserName==='chromium'){
  await page.goto('/learn/install/');
  await expect.poll(()=>page.evaluate(()=>navigator.serviceWorker?.controller?.scriptURL?.endsWith('/sw.js')===true),{timeout:12000}).toBe(true);
  await context.setOffline(true);
  try{
   await page.goto('/?hf65_offline_test=1');
   await expect(page.getByRole('heading',{name:'EnglishLegalese is offline'})).toBeVisible();
   await expect(page.getByText('Your private student records',{exact:false})).toBeVisible();
   await expect(page.locator('input[type=password], input[name=token]')).toHaveCount(0);
  }finally{await context.setOffline(false);}
 }
 expect(errors).toEqual([]);
});
