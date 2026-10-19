const { test, expect } = require('@playwright/test');

async function assertProductionRelease(page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#v1590-live-marker')).toHaveText('1.63.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-live-release', '1.63.0');
}

test.describe('EnglishLegalese v1.63.0 production acceptance', () => {
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
    expect(htmlResponse.headers()['x-englishlegalese-release']).toBe('1.63.0');
    expect(htmlResponse.headers()['cache-control']).toContain('no-cache');
    await page.screenshot({ path: testInfo.outputPath('production-homepage-v1590.png'), fullPage: true, animations: 'disabled' });
    await testInfo.attach('production-homepage-v1590', { path: testInfo.outputPath('production-homepage-v1590.png'), contentType: 'image/png' });
  });

  test('production hash navigation cannot restore rejected state', async ({ page }) => {
    await assertProductionRelease(page);
    for (const hash of ['#teachers','#courses','#language-bridge','#smartteacher','#trust','#practice-studio','#learning-plan','#skills-passport','#home']) {
      await page.evaluate(h => { window.location.hash = h; }, hash);
      await page.waitForTimeout(120);
      await expect(page.locator('#v1590-live-marker')).toHaveText('1.63.0');
      await expect(page.getByText('EnglishLegalese Team', { exact: true })).toHaveCount(0);
      await expect(page.getByText('New in v1.55', { exact: true })).toHaveCount(0);
      await expect(page.locator('#diagnostic')).toHaveCount(1);
    }
  });

  test('www production endpoint serves same current release', async ({ page }) => {
    await page.goto('https://www.englishlegalese.com/', { waitUntil: 'networkidle' });
    await page.locator('body.v1590-ready').waitFor();
    await expect(page.locator('#v1590-live-marker')).toHaveText('1.63.0');
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
