const { test, expect } = require('@playwright/test');

async function assertProductionRelease(page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#v1590-live-marker')).toHaveText('1.76.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-live-release', '1.76.0');
}

test.describe('EnglishLegalese v1.73.0 production acceptance', () => {
  test('apex production renders corrected owner-visible homepage', async ({ page }, testInfo) => {
    await assertProductionRelease(page);

    const forbidden = [
      'EnglishLegalese Team',
      'Open staff view',
      'New in v1.55',
      'NEW IN V1.55',
      'Launch course set',
      'LAUNCH COURSE SET',
      'EnglishLegalese should not promise perfect static translation of every page.',
      'Safety line:',
      'track payout status'
    ];
    for (const phrase of forbidden) await expect(page.getByText(phrase, { exact: false })).toHaveCount(0);

    await expect(page.locator('#diagnostic')).toBeHidden();
    await expect(page.locator('#diagnostic .v1580-diagnostic-shell')).toBeHidden();
    expect(await page.locator('#courses article:visible').count()).toBe(3);
    expect(await page.locator('#practice-studio .v1550-scenario-card').count()).toBe(21);
    expect(await page.locator('#practice-studio .v1550-scenario-card:visible').count()).toBe(0);
    await expect(page.locator('#learning-plan .v1550-plan-builder')).toBeHidden();
    await expect(page.locator('#skills-passport .v1550-passport-grid')).toBeHidden();

    const logoBox = await page.locator('.site-header .brand img').boundingBox();
    expect(logoBox).not.toBeNull();
    const minLogo = testInfo.project.name === 'production-mobile' ? 100 : testInfo.project.name === 'production-tablet' ? 120 : 175;
    expect(logoBox.width).toBeGreaterThanOrEqual(minLogo);

    const explore = page.getByRole('link', { name: 'Explore courses' }).first();
    const colors = await explore.evaluate(el => ({color:getComputedStyle(el).color, background:getComputedStyle(el).backgroundColor}));
    expect(colors.color).not.toBe('rgb(255, 255, 255)');
    expect(colors.color).not.toBe(colors.background);

    // Preserve a bounded rendered-page height after 28 courses, transparent pricing and a new independent study planner.
    const h=await page.evaluate(()=>document.documentElement.scrollHeight);
    expect(h).toBeLessThan(testInfo.project.name==='production-mobile'?26000:19000);
    const htmlResponse=await page.request.get('/');
    expect(htmlResponse.headers()['x-englishlegalese-release']).toBe('1.84.0');
    expect(htmlResponse.headers()['cache-control']).toContain('no-cache');
    await page.screenshot({ path: testInfo.outputPath('production-homepage-v1590.png'), fullPage: true, animations: 'disabled' });
    await testInfo.attach('production-homepage-v1590', { path: testInfo.outputPath('production-homepage-v1590.png'), contentType: 'image/png' });
  });

  test('production hash navigation cannot restore rejected state', async ({ page }) => {
    await assertProductionRelease(page);
    for (const hash of ['#teachers','#courses','#language-bridge','#smartteacher','#trust','#practice-studio','#learning-plan','#skills-passport','#home']) {
      await page.evaluate(h => { window.location.hash = h; }, hash);
      await page.waitForTimeout(120);
      await expect(page.locator('#v1590-live-marker')).toHaveText('1.76.0');
      await expect(page.getByText('EnglishLegalese Team', { exact: true })).toHaveCount(0);
      await expect(page.getByText('New in v1.55', { exact: true })).toHaveCount(0);
      await expect(page.locator('#diagnostic')).toHaveCount(1);
    }
  });

  test('www production endpoint serves same current release', async ({ page }) => {
    await page.goto('https://www.englishlegalese.com/', { waitUntil: 'networkidle' });
    await page.locator('body.v1590-ready').waitFor();
    await expect(page.locator('#v1590-live-marker')).toHaveText('1.76.0');
    await expect(page.getByRole('heading', { name: 'Legal English with AI-supported practice and live online classes with human teachers.' })).toBeVisible();
    await expect(page.getByText('EnglishLegalese Team', { exact: true })).toHaveCount(0);
  });
});

test('production focused practice retains all 21 scenarios and diagnostic',async({page})=>{await assertProductionRelease(page);await page.evaluate(()=>location.hash='#practice-studio');await expect(page.locator('#elFocusToolbar')).toBeVisible();await expect(page.locator('#practice-studio .v1550-scenario-card:visible')).toHaveCount(6);await page.locator('.js-v1590-scenarios').click();await expect(page.locator('.js-v1590-scenarios')).toHaveAttribute('aria-expanded','true');await expect(page.locator('#practice-studio .v1550-scenario-card:visible')).toHaveCount(21);await page.evaluate(()=>location.hash='#diagnostic');await expect(page.locator('#diagnostic .v1580-diagnostic-form')).toBeVisible();await page.locator('#elFocusToolbar a').click();await expect(page.locator('#home')).toBeVisible();});

test('production header shows approved large logo with restrained first screen',async({page},testInfo)=>{
 await assertProductionRelease(page);
 const wrap=page.locator('.site-header .brand');const img=wrap.locator('img');const box=await wrap.boundingBox();const ib=await img.boundingBox();
 expect(box).not.toBeNull();expect(ib).not.toBeNull();
 expect(box.width).toBeGreaterThanOrEqual(testInfo.project.name==='production-mobile'?165:200);
 expect(box.height).toBeGreaterThanOrEqual(testInfo.project.name==='production-mobile'?85:100);
 expect(ib.height).toBeGreaterThanOrEqual(testInfo.project.name==='production-mobile'?160:200);
 await expect(page.getByRole('heading',{name:'Legal English with AI-supported practice and live online classes with human teachers.'})).toBeVisible();
 await expect(page.locator('.hero-example.improved p')).toBeVisible();
 await expect(page.locator('.hero-logo')).toHaveCount(0);
 expect(await page.locator('.hero-actions .btn').count()).toBe(3);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);expect(overflow).toBeLessThanOrEqual(1);
});


test('production mobile menu and learning-prompt preparation work on the real site',async({page})=>{
  await assertProductionRelease(page);
  await page.setViewportSize({width:390,height:844});
  const toggle=page.locator('#navToggle');
  await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Escape');await expect(toggle).toHaveAttribute('aria-expanded','false');
  await page.evaluate(()=>location.hash='#smartteacher');
  await expect(page.locator('#smartteacher')).toBeVisible();
  await page.locator('#el-practice-topic').fill('Fictional contract update');
  await page.getByRole('button',{name:'Prepare writing review'}).click();
  await expect(page.locator('.js-ai-output')).toContainText('WRITING REVIEW');
  await expect(page.locator('.js-ai-output')).toContainText('Fictional contract update');
  await expect(page.locator('.js-copy-practice')).toBeVisible();
  await expect(page.locator('#smartteacher')).toContainText('does not send text to an AI service');
});

test('live site private writing workout opens and completes three learning steps without storing drafts',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#quick-practice')).toBeHidden();
  await page.locator('.v1630-hero-link').click();
  await expect(page.locator('#quick-practice')).toBeVisible();
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 1 of 3');
  await page.locator('#v1630-answer-0').fill('Fictional follow-up.');
  await page.getByRole('button',{name:'Show model example and checklist'}).click();
  await expect(page.locator('#v1630-model-0')).toBeVisible();
  await page.getByRole('button',{name:'Next exercise'}).click();
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 2 of 3');
  await page.getByRole('button',{name:'Next exercise'}).click();
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 3 of 3');
  await page.getByRole('button',{name:'Clear drafts and restart'}).click();
  await expect(page.locator('#v1630-answer-0')).toHaveValue('');
  await expect(page.locator('#quick-practice .v1630-step:visible')).toHaveCount(1);
});

test('real production diagnostic explains all eight answers and opens the matching private writing lesson',async({page})=>{
  await assertProductionRelease(page);
  await page.evaluate(()=>location.hash='#diagnostic');
  await expect(page.locator('.v1580-diagnostic-form')).toBeVisible();
  const answers=[1,1,0,1,1,2,1,0];
  for(let i=0;i<8;i++)await page.locator('input[name="v1580-q'+i+'"][value="'+answers[i]+'"]').check();
  await page.getByRole('button',{name:'Get my practice recommendation'}).click();
  await expect(page.locator('.v1580-result')).toContainText('7 of 8');
  await expect(page.locator('.v1640-review-item')).toHaveCount(8);
  await page.locator('.v1640-review summary').click();
  await expect(page.locator('.v1640-review')).toHaveAttribute('open','');
  await expect(page.locator('.v1640-review-item').nth(2)).toContainText('Stronger option');
  await page.locator('.v1640-next-action').click();
  await expect(page.locator('#quick-practice')).toBeVisible();
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 3 of 3');
});

test('live production AI draft review lab teaches 3 fictional cases without storing user content',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#ai-review-lab')).toBeHidden();
  await page.evaluate(()=>location.hash='#ai-review-lab');
  const lab=page.locator('#ai-review-lab');
  await expect(lab).toBeVisible();
  await expect(lab.locator('.v1650-case')).toHaveCount(3);
  const first=lab.locator('.v1650-case').first();
  await first.locator('input[value="0"]').check();
  await first.locator('.v1650-rewrite').fill('Use fictional details and verify the source.');
  await first.getByRole('button',{name:'Compare my choice'}).click();
  await expect(first.locator('.v1650-guidance')).toBeVisible();
  await expect(lab.locator('.v1650-progress')).toContainText('Reviewed 1 of 3');
  await lab.getByRole('button',{name:'Clear all three exercises'}).click();
  await expect(first.locator('.v1650-rewrite')).toHaveValue('');
  await expect(first.locator('.v1650-guidance')).toBeHidden();
  await expect(lab.locator('.v1650-progress')).toContainText('Reviewed 0 of 3');
});


test('live production fictional clause-reading comprehension works privately',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#clause-reading-lab')).toBeHidden();
  await page.evaluate(()=>location.hash='#clause-reading-lab');
  const lab=page.locator('#clause-reading-lab');
  await expect(lab).toBeVisible();
  await expect(lab.locator('.v1660-case')).toHaveCount(3);
  await expect(lab.locator('.v1660-progress')).toContainText('Reviewed 0 of 3');
  const first=lab.locator('.v1660-case').first();
  await first.locator('input[value="1"]').check();
  await first.getByRole('button',{name:'Compare my reading'}).click();
  await expect(first.locator('.v1660-feedback')).toContainText('five calendar days');
  await expect(lab.locator('.v1660-progress')).toContainText('Reviewed 1 of 3');
  await lab.getByRole('button',{name:'Clear all reading exercises'}).click();
  await expect(lab.locator('.v1660-progress')).toContainText('Reviewed 0 of 3');
  await expect(lab.locator('input[type="radio"]:checked')).toHaveCount(0);
  await expect(lab).toContainText('not sent or saved');
});


test('production meeting follow-up lab preserves next steps and clears private drafts',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#meeting-followup-lab')).toBeHidden();
  await page.evaluate(()=>location.hash='#meeting-followup-lab');
  const lab=page.locator('#meeting-followup-lab');
  await expect(lab).toBeVisible();
  await expect(lab.locator('.v1670-case')).toHaveCount(3);
  const first=lab.locator('.v1670-case').first();
  await first.locator('input[value="1"]').check();
  await first.locator('.v1670-followup').fill('Please confirm the fictional memo date.');
  await first.getByRole('button',{name:'Compare my follow-up'}).click();
  await expect(first.locator('.v1670-feedback')).toContainText('“Soon” does not identify a usable deadline');
  await expect(lab.locator('.v1670-progress')).toContainText('Reviewed 1 of 3');
  await lab.getByRole('button',{name:'Clear all meeting exercises'}).click();
  await expect(first.locator('.v1670-followup')).toHaveValue('');
  await expect(lab.locator('.v1670-progress')).toContainText('Reviewed 0 of 3');
  await expect(lab.locator('input[type="radio"]:checked')).toHaveCount(0);
  await expect(lab).toContainText('not save or transmit');
});


test('live production fictional email clarity practice reviews accurately and removes drafts',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#email-clarity-lab')).toBeHidden();
  await page.evaluate(()=>location.hash='#email-clarity-lab');
  const lab=page.locator('#email-clarity-lab');
  await expect(lab).toBeVisible();
  await expect(lab.locator('.v1680-case')).toHaveCount(3);
  const first=lab.locator('.v1680-case').first();
  await first.locator('input[value="1"]').check();
  await first.locator('.v1680-draft').fill('Please clarify the timeline for our fictional document.');
  await first.getByRole('button',{name:'Review this email'}).click();
  await expect(first.locator('.v1680-feedback')).toContainText('“ASAP”');
  await expect(lab.locator('.v1680-progress')).toContainText('Reviewed 1 of 3');
  await lab.getByRole('button',{name:'Clear all email exercises'}).click();
  await expect(first.locator('.v1680-draft')).toHaveValue('');
  await expect(lab.locator('.v1680-progress')).toContainText('Reviewed 0 of 3');
  await expect(lab.locator('input[type="radio"]:checked')).toHaveCount(0);
  await expect(lab).toContainText('not transmitted or saved');
});

test('live guided practice uses actual lab destinations and clears self-checkmarks',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#guided-practice-path')).toBeHidden();
  await page.evaluate(()=>location.hash='#guided-practice-path');
  const guide=page.locator('#guided-practice-path');
  await expect(guide).toBeVisible();
  await expect(guide.locator('input[name="v1690-goal"]')).toHaveCount(4);
  await guide.locator('input[value="writing"]').check();
  await expect(guide.locator('.v1690-steps a')).toHaveCount(3);
  await expect(guide.locator('.v1690-steps a').first()).toHaveAttribute('href','#email-clarity-lab');
  await guide.locator('.v1690-tried').first().check();
  await expect(guide.locator('.v1690-count')).toContainText('1 of 3');
  await guide.locator('input[value="reading"]').check();
  await expect(guide.locator('.v1690-count')).toContainText('0 of 3');
  await guide.locator('.v1690-steps a').first().click();
  await expect(page.locator('#clause-reading-lab')).toBeVisible();
  await page.evaluate(()=>location.hash='#guided-practice-path');
  await guide.getByRole('button',{name:'Clear my temporary plan'}).click();
  await expect(guide.locator('.v1690-results')).toBeHidden();
});

test('live production fictional case-brief practice explains status and clears private writing',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#case-brief-lab')).toBeHidden();
  await page.evaluate(()=>location.hash='#case-brief-lab');
  const lab=page.locator('#case-brief-lab');
  await expect(lab).toBeVisible();
  await expect(lab.locator('.v1700-case')).toHaveCount(3);
  const first=lab.locator('.v1700-case').first();
  await first.locator('input[value="2"]').check();
  await first.locator('.v1700-draft').fill('This is an allegation, not a final fact.');
  await first.getByRole('button',{name:'Compare my reading'}).click();
  await expect(first.locator('.v1700-feedback')).toContainText('A disputed allegation is not a finding');
  await expect(lab.locator('.v1700-progress')).toContainText('Reviewed 1 of 3');
  await lab.getByRole('button',{name:'Clear all case-brief exercises'}).click();
  await expect(first.locator('.v1700-draft')).toHaveValue('');
  await expect(lab.locator('.v1700-progress')).toContainText('Reviewed 0 of 3');
  await expect(lab.locator('input[type="radio"]:checked')).toHaveCount(0);
  await expect(lab).toContainText('are not sent or saved');
});

test('live vocabulary guide searches educational words safely across topics and clears filters',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#legal-vocabulary-guide')).toBeHidden();
  await page.evaluate(()=>location.hash='#legal-vocabulary-guide');
  const guide=page.locator('#legal-vocabulary-guide');
  await expect(guide).toBeVisible();
  await expect(guide.locator('.v1710-term:visible')).toHaveCount(18);
  const search=guide.getByRole('searchbox',{name:'Search a word or example'});
  await search.fill('zz-no-matches-xx');
  await expect(guide.locator('.v1710-term:visible')).toHaveCount(0);
  await expect(guide.locator('.v1710-empty')).toBeVisible();
  await guide.getByRole('button',{name:'Clear vocabulary filters'}).click();
  await expect(guide.locator('.v1710-term:visible')).toHaveCount(18);
  await guide.getByLabel('Choose a learning topic').selectOption('1');
  await expect(guide.locator('.v1710-term:visible')).toHaveCount(5);
  await expect(guide.locator('.v1710-term:visible').first()).toContainText('Allege');
  await expect(guide).toContainText('Searching does not upload, send or save what you type');
});

test('live revision studio compares material words and clears editable confidential-free drafts',async({page})=>{
  await assertProductionRelease(page);
  await expect(page.locator('#revision-studio')).toBeHidden();
  await page.evaluate(()=>location.hash='#revision-studio');
  const s=page.locator('#revision-studio');
  await expect(s).toBeVisible();await expect(s.locator('#v1720-case option')).toHaveCount(6);
  await s.getByRole('button',{name:'Compare wording'}).click();
  await expect(s.locator('.v1720-removed')).toContainText('must');
  await expect(s.locator('.v1720-added')).toContainText('may');
  await s.locator('.v1720-checkbox').first().check();
  await expect(s.locator('.v1720-count')).toContainText('1 of 4');
  await s.locator('#v1720-case').selectOption('custom');
  await s.locator('#v1720-before').fill('An invented request after approval.');
  await s.locator('#v1720-after').fill('An invented request before approval.');
  await s.getByRole('button',{name:'Compare wording'}).click();
  await expect(s.locator('.v1720-added')).toContainText('before');
  await s.getByRole('button',{name:'Clear both texts'}).click();
  await expect(s.locator('#v1720-before')).toHaveValue('');
  await expect(s.locator('.v1720-result')).toBeHidden();
});

test('live three-reply verified free trial is securely closed until database and mail ready',async({page,request})=>{
  await assertProductionRelease(page);
  await page.evaluate(()=>location.hash='#smartteacher-free-trial');
  const t=page.locator('#smartteacher-free-trial');await expect(t).toBeVisible();
  await expect(t.locator('.v1730-readiness')).toContainText('secure account storage');
  await expect(t.locator('.v1730-register button')).toBeDisabled();
  const status=await request.get('https://englishlegalese.com/api/v173/trial/capabilities');
  expect(status.status()).toBe(200);const info=await status.json();
  expect(info.trial_available).toBe(false);expect(info.free_replies).toBe(3);
  const blocked=await request.post('https://englishlegalese.com/api/v119/payments/create-checkout',{data:{amount_cents:1200}});
  expect(blocked.status()).toBe(503);
  const security=await request.get('https://englishlegalese.com/src/productionServices.js');
  expect(security.status()).toBe(404);
});
