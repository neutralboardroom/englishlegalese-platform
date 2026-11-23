const {test,expect}=require('@playwright/test');
test('HF92 public mobile learning home links to actual protected site routes',async({page})=>{
 await page.goto('/learn/app/');
 await expect(page).toHaveTitle(/EnglishLegalese mobile learning home/);
 await expect(page.getByRole('heading',{level:1})).toContainText('Professional English');
 for(const section of ['learn','practice','classes','account']){
  await expect(page.locator('#'+section)).toBeVisible();
  await expect(page.locator('nav.bottom-nav a[href="#'+section+'"]').first()).toBeVisible();
 }
 await expect(page.getByRole('link',{name:/Legal English Contracts/})).toHaveAttribute('href','/learn/legal-english/');
 await expect(page.getByRole('link',{name:/Business English Meetings/})).toHaveAttribute('href','/learn/business-english/');
 await expect(page.getByRole('link',{name:/Request enrollment/})).toHaveAttribute('href','/learn/enroll/');
 await expect(page.getByText(/no App Store or Google Play release yet/)).toBeVisible();
 const viewport=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,vw:innerWidth}));
 expect(viewport.sw).toBeLessThanOrEqual(viewport.vw+1);
});
test('HF92 public mobile home never posts, records, or calls private APIs by itself',async({page})=>{
 const unsafe=[];
 page.on('request',req=>{if(req.method()!=='GET'||new URL(req.url()).pathname.startsWith('/api/'))unsafe.push(req.method()+' '+req.url());});
 await page.goto('/learn/app/');
 await page.locator('.bottom-nav a[href="#practice"]').click();
 await expect(page).toHaveURL(/#practice$/);
 expect(unsafe).toEqual([]);
});
