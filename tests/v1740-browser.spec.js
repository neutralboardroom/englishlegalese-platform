const { test, expect } = require('@playwright/test');
async function openLab(page) {
  await page.goto('/#professional-message-builder');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#professional-message-builder')).toBeVisible();
}
test('v1.74 professional message builder is discoverable without expanding homepage', async({page})=>{
  await page.goto('/');
  await page.locator('body.v1590-ready').waitFor();
  const link=page.locator('.site-footer a[href="#professional-message-builder"]');
  await expect(link).toHaveCount(1);
  await expect(page.locator('#professional-message-builder')).toBeHidden();
  await page.locator('.site-footer #v1770-all-resources summary').click();
  await expect(link).toBeVisible();
  await link.click();
  await expect(page.locator('#professional-message-builder')).toBeVisible();
  await expect(page.locator('#home')).toBeHidden();
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.80.0');
  await expect(page.getByRole('heading',{name:'Turn scattered notes into a clear professional message.'})).toBeVisible();
  await expect(page.locator('.site-header .brand img')).toBeVisible();
});
test('v1.74 validates required fictional facts and does not invent approvals', async({page})=>{
  await openLab(page);
  const section=page.locator('#professional-message-builder');
  await section.getByRole('button',{name:'Build my practice message'}).click();
  await expect(section.locator('.v1740-status')).toContainText('Enter a fictional subject');
  await expect(section.locator('.v1740-preview')).toBeHidden();
  await section.locator('#v1740-matter').fill('Fictional document review');
  await section.locator('#v1740-confirmed').fill('Draft checklist was received.');
  await section.locator('#v1740-next').fill('Ask the reviewer for a correction.');
  await section.getByRole('button',{name:'Build my practice message'}).click();
  await expect(section.locator('.v1740-preview')).toBeVisible();
  await expect(section.locator('.v1740-draft')).toContainText('Timing has not been confirmed.');
  await expect(section.locator('.v1740-draft')).toContainText('Still to check: No additional points were provided');
  await expect(section.locator('.v1740-draft')).not.toContainText('Approved by the court');
});
test('v1.74 three fictional genres, checklist and stale-preview protections', async({page})=>{
  await openLab(page);
  const section=page.locator('#professional-message-builder');
  for(const [kind,subject] of [['client','Client update'],['internal','Internal team handoff'],['meeting','Meeting follow-up']]){
    await section.locator('#v1740-kind').selectOption(kind);
    await section.getByRole('button',{name:'Load a fictional example'}).click();
    await section.getByRole('button',{name:'Build my practice message'}).click();
    await expect(section.locator('.v1740-draft')).toContainText('Subject: '+subject);
    await section.locator('.v1740-checks input').first().check();
    await expect(section.locator('.v1740-progress')).toContainText('1 of 3');
    await section.locator('#v1740-confirmed').fill('Changed fictional evidence.');
    await expect(section.locator('.v1740-preview')).toBeHidden();
    await expect(section.locator('.v1740-progress')).toContainText('0 of 3');
  }
});
test('v1.74 clear and reload discard all practice text; no upload or paid AI',async({page})=>{
  const network=[];
  page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))network.push(r.url());});
  await openLab(page);
  const section=page.locator('#professional-message-builder');
  await section.locator('#v1740-kind').selectOption('meeting');
  await section.getByRole('button',{name:'Load a fictional example'}).click();
  await section.getByRole('button',{name:'Build my practice message'}).click();
  await expect(section.locator('.v1740-preview')).toBeVisible();
  await section.getByRole('button',{name:'Clear everything'}).click();
  await expect(section.locator('#v1740-matter')).toHaveValue('');
  await expect(section.locator('.v1740-preview')).toBeHidden();
  await expect(section.locator('.v1740-count')).toContainText('0 of 2,080');
  await section.locator('#v1740-matter').fill('Temporary fictional draft');
  await page.reload();
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#v1740-matter')).toHaveValue('');
  expect(network).toEqual([]);
});
