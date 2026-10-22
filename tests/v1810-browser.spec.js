const {test,expect}=require('@playwright/test');
async function visit(page,hash){await page.goto('/#'+hash);await page.locator('body.v1590-ready').waitFor();await expect(page.locator('#pricing')).toBeVisible();}
test('v1.81 published pricing is reachable from header, footer and homepage',async({page})=>{
 await visit(page,'home');
 await expect(page.locator('#mainNav a[href="#pricing"]')).toHaveCount(1);
 await expect(page.locator('.v1770-footer-group a[href="#pricing"]')).toHaveCount(1);
 await page.goto('/#pricing');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#pricing')).toBeVisible();
 await expect(page.locator('#mainNav a[href="#pricing"]')).toHaveAttribute('aria-current','location');
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.83.0');
 await expect(page.locator('html')).toHaveAttribute('data-englishlegalese-material-release','1.83.0');
});
test('v1.81 researched price disclosure stays accurate, explicit and non-transactional',async({page})=>{
 await visit(page,'pricing');const p=page.locator('#pricing');
 await expect(p.locator('.v1810-card')).toHaveCount(4);
 for(const value of ['14 practical free learning resources','Starter:','$12/month','Plus:','$19/month','Pro:','$29/month','100 replies','250 replies','500 replies','$24','$79 total','$59','$219 total','From $499','not available for purchase today','No automatic charges','US dollars'])await expect(p).toContainText(value);
 await expect(p.locator('button')).toHaveCount(0);
 await expect(p.locator('input')).toHaveCount(0);
 await expect(p.locator('form')).toHaveCount(0);
});
test('v1.81 pricing routes to real earlier class catalog and free learning resources',async({page})=>{
 await visit(page,'pricing');
 await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
 await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
 await expect(page.locator('#v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 for(const href of ['#quick-practice','#smartteacher-free-trial','#v1800-class-catalog','#live-classes','#employers'])await expect(page.locator('#pricing a[href="'+href+'"]')).toHaveCount(1);
});
test('v1.81 pricing has responsive layout, safe links and no horizontal page overflow',async({page})=>{
 await visit(page,'pricing');const p=page.locator('#pricing');
 await expect(p.getByRole('heading',{name:'Clear options for learning Legal English.'})).toBeVisible();
 const dimensions=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:innerWidth}));
 expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport+4);
 await expect(p).toContainText('subject to launch-readiness review');
});
