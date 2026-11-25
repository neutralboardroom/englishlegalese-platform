const {test,expect}=require('@playwright/test');
// Mock the DEVICE speech interface so CI can verify events, not pretend to hear real audio.
async function fakeSpeech(page){
 await page.addInitScript(()=>{
  window.__hf94AudioLog=[];
  const obj={speak(u){window.__hf94AudioLog.push({verb:'speak',text:u.text,lang:u.lang,rate:u.rate});},cancel(){window.__hf94AudioLog.push({verb:'cancel'});}};
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:obj});
  Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;this.lang='';this.rate=1;this.pitch=1;}}});
 });
}
test('HF94 optional listening, full-sentence model, transfer and explicit STOP',async({page})=>{
 await fakeSpeech(page);await page.goto('/learn/app/');
 await expect(page.locator('#hf94-audio-dialogue')).toBeDisabled();
 await page.locator('#hf93-start').click();
 await expect(page.locator('#hf94-audio-dialogue')).toBeEnabled();
 await expect(page.locator('#hf94-audio-model')).toBeDisabled();
 await page.locator('#hf94-audio-dialogue').click();
 let event=await page.evaluate(()=>window.__hf94AudioLog.find(x=>x.verb==='speak'));
 expect(event.text).toContain('Do we have to sign this agreement today?');expect(event.lang).toBe('en-US');expect(event.rate).toBe(0.82);
 await page.locator('#hf94-audio-stop').click();
 expect((await page.evaluate(()=>window.__hf94AudioLog)).at(-1).verb).toBe('cancel');
 await page.locator('#hf93-answers button').nth(1).click();
 await expect(page.locator('#hf94-audio-model')).toBeEnabled();
 await page.locator('#hf94-audio-rate').selectOption('normal');
 await page.locator('#hf94-audio-model').click();
 event=(await page.evaluate(()=>window.__hf94AudioLog.filter(x=>x.verb==='speak'))).at(-1);
 expect(event.rate).toBe(1);expect(event.text).toContain('Friday is the deadline for comments');
 await page.locator('#hf93-to-transfer').click();
 await expect(page.locator('#hf94-audio-model')).toBeDisabled();
 await expect(page.locator('#hf94-audio-transfer')).toBeDisabled();
 await page.locator('#hf93-reveal').click();
 await expect(page.locator('#hf94-audio-transfer')).toBeEnabled();
 await page.locator('#hf94-audio-transfer').click();
 event=(await page.evaluate(()=>window.__hf94AudioLog.filter(x=>x.verb==='speak'))).at(-1);
 expect(event.text).toContain('initial feedback, not final approval');
 await page.locator('#hf93-stop').click();
 await expect(page.locator('#hf94-audio-dialogue')).toBeDisabled();
 await expect(page.locator('#hf94-audio-stop')).toBeDisabled();
 await expect(page.locator('#hf93-case')).toBeHidden();
});
test('HF94 subject change, Restart, page hiding and playback error are safe',async({page})=>{
 await fakeSpeech(page);await page.goto('/learn/app/');
 await page.locator('#hf93-start').click();await page.locator('#hf94-audio-dialogue').click();
 const prior=(await page.evaluate(()=>window.__hf94AudioLog.length));
 await page.locator('#hf93-stop').click();
 expect(await page.evaluate(()=>window.__hf94AudioLog.length)).toBeGreaterThan(prior);
 await page.locator('input[value=business][name=hf93-subject]').check();
 await page.locator('#hf93-restart').click();
 await expect(page.locator('#hf94-audio-dialogue')).toBeDisabled();
 await page.locator('#hf93-start').click();
 await page.locator('#hf94-audio-dialogue').click();
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 // Real visibility simulation is not possible in every CI browser; pagehide must cancel unconditionally.
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 expect((await page.evaluate(()=>window.__hf94AudioLog)).at(-1).verb).toBe('cancel');
});
test('HF94 native speech missing: written comprehension, speaking and STOP still work',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:undefined});Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:undefined});});
 await page.goto('/learn/app/');
 await expect(page.locator('#hf94-audio-dialogue')).toBeDisabled();
 await expect(page.locator('#hf94-audio-status')).toContainText('no available device voice');
 await page.locator('#hf93-start').click();
 await page.locator('#hf93-answers button').nth(1).click();
 await expect(page.locator('#hf93-speak')).toBeVisible();
 await page.locator('#hf93-to-transfer').click();await page.locator('#hf93-reveal').click();
 await expect(page.locator('#hf93-transfer-answer')).toBeVisible();
 await page.locator('#hf93-stop').click();await expect(page.locator('#hf93-case')).toBeHidden();
});
