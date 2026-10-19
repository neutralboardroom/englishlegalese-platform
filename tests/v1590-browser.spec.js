const { test, expect } = require('@playwright/test');

async function waitForRecovery(page) {
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#v1590-live-marker')).toHaveText('1.65.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-live-release', '1.65.0');
}

test.describe('EnglishLegalese v1.65.0 hard live recovery', () => {
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
  const logo=brand.locator('img');await expect(logo).toHaveAttribute('src',/englishlegalese-logo\.png\?v=1\.65\.0/);
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
  await toggle.click();await page.mouse.click(5,10);
  await expect(toggle).toHaveAttribute('aria-expanded','false');
});

test('revised metadata stays aligned with the public learning experience',async({page})=>{
  await page.goto('/');await waitForRecovery(page);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://englishlegalese.com/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',/Legal English/);
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content',/Practical Legal English/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content','summary_large_image');
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.65.0');
});

test('guided three-step writing practice is private, usable and preserves work between steps',async({page})=>{
  await page.goto('/#quick-practice');
  await waitForRecovery(page);
  await expect(page.locator('#quick-practice')).toBeVisible();
  await expect(page.locator('#home')).toBeHidden();
  await expect(page.locator('#elFocusToolbar')).toBeVisible();
  const steps=page.locator('#quick-practice .v1630-step');
  await expect(steps).toHaveCount(3);
  await expect(page.locator('#quick-practice .v1630-step:visible')).toHaveCount(1);
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 1 of 3');
  await expect(page.locator('#quick-practice [data-practice-action="prev"]')).toBeDisabled();

  const draft='Please send the fictional missing attachment so we can finish the review.';
  await page.locator('#v1630-answer-0').fill(draft);
  await page.getByRole('button',{name:'Show model example and checklist'}).click();
  await expect(page.locator('#v1630-model-0')).toBeVisible();
  await expect(page.locator('#v1630-model-0')).toContainText('not an automatic assessment');
  await expect(page.getByRole('button',{name:'Hide model example and checklist'})).toHaveAttribute('aria-expanded','true');
  await page.getByRole('button',{name:'Next exercise'}).click();
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 2 of 3');
  await expect(page.locator('#v1630-step-title-1')).toBeFocused();
  await page.locator('#v1630-answer-1').fill('Who should receive the summary?');
  await page.getByRole('button',{name:'Previous'}).click();
  await expect(page.locator('#v1630-answer-0')).toHaveValue(draft);
  await expect(page.locator('#v1630-model-0')).toBeVisible();
  await page.getByRole('button',{name:'Next exercise'}).click();
  await expect(page.locator('#v1630-answer-1')).toHaveValue('Who should receive the summary?');
  await page.getByRole('button',{name:'Next exercise'}).click();
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 3 of 3');
  await expect(page.locator('#quick-practice [data-practice-action="next"]')).toBeDisabled();
  await expect(page.locator('.v1630-end-note')).toContainText('final exercise');
  const persisted=await page.evaluate(()=>Object.keys(localStorage).concat(Object.keys(sessionStorage)).filter(k=>/v1630|quickpractice|writingdraft/i.test(k)));
  expect(persisted).toEqual([]);
  await page.getByRole('button',{name:'Clear drafts and restart'}).click();
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 1 of 3');
  await expect(page.locator('#v1630-answer-0')).toHaveValue('');
  await expect(page.locator('#v1630-answer-1')).toHaveValue('');
  await expect(page.locator('#v1630-model-0')).toBeHidden();
  await expect(page.locator('.v1630-end-note')).toContainText('cleared');
  await page.locator('#v1630-answer-0').fill('Discard on reload.');
  await page.reload();
  await waitForRecovery(page);
  await expect(page.locator('#v1630-answer-0')).toHaveValue('');
});

test('writing practice is discoverable but does not lengthen the default homepage',async({page})=>{
  await page.goto('/');
  await waitForRecovery(page);
  await expect(page.locator('.v1630-hero-link')).toHaveAttribute('href','#quick-practice');
  await expect(page.locator('.v1630-hero-link')).toBeVisible();
  await expect(page.locator('#quick-practice')).toBeHidden();
  await expect(page.locator('#quick-practice .v1630-step')).toHaveCount(3);
  await expect(page.locator('footer a[href="#quick-practice"]')).toHaveCount(1);
  await page.locator('.v1630-hero-link').click();
  await expect(page.locator('#quick-practice')).toBeVisible();
  await expect(page.locator('#quick-practice .v1630-privacy')).toContainText('not submitted, scored, stored, or shared');
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('eight-question diagnostic explains each practice answer and routes to a relevant exercise',async({page})=>{
  await page.goto('/#diagnostic');await waitForRecovery(page);
  await expect(page.locator('.v1580-diagnostic-form')).toBeVisible();
  const correct=[1,1,1,1,1,2,1,0];
  for(let i=0;i<correct.length;i++)await page.locator('input[name="v1580-q'+i+'"][value="'+(i===2?0:correct[i])+'"]').check();
  await page.getByRole('button',{name:'Get my practice recommendation'}).click();
  const result=page.locator('.v1580-result');
  await expect(result).toBeVisible();
  await expect(result).toContainText('7 of 8');
  await expect(result).toContainText('not a validated proficiency score');
  await expect(result.locator('.v1640-action-plan')).toContainText('expressing obligations and time limits');
  const suggested=result.locator('.js-v1640-recommended-practice');
  await expect(suggested).toHaveAttribute('href','#quick-practice');
  await expect(suggested).toHaveAttribute('data-practice-step','2');
  const details=result.locator('details.v1640-review');
  await expect(details).not.toHaveAttribute('open','');
  await details.locator('summary').click();
  await expect(details).toHaveAttribute('open','');
  const items=details.locator('.v1640-review-item');
  await expect(items).toHaveCount(8);
  for(let i=0;i<8;i++){
    await expect(items.nth(i)).toContainText('Question '+(i+1));
    await expect(items.nth(i)).toContainText('Your answer:');
    await expect(items.nth(i)).toContainText('Stronger option:');
  }
  await expect(items.nth(2)).toContainText('A different answer is stronger');
  await expect(items.nth(2)).toContainText('“must” for obligations');
  await expect(items.nth(7)).toContainText('confidentiality risks');
  await suggested.click();
  await expect(page.locator('#quick-practice')).toBeVisible();
  await expect(page.locator('.v1630-progress')).toHaveText('Exercise 3 of 3');
  await expect(page.locator('#v1630-step-title-2')).toBeVisible();
  await expect(page.locator('#quick-practice .v1630-step:visible')).toHaveCount(1);
});

test('incomplete diagnostic guides the learner and reset clears the whole debrief',async({page})=>{
  await page.goto('/#diagnostic');await waitForRecovery(page);
  await page.getByRole('button',{name:'Get my practice recommendation'}).click();
  await expect(page.locator('.v1580-form-status')).toContainText('8 questions remain');
  await expect(page.locator('input[name="v1580-q0"]').first()).toBeFocused();
  const correct=[1,1,1,1,1,2,1,0];
  for(let i=0;i<8;i++)await page.locator('input[name="v1580-q'+i+'"][value="'+correct[i]+'"]').check();
  await page.getByRole('button',{name:'Get my practice recommendation'}).click();
  await expect(page.locator('.v1580-result')).toContainText('8 of 8');
  await expect(page.locator('.v1640-review-item')).toHaveCount(8);
  await expect(page.locator('.v1640-next-action')).toHaveAttribute('href','#quick-practice');
  await page.getByRole('button',{name:'Clear answers'}).click();
  await expect(page.locator('.v1580-result')).toBeHidden();
  await expect(page.locator('.v1580-result')).toBeEmpty();
  await expect(page.locator('input[name="v1580-q0"][value="1"]')).not.toBeChecked();
  await expect(page.locator('.v1580-form-status')).toBeEmpty();
  await page.reload();await waitForRecovery(page);
  await expect(page.locator('input[name="v1580-q0"][value="1"]')).not.toBeChecked();
});

test('AI draft review lab teaches all three fictional risk cases without external AI',async({page})=>{
  await page.goto('/#ai-review-lab');await waitForRecovery(page);
  const lab=page.locator('#ai-review-lab');
  await expect(lab).toBeVisible();
  await expect(page.locator('#home')).toBeHidden();
  await expect(lab.locator('.v1650-case')).toHaveCount(3);
  await expect(lab.locator('.v1650-progress')).toContainText('Reviewed 0 of 3');
  await expect(lab).toContainText('No live AI service');
  await expect(lab).toContainText('Fictional AI draft to review');

  const first=lab.locator('.v1650-case').nth(0);
  await first.getByRole('button',{name:'Compare my choice'}).click();
  await expect(first.locator('.v1650-status')).toContainText('Choose the concern');
  await expect(first.locator('input[type="radio"]').first()).toBeFocused();
  await expect(first.locator('.v1650-guidance')).toBeHidden();
  await first.locator('input[value="1"]').check();
  await first.locator('.v1650-rewrite').fill('Check a fictional deadline with qualified reviewers.');
  await first.getByRole('button',{name:'Compare my choice'}).click();
  await expect(first.locator('.v1650-guidance')).toBeVisible();
  await expect(first.locator('.v1650-judgement')).toContainText('different first step');
  await expect(lab.locator('.v1650-progress')).toContainText('Reviewed 1 of 3');
  await first.locator('input[value="0"]').check();
  await expect(first.locator('.v1650-guidance')).toBeHidden();
  await expect(lab.locator('.v1650-progress')).toContainText('Reviewed 0 of 3');
  await first.getByRole('button',{name:'Compare my choice'}).click();
  await expect(first.locator('.v1650-judgement')).toContainText('matches the recommended');
  await expect(first.locator('.v1650-rewrite')).toHaveValue('Check a fictional deadline with qualified reviewers.');

  const second=lab.locator('.v1650-case').nth(1);
  await second.locator('input[value="1"]').check();
  await second.getByRole('button',{name:'Compare my choice'}).click();
  await expect(second.locator('.v1650-guidance')).toContainText('legal conclusion is unsupported');
  const third=lab.locator('.v1650-case').nth(2);
  await third.locator('input[value="2"]').check();
  await third.getByRole('button',{name:'Compare my choice'}).click();
  await expect(third.locator('.v1650-guidance')).toContainText('public AI service');
  await expect(lab.locator('.v1650-progress')).toContainText('Reviewed 3 of 3');

  await first.getByRole('button',{name:'Clear this case'}).click();
  await expect(first.locator('.v1650-rewrite')).toHaveValue('');
  await expect(first.locator('.v1650-guidance')).toBeHidden();
  await expect(lab.locator('.v1650-progress')).toContainText('Reviewed 2 of 3');
  await lab.getByRole('button',{name:'Clear all three exercises'}).click();
  await expect(lab.locator('.v1650-progress')).toContainText('Reviewed 0 of 3');
  for(const card of await lab.locator('.v1650-case').all()){
    await expect(card.locator('.v1650-guidance')).toBeHidden();
    await expect(card.locator('.v1650-rewrite')).toHaveValue('');
    await expect(card.locator('input[type="radio"]:checked')).toHaveCount(0);
  }
  await first.locator('.v1650-rewrite').fill('Temporary fictional test.');
  await page.reload();await waitForRecovery(page);
  await expect(page.locator('.v1650-case').first().locator('.v1650-rewrite')).toHaveValue('');
  const keys=await page.evaluate(()=>Object.keys(localStorage).concat(Object.keys(sessionStorage)).filter(k=>/v1650|aireviewlab|aidraft/i.test(k)));
  expect(keys).toEqual([]);
});

test('AI draft review lab is discoverable without changing original home layout',async({page})=>{
  await page.goto('/');await waitForRecovery(page);
  await expect(page.locator('#ai-review-lab')).toBeHidden();
  await expect(page.locator('.v1650-case')).toHaveCount(3);
  await expect(page.locator('footer a[href="#ai-review-lab"]')).toHaveCount(1);
  await page.evaluate(()=>location.hash='#smartteacher');
  await expect(page.locator('.v1650-inline-link')).toBeVisible();
  await page.locator('.v1650-inline-link').click();
  await expect(page.locator('#ai-review-lab')).toBeVisible();
  await expect(page.locator('#elFocusToolbar')).toBeVisible();
  await expect(page.locator('#ai-review-lab .v1650-case')).toHaveCount(3);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('diagnostic AI uncertainty safely routes to the new fictional AI draft lab',async({page})=>{
  await page.goto('/#diagnostic');await waitForRecovery(page);
  const answers=[1,1,1,1,1,2,0,0];
  for(let i=0;i<8;i++)await page.locator('input[name="v1580-q'+i+'"][value="'+answers[i]+'"]').check();
  await page.getByRole('button',{name:'Get my practice recommendation'}).click();
  await expect(page.locator('.v1640-next-action')).toHaveAttribute('href','#ai-review-lab');
  await page.locator('.v1640-next-action').click();
  await expect(page.locator('#ai-review-lab')).toBeVisible();
  await expect(page.locator('.v1650-progress')).toContainText('Reviewed 0 of 3');
});
