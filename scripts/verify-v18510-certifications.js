'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const levels=['A1','A2','B1','B2','C1','C2'];
const home=read('index.html'),app=read('app.js');
const hub=read('learn/certifications/index.html');
const legal=read('learn/legal-english-certification/index.html');
const business=read('learn/business-english-certification/index.html');
assert.equal(require('../package.json').version,'1.85.12');
for(const [track,doc,prefix]of [['legal',legal,'EL-LEG'],['business',business,'EL-BUS']]){
 assert(doc.includes('EnglishLegalese-issued'));
 assert(doc.includes('name="englishlegalese-release" content="1.85.12"'));
 assert(doc.includes('rel="canonical" href="https://englishlegalese.com/learn/'+track+'-english-certification/"'));
 assert(doc.includes('teacher-supervised')&&doc.includes('CEFR')&&doc.includes('before any credential can be issued'));
 assert(doc.includes('Council of Europe'));
 assert(doc.includes('Scores in the other specialist track do not transfer'));
 for(const level of levels)assert(doc.includes(prefix+'-'+level),'Missing separate '+track+' level '+level);
 assert(read('learn/'+track+'-english/index.html').includes('/learn/'+track+'-english-certification/'));
}
assert(legal.includes('legal correspondence')&&business.includes('investor')&&legal!==business);
assert(hub.includes('/learn/legal-english-certification/')&&hub.includes('/learn/business-english-certification/'));
assert(home.includes('<a href="/learn/certifications/">Certifications</a>'));
assert(app.includes('Explore EnglishLegalese Legal English and Business English certificates'));
assert(!legal.includes('Council of Europe logo')&&!business.includes('Council of Europe logo'));
assert(read('hf24-certifications.css').includes('.v1940-cert-grid'));
console.log('PASS HF24: original track-specific branded certificate frameworks, six distinct supervised levels each, overview and homepage promotion, no accredited/external equivalence claims.');
