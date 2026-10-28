'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
test('HF17 device-only dashboard offers private next-step and metadata-only study download',async({page})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('el1940.device.optin','yes');
  localStorage.setItem('el1940.lesson.workbook:class-01',JSON.stringify({
   key:'workbook:class-01',title:'Fictional Client Interviewing',path:'/learn/legal-english/',
   status:'draft',updated_at:'2026-10-28T09:00:00Z',
   answers:{fields:[{i:0,t:'TEXTAREA',kind:'textarea',name:'fictional',value:'PRIVATE ANSWER MUST NOT EXPORT'}]}
  }));
 });
 await page.goto('/learn/my-work/');
 const hub=page.locator('[data-el1940-hub]');
 await expect(hub.getByText('Your study overview')).toBeVisible();
 await expect(hub.getByText(/1 drafts to continue/)).toBeVisible();
 const next=hub.getByRole('link',{name:'Continue my most recent draft'});
 await expect(next).toHaveAttribute('href',/resume=workbook%3Aclass-01/);
 page.once('dialog',dialog=>dialog.accept());
 const [download]=await Promise.all([
  page.waitForEvent('download'),
  hub.getByRole('button',{name:'Download study overview (.txt)'}).click()
 ]);
 expect(download.suggestedFilename()).toMatch(/^englishlegalese-study-overview-\d{4}-\d{2}-\d{2}\.txt$/);
 const report=fs.readFileSync(await download.path(),'utf8');
 expect(report).toContain('Source: This device');
 expect(report).toContain('Fictional Client Interviewing');
 expect(report).toContain('NOT a full lesson backup');
 expect(report).not.toContain('PRIVATE ANSWER MUST NOT EXPORT');
});
