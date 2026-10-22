const {test,expect}=require('@playwright/test');
test('v1.79 both public domains serve current release and usable course 3 lessons',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  const response=await page.goto(domain+'/');expect(response.status()).toBeLessThan(400);
  expect(response.headers()['x-englishlegalese-release']).toBe('1.83.0');
  await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.84.0');
  await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.84.0');
  await page.goto(domain+'/#courses');await page.locator('body.v1590-ready').waitFor();
  await expect(page.locator('#courses .v1790-third-action')).toHaveCount(6);
  await page.goto(domain+'/#live-classes');await page.locator('body.v1590-ready').waitFor();
  const prep=page.locator('#v1790-class-prep');await prep.locator('summary').click();
  await expect(prep.locator('.v1790-times tbody tr')).toHaveCount(8);
  await expect(prep).toContainText('not request, book or pay for a class');
 }
});


test('v1.79 live primary navigation and footer both expose all 14 resource links',async({page})=>{
 for(const domain of ['https://englishlegalese.com','https://www.englishlegalese.com']){
  await page.goto(domain+'/#home');await page.locator('body.v1590-ready').waitFor();
  const menu=page.locator('#v1790-resource-menu'),footer=page.locator('#v1770-all-resources');
  await expect(menu.locator('.v1790-resource-nav a')).toHaveCount(14);
  await expect(footer.locator('.v1770-resource-links a')).toHaveCount(14);
  const menuHrefs=await menu.locator('.v1790-resource-nav a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  const footerHrefs=await footer.locator('.v1770-resource-links a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  expect(menuHrefs).toEqual(footerHrefs);
  if(await page.locator('#navToggle').isVisible())await page.locator('#navToggle').click();
  await menu.locator('summary').click();
  await expect(menu.locator('a[href="#reading-precision-lab"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(footer).not.toHaveAttribute('open');
 }
});
