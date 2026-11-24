'use strict';
// RDR-003 observation only. Public, fresh local test contexts; no live traffic.
// Rendered snapshots and mappings assist human review; they are NOT approval.
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const crypto=require('node:crypto');
const path=require('node:path');
const routes=['/','/learn/courses/','/learn/legal-english/','/learn/business-english/','/learn/legal-vocabulary/','/learn/conversation-rehearsal/','/learn/reading-precision/','/learn/app/'];
test.use({serviceWorkers:'block',reducedMotion:'reduce'});
for(const route of routes)test('HF108 RDR-003 public visual evidence '+route,async({page},info)=>{
 const blocked=[];
 await page.route('**/*',r=>{
  const q=r.request(),u=new URL(q.url());
  if(u.origin==='http://127.0.0.1:4173'&&['GET','HEAD'].includes(q.method()))return r.continue();
  if(['data:','blob:','about:'].includes(u.protocol))return r.continue();
  blocked.push({protocol:u.protocol,origin:u.origin,method:q.method()});
  return r.abort();
 });
 const response=await page.goto(route,{waitUntil:'domcontentloaded'});
 expect(response&&response.ok(),'public local route response').toBeTruthy();
 await expect(page.locator('body')).toBeVisible();
 // Record exact visible DOM observations, including off-screen scrollable items.
 // Do not read input values, user content, remote URLs with query strings, or full data URLs.
 const report=await page.evaluate(()=>{
  const rows=[];
  const visible=(el)=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity)>0&&r.width>0&&r.height>0&&el.getClientRects().length>0;};
  const scrub=s=>String(s||'').replace(/data:[^)]*/gi,'[embedded data]').replace(/https?:\/\/[^\s)"']+/gi,u=>{try{const parsed=new URL(u);return parsed.origin+parsed.pathname;}catch{return '[url]';}}).slice(0,500);
  const desc=el=>{const r=el.getBoundingClientRect();return {tag:el.tagName.toLowerCase(),id:el.id||null,visible:visible(el),size:{width:Math.round(r.width),height:Math.round(r.height)},documentPosition:{x:Math.round(r.left+scrollX),y:Math.round(r.top+scrollY)},section:scrub(el.closest('section,article,main')?.querySelector('h1,h2,h3')?.textContent),role:el.getAttribute('role'),ariaHidden:el.getAttribute('aria-hidden'),alt:scrub(el.getAttribute('alt')),label:scrub(el.getAttribute('aria-label'))};};
  for(const el of document.querySelectorAll('img,svg,canvas,video[poster],picture source,object,embed')){
   const row={...desc(el),kind:el.tagName.toLowerCase(),source:scrub(el.currentSrc||el.getAttribute('src')||el.getAttribute('srcset')||el.getAttribute('poster')||el.getAttribute('data'))};
   if(el instanceof HTMLImageElement){row.complete=el.complete;row.naturalWidth=el.naturalWidth;row.naturalHeight=el.naturalHeight;}
   rows.push(row);
  }
  for(const el of document.querySelectorAll('body,body *'))for(const pseudo of [null,'::before','::after']){
   const background=getComputedStyle(el,pseudo).backgroundImage;
   if(background&&background!=='none')rows.push({...desc(el),kind:'css-background',pseudo,source:scrub(background)});
  }
  return {title:document.title,viewport:{width:innerWidth,height:innerHeight},rows};
 });
 const out=info.outputPath('hf108-visual-evidence.json'),png=info.outputPath('hf108-viewport.png');
 await page.screenshot({path:png,animations:'disabled'});
 const result={schema:'rdr003.rendered-observation.v1',status:'OBSERVATION_ONLY_NOT_APPROVED',route,project:info.project.name,scope:'Public initial view, not all interaction states; service workers blocked; external traffic blocked; no offline/physical-device acceptance',...report,blockedRequests:blocked,screenshotSha256:crypto.createHash('sha256').update(fs.readFileSync(png)).digest('hex')};
 fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 await info.attach('RDR-003 viewport observation',{path:png,contentType:'image/png'});
 await info.attach('RDR-003 rendered inventory',{path:out,contentType:'application/json'});
 expect(report.viewport.width).toBeGreaterThan(0);
 expect(report.rows.some(x=>x.kind==='img'&&x.visible),'existing visible branding image').toBeTruthy();
 expect(blocked.filter(x=>!['GET','HEAD'].includes(x.method)),'no attempted public-view writes').toEqual([]);
});
