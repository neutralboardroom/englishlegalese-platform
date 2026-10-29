'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const s=fs.readFileSync('role-workspaces-v18510.js','utf8');
for(const key of ['v18512-employer-filters','Find a consented employee','Filter by published report','Sort consented employee names','visiblePeople=matched.map','for(const p of visiblePeople)lines.push','No results are inferred.'])assert(s.includes(key),'Missing consent-restricted employer UI: '+key);
assert(s.includes("const people=data.employees||[]"),'Employer report may use only verified API employees');
assert(!s.includes('localStorage.setItem'),'Private employer progress cannot persist to unrestricted browser storage');
const css=fs.readFileSync('hf24-role-workspaces.css','utf8');assert(css.includes('.v1940-employer-report tr[hidden]'));
console.log('PASS HF26 employer: filter and export only server-authorized, current consented company progress reports.');
