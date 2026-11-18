'use strict';
// HF68 R3: deterministic browser-like lifecycle simulation; no network, student
// data, payment, calendar or email side effects. A waiting service worker can
// legitimately exist on page load on iPad/WebKit: only explicit user consent
// may activate it, and the UI may only advertise a genuinely waiting update.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../pwa-install.js'),'utf8');
const flush=async()=>{for(let i=0;i<6;i++)await Promise.resolve();};
function scenario({hasController,hasWaiting}){
 const listeners={};const elements={};let reloads=0,posted=0,registrations=0;
 function element(id,options={}){
  const e={id,hidden:options.hidden??false,disabled:options.disabled??false,textContent:'',events:{},
   addEventListener(type,fn){this.events[type]=fn;},click(){return this.events.click?.();}};
  elements[id]=e;return e;
 }
 for(const id of ['el-install-button','el-install-status','el-update-check','el-update-apply','el-update-status','el-app-network-status'])
  element(id,{hidden:id==='el-update-check'||id==='el-update-apply'});
 const worker={postMessage(payload){assert.equal(payload.type,'ENGLISHLEGALESE_APPLY_UPDATE');posted++;}};
 const registration={waiting:hasWaiting?worker:null,installing:null,events:{},
  addEventListener(name,callback){this.events[name]=callback;},async update(){}};
 const sw={controller:hasController?{scriptURL:'https://example.test/sw.js'}:null,
  listeners:{},addEventListener(name,callback){this.listeners[name]=callback;},
  async register(){registrations++;return registration;}};
 const document={getElementById:id=>elements[id]||null};
 const location={reload(){reloads++;}};
 const window={isSecureContext:true,location,
  matchMedia:()=>({matches:false}),
  addEventListener(name,callback){listeners[name]=callback;}};
 const navigator={serviceWorker:sw,onLine:true,standalone:false};
 vm.runInNewContext(source,{window,document,navigator,Promise,AbortController,console},{filename:'pwa-install.js',timeout:1500});
 return {elements,listeners,sw,worker,registration,async ready(){listeners.load();await flush();assert.equal(registrations,1);},
  async check(){await elements['el-update-check'].click();await flush();},
  controllerchange(){sw.listeners.controllerchange();},
  get posted(){return posted;},get reloads(){return reloads;}};
}
(async()=>{
 const regular=scenario({hasController:true,hasWaiting:false});
 await regular.ready();
 assert.equal(regular.elements['el-update-apply'].hidden,true,'No waiting update: no apply button');
 await regular.check();
 assert.equal(regular.elements['el-update-apply'].hidden,true,'Normal manual check must not falsely advertise update');
 assert.equal(regular.posted,0);assert.equal(regular.reloads,0);

 const noController=scenario({hasController:false,hasWaiting:true});
 await noController.ready();
 assert.equal(noController.elements['el-update-apply'].hidden,true,'A waiting worker without a controller is NOT an update ready to apply');
 assert.equal(noController.posted,0);

 const genuine=scenario({hasController:true,hasWaiting:true});
 await genuine.ready();
 assert.equal(genuine.elements['el-update-apply'].hidden,false,'A genuine waiting update should offer opt-in application');
 assert.equal(genuine.posted,0,'No automatic skipWaiting on page load');
 assert.equal(genuine.reloads,0,'No automatic page reload on page load');
 genuine.controllerchange();
 assert.equal(genuine.reloads,0,'External controllerchange cannot reload unsaved work');
 genuine.registration.waiting=null;
 await genuine.check();
 assert.equal(genuine.elements['el-update-apply'].hidden,true,'Stale waiting update must be withdrawn after recheck');
 genuine.registration.waiting=genuine.worker;
 await genuine.check();
 assert.equal(genuine.elements['el-update-apply'].hidden,false,'Fresh manual check can reoffer a genuine pending update');
 await genuine.elements['el-update-apply'].click();
 assert.equal(genuine.posted,1,'Only explicit Apply click sends skipWaiting message');
 assert.equal(genuine.elements['el-update-apply'].hidden,true);
 assert.equal(genuine.reloads,0,'Update should not reload before worker controllerchange');
 genuine.controllerchange();
 assert.equal(genuine.reloads,1,'Opt-in installation page may reload only after activation');
 genuine.controllerchange();
 assert.equal(genuine.reloads,1,'A second controllerchange cannot reload again');

 const broken=scenario({hasController:true,hasWaiting:true});
 await broken.ready();
 broken.worker.postMessage=()=>{throw Error('Synthetic worker unavailable');};
 await broken.elements['el-update-apply'].click();
 assert.equal(broken.reloads,0);
 broken.controllerchange();
 assert.equal(broken.reloads,0,'Failed message cannot authorize a later unsolicited reload');
 assert.match(broken.elements['el-update-status'].textContent,/could not be sent/i);
 console.log('PASS HF68 R3: real waiting updates are opt-in; missing controller/stale worker hidden; no automatic reload; failed message safe.');
})().catch(e=>{console.error(e);process.exitCode=1;});
