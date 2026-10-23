const {test,expect}=require('@playwright/test');
const groups=[
['start','courses','smartteacher','teachers','live-classes','pricing','study-planner'],
['employers','language-support','trust','account','scenario-practice','learning-path','progress'],
['free-writing-exercise','ai-draft-review','clause-reading','meeting-followup','email-clarity','guided-practice','case-brief'],
['legal-vocabulary','revision-studio','professional-message','listening-clarification','conversation-rehearsal','reading-precision','smartteacher-free-trial']
];
const route=k=>k==='pricing'?'/pricing/':'/learn/'+k+'/';
for(const [i,group] of groups.entries()){
test('v1.84 verifies 28 distinct dedicated destinations · group '+(i+1),async({request})=>{
 for(const slug of group){
  const response=await request.get(route(slug));expect(response.status(),slug).toBe(200);
  const text=await response.text();
  expect(text).toContain('data-page-slug="'+slug+'"');
  expect(text).toContain('<main id="main">');
  expect(text).toContain('<link rel="canonical" href="https://englishlegalese.com'+route(slug)+'"');
  expect(text).toContain('/product-v1840-pages.js?v=1.84.0');
  expect(text).toContain('Free learning resources');
 }
});
}
test('v1.84 homepage keeps pricing visibly unchanged and all former learning experiences in place',async({page})=>{
 await page.goto('/#home');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('meta[name="englishlegalese-release"]')).toHaveAttribute('content','1.85.1');
 await expect(page.locator('#pricing')).toContainText('Class schedules and enrollment requests are open');
 await expect(page.locator('#pricing')).toContainText('$79 total');
 await expect(page.locator('#v1800-class-catalog .v1800-class-count')).toContainText('28 class topics');
 await expect(page.locator('#courses .v1800-class-card')).toHaveCount(12);
 await expect(page.locator('#v1840-sample-lessons')).not.toHaveAttribute('open');
 await expect(page.locator('#courses .section-head h2')).toContainText('28 class topics');
 await expect(page.locator('#mainNav a[href="/pricing/"]')).toHaveCount(1);
 await expect(page.locator('.v1770-footer-group a[href="/pricing/"]')).toHaveCount(1);
 await expect(page.locator('#v1790-resource-menu .v1790-resource-nav a')).toHaveCount(14);
 await expect(page.locator('#v1770-all-resources .v1770-resource-links a')).toHaveCount(14);
});
test('v1.84 header/footer and free-resource menu links all lead to separate webpages',async({page})=>{
 await page.goto('/');await page.locator('body.v1590-ready').waitFor();
 await expect(page.locator('#mainNav a[href="/learn/courses/"]')).toHaveCount(1);
 await expect(page.locator('.v1770-footer-group a[href="/learn/study-planner/"]')).toHaveCount(1);
 await expect(page.locator('#v1790-resource-menu a[href="/learn/free-writing-exercise/"]')).toHaveCount(1);
 await expect(page.locator('#v1770-all-resources a[href="/learn/free-writing-exercise/"]')).toHaveCount(1);
 const link=page.locator('#mainNav a[href="/pricing/"]');
 // Real tablet/phone users open the collapsed menu before navigating.
 if(!(await link.isVisible())){
  const toggle=page.locator('#navToggle');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
 }
 await expect(link).toBeVisible();
 await link.click();await expect(page).toHaveURL(/\/pricing\/$/);
 await expect(page.getByRole('heading',{name:'Legal English Pricing',exact:true})).toBeVisible();
});
test('v1.84 standalone pricing faithfully repeats homepage prices while leaving homepage visible',async({page})=>{
 await page.goto('/pricing/');const p=page.locator('#pricing');await expect(p).toBeVisible();
 for(const rate of ['$12/month','$19/month','$29/month','$24','$79 total','$59','$219 total','From $499'])await expect(p).toContainText(rate);
 await expect(p).toContainText('Class schedules and enrollment requests are open');
 await expect(page.locator('a[href="/"]')).not.toHaveCount(0);
 await expect(page.locator('.v1840-foot-resources a')).toHaveCount(14);
});
test('v1.84 standalone exercises are usable, clearly bounded and responsive',async({page})=>{
 await page.goto('/learn/clause-reading/');
 const item=page.locator('#v1840-content');
 await expect(page.getByRole('heading',{name:'Free Contract Clause Reading Lab',exact:true})).toBeVisible();
 await expect(item).toContainText('may notify');
 const btn=item.locator('button.v1840-button');
 await expect(btn).toHaveText('Show original learning example');
 await btn.click();
 await expect(item).toContainText('The second wording creates a duty');
 await expect(btn).toHaveAttribute('aria-expanded','true');
 await btn.click();await expect(btn).toHaveAttribute('aria-expanded','false');
 const dims=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
 expect(dims.scroll).toBeLessThanOrEqual(dims.width+4);
});
