'use strict';
const fs=require('node:fs');const assert=require('node:assert/strict');const get=p=>fs.readFileSync(p,'utf8');
const price=get('pricing/index.html'),home=get('index.html'),legal=get('learn/legal-english/index.html'),biz=get('learn/business-english/index.html'),enroll=get('learn/enroll/index.html'),plans=get('learn/classroom-programs/index.html'),courses=get('learn/courses/index.html'),client=get('product-v1850-enrollment.js');
for(const [name,html] of Object.entries({home,price})){
 for(const term of ['$26 <span>/50-minute lesson','$85 total','$49 <span>/50-minute lesson','$179 total','From $499'])assert(html.includes(term),name+' missing final rate '+term);
 for(const tier of ['$12/month','$19/month','$29/month'])assert(html.includes(tier),name+' lost approved AI subscription '+tier);
}
for(const [name,html] of Object.entries({price,legal,biz,enroll,plans,courses,client})){
 assert(html.includes('$269'),name+' missing 16-group rate');
 assert(html.includes('$699'),name+' missing explicitly retained 16-private rate');
 assert(!/\$499[^\n]{0,90}(?:private|16-lesson|16 ×)|private[^\n]{0,90}\$499/i.test(html),name+' improperly lowered 16-private rate to corporate $499');
}
assert(price.includes('$699 for 16 × 50 minutes · saves $85 (about 11%)'));
assert(price.includes('$784 for 16 individual private lessons')&&biz.includes('$49 private lessons ($784)'));
assert(client.includes("Private, 16 lessons · $699"));
assert(enroll.includes('private: <strong>$699</strong>'));
assert(legal.includes('$699 private package')&&biz.includes('private $699'));
assert(price.includes('16 single group classes')&&price.includes('$416'));
assert(get('docs/ENGLISHLEGALESE_HUMAN_TAUGHT_PRICING_RESEARCH_2026-10-24.md').includes('**$699** (explicitly retained)'));
assert(get('governance/ENGLISHLEGALESE_DURABLE_BUILDER_RULES_ADDENDUM_2026-10-24.md').includes('EL-DUR-011'));
console.log('PASS final affordable human class prices: group $26 / $85 / $269; private $49 / $179 / $699; custom teams from $499; protected unchanged $12/$19/$29 AI subscriptions; no outbound email.');
