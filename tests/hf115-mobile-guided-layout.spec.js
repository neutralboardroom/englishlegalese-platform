'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),crypto=require('node:crypto'),cp=require('node:child_process');
test.use({serviceWorkers:'block',reducedMotion:'reduce'});
test('HF115 accessible mobile guided workplace layout and selection state',async({page},info)=>{
 test.setTimeout(60000);
 const blocked=[];await page.route('**/*',r=>{const q=r.request(),u=new URL(q.url());if(u.origin==='http://127.0.0.1:4173'&&['GET','HEAD'].includes(q.method()))return r.continue();if(['data:','blob:','about:'].includes(u.protocol))return r.continue();blocked.push(q.method());return r.abort();});
 await page.goto('/learn/study-planner/');
 const p=page.locator('#hf111-workplace-preview'),g=p.locator('#hf112-guided'),progress=g.locator('#hf115-progress'),observations=[];
 const before=await page.evaluate(()=>JSON.stringify([localStorage,sessionStorage]));
 async function stage(n){await expect(progress).toHaveJSProperty('value',n);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(4);}
 async function capture(name,locator){const file='hf115-'+name+'.png',dest=info.outputPath(file);await locator.screenshot({path:dest,animations:'disabled'});const png=fs.readFileSync(dest);expect(png.length).toBeGreaterThan(0);expect(observations.reduce((n,x)=>n+x.bytes,0)+png.length).toBeLessThan(5*1024*1024);observations.push({name,file,bytes:png.length,sha256:crypto.createHash('sha256').update(png).digest('hex')});}
 await p.locator('#hf111-scenario').selectOption('energy');await p.locator('#hf111-audience').selectOption('client');await p.locator('#hf112-start').click();await stage(1);
 await expect(progress).toHaveAccessibleName('Guided speaking lesson progress');
 await expect(g.locator('#hf113-audience-model')).toHaveCount(0);
 await g.getByRole('button',{name:'Continue to language coaching',exact:true}).click();await stage(2);
 await g.getByRole('button',{name:'Practise a comparable situation',exact:true}).click();await stage(3);
 await g.getByRole('button',{name:'Review my self-reflection',exact:true}).click();await stage(4);
 await g.getByRole('button',{name:'Try one more workplace situation',exact:true}).click();await stage(5);
 await g.getByRole('button',{name:'Reveal a possible response',exact:true}).click();await g.getByRole('button',{name:'Reveal a possible follow-up response',exact:true}).click();await capture('transfer',g);
 const repair=g.locator('#hf114-repair');await repair.getByRole('button',{name:'Practise repairing a misunderstanding',exact:true}).click();await repair.getByRole('button',{name:'Show possible clarification responses',exact:true}).click();
 const options=repair.locator('[data-option]');await expect(options).toHaveCount(3);await expect(options.nth(0)).toHaveAttribute('aria-pressed','false');
 await options.nth(0).click();await expect(options.nth(0)).toHaveAttribute('aria-pressed','true');await options.nth(1).click();await expect(options.nth(0)).toHaveAttribute('aria-pressed','false');await expect(options.nth(1)).toHaveAttribute('aria-pressed','true');
 expect((await options.nth(1).boundingBox()).height).toBeGreaterThanOrEqual(44);await expect(repair.locator('#hf114-feedback')).toHaveAttribute('data-clear','true');await capture('repair',repair);
 await g.getByRole('button',{name:'Finish and clear guided practice',exact:true}).click();await expect(g).toBeHidden();await expect(progress).toHaveJSProperty('value',0);
 expect(await page.evaluate(()=>JSON.stringify([localStorage,sessionStorage]))).toBe(before);expect(blocked.filter(m=>!['GET','HEAD'].includes(m))).toEqual([]);
 fs.writeFileSync(info.outputPath('hf115-observations.json'),JSON.stringify({schema:'rdr003.workplace-layout.v1',status:'OBSERVATION_ONLY_NOT_APPROVED',head:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),project:info.project.name,observations},null,2)+'\n',{flag:'wx'});
});
