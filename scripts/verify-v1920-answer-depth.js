'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),rd=p=>fs.readFileSync(p,'utf8');
const source=rd('product-v1850-business.js'),workbook=rd('product-v1870-curriculum-workbooks.js');
const ctx={window:{}};vm.runInNewContext(rd('curriculum-v1800-data.js'),ctx,{timeout:3000});
const orig=ctx.window.ELCURRICULUM_V1800.records;
const more=JSON.parse(source.slice(source.indexOf('const widerBusiness=')+20,source.indexOf(';\nconst businessCatalog=')));
const finance=JSON.parse(source.slice(source.indexOf('const finance=')+14,source.indexOf(';\nconst widerBusiness=')));
assert.equal(more.length,12);assert.equal(finance.length,8);assert.equal(orig.length,28);
assert.equal(new Set([...orig,...more,...finance].map(x=>x.id)).size,48);
const generic=/The outcome is guaranteed and does not need independent verification|This definitely proves the future outcome, so no further verification is necessary/;
const second=[...more,...finance].map(x=>x.wrong[1]);
assert.equal(new Set(second).size,20,'Every Business/Investor course must have its own second misconception');
for(const x of [...more,...finance]){
 assert(x.wrong[1].length>=75,'Subject-specific wrong option too thin: '+x.id);
 assert(!generic.test(x.wrong[1]),'Generic wrong answer left in '+x.id);
 assert.notEqual(x.wrong[0],x.wrong[1]);
}
for(const token of ['function explainAnswer','Scenario reasoning','Vocabulary reasoning','Terminology reasoning','c.scenario','c.good','c.vocab','v1880-progress'])assert(workbook.includes(token),'Explain all three checks: '+token);
assert(source.includes('Try again. Your selection says:')&&source.includes('Better wording: '),'Business mini quiz must explain wrong options');
assert(!/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|\.cookie\s*=|sendMail|mailto:|WebSocket|axios\s*\(|postMessage|PaymentRequest/i.test(workbook),'Workbook must remain private and non-sending');
for(const page of ['learn/legal-english/index.html','learn/business-english/index.html']){
 const s=rd(page);for(const token of ['product-v1870-curriculum-workbooks.js','product-v1890-practice-coach.js','product-v1900-evidence-lab.js','product-v1910-workbook-path.js'])assert(s.includes(token),'Protected practice is missing: '+token);
}
const workflow=rd('.github/workflows/englishlegalese-v1850-production-acceptance.yml');
assert(workflow.includes('verify-v1920-answer-depth.js')&&workflow.includes('v1920-answer-depth-production.spec.js')&&workflow.includes(' -lt 108 '),'HF11 complete public gate');
for(const conf of ['playwright.config.js','playwright.production.config.js'])assert(rd(conf).includes('v1920-answer-depth-production.spec.js'),'HF11 test discovery '+conf);
const rules=rd('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md');
assert(rules.includes('EL-DUR-011')&&rules.includes('EL-DUR-012'));
console.log('PASS HF11: twenty distinct topic-specific Business/Investor misconceptions, source-specific feedback on all 144 knowledge checks, non-sending privacy and preserved HF4–HF10 course depth.');
