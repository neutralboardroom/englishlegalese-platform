'use strict';
const {test,expect}=require('@playwright/test');
test('HF26 summary-first homepage preserves independent teacher photo, real editable CTAs and full learning content',async({page})=>{
 await page.goto('/');
 const main=page.locator('#v18512-home-preview');
 await expect(main).toBeVisible();
 await expect(main.getByRole('heading',{name:'Choose your EnglishLegalese pathway'})).toBeVisible();
 await expect(main.locator('.v18512-pathway-card')).toHaveCount(5);
 await expect(page.locator('#live-classes')).toBeVisible();
 await expect(page.locator('#live-classes .v1780-room-stage')).toHaveCSS('background-image',/teacher-classroom-photo-locked-hf26\.svg/);
 const fold=main.locator('details.v18512-disclosure').filter({hasText:'Free practice tools and learning resources'});
 await expect(fold).not.toHaveAttribute('open',/.*/);
 await fold.locator('summary').click();
 await expect(fold).toHaveAttribute('open', '');
 await expect(page.locator('#ai-review-lab')).toBeVisible();
 await expect(page.locator('#case-brief-lab')).toBeVisible();
 await expect(page.locator('#smartteacher-free-trial')).toBeVisible();
});
test('HF26 direct links disclose hidden learning sections automatically',async({page})=>{
 await page.goto('/#case-brief-lab');
 const fold=page.locator('#case-brief-lab').locator('xpath=ancestor::details[contains(@class,"v18512-disclosure")]');
 await expect(fold).toHaveAttribute('open','');
 await expect(page.locator('#case-brief-lab')).toBeVisible();
});
