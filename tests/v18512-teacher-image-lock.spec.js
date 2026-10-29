'use strict';
const {test,expect}=require('@playwright/test');
test('HF26 teacher photograph stays separate from editable heading, supporting copy and functioning buttons',async({page})=>{
 await page.goto('/');
 const panel=page.locator('.v1780-room-stage');
 await expect(panel).toBeVisible();
 const background=await panel.evaluate(el=>getComputedStyle(el).backgroundImage);
 expect(background).toContain('/assets/teacher-classroom-photo-locked-hf26.svg');
 await expect(panel.getByRole('heading',{name:'Teacher-led learning, together.'})).toBeVisible();
 await expect(panel).toContainText('Video discussion • roleplay • vocabulary review • shared learning goals');
 await expect(panel.getByRole('link',{name:'Explore live classes'})).toHaveAttribute('href','/learn/live-classes/');
 await expect(panel.getByRole('link',{name:'View courses'})).toHaveAttribute('href','/learn/courses/');
 const response=await page.request.get('/assets/teacher-classroom-photo-locked-hf26.svg');
 expect(response.ok()).toBeTruthy();
 const svg=await response.text();
 expect(svg).toContain('data:image/webp;base64,');
 expect(svg).not.toMatch(/<text\b/);
 expect(svg).not.toContain('Teacher-led learning, together.');
});
