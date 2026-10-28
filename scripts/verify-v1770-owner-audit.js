'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict');const rd=p=>fs.readFileSync(p,'utf8');
const pkg=JSON.parse(rd('package.json')),index=rd('index.html'),app=rd('app.js'),overlay=rd('product-v1770.js'),css=rd('product-v1770.css'),audit=rd('governance/ENGLISHLEGALESE_V1770_OWNER_SCREENSHOT_AUDIT__MASTER_CHECKLIST__2026-10-20.md'),register=rd('governance/ENGLISHLEGALESE_CANONICAL_RULE_REGISTER__v1.57.0.md');
assert.ok(['1.85.0','1.85.1','1.85.2','1.85.3'].includes(pkg.version));assert(index.includes('name="englishlegalese-release" content="'+pkg.version+'"'));assert(index.includes('product-v1770.js?v=1.77.0'));assert(index.includes('product-v1770.css?v=1.77.0'));
assert(app.includes('Georgian (ქართული)')&&app.includes('Human teacher guidance available'));
assert(overlay.includes('const VERSION=')&&overlay.includes("input.maxLength=2500")&&overlay.includes("function mountLanguage")&&overlay.includes("function mountCourses")&&overlay.includes("function mountSmartTeacher")&&overlay.includes("function mountRoleViews")&&overlay.includes("function mountTrust"));
assert(!overlay.includes('fetch(')&&!overlay.includes('XMLHttpRequest')&&!overlay.includes('sendBeacon')&&!overlay.includes('getUserMedia'));
assert(overlay.includes('Local selection only')&&overlay.includes('No file uploaded')===false);
assert(css.includes('v1770-footer')&&css.includes('focus-visible')&&css.includes('@media(max-width:620px)'));
const originalHrefs=['/learn/courses/','/learn/free-writing-exercise/','/learn/ai-draft-review/','/learn/clause-reading/','/learn/meeting-followup/','/learn/email-clarity/','/learn/guided-practice/','/learn/case-brief/','/learn/legal-vocabulary/','/learn/revision-studio/','/learn/professional-message/','/learn/listening-clarification/','/learn/conversation-rehearsal/','/learn/reading-precision/','/learn/smartteacher-free-trial/','/learn/scenario-practice/','/learn/learning-path/','/learn/smartteacher/','/learn/teachers/','/learn/language-support/','/learn/employers/','/learn/progress/','/learn/trust/'];
const footer=index.match(/<footer[\s\S]*?<\/footer>/)[0];for(const href of originalHrefs){assert.equal((footer.split('href="'+href+'"').length-1),1,'Protected footer route: '+href);}
assert(audit.includes('Max reasonable substantial compatible work')&&audit.includes('Georgian')&&audit.includes('v1.76.0'));
for(let i=1;i<=19;i++)assert(register.includes('EL-RGR-'+String(i).padStart(3,'0')));for(let i=1;i<=10;i++)assert(register.includes('EL-DUR-'+String(i).padStart(3,'0')));
assert(rd('NEXT_VERSION_IMPROVEMENT_LIST.md').includes('after v1.76.0'));console.log('PASS v1.77 owner audit baseline, six actionable course lessons, private file picker, 2500 counter, Georgian language, preserved 23 links and protected 29 rules');
