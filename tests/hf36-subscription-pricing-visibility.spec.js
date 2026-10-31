'use strict';
const {test,expect}=require('@playwright/test');
test('HF36 combined membership prices appear above legacy pricing grid, with accurate terms',async({page},info)=>{
 await page.goto('/pricing/');
 const prices=page.locator('#hf36-membership-prices');
 await expect(prices.getByRole('heading',{name:'One membership for both Legal English and Business English'})).toBeVisible();
 for(const amount of ['$12','$19','$29','$79','$25','$23','$21'])await expect(prices).toContainText(amount);
 await expect(prices).toContainText('Guided');
 await expect(prices).toContainText('50+ employees');
 await expect(prices).toContainText('renew automatically until canceled');
 await expect(prices).toContainText('keep access through the period already paid for');
 await expect(prices).toContainText('not active');
 await expect(prices.getByRole('link',{name:'View individual plan features'})).toHaveAttribute('href','/learn/memberships/#v1970-individual-heading');
 await expect(prices.getByRole('link',{name:'Calculate your team price'})).toHaveAttribute('href','/learn/memberships/#v1970-team-heading');
 await expect(page.locator('#pricing')).toContainText('Private online lessons');
 await expect(page.locator('#pricing')).toContainText('SmartTeacher AI');
 const pos=await page.evaluate(()=>({top:document.getElementById('hf36-membership-prices').getBoundingClientRect().top,legacy:document.getElementById('pricing').getBoundingClientRect().top,priceIndex:document.getElementById('hf36-membership-prices').compareDocumentPosition(document.getElementById('pricing'))}));
 expect(pos.top).toBeLessThan(pos.legacy);
 await page.screenshot({path:info.outputPath('hf36-prominent-subscription-pricing.png'),fullPage:true});
 const viewport=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
 expect(viewport.scroll).toBeLessThanOrEqual(viewport.width+2);
});
test('HF36 each course page shows same four individual and progressive company monthly prices',async({page})=>{
 for(const route of ['/learn/legal-english/','/learn/business-english/']){
  await page.goto(route);
  const panel=page.getByRole('region',{name:'Shared membership options'});
  await expect(panel).toBeVisible();
  for(const amount of ['$12','$19','$29','$79','$25','$23','$21'])await expect(panel).toContainText(amount);
  await expect(panel).toContainText('both');
  await expect(panel).toContainText('confirmed teacher capacity');
  await expect(panel).toContainText('Checkout and subscriptions are not yet active');
  await expect(panel.getByRole('link',{name:'Compare full proposed membership plans'})).toHaveAttribute('href','/learn/memberships/');
 }
});
test('HF36 employer page shows actual team prices and one-seat policy without claiming checkout',async({page})=>{
 await page.goto('/learn/employers/');
 const panel=page.locator('section[aria-labelledby="hf36-employer-pricing"]');
 await expect(panel.getByRole('heading',{name:/Company memberships from one employee/})).toBeVisible();
 for(const amount of ['$12','$19','$29','$79','$25','$23','$21'])await expect(panel).toContainText(amount);
 await expect(panel).toContainText('50+ employees: custom quote');
 await expect(panel).toContainText('Not active or purchasable');
 await expect(panel.getByRole('link',{name:'Estimate your team membership'})).toHaveAttribute('href','/learn/memberships/#v1970-team-heading');
 await expect(page.locator('main')).toContainText('Multi-employee group training options');
});
test('HF36 membership, account and inherited homepage pricing notes are in agreement',async({page})=>{
 await page.goto('/learn/memberships/');
 await expect(page.locator('main')).toContainText('Individual monthly plan prices: Starter $12');
 await expect(page.locator('main')).toContainText('Company memberships: one employee $25/month');
 await expect(page.locator('main')).toContainText('Cancel any time before the next renewal');
 await expect(page.getByRole('link',{name:'Estimate company prices'})).toHaveAttribute('href','#v1970-team-heading');
 await page.goto('/learn/account/');
 await expect(page.locator('main')).toContainText('Starter $12, Plus $19, Pro $29, Guided $79');
 await page.goto('/');
 await expect(page.locator('meta[name="englishlegalese-homepage-build"]')).toHaveAttribute('content','HF31-image-led-first-screen');
 await expect(page.locator('aside[aria-label="One subscription for Legal and Business English"]')).toContainText('Starter $12, Plus $19, Pro $29, Guided $79');
 await expect(page.locator('aside[aria-label="One subscription for Legal and Business English"]')).toContainText('not active');
});
