#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
function read(file){ return fs.readFileSync(path.join(root, file), 'utf8'); }
function must(file, needle){ const text = read(file); if(!text.includes(needle)){ throw new Error(`${file} missing: ${needle}`); } }
[
  ['package.json','1.54.0'],
  ['server.js','/api/v147/simplicity-command-pass'],
  ['server.js','/api/v147/role-next-action-plan'],
  ['server.js','/api/v147/data-continuity-gate'],
  ['server.js','/api/v147/employer-privacy-snapshot'],
  ['app.js','v1.47.0 Simplicity Command Pass'],
  ['app.js','v147-simplicity-command'],
  ['app.js','AI can translate words. EnglishLegalese trains judgment'],
  ['index.html','#v147-simplicity-command'],
  ['styles.css','v1.47 Simplicity Command Pass'],
  ['SAFE_DEPLOYMENT_CHECKLIST.md','v1.47.0'],
  ['README.md','v1.47.0'],
  ['RELEASE_NOTES.md','v1.47.0']
].forEach(([file, needle]) => must(file, needle));
console.log('v1.47 simplicity command verification passed');
