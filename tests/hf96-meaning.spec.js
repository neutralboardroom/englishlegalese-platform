const {test,expect}=require('@playwright/test');
// Stable accessible automation for the inherited CSS smooth-scroll layout.
test.use({reducedMotion:'reduce'});

test('HF96 offers an accurate meaning paraphrase only after learner chooses, and resets between turns',async({page})=>{
 await page.goto('/learn/app/');
 await expect(page.locator('#hf96-meaning-reveal')).toBeDisabled();
 await page.locator('#hf93-start').click();
 await page.locator('#hf95-turn-first').click();
 await expect(page.locator('#hf96-meaning-reveal')).toBeEnabled();
 await expect(page.locator('#hf96-meaning-example')).toBeHidden();
 await page.locator('#hf96-meaning-reveal').click();
 await expect(page.locator('#hf96-meaning-example')).toContainText('whether they must sign the agreement today');
 await expect(page.locator('#hf96-meaning-reveal')).toBeDisabled();
 await page.locator('#hf95-turn-next').click();
 await expect(page.locator('#hf96-meaning-example')).toBeHidden();
 await expect(page.locator('#hf96-meaning-reveal')).toBeEnabled();
 await page.locator('#hf96-meaning-reveal').click();
 await expect(page.locator('#hf96-meaning-example')).toContainText('comments on the draft are due Friday');
 await page.locator('#hf95-turn-back').click();
 await expect(page.locator('#hf96-meaning-example')).toBeHidden();
 await page.locator('#hf93-stop').click();
 await expect(page.locator('#hf96-meaning-reveal')).toBeDisabled();
 await expect(page.locator('#hf96-meaning-example')).toBeHidden();
});

test('HF96 self-explanation works entirely without native speech or text collection',async({page})=>{
 const sideEffects=[];
 page.on('request',req=>{if(req.method()!=='GET'||req.url().includes('/api/'))sideEffects.push(req.method()+' '+req.url());});
 await page.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:undefined});Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:undefined});});
 await page.goto('/learn/app/');
 await page.locator('#hf93-start').click();
 await page.locator('#hf95-turn-first').click();
 await expect(page.locator('#hf95-turn-listen')).toBeDisabled();
 await expect(page.locator('#hf96-meaning-reveal')).toBeEnabled();
 await page.locator('#hf96-meaning-reveal').click();
 await expect(page.locator('#hf96-meaning-example')).toBeVisible();
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#hf96-meaning-example')).toBeHidden();
 expect(sideEffects).toEqual([]);
});

test('HF96 authored explanation covers every one of twelve source turns in both tracks',async({page})=>{
 await page.goto('/learn/app/');
 const seen=[];
 for(const [subject,answers] of [['legal',[1,2,0]],['business',[1,1,2]]]){
  if(subject==='business')await page.locator('input[name=hf93-subject][value=business]').check();
  await page.locator('#hf93-start').click();
  for(let caseNo=0;caseNo<3;caseNo++){
   await page.locator('#hf95-turn-first').click();
   for(let turn=0;turn<2;turn++){
    await expect(page.locator('#hf96-meaning-reveal')).toBeEnabled();
    await page.locator('#hf96-meaning-reveal').click();
    const sample=await page.locator('#hf96-meaning-example').innerText();
    expect(sample.length).toBeGreaterThan(50);
    seen.push(sample);
    if(turn===0){await page.locator('#hf95-turn-next').click();await expect(page.locator('#hf96-meaning-example')).toBeHidden();}
   }
   await page.locator('#hf93-answers button').nth(answers[caseNo]).click();
   await page.locator('#hf93-to-transfer').click();
   await page.locator('#hf93-reveal').click();
   await page.locator('#hf93-next').click();
   await expect(page.locator('#hf96-meaning-reveal')).toBeDisabled();
  }
 }
 expect(seen.length).toBe(12);
 expect(new Set(seen).size).toBe(12);
});

test('HF96 developer-only RTL technical fixture isolates English without claiming Arabic launch',async({page})=>{
 const fs=require('node:fs'),path=require('node:path');
 const content=fs.readFileSync(path.resolve(__dirname,'../qa/hf96-rtl-fixture.html'),'utf8');
 await page.setContent(content);
 await expect(page.locator('header')).toContainText('NOT A PUBLIC TRANSLATION OR LIVE PRODUCT');
 await expect(page.locator('section[dir=rtl][lang=ar]')).toHaveCSS('direction','rtl');
 await expect(page.locator('p[lang="en-US"][dir="ltr"]')).toHaveCSS('direction','ltr');
 await expect(page.locator('input#practice')).toHaveAttribute('autocomplete','off');
 const width=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
 expect(width.scroll).toBeLessThanOrEqual(width.client+1);
});
