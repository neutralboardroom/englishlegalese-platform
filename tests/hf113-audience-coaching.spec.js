'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs'),crypto=require('node:crypto'),cp=require('node:child_process');
test.use({serviceWorkers:'block',reducedMotion:'reduce'});
test('HF113 audience-specific transfer coaching and rendered observation',async({page},info)=>{
 const blocked=[];await page.route('**/*',r=>{const q=r.request(),u=new URL(q.url());if(u.origin==='http://127.0.0.1:4173'&&['GET','HEAD'].includes(q.method()))return r.continue();if(['data:','blob:','about:'].includes(u.protocol))return r.continue();blocked.push({origin:u.origin,method:q.method()});return r.abort();});
 await page.goto('/learn/study-planner/');
 const p=page.locator('#hf111-workplace-preview'),g=p.locator('#hf112-guided'),before=await page.evaluate(()=>({local:JSON.stringify(localStorage),session:JSON.stringify(sessionStorage)})),observations=[];
 async function capture(stage){const file='hf113-'+stage+'.png',dest=info.outputPath(file);await g.screenshot({path:dest,animations:'disabled'});const png=fs.readFileSync(dest);expect(png.length).toBeLessThan(6*1024*1024);observations.push({stage,file,sha256:crypto.createHash('sha256').update(png).digest('hex'),bytes:png.length});}
 await p.locator('#hf111-scenario').selectOption('energy');await p.locator('#hf111-audience').selectOption('client');await p.locator('#hf112-start').click();
 await expect(g).not.toContainText('Under the stated terms');await capture('baseline');
 await g.getByRole('button',{name:'Continue to language coaching'}).click();await expect(g.locator('#hf113-audience-model')).toContainText('Under the stated terms, delivery');await capture('review');
 await g.getByRole('button',{name:'Practise a comparable situation'}).click();await expect(g.locator('#hf113-audience-model')).toHaveCount(0);
 await g.getByRole('button',{name:'Review my self-reflection'}).click();
 await g.getByRole('button',{name:'Try one more workplace situation'}).click();await expect(g.locator('#hf113-transfer-model')).toHaveCount(0);await capture('transfer-before');
 await g.getByRole('button',{name:'Reveal a possible response'}).click();await expect(g.locator('#hf113-transfer-model')).toContainText('Under the stated terms, the report');
 await expect(g.locator('#hf113-followup-answer')).toHaveCount(0);
 await g.getByRole('button',{name:'Reveal a possible follow-up response'}).click();await expect(g.locator('#hf113-followup-answer')).toContainText('Not from these facts alone');await capture('transfer-reviewed');
 await g.getByRole('button',{name:'Finish and clear guided practice'}).click();await expect(g).toBeHidden();
 await p.locator('#hf111-scenario').selectOption('finance');await p.locator('#hf111-audience').selectOption('manager');await p.locator('#hf112-start').click();await g.getByRole('button',{name:'Continue to language coaching'}).click();await expect(g.locator('#hf113-audience-model')).toContainText('10 units below forecast');await expect(g.locator('#hf113-audience-model')).not.toContainText('delivery');
 await p.locator('#hf112-stop').click();await expect(g).toBeHidden();
 expect(await page.evaluate(()=>({local:JSON.stringify(localStorage),session:JSON.stringify(sessionStorage)}))).toEqual(before);
 expect(blocked.filter(x=>!['GET','HEAD'].includes(x.method))).toEqual([]);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(4);
 const manifest={status:'OBSERVATION_ONLY_NOT_APPROVED',schema:'rdr003.workplace-interaction.v1',head:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),project:info.project.name,route:'/learn/study-planner/',scope:'Fictional panel snapshots of four selected interaction states; not full visual, professional, native, offline or physical review',observations};
 fs.writeFileSync(info.outputPath('hf113-observations.json'),JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
});
