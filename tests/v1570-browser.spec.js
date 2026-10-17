const { test, expect } = require('@playwright/test');

test.describe('EnglishLegalese v1.57.0 public experience', () => {
  test('homepage is responsive, accessible enough for core navigation, and preserves the protected logo', async ({ page }, testInfo) => {
    await page.goto('/');
    await page.locator('body.v1570-ready').waitFor();

    await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-version', '1.57.0');
    await expect(page.locator('.site-header .brand img')).toHaveAttribute('src', 'assets/englishlegalese-logo.png');
    await expect(page.locator('#diagnostic')).toBeVisible();
    await expect(page.locator('.hero-actions a').first()).toHaveAttribute('href', '#diagnostic');
    await expect(page.getByRole('heading', { name: 'Find your best Legal English practice starting point.' })).toBeVisible();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);

    const minTouch = await page.locator('.v1570-diagnostic .btn').first().evaluate(el => Math.min(el.getBoundingClientRect().width, el.getBoundingClientRect().height));
    expect(minTouch).toBeGreaterThanOrEqual(40);

    await page.screenshot({ path: testInfo.outputPath('homepage-full.png'), fullPage: true, animations: 'disabled' });
    await testInfo.attach('homepage-full', { path: testInfo.outputPath('homepage-full.png'), contentType: 'image/png' });
  });

  test('starting diagnostic gives non-accredited guidance without persisting answers', async ({ page }) => {
    await page.goto('/#diagnostic');
    await page.locator('body.v1570-ready').waitFor();

    const answers = [1, 1, 1, 1, 1, 2, 1, 0];
    for (let i = 0; i < answers.length; i += 1) {
      await page.locator('.v1570-question').nth(i).locator(`input[value="${answers[i]}"]`).check();
    }
    await page.getByRole('button', { name: 'Get my practice recommendation' }).click();

    const result = page.locator('.v1570-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Advanced practice path');
    await expect(result).toContainText('not a validated language-proficiency score');
    await expect(result).toContainText('no CEFR, TOLES, academic, licensing, or employment equivalence');

    const stored = await page.evaluate(() => ({
      diagnostic: localStorage.getItem('elV1570Diagnostic'),
      sessionDiagnostic: sessionStorage.getItem('elV1570Diagnostic')
    }));
    expect(stored.diagnostic).toBeNull();
    expect(stored.sessionDiagnostic).toBeNull();
  });

  test('diagnostic blocks incomplete submission and remains keyboard-usable', async ({ page }) => {
    await page.goto('/#diagnostic');
    await page.locator('body.v1570-ready').waitFor();
    await page.getByRole('button', { name: 'Get my practice recommendation' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('.v1570-form-status')).toContainText('Please answer all 8 questions');
    await expect(page.locator('.v1570-result')).toBeHidden();
  });

  test('operational dashboards fail closed for unauthenticated public access', async ({ page }) => {
    await page.goto('/#admin-dashboard');
    await expect(page.getByRole('heading', { name: 'Account dashboards are not publicly enabled yet.' })).toBeVisible();
    await expect(page.locator('#account-access')).toContainText('production authentication and persistent account storage are confirmed');
  });

  test('featured course and scenario disclosures retain deeper content', async ({ page }) => {
    await page.goto('/');
    await page.locator('body.v1570-ready').waitFor();

    const courseButton = page.locator('.js-v1560-courses');
    if (await courseButton.count()) {
      await expect(courseButton).toHaveAttribute('aria-expanded', 'false');
      await courseButton.click();
      await expect(courseButton).toHaveAttribute('aria-expanded', 'true');
      expect(await page.locator('#courses .v1560-collapsible:visible').count()).toBeGreaterThan(0);
    }

    const scenarioButton = page.locator('.js-v1560-scenarios');
    if (await scenarioButton.count()) {
      await scenarioButton.click();
      await expect(scenarioButton).toHaveAttribute('aria-expanded', 'true');
      expect(await page.locator('#practice-studio .v1560-collapsible:visible').count()).toBeGreaterThan(0);
    }
  });

  test('reduced-motion preference remains honored by v1.57 layer', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.locator('body.v1570-ready').waitFor();
    const transition = await page.locator('.v1570-question').first().evaluate(el => getComputedStyle(el).transitionDuration);
    expect(['0s', '0ms']).toContain(transition);
  });
});
