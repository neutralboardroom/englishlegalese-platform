'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const first=Array.from({length:100},(_,i)=>({
 lesson_key:'page:mock-'+String(i).padStart(3,'0'),lesson_title:'Fictional exercise '+String(i).padStart(3,'0'),
 origin_path:'/learn/legal-english/',status:i%2?'submitted':'draft',updated_at:'2026-10-29T00:00:00Z',
 answers:{private:'DO NOT EXPORT MY ANSWERS'}
}));
const second=Array.from({length:25},(_,i)=>({
 lesson_key:'page:mock-'+String(100+i),lesson_title:'Fictional exercise '+String(100+i),
 origin_path:'/learn/business-english/',status:'draft',updated_at:'2026-10-28T00:00:00Z',
 answers:{private:'DO NOT EXPORT MY ANSWERS'}
}));
async function setup(page,broken=false){
 await page.addInitScript(()=>sessionStorage.setItem('el1940.student.session','mock.verified.session'));
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v119/auth/me',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"mock-student","role":"student"}}'}));
 await page.route('**/api/v1940/lessons?offset=100',route=>route.fulfill({status:broken?503:200,contentType:'application/json',body:broken?'{"ok":false,"error":"Temporary database interruption"}':JSON.stringify({ok:true,lessons:second,has_more:false,next_offset:null})}));
 await page.route('**/api/v1940/lessons',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,lessons:first,has_more:true,next_offset:100})}));
}
test('HF18 loads 125 account-owned lessons from two private pages and exports metadata only',async({page})=>{
 await setup(page);
 const requests=[];page.on('request',r=>{if(r.url().includes('/api/v1940/lessons')&&!r.url().endsWith('/capabilities'))requests.push(r.url())});
 await page.goto('/learn/my-work/');
 const hub=page.locator('[data-el1940-hub]');
 await expect(hub.locator('.v1940-saved-card')).toHaveCount(125);
 await expect(hub.locator('.v1940-hub-summary')).toContainText('125 saved lessons');
 expect(requests.some(x=>x.includes('?offset=100'))).toBe(true);
 await hub.getByRole('searchbox',{name:'Search saved lessons'}).fill('exercise 124');
 await expect(hub.locator('.v1940-saved-card')).toHaveCount(1);
 await hub.getByRole('searchbox',{name:'Search saved lessons'}).fill('');
 page.once('dialog',d=>d.accept());
 const [dl]=await Promise.all([page.waitForEvent('download'),hub.getByRole('button',{name:'Download study overview (.txt)'}).click()]);
 const text=fs.readFileSync(await dl.path(),'utf8');
 expect(text).toContain('Saved lessons shown: 125');
 expect(text).toContain('Listing coverage: All pages returned');
 expect(text).toContain('Fictional exercise 124');
 expect(text).not.toContain('DO NOT EXPORT MY ANSWERS');
});
test('HF18 warns when the second private page fails; never claims a full account listing',async({page})=>{
 await setup(page,true);
 await page.goto('/learn/my-work/');
 const hub=page.locator('[data-el1940-hub]');
 await expect(hub.locator('.v1940-saved-card')).toHaveCount(100);
 await expect(hub).toContainText('LIST MAY BE INCOMPLETE');
 await expect(hub).toContainText('Previously saved work has NOT been deleted');
 page.once('dialog',d=>d.accept());
 const [dl]=await Promise.all([page.waitForEvent('download'),hub.getByRole('button',{name:'Download study overview (.txt)'}).click()]);
 const text=fs.readFileSync(await dl.path(),'utf8');
 expect(text).toContain('Listing coverage: PARTIAL');
 expect(text).not.toContain('DO NOT EXPORT MY ANSWERS');
});
