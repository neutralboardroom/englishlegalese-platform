const { test, expect } = require('@playwright/test');

test.describe('EnglishLegalese v1.73.0 live homepage recovery inheritance', () => {
  test('homepage loads corrected canonical experience and locked logo at usable size', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.locator('body.v1590-ready').waitFor();

    await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-live-release', '1.75.0');
    await expect(page.locator('.site-header .brand img')).toHaveAttribute('src', /assets\/englishlegalese-logo\.png\?v=1\.73\.0/);
    const logoBox = await page.locator('.site-header .brand img').boundingBox();
    expect(logoBox).not.toBeNull();
    expect(logoBox.width).toBeGreaterThanOrEqual(testInfo.project.name === 'mobile-chromium' ? 100 : 140);

    await expect(page.getByRole('heading', { name: 'Clear English for legal work.' })).toBeVisible();
    await expect(page.locator('#diagnostic')).toBeHidden();
    await expect(page.locator('.hero-actions a').first()).toHaveAttribute('href', '#diagnostic');
    await expect(page.getByText('EnglishLegalese Team', { exact: true })).toHaveCount(0);
    await expect(page.getByText('New in v1.55', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Launch course set', { exact: true })).toHaveCount(0);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    await page.screenshot({ path: testInfo.outputPath('homepage-full-v1590.png'), fullPage: true, animations: 'disabled' });
    await testInfo.attach('homepage-full-v1590', { path: testInfo.outputPath('homepage-full-v1590.png'), contentType: 'image/png' });
  });

  test('hash navigation no longer destroys corrected homepage state', async ({ page }) => {
    await page.goto('/');
    await page.locator('body.v1590-ready').waitFor();

    await page.evaluate(() => { window.location.hash = '#teachers'; });
    await expect(page).toHaveURL(/#teachers$/);
    await expect(page.locator('#home')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Teacher-guided learning support.' })).toBeVisible();
    await expect(page.getByText('Built-in online classroom tools.', { exact: true })).toHaveCount(0);

    await page.evaluate(() => { window.location.hash = '#language-bridge'; });
    await expect(page).toHaveURL(/#language-bridge$/);
    await expect(page.locator('#home')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: 'Get help in your language. Build confidence in Legal English.' })).toBeVisible();
    await expect(page.getByText(/should not promise perfect static translation/i)).toHaveCount(0);
  });

  test('starting diagnostic is non-accredited, complete, and does not persist answers', async ({ page }) => {
    await page.goto('/#diagnostic');
    await page.locator('body.v1590-ready').waitFor();

    const answers = [1, 1, 1, 1, 1, 2, 1, 0];
    for (let i = 0; i < answers.length; i += 1) {
      await page.locator('.v1580-question').nth(i).locator(`input[value="${answers[i]}"]`).check();
    }
    await page.getByRole('button', { name: 'Get my practice recommendation' }).click();

    const result = page.locator('.v1580-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Advanced practice path');
    await expect(result).toContainText('not a validated proficiency score');
    await expect(result).toContainText('no CEFR, TOLES, academic, licensing, certification, or employment equivalence');

    const stored = await page.evaluate(() => ({
      v1580: localStorage.getItem('elV1580Diagnostic'),
      v1570: localStorage.getItem('elV1570Diagnostic'),
      sessionV1580: sessionStorage.getItem('elV1580Diagnostic')
    }));
    expect(stored.v1580).toBeNull();
    expect(stored.v1570).toBeNull();
    expect(stored.sessionV1580).toBeNull();
  });

  test('diagnostic blocks incomplete submission and remains keyboard usable', async ({ page }) => {
    await page.goto('/#diagnostic');
    await page.locator('body.v1590-ready').waitFor();
    await page.getByRole('button', { name: 'Get my practice recommendation' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.v1580-form-status')).toContainText('Please answer all 8 questions');
    await expect(page.locator('.v1580-result')).toBeHidden();
  });

  test('homepage deep content uses progressive disclosure without deleting features', async ({ page }) => {
    await page.goto('/');
    await page.locator('body.v1590-ready').waitFor();

    const courseButton = page.locator('.js-v1580-courses');
    await expect(courseButton).toHaveAttribute('aria-expanded', 'false');
    expect(await page.locator('#courses article:visible').count()).toBe(3);
    await courseButton.click();
    await expect(courseButton).toHaveAttribute('aria-expanded', 'true');
    expect(await page.locator('#courses article:visible').count()).toBeGreaterThan(3);

    const scenarioButton = page.locator('.js-v1590-scenarios');
    await expect(scenarioButton).toHaveAttribute('aria-expanded', 'false');
    await page.evaluate(()=>location.hash='#practice-studio');
    expect(await page.locator('#practice-studio .v1550-scenario-card:visible').count()).toBe(6);
    await scenarioButton.click();
    await expect(scenarioButton).toHaveAttribute('aria-expanded', 'true');
    expect(await page.locator('#practice-studio .v1550-scenario-card:visible').count()).toBeGreaterThan(6);

    await page.evaluate(()=>location.hash='#learning-plan');
    await expect(page.locator('.js-v1590-planner')).toBeVisible();
    await expect(page.locator('#learning-plan .v1550-plan-builder')).toBeHidden();
    await page.evaluate(()=>location.hash='#skills-passport');
    await expect(page.locator('.js-v1590-progress')).toBeVisible();
    await expect(page.locator('#skills-passport .v1550-passport-grid')).toBeHidden();
  });

  test('operational dashboards fail closed and reduced motion remains honored', async ({ page }) => {
    await page.goto('/#admin-dashboard');
    await expect(page.locator('#account-access, #admin-dashboard')).toBeVisible();
    await expect(page.getByText(/operational dashboards|account dashboards/i).first()).toBeVisible();
    await expect(page.getByText('Check launch gates', { exact: true })).toHaveCount(0);

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('body.v1590-ready').waitFor();
    const transition = await page.locator('.v1580-question').first().evaluate(el => getComputedStyle(el).transitionDuration);
    expect(['0s', '0ms']).toContain(transition);
  });
});