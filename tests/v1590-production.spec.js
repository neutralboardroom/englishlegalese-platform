const { test, expect } = require('@playwright/test');

async function assertProductionRelease(page) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#v1590-live-marker')).toHaveText('1.59.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-live-release', '1.59.0');
}

test.describe('EnglishLegalese v1.59.0 production acceptance', () => {
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

    await expect(page.locator('#diagnostic')).toBeVisible();
    await expect(page.locator('#diagnostic .v1580-diagnostic-shell')).toBeHidden();
    expect(await page.locator('#courses article:visible').count()).toBe(3);
    expect(await page.locator('#practice-studio .v1550-scenario-card').count()).toBe(21);
    expect(await page.locator('#practice-studio .v1550-scenario-card:visible').count()).toBe(6);
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

    await page.screenshot({ path: testInfo.outputPath('production-homepage-v1590.png'), fullPage: true, animations: 'disabled' });
    await testInfo.attach('production-homepage-v1590', { path: testInfo.outputPath('production-homepage-v1590.png'), contentType: 'image/png' });
  });

  test('production hash navigation cannot restore rejected state', async ({ page }) => {
    await assertProductionRelease(page);
    for (const hash of ['#teachers','#courses','#language-bridge','#smartteacher','#trust','#practice-studio','#learning-plan','#skills-passport','#home']) {
      await page.evaluate(h => { window.location.hash = h; }, hash);
      await page.waitForTimeout(120);
      await expect(page.locator('#v1590-live-marker')).toHaveText('1.59.0');
      await expect(page.getByText('EnglishLegalese Team', { exact: true })).toHaveCount(0);
      await expect(page.getByText('New in v1.55', { exact: true })).toHaveCount(0);
      await expect(page.locator('#diagnostic')).toHaveCount(1);
    }
  });

  test('www production endpoint serves same current release', async ({ page }) => {
    await page.goto('https://www.englishlegalese.com/', { waitUntil: 'networkidle' });
    await page.locator('body.v1590-ready').waitFor();
    await expect(page.locator('#v1590-live-marker')).toHaveText('1.59.0');
    await expect(page.getByRole('heading', { name: 'Legal English training for the AI era.' })).toBeVisible();
    await expect(page.getByText('EnglishLegalese Team', { exact: true })).toHaveCount(0);
  });
});
