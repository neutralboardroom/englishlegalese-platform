'use strict';
/* HF74: self-contained execution of the actual public PWA checker in a VM.
 * No external calls, real clipboard use, persistence, student data or accounts. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'pwa-install.js'),'utf8');
const html=fs.readFileSync(path.join(root,'learn/install/index.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const png=new Map([192,512].map(s=>[s,fs.readFileSync(path.join(root,`assets/englishlegalese-app-icon-${s}.png`))]));
const allowed=['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png'];
for(const language of ['th','vi','zh-Hans']) {
 assert.ok(html.includes(`<details lang="${language}">`),`${language} help must be available without JavaScript`);
}
for(const exact of ['ติดตั้งแอป','เพิ่มไปยังหน้าจอโฮม','Cài đặt ứng dụng','Thêm vào Màn hình chính','安装应用','添加到主屏幕'])
 assert.ok(html.includes(exact),'Missing translated mobile browser help: '+exact);
assert.ok(html.includes('id="el-device-check-copy" type="button" hidden'),'Result copying must be opt-in');
assert.ok(html.includes('role="status" aria-live="polite" class="muted"'),'Copy announcement must be accessible');
assert.ok(html.includes('&public=hf74&copy=hf74'),'New browser must obtain HF74 client code');
function arrayBuffer(b){return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);}
async function scenario(mode){
 class Element{
  constructor(){this.textContent='';this.disabled=false;this.hidden=true;this.children=[];this.events={};}
  addEventListener(type,fn){this.events[type]=fn;}
  replaceChildren(){this.children=[];}
  append(e){this.children.push(e);}
 }
 const ids=['el-install-button','el-install-status','el-update-check','el-update-apply',
  'el-update-status','el-app-network-status','el-device-check','el-device-check-status',
  'el-device-check-results','el-device-check-help','el-device-check-copy','el-device-check-copy-status'];
 const elements=Object.fromEntries(ids.map(x=>[x,new Element()]));
 const calls=[],written=[];
 let released=null,resolveHold=null;
 let hostile=structuredClone(manifest);
 if(mode==='remote_icon')hostile.icons.push({src:'https://outside.example.com/icon.png',sizes:'96x96',type:'image/png'});
 if(mode==='protocol_relative_icon')hostile.icons.push({src:'//outside.example.com/icon.png',sizes:'96x96',type:'image/png'});
 if(mode==='remote_shortcut')hostile.shortcuts.push({url:'https://outside.example.com/login',name:'Login'});
 if(mode==='traversal_shortcut')hostile.shortcuts.push({url:'/learn/../account/',name:'Login'});
 const fetch=async(url,options)=>{
  assert.ok(allowed.includes(url),'No private or external request: '+url);
  assert.equal(options.method,'GET');assert.equal(options.credentials,'omit');
  assert.equal(options.cache,'no-store');assert.equal(options.redirect,'error');
  calls.push(url);
  if(mode==='concurrent'&&url===allowed[0])await new Promise(resolve=>{resolveHold=resolve;});
  const data=url===allowed[0]?Buffer.from(JSON.stringify(hostile)):
   png.get(Number(url.match(/icon-(\d+)/)[1]));
  return {ok:true,redirected:false,headers:{get(name){return name==='content-type'?
    (url===allowed[0]?'application/manifest+json':'image/png'):
    name==='content-length'?String(data.length):null;}},
   arrayBuffer:async()=>arrayBuffer(data)};
 };
 const navigator={onLine:true,serviceWorker:{controller:null,addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})}};
 if(mode!=='no_clipboard')navigator.clipboard={writeText:async content=>{
  if(mode==='denied_clipboard')throw Error('Permission denied');
  written.push(content);
 }};
 const window={Response:function Response(){},isSecureContext:true,matchMedia:()=>({matches:false}),
  addEventListener(){},location:{reload(){throw Error('Automatic reload forbidden');}}};
 const document={getElementById:id=>elements[id]??null,createElement:()=>new Element()};
 const sandbox={window,document,navigator,fetch,Promise,Uint8Array,DataView,Blob,TextDecoder,
  AbortController:class{constructor(){this.signal={};}abort(){}},
  createImageBitmap:async blob=>({width:blob.size===png.get(192).length?192:512,
   height:blob.size===png.get(192).length?192:512,close(){}}),setTimeout,clearTimeout};
 vm.runInNewContext(source,sandbox,{filename:'pwa-install.js',timeout:3500});
 assert.deepEqual(calls,[],'Must never fetch before explicit click');
 const check=elements['el-device-check'],copy=elements['el-device-check-copy'];
 await copy.events.click();
 assert.deepEqual(written,[],'Copy before check must not touch clipboard');
 assert.equal(copy.hidden,true,'Copy action stays hidden until results are available');
 const first=check.events.click();
 if(mode==='concurrent'){
  await new Promise(resolve=>setImmediate(resolve));
  const second=check.events.click();
  await second;
  assert.equal(calls.length,1,'Concurrent clicks must not create duplicate requests');
  assert.equal(check.disabled,true,'Button disabled for pending diagnostic');
  assert.equal(copy.hidden,true,'Copy remains hidden during pending check');
  resolveHold();
 }
 await first;
 assert.deepEqual(calls,allowed,'Exactly three user-initiated public requests');
 assert.equal(check.disabled,false,'Diagnostic button must recover');
 const rows=elements['el-device-check-results'].children.map(x=>x.textContent);
 assert.equal(rows.length,7,'Retain seven visible checks');
 assert.equal(copy.hidden,false,'Copy is offered only after complete check');
 assert.ok(elements['el-device-check-help'].children.length,'Visible followup guidance');
 const manifestRow=rows.find(x=>x.startsWith('App manifest:'));
 if(['remote_icon','protocol_relative_icon','remote_shortcut','traversal_shortcut'].includes(mode)){
  assert.ok(!manifestRow.includes('Present and configured'),'Unsafe extra manifest entry cannot pass');
  assert.match(manifestRow,/missing required app settings/i);
 }else assert.match(manifestRow,/Present and configured/);
 await copy.events.click();
 if(mode==='no_clipboard')assert.match(elements['el-device-check-copy-status'].textContent,/unavailable/);
 else if(mode==='denied_clipboard')assert.match(elements['el-device-check-copy-status'].textContent,/not allowed/);
 else{
  assert.equal(written.length,1,'Copy once only on a second explicit click');
  for(const row of rows)assert.ok(written[0].includes(row),'Only current result rows copied');
  assert.ok(written[0].startsWith('EnglishLegalese public app readiness (no private data)'));
  assert.ok(!/student|email|password|token|cookie|user-agent|location=/i.test(written[0]),'Copy must omit personal data/identifiers');
 }
 assert.deepEqual(calls,allowed,'Clipboard action may not trigger further network');
 return mode;
}
(async()=>{
 const modes=['normal','remote_icon','protocol_relative_icon','remote_shortcut','traversal_shortcut',
  'concurrent','no_clipboard','denied_clipboard'];
 for(const m of modes)await scenario(m);
 console.log('PASS HF74: 8 safe-public VM scenarios, third-party manifest rejection, concurrent-request suppression, click-only clipboard, accessible Thai/Vietnamese/Chinese install guidance, no private/external network or data.');
})().catch(e=>{console.error(e);process.exitCode=1;});
