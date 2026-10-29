'use strict';
const {test,expect}=require('@playwright/test');
test('HF26 employer filters only authorized, consented reports without inventing scores',async({page})=>{
 await page.route('**/api/v119/auth/login',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,token:'employer.test',user:{role:'employer'}})}));
 await page.route('**/api/v18510/employer/progress**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,organizations:[{id:'EL-ORG-alpha',name:'Verified Company'}],organization:{id:'EL-ORG-alpha',name:'Verified Company'},employees:[
  {name:'Alice Smith',has_published_report:true,reported_at:'2026-10-20T12:00:00Z',completion_percent:80,score_percent:91,attendance_percent:100,milestones_completed:5,level:'B2'},
  {name:'Bob Example',has_published_report:false,reported_at:null,completion_percent:null,score_percent:null,attendance_percent:null,milestones_completed:null,level:''},
  {name:'Clara Jones',has_published_report:true,reported_at:'2026-10-21T12:00:00Z',completion_percent:40,score_percent:null,attendance_percent:null,milestones_completed:2,level:''}
 ],notice:'Published, consented employees only',truncated:false})}));
 await page.route('**/api/v18510/employer/roster**',r=>r.fulfill({status:503,contentType:'application/json',body:'{"ok":false,"error":"Roster unavailable"}'}));
 await page.goto('/learn/employer-dashboard/');
 await page.locator('#el18510-login input[name=email]').fill('employer@example.test');
 await page.locator('#el18510-login input[name=password]').fill('fictional');
 await page.getByRole('button',{name:'Sign in securely'}).click();
 const table=page.locator('.v1940-employer-report');
 await expect(table.locator('tbody tr:visible')).toHaveCount(3);
 await page.getByLabel('Filter by published report').selectOption('missing');
 await expect(table.locator('tbody tr:visible')).toHaveCount(1);
 await expect(table.locator('tbody tr:visible')).toContainText('Bob Example');
 await expect(table.locator('tbody tr:visible')).toContainText('Not reported');
 await page.getByLabel('Filter by published report').selectOption('all');
 await page.getByLabel('Find a consented employee').fill('clara');
 await expect(table.locator('tbody tr:visible')).toHaveCount(1);
 await expect(table.locator('tbody tr:visible')).toContainText('Clara Jones');
 await expect(table.locator('tbody tr:visible')).not.toContainText('91%');
 await page.getByLabel('Find a consented employee').fill('');
 await page.getByLabel('Sort consented employee names').selectOption('descending');
 await expect(table.locator('tbody tr:visible').first()).toContainText('Clara Jones');
 await expect(page.getByText('Showing 3 of 3 consented company employees.')).toBeVisible();
});
