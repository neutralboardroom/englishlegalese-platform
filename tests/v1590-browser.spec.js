const { test, expect } = require('@playwright/test');

async function waitForRecovery(page) {
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#v1590-live-marker')).toHaveText('1.62.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-live-release', '1.62.0');
}

test.describe('EnglishLegalese v1.62.0 hard live recovery', () => {
  test('old public homepage state cannot reappear after navigation', async ({ page }) => {
    await page.goto('/');
    await waitForRecovery(page);

    const forbidden = [
      'EnglishLegalese Team',
      'Open staff view',
      'NEW IN V1.55',
      'New in v1.55',
      'LAUNCH COURSE SET',
      'Launch course set',
      'The full catalog can grow later. Public launch should start with a small set of clear paths.',
      'EnglishLegalese should not promise perfect static translation of every page.',
      'Safety line:',
      'future teacher-confirmed assessment',
      'track payout status'
    ];
    for (const phrase of forbidden) {
      await expect(page.getByText(phrase, { exact: false })).toHaveCount(0);
    }

    await expect(page.locator('#diagnostic')).toBeHidden();
    await page.evaluate(()=>location.hash='#diagnostic');
    await expect(page.locator('#diagnostic')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Find your best Legal English practice starting point.' })).toBeVisible();
    await page.evaluate(()=>location.hash='#home');

    for (const hash of ['#teachers','#courses','#language-bridge','#smartteacher','#trust','#practice-studio','#learning-plan','#skills-passport','#home']) {
      await page.evaluate(h => { window.location.hash = h; }, hash);
      await page.waitForTimeout(80);
      await waitForRecovery(page);
      await expect(page.getByText('EnglishLegalese Team', { exact: true })).toHaveCount(0);
      await expect(page.getByText('New in v1.55', { exact: true })).toHaveCount(0);
      await expect(page.locator('#diagnostic')).toHaveCount(1);
    }
  });

  test('long homepage content is truly collapsed in DOM until requested', async ({ page }) => {
    await page.goto('/');
    await waitForRecovery(page);

    await expect(page.locator('#adaptive-learning')).toHaveCount(0);

    const courseCards = page.locator('#courses article');
    expect(await courseCards.count()).toBeGreaterThanOrEqual(9);
    expect(await page.locator('#courses article:visible').count()).toBe(3);

    const scenarios = page.locator('#practice-studio .v1550-scenario-card');
    expect(await scenarios.count()).toBe(21);
    expect(await page.locator('#practice-studio .v1550-scenario-card:visible').count()).toBe(0);
    await expect(page.locator('#practice-studio .v1550-filters')).toBeHidden();

    await expect(page.locator('#learning-plan .v1550-plan-builder')).toBeHidden();
    await expect(page.locator('#skills-passport .v1550-stat-row')).toBeHidden();
    await expect(page.locator('#skills-passport .v1550-passport-grid')).toBeHidden();
    await page.evaluate(()=>location.hash='#practice-studio');
    await expect(page.locator('#practice-studio .v1550-scenario-card:visible')).toHaveCount(6);
    await page.locator('.js-v1590-scenarios').click();
    expect(await page.locator('#practice-studio .v1550-scenario-card:visible').count()).toBe(21);
    await expect(page.locator('#practice-studio .v1550-filters')).toBeVisible();

    await page.evaluate(()=>location.hash='#learning-plan');
    await page.locator('.js-v1590-planner').click();
    await expect(page.locator('.js-v1590-planner')).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#learning-plan .v1550-plan-builder')).toBeVisible();

    await page.evaluate(()=>location.hash='#skills-passport');
    await expect(page.locator('.v1590-empty-progress')).toBeVisible();
    await page.locator('.js-v1590-progress').click();
    await expect(page.locator('.js-v1590-progress')).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#skills-passport .v1550-passport-grid')).toBeVisible();
  });

  test('mobile and desktop presentation visibly differs from rejected state', async ({ page }, testInfo) => {
    await page.goto('/');
    await waitForRecovery(page);

    const logo = page.locator('.site-header .brand img');
    const box = await logo.boundingBox();
    expect(box).not.toBeNull();
    const minWidth = testInfo.project.name === 'mobile-chromium' ? 100 : testInfo.project.name === 'tablet-chromium' ? 120 : 175;
    expect(box.width).toBeGreaterThanOrEqual(minWidth);

    const explore = page.getByRole('link', { name: 'Explore courses' }).first();
    await expect(explore).toBeVisible();
    const colors = await explore.evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(el).backgroundColor }));
    expect(colors.color).not.toBe('rgb(255, 255, 255)');
    expect(colors.color).not.toBe(colors.background);

    const contentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(contentHeight).toBeGreaterThan(1000);
    expect(contentHeight).toBeLessThan(testInfo.project.name === 'mobile-chromium' ? 9500 : 7000);
    expect(await page.locator('#app > section:visible').count()).toBeLessThanOrEqual(6);
    const titlePx=await page.locator('#start .section-head h2').evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
    expect(titlePx).toBeGreaterThanOrEqual(23);
    expect(titlePx).toBeLessThanOrEqual(42);

    await page.screenshot({ path: testInfo.outputPath('v1590-live-recovery-full.png'), fullPage: true, animations: 'disabled' });
    await testInfo.attach('v1590-live-recovery-full', { path: testInfo.outputPath('v1590-live-recovery-full.png'), contentType: 'image/png' });
  });
});

test('focused learning destinations are accessible and link back home',async({page})=>{await page.goto('/');await waitForRecovery(page);for(const [hash,id] of [['#courses','courses'],['#language-bridge','language-bridge'],['#teachers','teachers'],['#employers','teachers'],['#practice-studio','practice-studio'],['#learning-plan','learning-plan'],['#skills-passport','skills-passport'],['#trust','trust']]){await page.evaluate(h=>location.hash=h,hash);await expect(page.locator('#elFocusToolbar')).toBeVisible();await expect(page.locator('#'+id)).toBeVisible();await expect(page.locator('#home')).toBeHidden();expect(await page.locator('#app > section:visible').count()).toBe(1);}await page.locator('#elFocusToolbar a[href="#home"]').click();await expect(page.locator('#home')).toBeVisible();await expect(page.locator('#elFocusToolbar')).toBeHidden();});

test('approved logo is prominent and unchanged; hero hierarchy is intentionally concise',async({page},testInfo)=>{
  await page.goto('/');await page.locator('body.v1590-ready').waitFor();
  const brand=page.locator('.site-header .brand');
  const logo=brand.locator('img');await expect(logo).toHaveAttribute('src',/englishlegalese-logo\.png\?v=1\.62\.0/);
  const box=await brand.boundingBox();const im=await logo.boundingBox();expect(box).not.toBeNull();expect(im).not.toBeNull();
  expect(box.width).toBeGreaterThanOrEqual(testInfo.project.name==='mobile-chromium'?165:200);
  expect(box.height).toBeGreaterThanOrEqual(testInfo.project.name==='mobile-chromium'?85:100);
  expect(im.height).toBeGreaterThanOrEqual(testInfo.project.name==='mobile-chromium'?160:200);
  expect(await logo.evaluate(el=>getComputedStyle(el).objectFit)).toBe('contain');
  await expect(page.locator('.hero-logo')).toHaveCount(0);
  await expect(page.getByRole('heading',{name:'Clear English for legal work.'})).toBeVisible();
  await expect(page.locator('.hero-example.improved p')).toBeVisible();
  expect(await page.locator('.hero-actions .btn').count()).toBe(2);
  await expect(page.locator('.hero-secondary a[href="#smartteacher"]')).toBeVisible();
  await expect(page.locator('.hero-secondary a[href="#practice-studio"]')).toBeVisible();
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:testInfo.outputPath('v1610-visual-homepage.png'),fullPage:true,animations:'disabled'});
});

// Regression for the formerly self-triggering recovery observer: stable markup must settle.
test('public recovery observer becomes idle instead of constantly rewriting text nodes',async({page})=>{
 await page.goto('/');await waitForRecovery(page);await page.waitForTimeout(1650);
 const changes=await page.evaluate(()=>new Promise(resolve=>{
  let count=0;const root=document.querySelector('#app');const obs=new MutationObserver(events=>{count+=events.filter(e=>e.type==='childList').length;});
  obs.observe(root,{subtree:true,childList:true});
  setTimeout(()=>{obs.disconnect();resolve(count);},500);
 }));
 expect(changes).toBeLessThan(8);
});


test('next learning version provides a real safe prompt-preparation workflow',async({page})=>{
  await page.goto('/');await waitForRecovery(page);
  await expect(page.locator('#start h2')).toHaveText('Start with what you need.');
  await expect(page.getByText('Operational staff tools stay behind account access.')).toHaveCount(0);
  await page.evaluate(()=>{location.hash='#smartteacher';});
  await expect(page.locator('#smartteacher')).toBeVisible();
  const topic='Fictional client update about a delayed contract review';
  await page.locator('#el-practice-topic').fill(topic);
  await page.getByRole('button',{name:'Prepare conversation practice'}).click();
  await expect(page.locator('.js-ai-output')).toContainText('CONVERSATION PRACTICE');
  await expect(page.locator('.js-ai-output')).toContainText(topic);
  await expect(page.locator('.js-ai-output')).toContainText('not legal advice');
  await expect(page.locator('.js-copy-practice')).toBeVisible();
  await page.getByRole('button',{name:'Prepare writing review'}).click();
  await expect(page.locator('.js-ai-output')).toContainText('WRITING REVIEW');
  await expect(page.locator('.js-ai-output')).toContainText('Preserve the intended legal meaning');
  await expect(page.locator('#smartteacher p').first()).toContainText('does not send text to an AI service');
  await expect(page.locator('#smartteacher .js-ai-input')).toHaveAttribute('maxlength','1500');
});

test('mobile disclosure menu handles Escape, link activation and outside touch',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');await waitForRecovery(page);
  const toggle=page.locator('#navToggle'),nav=page.locator('#mainNav');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await toggle.click();await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(nav).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await nav.locator('a[href="#courses"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(page.locator('#courses')).toBeVisible();
  await expect(nav.locator('a[href="#courses"]')).toHaveAttribute('aria-current','location');
  await toggle.click();await page.locator('#courses h2').click({force:true});
  await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('revised metadata stays aligned with the public learning experience',async({page})=>{
  await page.goto('/');await waitForRecovery(page);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://englishlegalese.com/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/Legal English/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',/Practical Legal English/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.62.0');
});
