'use strict';
const {test,expect}=require('@playwright/test');

test('HF31 approved image-led homepage is FIRST; five pathways precede legacy guidance and original tools remain',async({page},testInfo)=>{
 const sizes={'desktop-chromium':[1440,900],'tablet-chromium':[900,1050],'tablet-webkit':[900,1050],'mobile-chromium':[390,844]};
 const [width,height]=sizes[testInfo.project.name]||[1440,900];
 await page.setViewportSize({width,height});
 await page.goto('/#home');
 const home=page.locator('#home'),newHero=home.locator('#v18531-integrated-hero');
 const preview=home.locator('#v18512-home-preview');
 await expect(newHero).toBeVisible();
 await expect(newHero.getByRole('heading',{name:'Teacher-led learning, together.'})).toBeVisible();
 await expect(newHero).toHaveCSS('background-image',/teacher-classroom-photo-locked-hf26\.svg/);
 await expect(newHero.locator('.v18531-hero-planner')).toBeVisible();
 await expect(preview.locator('.v18512-pathway-card')).toHaveCount(5);
 await expect(preview.locator('.v18512-steps li')).toHaveCount(4);
 await expect(preview.locator('details.v18512-disclosure')).toHaveCount(5);
 const loc=await page.evaluate(()=>{
  const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return {top:r.top+scrollY,bottom:r.bottom+scrollY,height:r.height}};
  return {hero:rect('#v18531-integrated-hero'),paths:rect('#v18512-home-preview'),legacy:rect('#home > .hero-grid'),width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth};
 });
 expect(loc.hero.top,'Image-led hero should be above previous text-heavy hero').toBeLessThan(loc.legacy.top);
 expect(loc.paths.top,'Approved pathways must appear before legacy explanatory homepage').toBeLessThan(loc.legacy.top);
 expect(loc.paths.top,'Pathway cards should directly follow image-led hero').toBeLessThanOrEqual(loc.hero.bottom+100);
 expect(loc.scrollWidth-loc.width,'No horizontal overflow at desktop/tablet/mobile').toBeLessThanOrEqual(4);
 await expect(page.locator('#home .hero-example.improved p')).toBeVisible();
 await expect(page.locator('#live-classes .v1780-studio')).toBeVisible();
 await expect(page.locator('#live-classes .v1780-room-stage')).toHaveCSS('background-image',/teacher-classroom-photo-locked-hf26\.svg/);
 await page.screenshot({path:testInfo.outputPath('hf31-approved-home-'+testInfo.project.name+'.png'),fullPage:true,animations:'disabled'});
});

test('HF31 integrated class planning is functional, truthful and sends no personal data',async({page})=>{
 const writes=[];page.on('request',r=>{if(['POST','PUT','PATCH'].includes(r.method()))writes.push(r.url());});
 await page.goto('/#home');
 const plan=page.locator('#v18531-integrated-hero .v18531-hero-planner');
 await expect(plan).toBeVisible();
 await expect(plan.locator('#v18531-focus option')).toHaveCount(7);
 await plan.locator('#v18531-when').fill('2020-01-01T09:00');
 await plan.getByRole('button',{name:'Preview a class plan'}).click();
 await expect(plan.locator('.v18531-form-status')).toContainText('valid future');
 await expect(plan.locator('.v18531-plan-result')).toBeHidden();
 await plan.locator('#v18531-focus').selectOption('3');
 await plan.locator('#v18531-provider').selectOption('teams');
 await plan.locator('#v18531-when').fill('2035-04-17T14:30');
 await plan.getByRole('button',{name:'Preview a class plan'}).click();
 await expect(plan.locator('.v18531-plan-result')).toBeVisible();
 await expect(plan.locator('.v18531-plan-result')).toContainText('Investor and Wall Street communication');
 await expect(plan.locator('.v18531-plan-result')).toContainText('Not booked');
 await plan.locator('#v18531-focus').selectOption('1');
 await expect(plan.locator('.v18531-plan-result')).toBeHidden();
 expect(writes,'Unconfirmed class planning is device-only').toEqual([]);
 await expect(plan.getByRole('link',{name:'View all class topics'})).toHaveAttribute('href','/learn/live-classes/');
});
