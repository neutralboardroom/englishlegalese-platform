'use strict';
// HF74 R2: exact installed-app source tested under WebKit-style races.
// No real browser, network, student records or update activation is touched.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const code=fs.readFileSync(path.join(__dirname,'..','pwa-install.js'),'utf8');
class Element{
 constructor(){this.hidden=true;this.disabled=true;this.textContent='';this.handlers={};}
 addEventListener(type,fn){this.handlers[type]=fn;}
}
const ids=['el-install-button','el-install-status','el-update-check','el-update-apply','el-update-status','el-app-network-status'];
const els=Object.fromEntries(ids.map(id=>[id,new Element()]));
let loads=[],focus=[],visibility=[],controllerChanges=[],posts=0,reloads=0;
const registration={waiting:{postMessage(m){assert.equal(m.type,'ENGLISHLEGALESE_APPLY_UPDATE');posts++;}},
 installing:null,addEventListener(){},update:async()=>{}};
const sw={controller:null,addEventListener(type,cb){if(type==='controllerchange')controllerChanges.push(cb);},
 register:async()=>registration};
const navigator={onLine:true,serviceWorker:sw};
const window={isSecureContext:true,matchMedia:()=>({matches:false}),
 location:{reload(){reloads++;}},addEventListener(type,fn){if(type==='load')loads.push(fn);if(type==='focus')focus.push(fn);}};
const document={getElementById:id=>els[id]??null,addEventListener(type,fn){if(type==='visibilitychange')visibility.push(fn);},visibilityState:'visible'};
vm.runInNewContext(code,{window,document,navigator}, {filename:'pwa-install.js',timeout:4000});
assert.equal(loads.length,1);assert.equal(controllerChanges.length,1);
assert.equal(els['el-update-apply'].hidden,true,'Not controlled means no update button');
(async()=>{
 loads[0]();
 // Promise.resolve microtasks from register() must run before changing state.
 for(let i=0;i<5;i++)await Promise.resolve();
 assert.equal(els['el-update-apply'].hidden,true,'Still no controller after register');
 sw.controller={scriptURL:'https://englishlegalese.com/sw.js'};
 controllerChanges[0]();
 assert.equal(els['el-update-apply'].hidden,false,'True waiting+controller must make button visible');
 assert.equal(posts,0,'Must never apply worker update without click');
 assert.equal(reloads,0,'Controllerchange may not reload without opt-in');
 registration.waiting=null;
 assert.equal(focus.length,1);focus[0]();
 assert.equal(els['el-update-apply'].hidden,true,'Stale waiting button must disappear after focus');
 registration.waiting={postMessage(m){assert.equal(m.type,'ENGLISHLEGALESE_APPLY_UPDATE');posts++;}};
 visibility[0]();
 assert.equal(els['el-update-apply'].hidden,false,'Visible page must resync real waiting update');
 assert.equal(posts,0);assert.equal(reloads,0);
 els['el-update-apply'].handlers.click();
 assert.equal(posts,1,'Only explicit click may send update message');
 assert.equal(reloads,0,'Click alone may not reload before controller activation');
 controllerChanges[0]();
 assert.equal(reloads,1,'Explicitly approved update may reload only this page');
 controllerChanges[0]();
 assert.equal(reloads,1,'Subsequent unsolicited controller changes never reload');
 registration.waiting=null;focus[0]();
 assert.equal(els['el-update-apply'].hidden,true,'No waiting worker means no update button');
 console.log('PASS HF74 R2: delayed WebKit controller, waiting-state reconciliation, focus/visibility refresh, and explicit-only update activation and reload.');
})().catch(error=>{console.error(error);process.exitCode=1;});
