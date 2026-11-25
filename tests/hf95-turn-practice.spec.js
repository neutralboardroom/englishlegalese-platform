const {test,expect}=require('@playwright/test');
async function fakeVoice(page){await page.addInitScript(()=>{
 window.__hf95Log=[];
 Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{speak(u){window.__hf95Log.push({verb:'speak',text:u.text,rate:u.rate,lang:u.lang});},cancel(){window.__hf95Log.push({verb:'cancel'});}}});
 Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:class{constructor(text){this.text=text;this.lang='';this.rate=1;this.pitch=1;}}});
});}

test('HF95 one-turn listening is speaker-sentence only, manually paced, reversible, independent of comprehension',async({page})=>{
 await fakeVoice(page);await page.goto('/learn/app/');
 await expect(page.locator('#hf95-turn-first')).toBeDisabled();
 await page.locator('#hf93-start').click();
 await expect(page.locator('#hf95-turn-first')).toBeEnabled();
 await page.locator('#hf95-turn-first').click();
 await expect(page.locator('#hf95-turn-text')).toContainText('Do we have to sign this agreement today?');
 await expect(page.locator('#hf95-turn-next')).toBeEnabled();
 await expect(page.locator('#hf95-turn-back')).toBeDisabled();
 await page.locator('#hf95-turn-listen').click();
 let audio=await page.evaluate(()=>window.__hf95Log.filter(x=>x.verb==='speak').at(-1));
 expect(audio.text).toBe('Do we have to sign this agreement today?');
 expect(audio.lang).toBe('en-US');expect(audio.rate).toBe(.82);
 await page.locator('#hf95-turn-next').click();
 expect((await page.evaluate(()=>window.__hf95Log)).at(-1).verb).toBe('cancel');
 await expect(page.locator('#hf95-turn-text')).toContainText('The draft asks for comments by Friday');
 await expect(page.locator('#hf95-turn-next')).toBeDisabled();
 await page.locator('#hf95-turn-listen').click();
 audio=await page.evaluate(()=>window.__hf95Log.filter(x=>x.verb==='speak').at(-1));
 expect(audio.text).not.toContain('Lawyer:');expect(audio.text).toContain('Not today.');
 await page.locator('#hf95-turn-back').click();
 await expect(page.locator('#hf95-turn-text')).toContainText('Do we have to sign this agreement today?');
 await page.locator('#hf93-answers button').nth(1).click();
 await expect(page.locator('#hf93-speak')).toBeVisible();
 await page.locator('#hf94-audio-model').click();
 const model=await page.evaluate(()=>window.__hf95Log.filter(x=>x.verb==='speak').at(-1));
 expect(model.text).toContain('Friday is the deadline for comments');
 await page.locator('#hf93-to-transfer').click();
 await page.locator('#hf93-reveal').click();
 await expect(page.locator('#hf94-audio-transfer')).toBeEnabled();
 await page.locator('#hf93-stop').click();
 await expect(page.locator('#hf95-turn-text')).toBeHidden();
 await expect(page.locator('#hf95-turn-first')).toBeDisabled();
});

test('HF95 text-only turn practice still works when native voice is unavailable',async({page})=>{
 await page.addInitScript(()=>{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:undefined});Object.defineProperty(window,'SpeechSynthesisUtterance',{configurable:true,value:undefined});});
 await page.goto('/learn/app/');await page.locator('#hf93-start').click();
 await page.locator('#hf95-turn-first').click();
 await expect(page.locator('#hf95-turn-text')).toContainText('Client:');
 await expect(page.locator('#hf95-turn-listen')).toBeDisabled();
 await page.locator('#hf95-turn-next').click();
 await expect(page.locator('#hf95-turn-text')).toContainText('Lawyer:');
 await page.locator('#hf93-answers button').nth(1).click();
 await expect(page.locator('#hf93-speak')).toBeVisible();
 await page.locator('#hf93-stop').click();await expect(page.locator('#hf95-turn-text')).toBeHidden();
});

test('HF95 STOP, next conversation, subject changes and pagehide invalidate stale turn practice and speech',async({page})=>{
 await fakeVoice(page);await page.goto('/learn/app/');
 await page.locator('#hf93-start').click();await page.locator('#hf95-turn-first').click();await page.locator('#hf95-turn-listen').click();
 await page.locator('#hf93-stop').click();await expect(page.locator('#hf95-turn-text')).toBeHidden();
 await page.locator('input[name=hf93-subject][value=business]').check();await page.locator('#hf93-start').click();
 await page.locator('#hf95-turn-first').click();await expect(page.locator('#hf95-turn-text')).toContainText('Manager:');
 await page.locator('#hf93-answers button').nth(1).click();await page.locator('#hf93-to-transfer').click();await page.locator('#hf93-reveal').click();await page.locator('#hf93-next').click();
 await expect(page.locator('#hf95-turn-text')).toBeHidden();await page.locator('#hf95-turn-first').click();
 await expect(page.locator('#hf95-turn-text')).toContainText('Chair:');
 await page.locator('#hf95-turn-listen').click();await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 await expect(page.locator('#hf95-turn-text')).toBeHidden();
 expect((await page.evaluate(()=>window.__hf95Log)).at(-1).verb).toBe('cancel');
});
