'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const prices=read('pricing/index.html');
const pos=prices.indexOf('id="hf36-membership-prices"');
const legacy=prices.indexOf('<section id="pricing"');
assert.ok(pos>0 && pos<legacy,'new subscription prices appear above existing protected pricing grid');
assert.equal((prices.match(/id="v1970-shared-pricing"/g)||[]).length,1,'only one shared comparison heading');
const newBlock=prices.slice(pos,legacy);
for(const price of ['$12','$19','$29','$79','$25','$23','$21'])assert.ok(newBlock.includes(price),'visible planned price '+price);
for(const flag of ['renew automatically until canceled','keep access through the period already paid for','proposed prices','not active'])assert.ok(newBlock.toLowerCase().includes(flag.toLowerCase()),'required terms '+flag);
for(const p of ['pricing/index.html','learn/legal-english/index.html','learn/business-english/index.html','learn/employers/index.html']){
 const html=read(p);
 assert.ok(html.includes('/hf36-membership-pricing.css?v=hf36'),p+' stylesheet loaded');
 for(const price of ['$12','$19','$29','$79','$25','$23','$21'])assert.ok(html.includes(price),p+' shows '+price);
}
const individual=read('learn/memberships/index.html');
assert.ok(individual.includes('id="v1970-individual-heading"'));
assert.ok(individual.includes('id="v1970-team-heading"'));
assert.ok(prices.includes('/learn/memberships/#v1970-team-heading'));
assert.ok(individual.includes('Cancel any time before the next renewal'));
assert.ok(!newBlock.includes('Get membership now')&&!newBlock.includes('Pay now'),'no false live checkout');
const home=read('index.html');
assert.ok(home.includes('HF31-image-led-first-screen'));
assert.ok(home.includes('Planned memberships: one subscription for both Legal English and Business English.'));
assert.ok(read('learn/account/index.html').includes('Starter $12, Plus $19, Pro $29, Guided $79'));
console.log('PASS HF36: membership monthly prices and terms prominent and consistent across pricing, program, employer, account and homepage sections.');
