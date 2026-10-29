'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
async function setup(page,{breakSecond=false}={}){
 await page.addInitScript(()=>sessionStorage.setItem('el1940.student.session','mock.verified.session'));
 await page.route('**/api/v1940/lessons/capabilities',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"account_saving_available":true,"account_registration_available":true}'}));
 await page.route('**/api/v119/auth/me',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"user":{"id":"mock-student","role":"student"}}'}));
 await page.route('**/api/v1940/lessons',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"lessons":[],"has_more":false,"next_offset":null}'}));
 const offsets=[];
 await page.route('**/api/v1940/account/export-part?offset=*',r=>{
  const offset=Number(new URL(r.request().url()).searchParams.get('offset'));offsets.push(offset);
  if(offset===25&&breakSecond)return r.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"error":"Database unavailable"}'});
  const part={ok:true,format:'EnglishLegalese student cloud backup part',schema_version:1,complete:false,part_only:true,
   offset,page_size:25,has_more:offset===0,next_offset:offset===0?25:null,
   saved_lessons:Array.from({length:offset===0?25:1},(_,i)=>({lesson_key:'page:mock-'+(offset+i),lesson_title:'Mock '+(offset+i),origin_path:'/learn/legal-english/',answers:{fields:[],secret:'PRIVATE ANSWER'}})),
   submissions:[],privacy:'Partial private data; no email'};
  return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(part)});
 });
 return offsets;
}
test('HF19 student explicitly downloads numbered backup parts with private data and honest coverage',async({page})=>{
 const offsets=await setup(page);
 await page.goto('/learn/my-work/');
 const firstButton=page.getByRole('button',{name:'Download backup part 1'});
 await expect(firstButton).toBeVisible();
 page.once('dialog',d=>d.accept());
 const [one]=await Promise.all([page.waitForEvent('download'),firstButton.click()]);
 const data=JSON.parse(fs.readFileSync(await one.path(),'utf8'));
 expect(data.complete).toBe(false);expect(data.part_only).toBe(true);expect(data.saved_lessons.length).toBe(25);
 expect(data.saved_lessons[0].answers.secret).toBe('PRIVATE ANSWER');
 expect(one.suggestedFilename()).toContain('backup-part-1');
 page.once('dialog',d=>d.accept());
 const [two]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download backup part 2'}).click()]);
 expect(two.suggestedFilename()).toContain('backup-part-2');
 await expect(page.getByRole('button',{name:'Download backup part 1'})).toBeVisible();
 expect(offsets).toEqual([0,25]);
});
test('HF19 failed part retries same offset and never skips private records',async({page})=>{
 const offsets=await setup(page,{breakSecond:true});
 await page.goto('/learn/my-work/');
 page.once('dialog',d=>d.accept());
 await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download backup part 1'}).click()]);
 page.once('dialog',d=>d.accept());
 await page.getByRole('button',{name:'Download backup part 2'}).click();
 await expect(page.getByText(/BACKUP PART NOT DOWNLOADED:/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Download backup part 2'})).toBeVisible();
 page.once('dialog',d=>d.accept());
 await page.getByRole('button',{name:'Download backup part 2'}).click();
 await expect.poll(()=>offsets,{message:'Retry must request exactly the same failed private backup offset'}).toEqual([0,25,25]);
});
