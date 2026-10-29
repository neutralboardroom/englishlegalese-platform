'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const lessons=Array.from({length:75},(_,i)=>({
 lesson_key:'page:mock-'+String(i).padStart(3,'0'),
 lesson_title:'Practice '+String(75-i).padStart(3,'0'),
 origin_path:'/learn/legal-english/',
 status:i<50?'draft':'submitted',
 updated_at:new Date(Date.UTC(2026,9,29,0,i)).toISOString(),
 answers:{secret:'DO NOT EXPOSE STUDENT RESPONSE'}
}));
async function setup(page){
 await page.addInitScript(()=>sessionStorage.setItem('el1940.student.session','mock.verified.session'));
 await page.route('**/api/v1940/lessons/capabilities',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v119/auth/me',route=>route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"mock-student","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',route=>route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,lessons,has_more:false,next_offset:null})}));
}
test('HF20 saved-work pages, boundaries, filters and title sort without duplicate fetch',async({page})=>{
 await setup(page);
 const requests=[];page.on('request',r=>{if(r.url().endsWith('/api/v1940/lessons'))requests.push(r.url())});
 await page.goto('/learn/my-work/');
 const hub=page.locator('[data-el1940-hub]'),cards=hub.locator('.v1940-saved-card');
 const previous=hub.getByRole('button',{name:'Previous page'}),next=hub.getByRole('button',{name:'Next page'});
 await expect(cards).toHaveCount(25);await expect(hub.getByText(/Page 1 of 3/)).toBeVisible();
 await expect(previous).toBeDisabled();await expect(next).toBeEnabled();
 await next.click();await next.click();
 await expect(hub.getByText(/Page 3 of 3/)).toBeVisible();await expect(next).toBeDisabled();
 await previous.click();await expect(hub.getByText(/Page 2 of 3/)).toBeVisible();
 await hub.getByRole('combobox',{name:'Sort saved lessons'}).selectOption('title');
 await expect(hub.getByText(/Page 1 of 3/)).toBeVisible();
 await expect(cards.first()).toContainText('Practice 001');
 await hub.getByRole('combobox',{name:'Filter saved lessons by status'}).selectOption('submitted');
 await expect(cards).toHaveCount(25);await expect(hub.getByText(/Page 1 of 1/)).toBeVisible();
 await expect(next).toBeDisabled();
 await hub.getByRole('searchbox',{name:'Search saved lessons'}).fill('no-match');
 await expect(cards).toHaveCount(0);await expect(hub).toContainText('Your saved work has not been deleted');
 await expect(previous).toBeDisabled();await expect(next).toBeDisabled();
 expect(requests).toHaveLength(1);
});
test('HF20 metadata-only study report exports all authorized records, not just visible 25',async({page})=>{
 await setup(page);
 await page.goto('/learn/my-work/');
 const hub=page.locator('[data-el1940-hub]');
 await expect(hub.locator('.v1940-saved-card')).toHaveCount(25);
 page.once('dialog',d=>d.accept());
 const [download]=await Promise.all([page.waitForEvent('download'),hub.getByRole('button',{name:'Download study overview (.txt)'}).click()]);
 const content=fs.readFileSync(await download.path(),'utf8');
 expect(content).toContain('Saved lessons shown: 75');
 expect(content).toContain('Practice 001');
 expect(content).toContain('Practice 075');
 expect(content).not.toContain('DO NOT EXPOSE STUDENT RESPONSE');
});
