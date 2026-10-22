const {test,expect}=require('@playwright/test');
test('v1.80 live apex and www show the private study planner and preserved Free learning resources',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  const response=await page.goto(domain+'/');expect(response.status()).toBeLessThan(400);
  expect(response.headers()['x-englishlegalese-release']).toBe('1.84.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.84.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.84.0');
  await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
  await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
  await page.goto(domain+'/#courses');await page.locator('body.v1590-ready').waitFor();
  const study=page.locator('#v1800-study-planner');
  await expect(study.locator('summary')).toBeVisible();await study.locator('summary').click();
  await expect(study.locator('#v1800-course-select option')).toHaveCount(6);
  await study.locator('.v1800-check input').first().check();
  await expect(study.locator('.v1800-progress')).toContainText('1 of 3');
  await expect(page.locator('#courses .v1790-third-action')).toHaveCount(6);
 }
});


test('v1.80 deployed 28-class preview retains all five teaching components and operational boundaries',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  await page.goto(domain+'/#courses');await page.locator('body.v1590-ready').waitFor();
  const catalog=page.locator('#v1800-class-catalog');
  await expect(catalog.locator('.v1800-class-count')).toContainText('28 class topics');
  await expect(catalog).toContainText('not bookable teacher sessions');
  await catalog.locator('#v1800-class-track').selectOption('Legal specialties');
  await expect(catalog.locator('.v1800-class-card')).toHaveCount(12);
  await catalog.locator('#v1800-class-track').selectOption('Professional & Business English');
  await expect(catalog.locator('.v1800-class-card')).toHaveCount(4);
  await catalog.locator('.v1800-class-card').first().getByRole('button',{name:'View lesson & teacher materials'}).click();
  const preview=catalog.locator('#v1800-class-viewer');
  await expect(preview).toBeVisible();
  await expect(preview.locator('.v1800-material-block').first().locator('ol > li')).toHaveCount(4);
  await expect(preview.locator('.v1800-glossary dt')).toHaveCount(5);
  await expect(preview.locator('.v1800-quiz-question')).toHaveCount(3);
  await expect(preview).toContainText('At-home practice and self-check');
  await preview.locator('.v1800-teacher summary').click();
  await expect(preview).toContainText('Suggested 50-minute teacher-led lesson');
  await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
  await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
 }
});
