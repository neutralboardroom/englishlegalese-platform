const { test, expect } = require('@playwright/test');

async function assertProductionRelease(page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#v1590-live-marker')).toHaveText('1.65.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-live-release', '1.65.0');
}

test.describe('EnglishLegalese v1.65.0 production acceptance', () => {
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

    const h=await page.evaluate(()=>document.documentElement.scrollHeight);
    expect(h).toBeLessThan(testInfo.project.name==='production-mobile'?9500:7000);
    const htmlResponse=await page.request.get('/');
    expect(htmlResponse.headers()['x-englishlegalese-release']).toBe('1.65.0');
    expect(htmlResponse.headers()['cache-control']).toContain('no-cache');
    await page.screenshot({ path: testInfo.outputPath('production-homepage-v1590.png'), fullPage: true, animations: 'disabled' });
    await testInfo.attach('production-homepage-v1590', { path: testInfo.outputPath('production-homepage-v1590.png'), contentType: 'image/png' });
  });

  test('production hash navigation cannot restore rejected state', async ({ page }) => {
    await assertProductionRelease(page);
    for (const hash of ['#teachers','#courses','#language-bridge','#smartteacher','#trust','#practice-studio','#learning-plan','#skills-passport','#home']) {
      await page.evaluate(h => { window.location.hash = h; }, hash);
      await page.waitForTimeout(120);
      await expect(page.locator('#v1590-live-marker')).toHaveText('1.65.0');
      await expect(page.getByText('EnglishLegalese Team', { exact: true })).toHaveCount(0);
      await expect(page.getByText('New in v1.55', { exact: true })).toHaveCount(0);
      await expect(page.locator('#diagnostic')).toHaveCount(1);
    }
  });

  test('www production endpoint serves same current release', async ({ page }) => {
    await page.goto('https://www.englishlegalese.com/', { waitUntil: 'networkidle' });
    await page.locator('body.v1590-ready').waitFor();
    await expect(page.locator('#v1590-live-marker')).toHaveText('1.65.0');
    await expect(page.getByRole('heading', { name: 'Clear English for legal work.' })).toBeVisible();
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
 await expect(page.getByRole('heading',{name:'Clear English for legal work.'})).toBeVisible();
 await expect(page.locator('.hero-example.improved p')).toBeVisible();
 await expect(page.locator('.hero-logo')).toHaveCount(0);
 expect(await page.locator('.hero-actions .btn').count()).toBe(2);
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
