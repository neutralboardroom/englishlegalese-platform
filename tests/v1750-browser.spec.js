const {test,expect}=require('@playwright/test');
async function openLab(page){
 await page.goto('/#listening-clarification-lab');
 await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#listening-clarification-lab')).toBeVisible();
}
test('v1.75 listening lab opens from original footer without changing homepage or logo',async({page})=>{
 await page.goto('/');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#listening-clarification-lab')).toBeHidden();
 await expect(page.locator('.site-footer a[href="/learn/listening-clarification/"]')).toHaveCount(1);
 await page.locator('.site-footer #v1770-all-resources summary').click();
 await expect(page.locator('.site-footer a[href="/learn/listening-clarification/"]')).toBeVisible();
 await page.locator('.site-footer a[href="/learn/listening-clarification/"]').click();
 await expect(page).toHaveURL(/\/learn\/listening-clarification\/$/);
 await expect(page.getByRole('heading',{name:'Free Listening & Clarification Lab',exact:true})).toBeVisible();
 await page.goto('/#listening-clarification-lab');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#listening-clarification-lab')).toBeVisible();
 await expect(page.locator('#home')).toBeHidden();
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.84.0');
 await expect(page.locator('.site-header .brand img')).toBeVisible();
 await expect(page.getByRole('heading',{name:'Hear the distinction. Ask the right follow-up.'})).toBeVisible();
});
test('v1.75 transcript is optional accessible and resettable across all three fictional cases',async({page})=>{
 await openLab(page);const lab=page.locator('#listening-clarification-lab');
 for(const [id,word] of [['intake','receipt'],['meeting','target'],['contract','supplier']]){
  await lab.locator('#v1750-case').selectOption(id);
  await expect(lab.locator('#v1750-transcript')).toBeHidden();
  await lab.getByRole('button',{name:'Show transcript'}).click();
  await expect(lab.locator('#v1750-transcript')).toBeVisible();
  await expect(lab.locator('#v1750-transcript')).toContainText(word,{ignoreCase:true});
  await expect(lab.locator('.v1750-question')).toHaveCount(3);
  await lab.getByRole('button',{name:'Hide transcript'}).click();
  await expect(lab.locator('#v1750-transcript')).toBeHidden();
 }
});
test('v1.75 comprehension explains uncertainty and invalidates changed answers',async({page})=>{
 await openLab(page);const lab=page.locator('#listening-clarification-lab');
 await lab.getByRole('button',{name:'Check my answers'}).click();
 await expect(lab.locator('.v1750-feedback')).toContainText('Answer all three questions');
 for(const [i,choice] of [[0,1],[1,0],[2,2]]) await lab.locator('input[name="answer-'+i+'"][value="'+choice+'"]').check();
 await lab.getByRole('button',{name:'Check my answers'}).click();
 await expect(lab.locator('.v1750-feedback')).toContainText('3 of 3');
 await expect(lab.locator('.v1750-explanations li')).toHaveCount(3);
 await lab.locator('input[name="answer-0"][value="0"]').check();
 await expect(lab.locator('.v1750-reasons')).toBeHidden();
 await lab.getByRole('button',{name:'Check my answers'}).click();
 await expect(lab.locator('.v1750-feedback')).toContainText('2 of 3');
 await lab.getByRole('button',{name:'Start this conversation again'}).click();
 await expect(lab.locator('.v1750-reasons')).toBeHidden();
 await expect(lab.locator('input[name="answer-0"]:checked')).toHaveCount(0);
});
test('v1.75 browser voice unavailable falls back to transcript',async({page})=>{
 await page.addInitScript(()=>{try{Object.defineProperty(window,'speechSynthesis',{configurable:true,value:undefined});}catch(_){}});
 await openLab(page);const lab=page.locator('#listening-clarification-lab');
 await lab.getByRole('button',{name:'Play conversation',exact:true}).click();
 await expect(lab.locator('.v1750-audio-status')).toContainText('unavailable');
 await lab.getByRole('button',{name:'Show transcript'}).click();
 await expect(lab.locator('#v1750-transcript')).toBeVisible();
});
test('v1.75 voice start/stop and slow playback use only user gesture',async({page})=>{
 await page.addInitScript(()=>{
  window.__v1750SpeechCalls=[];
  window.SpeechSynthesisUtterance=function(t){this.text=t;this.rate=1;};
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{
   speak(u){window.__v1750SpeechCalls.push(['speak',u.text,u.rate]);},
   cancel(){window.__v1750SpeechCalls.push(['cancel']);}
  }});
 });
 await openLab(page);const lab=page.locator('#listening-clarification-lab');
 let calls=await page.evaluate(()=>window.__v1750SpeechCalls);
 expect(calls.filter(x=>x[0]==='speak')).toHaveLength(0);
 await lab.getByRole('button',{name:'Play conversation',exact:true}).click();
 await lab.getByRole('button',{name:'Play more slowly'}).click();
 await lab.getByRole('button',{name:'Stop playback'}).click();
 calls=await page.evaluate(()=>window.__v1750SpeechCalls);
 const spoken=calls.filter(x=>x[0]==='speak');
 expect(spoken).toHaveLength(2);
 expect(spoken[0][2]).toBeGreaterThan(spoken[1][2]);
 expect(spoken[0][1]).toContain('receipt');
 expect(calls[calls.length-1][0]).toBe('cancel');
});
test('v1.75 no user responses are transmitted or persisted across reloads',async({page})=>{
 const posts=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))posts.push(r.url());});
 await openLab(page);const lab=page.locator('#listening-clarification-lab');
 await lab.locator('input[name="answer-0"][value="1"]').check();
 await page.reload();await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('input[name="answer-0"]:checked')).toHaveCount(0);
 expect(posts).toEqual([]);
});
