"use strict";
/* HF70: verify valid-CRC malformed PNGs fail closed and body stalls settle.
 * No network, login, persistent storage, marketing, or student information. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(root,'pwa-install.js'),'utf8');
const html=fs.readFileSync(path.join(root,'learn/install/index.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const icons=new Map([192,512].map(n=>[n,fs.readFileSync(path.join(root,`assets/englishlegalese-app-icon-${n}.png`))]));
assert.ok(html.includes('pwa-install.js?v=hf68&integrity=hf69&strict=hf70'));
const crcChunk=(name,data)=>{
 const c=Buffer.alloc(12+data.length);c.writeUInt32BE(data.length,0);c.write(name,4,4,'ascii');data.copy(c,8);
 let crc=0xFFFFFFFF;
 for(let i=4;i<8+data.length;i++){crc^=c[i];for(let j=0;j<8;j++)crc=(crc>>>1)^((crc&1)?0xEDB88320:0);}
 c.writeUInt32BE((crc^0xFFFFFFFF)>>>0,8+data.length);return c;
};
function chunks(buffer){let pos=8,result=[];while(pos<buffer.length){const n=buffer.readUInt32BE(pos),t=buffer.toString('ascii',pos+4,pos+8);result.push([t,buffer.subarray(pos+8,pos+8+n)]);pos+=n+12;}return result;}
function deform(raw,mode){
 if(mode==='clean'||mode==='slow_body'||mode==='invalid_length')return raw;
 const cs=chunks(raw).map(([t,data])=>[t,Buffer.from(data)]);
 const pl=cs.find(x=>x[0]==='PLTE'), id=cs.find(x=>x[0]==='IDAT'),ih=cs.find(x=>x[0]==='IHDR');
 if(mode==='missing_palette')cs.splice(cs.findIndex(x=>x[0]==='PLTE'),1);
 if(mode==='duplicate_palette')cs.splice(2,0,['PLTE',pl[1]]);
 if(mode==='palette_after_idat'){cs.splice(1,1);cs.splice(cs.findIndex(x=>x[0]==='IDAT')+1,0,['PLTE',pl[1]]);}
 if(mode==='split_idat'){
   const pos=cs.findIndex(x=>x[0]==='IDAT');const half=Math.floor(id[1].length/2);
   cs.splice(pos,1,['IDAT',id[1].subarray(0,half)],['tEXt',Buffer.from('note\u0000hi')],['IDAT',id[1].subarray(half)]);
 }
 if(mode==='bad_interlace')ih[1][12]=3;
 if(mode==='reserved_bit')cs.splice(2,0,['texT',Buffer.alloc(0)]);
 if(mode==='zero_idat')id[1]=Buffer.alloc(0);
 if(mode==='tiny_palette')pl[1]=Buffer.from([1,2]);
 if(mode==='early_iend'){cs.splice(cs.findIndex(x=>x[0]==='IDAT'),1);}
 return Buffer.concat([raw.subarray(0,8),...cs.map(([t,d])=>crcChunk(t,d))]);
}
async function check(mode, size){
 class E{constructor(){this.children=[];this.disabled=false;this.textContent='';this.e={};this.hidden=true;}
 addEventListener(k,f){this.e[k]=f;}replaceChildren(){this.children=[];}append(x){this.children.push(x);}}
 const ids=['el-install-button','el-install-status','el-update-check','el-update-apply','el-update-status','el-app-network-status','el-device-check','el-device-check-status','el-device-check-results'];
 const es=Object.fromEntries(ids.map(id=>[id,new E()]));
 const calls=[];let aborts=0;
 class Controller{constructor(){this.signal={};}abort(){aborts++;}}
 const fetch=async (url,opts)=>{
  calls.push(url);
  assert.equal(opts.credentials,'omit');assert.equal(opts.cache,'no-store');assert.equal(opts.redirect,'error');assert.equal(opts.method,'GET');
  assert.ok(['/manifest.webmanifest',...Array.from(icons.keys()).map(n=>`/assets/englishlegalese-app-icon-${n}.png`)].includes(url));
  const n=Number((url.match(/icon-(192|512)\.png/)||[])[1]);
  return {ok:true,redirected:false,headers:{get:k=>k==='content-type'?(n?'image/png':'application/manifest+json'):k==='content-length'&&mode==='invalid_length'?'bogus':null},json:async()=>manifest,arrayBuffer:async()=>mode==='slow_body'&&n===size?new Promise(()=>{}):(()=>{const b=deform(icons.get(n),mode);return b.buffer.slice(b.byteOffset,b.byteOffset+b.length);})()};
 };
 const window={isSecureContext:true,matchMedia:()=>({matches:false}),addEventListener(){},location:{reload(){throw Error('No reload');}}};
 const document={getElementById:id=>es[id]||null,createElement:()=>new E()};
 const navigator={onLine:true,serviceWorker:{controller:null,addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})}};
 const clock=(fn,ms)=>setTimeout(fn,ms===7000?5:ms);
 vm.runInNewContext(js,{window,document,navigator,fetch,Promise,Uint8Array,DataView,String,AbortController:Controller,setTimeout:clock,clearTimeout},{filename:'pwa-install.js',timeout:2500});
 assert.equal(calls.length,0,'Only after click');
 await es['el-device-check'].e.click();
 assert.deepEqual(calls,['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png']);
 assert.equal(es['el-device-check'].disabled,false);
 const rows=es['el-device-check-results'].children.map(e=>e.textContent);
 assert.equal(rows.length,7);
 const row=rows.find(x=>x.startsWith('App icon '+size+'px:'));
 assert.ok(row);
 const valid=row.includes(`Valid ${size}×${size} PNG`);
 assert.equal(valid,mode==='clean','Mode '+mode+' failed on '+size+': '+row);
 if(mode==='slow_body')assert.ok(aborts>=1,'Timeout must abort body read');
 assert.equal(es['el-device-check-status'].textContent.includes('check finished'),true);
}
(async()=>{
 for(const mode of ['clean','missing_palette','duplicate_palette','palette_after_idat','split_idat','bad_interlace','reserved_bit','zero_idat','tiny_palette','early_iend','invalid_length','slow_body']){
  for(const size of [192,512])await check(mode,size);
 }
 console.log('PASS HF70: both real icon sizes and ten structural/semantic/timeout failures; no automatic network calls, credentials, private routes, reloads or saved work');
})().catch(e=>{console.error(e);process.exitCode=1});
