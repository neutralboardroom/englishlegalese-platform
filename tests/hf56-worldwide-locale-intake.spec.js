'use strict';
const {test,expect}=require('@playwright/test');

for(const mode of [
 {market:'th',lang:'th',native:'ภาษาอังกฤษ',country:'Thailand'},
 {market:'vn',lang:'vi',native:'Tiếng Anh',country:'Vietnam'},
 {market:'cn',lang:'zh-Hans',native:'法律英语',country:'China'},
 {market:'other',lang:'en',native:'welcomes adult professionals worldwide',country:'worldwide'}
]){
 test('HF56 worldwide enrollment accepts '+mode.country+' inquiry with preferred language preserved',async({page})=>{
  const inbound=[],errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/api/v1850/enroll',async route=>{
   inbound.push(JSON.parse(route.request().postData()||'{}'));
   await route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({ok:true,reference:'LOCAL-TEST-ONLY',received:true})});
  });
  await page.goto('/learn/enroll/?market='+encodeURIComponent(mode.market)+'&lang='+encodeURIComponent(mode.lang));
  const form=page.locator('#v1850-enroll-form');
  await expect(form).toBeVisible();
  await expect(form.locator('select[name="learner_market"]')).toHaveValue(mode.market);
  await expect(form.locator('select[name="preferred_contact_language"]')).toHaveValue(mode.lang);
  await expect(page.locator('#v1850-enroll-form p[lang="'+mode.lang+'"]')).toContainText(mode.native);
  await form.locator('input[name="full_name"]').fill('Example Learner');
  await form.locator('input[name="email"]').fill('example.learner@example.test');
  await form.getByRole('button',{name:'Submit enrollment inquiry'}).click();
  await expect(page.getByText('Inquiry received. Reference: LOCAL-TEST-ONLY')).toBeVisible();
  expect(inbound).toHaveLength(1);
  expect(inbound[0].note).toContain('Learner market='+mode.market);
  expect(inbound[0].note).toContain('preferred contact language='+mode.lang);
  expect(inbound[0].program).toBe('legal');
  expect(inbound[0].format).toBe('group');
  expect(inbound[0].note).toContain('support not yet confirmed');
  expect(inbound[0]).not.toHaveProperty('payment_method');
  expect(errors).toEqual([]);
  const dimensions=await page.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
  expect(dimensions[0]).toBeLessThanOrEqual(dimensions[1]+2);
 });
}
test('HF56 market switch does not block global adult enrollment or force a language',async({page})=>{
 await page.goto('/learn/enroll/');
 const form=page.locator('#v1850-enroll-form');
 await expect(form.locator('select[name="learner_market"]')).toHaveValue('other');
 await expect(form.locator('select[name="preferred_contact_language"]')).toHaveValue('en');
 await form.locator('select[name="learner_market"]').selectOption('vn');
 await expect(form.locator('select[name="preferred_contact_language"]')).toHaveValue('vi');
 await form.locator('select[name="preferred_contact_language"]').selectOption('en');
 await expect(form.locator('select[name="preferred_contact_language"]')).toHaveValue('en');
 await form.locator('select[name="learner_market"]').selectOption('cn');
 await expect(form.locator('select[name="preferred_contact_language"]')).toHaveValue('zh-Hans');
 await expect(page.locator('#v1850-enroll-form p[lang="zh-Hans"]')).toContainText('法律英语');
});
