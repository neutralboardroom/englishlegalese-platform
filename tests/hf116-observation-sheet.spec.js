'use strict';
const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
test.use({serviceWorkers:'block'});
test('HF116 fictional teacher sheet download, reset and existing guided flow',async({page,context})=>{
 test.setTimeout(60000);
 await page.goto('/learn/study-planner/');const p=page.locator('#hf111-workplace-preview'),s=p.locator('#hf116-sheet');
 const before=await page.evaluate(()=>JSON.stringify([localStorage,sessionStorage])),writes=[];page.on('request',r=>{if(['POST','PUT','PATCH','DELETE'].includes(r.method()))writes.push(r.url());});
 await p.locator('#hf111-scenario').selectOption('energy');await p.locator('#hf111-audience').selectOption('client');await p.locator('#hf116-prepare').click();await expect(s).toContainText('inspection is due');await expect(s).toContainText('No learner information');
 const downloadEvent=page.waitForEvent('download');await p.locator('#hf116-download').click();const download=await downloadEvent;expect(download.suggestedFilename()).toBe('EnglishLegalese-fictional-observation-sheet.html');const html=fs.readFileSync(await download.path(),'utf8');expect(html).toContain('Teacher observation sheet');expect(html).not.toMatch(/<(script|iframe|input|form)\b/i);expect(html.match(/scope="row"/g)).toHaveLength(6);expect(html).not.toContain('The agreement requires delivery within ten days of written notice. Could you clarify');
 const view=await context.newPage();await view.setContent(html);await expect(view.locator('tbody tr')).toHaveCount(6);await view.close();
 await p.locator('#hf111-scenario').selectOption('finance');await expect(s).toBeHidden();await p.locator('#hf116-prepare').click();await expect(s).toContainText('forecast revenue');await p.locator('#hf116-clear').click();await expect(s).toBeHidden();
 await p.locator('#hf116-prepare').click();await p.locator('#hf111-reset').click();await expect(s).toBeHidden();await p.locator('#hf112-start').click();await expect(p.locator('#hf112-guided')).toBeVisible();await p.locator('#hf112-stop').click();
 expect(await page.evaluate(()=>JSON.stringify([localStorage,sessionStorage]))).toBe(before);expect(writes).toEqual([]);expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(4);
});
