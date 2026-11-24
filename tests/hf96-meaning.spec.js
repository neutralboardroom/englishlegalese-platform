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

// HF107: independently bounded case tests; all twelve exact distinct authored outputs remain pinned.
const expectedMeaning = {
 "legal": [
  [
   "One possible meaning: The client wants to know whether they must sign the agreement today.",
   "One possible meaning: The lawyer explains that comments on the draft are due Friday, but signing would take place later if both sides agree."
  ],
  [
   "One possible meaning: The colleague asks whether the draft makes every conversation confidential.",
   "One possible meaning: The reviewer explains that the draft focuses on specified project information and does not automatically cover ordinary public information."
  ],
  [
   "One possible meaning: The client wants a summary of the most important risks before the meeting.",
   "One possible meaning: The team member is checking whether the client wants a short email before the meeting and detailed analysis during it."
  ]
 ],
 "business": [
  [
   "One possible meaning: The manager asks whether the team can complete the entire report by Wednesday.",
   "One possible meaning: The analyst can deliver a draft by Wednesday, but the reviewed final report will take two more days."
  ],
  [
   "One possible meaning: The chair assigns the supplier follow-up to Lina and the budget update to Arun, with Thursday as the budget deadline.",
   "One possible meaning: The colleague repeats who is responsible for each task to check that the assignments are understood correctly."
  ],
  [
   "One possible meaning: The director asks whether higher order numbers guarantee increased revenue next quarter.",
   "One possible meaning: The analyst says higher orders are promising, but revenue is not guaranteed because deliveries, cancellations, and payment dates also matter."
  ]
 ]
};
const allMeanings=Object.values(expectedMeaning).flat(2);
if(allMeanings.length!==12||new Set(allMeanings).size!==12)throw new Error('HF96 requires twelve distinct authored meanings');
for(const [subject,answers] of [['legal',[1,2,0]],['business',[1,1,2]]]){
 for(let caseNo=0;caseNo<3;caseNo++){
  test(`HF96 authored explanation covers both source turns: ${subject} case ${caseNo+1}`,async({page})=>{
   await page.goto('/learn/app/');
   if(subject==='business')await page.locator('input[name=hf93-subject][value=business]').check();
   await page.locator('#hf93-start').click();
   // Reach the requested case using the original learner workflow, never injected state.
   for(let prior=0;prior<caseNo;prior++){
    await page.locator('#hf93-answers button').nth(answers[prior]).click();
    await page.locator('#hf93-to-transfer').click();
    await page.locator('#hf93-reveal').click();
    await page.locator('#hf93-next').click();
    await expect(page.locator('#hf96-meaning-reveal')).toBeDisabled();
   }
   const seen=[];
   await page.locator('#hf95-turn-first').click();
   for(let turn=0;turn<2;turn++){
    await expect(page.locator('#hf96-meaning-reveal')).toBeEnabled();
    await page.locator('#hf96-meaning-reveal').click();
    const sample=await page.locator('#hf96-meaning-example').innerText();
    expect(sample.length).toBeGreaterThan(50);
    seen.push(sample);
    if(turn===0){await page.locator('#hf95-turn-next').click();await expect(page.locator('#hf96-meaning-example')).toBeHidden();}
   }
   expect(seen).toEqual(expectedMeaning[subject][caseNo]);
   expect(seen.length).toBe(2);
   expect(new Set(seen).size).toBe(2);
   await page.locator('#hf93-answers button').nth(answers[caseNo]).click();
   await page.locator('#hf93-to-transfer').click();
   await page.locator('#hf93-reveal').click();
   await page.locator('#hf93-next').click();
   await expect(page.locator('#hf96-meaning-reveal')).toBeDisabled();
  });
 }
}

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
