#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..');const get=p=>fs.readFileSync(path.join(root,p),'utf8');
const hub=get('learn/app/index.html'),app=get('assets/hf93-mobile-conversations.js'),r1=get('owner-rules/RDR-001.md'),r2=get('owner-rules/RDR-002.md');
let n=0;function ok(bool,msg){assert.ok(bool,msg);++n;}
ok(hub.includes('Full website navigation and all free tools'),'all inherited free resource navigation visible on demand');
for(const p of ['/learn/legal-english/','/learn/business-english/','/learn/conversation-rehearsal/','/learn/enroll/','/learn/account/','/learn/install/'])ok(hub.includes(p),'legacy route preserved '+p);
for(const id of ['learn','practice','classes','account','hf93-conversation-lab','hf93-start','hf93-stop','hf93-restart','hf93-question','hf93-to-transfer','hf93-reveal','hf93-next'])ok(hub.includes('id="'+id+'"'),'interactive/legacy id '+id);
ok(hub.includes('src="/assets/hf93-mobile-conversations.js"'),'app loads source-specific script');
ok(hub.includes('no sign-in')||hub.includes('No sign-in'),'clear no-account disclosure');
ok(hub.includes('cannot hear, record, or assess pronunciation')&&hub.includes('does not certify speaking ability'),'honest non-grading disclosure');
ok(app.includes('scenarios={')&&app.includes('legal:[')&&app.includes('business:['),'two original professional contexts');
ok((app.match(/title:'/g)||[]).length===6,'six original full professional conversations');
for(const d of ['const right=number===scenario.correct','if(!right)','stage=\'speaking\'','stage=\'transfer\'','function stop()','document.createTextNode','textContent='])ok(app.includes(d),'relevant safety/interaction '+d);
for(const forbidden of [/\bfetch\s*\(/,/\bXMLHttpRequest\b/,/\bindexedDB\s*\./,/\blocalStorage\s*\./,/\bsessionStorage\s*\./,/\.mediaDevices\b/,/\.getUserMedia\s*\(/,/\bWebSocket\s*\(/,/\binnerHTML\s*=/,/\bSpeechRecognition\b/])ok(!forbidden.test(app),'no remote/private-data/speech grading operation '+forbidden.source);
ok(!hub.includes('src="https://'),'new mobile feature does not import remote script');
ok(r1.includes('MASTER ROGER DURABLE RULE')&&r2.includes('No dilution, no loss of intention'),'verbatim owner rule files packaged');
ok(get('mobile/native/www/index.html').includes('Development build only'),'native prototype not advertised live');
ok(get('sw.js').includes('PUBLIC_FALLBACK_PATHS')&&!get('sw.js').includes('hf93-mobile-conversations.js'),'unchanged offline private-data safety');
console.log('HF93 benefit-first static safeguard assertions PASS '+n);
