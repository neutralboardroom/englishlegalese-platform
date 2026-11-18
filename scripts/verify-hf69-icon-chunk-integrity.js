"use strict";
/* HF69: independent offline tamper-test. This executes the real public
   installer with fake device and fetch, without any network or private state. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'pwa-install.js'),'utf8');
const html=fs.readFileSync(path.join(root,'learn/install/index.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const icons=new Map([192,512].map(size=>[size,fs.readFileSync(path.join(root,'assets/englishlegalese-app-icon-'+size+'.png'))]));
assert.ok(html.includes('pwa-install.js?v=hf68&integrity=hf69'),'New URL must invalidate cached HF68 script without breaking inherited v=hf68 checks');
assert.ok(source.includes('0xEDB88320'),'Verify PNG CRC polynomial is present');
const cases=['clean','bad_crc','truncated','wrong_ihdr','bad_magic','trailing','bad_color','bad_critical','tampered_pixel'];
function modify(input,mode){
 const b=Buffer.from(input);
 if(mode==='bad_crc')b[b.length-6]^=1; // IEND CRC changes; no valid PNG can pass
 if(mode==='tampered_pixel')b[Math.floor(b.length/2)]^=1; // IDAT CRC mismatch
 if(mode==='wrong_ihdr')b.writeUInt32BE(500,16); // dimensions + CRC mismatch
 if(mode==='bad_magic')b[0]=0;
 if(mode==='bad_color')b[25]=255;
 if(mode==='truncated')return b.subarray(0,b.length-1);
 if(mode==='trailing')return Buffer.concat([b,Buffer.from([7])]);
 if(mode==='bad_critical'){ // insert nonstandard critical chunk with valid CRC
  const chunk=Buffer.alloc(12);chunk.write('ZZZZ',4);
  let crc=0xFFFFFFFF;for(let i=4;i<8;i++){crc^=chunk[i];for(let k=0;k<8;k++)crc=(crc>>>1)^((crc&1)?0xEDB88320:0);}
  chunk.writeUInt32BE((crc^0xFFFFFFFF)>>>0,8);
  return Buffer.concat([b.subarray(0,b.length-12),chunk,b.subarray(b.length-12)]);
 }
 return b;
}
async function probe(mode){
 class Element{
  constructor(){this.events={};this.children=[];this.disabled=false;this.hidden=false;this.textContent='';}
  addEventListener(k,fn){this.events[k]=fn;}
  replaceChildren(){this.children=[];}
  append(x){this.children.push(x);}
 }
 const ids=['el-install-button','el-install-status','el-update-check','el-update-apply','el-update-status','el-app-network-status','el-device-check','el-device-check-status','el-device-check-results'];
 const elements=Object.fromEntries(ids.map(k=>[k,new Element()]));
 const requests=[];
 const document={getElementById:id=>elements[id]||null,createElement:()=>new Element()};
 const window={isSecureContext:true,matchMedia:()=>({matches:false}),addEventListener(){},location:{reload(){throw new Error('No unsolicited reload');}}};
 const navigator={onLine:true,serviceWorker:{controller:null,addEventListener(){},getRegistration:async()=>null,register:async()=>({addEventListener(){}})}};
 const fetch=async(url,opts)=>{
  requests.push(url);
  assert.equal(opts.credentials,'omit');assert.equal(opts.cache,'no-store');assert.equal(opts.redirect,'error');
  assert.equal(opts.method,'GET');
  assert.ok(['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png'].includes(url),'No private URLs may be accessed');
  const size=Number((url.match(/icon-(192|512)\.png/)||[])[1]);
  return {ok:true,redirected:false,headers:{get:key=>key==='content-type'?size?'image/png':'application/manifest+json':null},json:async()=>manifest,arrayBuffer:async()=>{
   const bytes=modify(icons.get(size),mode);return bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.length);
  }};
 };
 vm.runInNewContext(source,{window,navigator,document,fetch,Promise,Uint8Array,DataView,String,AbortController},{filename:'pwa-install.js',timeout:2500});
 assert.equal(requests.length,0,'No network call before click');
 await elements['el-device-check'].events.click();
 assert.deepEqual(requests,['/manifest.webmanifest','/assets/englishlegalese-app-icon-192.png','/assets/englishlegalese-app-icon-512.png']);
 assert.equal(elements['el-device-check'].disabled,false);
 return elements['el-device-check-results'].children.map(e=>e.textContent);
}
(async()=>{
 for(const c of cases){
  const rows=await probe(c);
  for(const s of [192,512]){
   const line=rows.find(row=>row.startsWith('App icon '+s+'px: '));
   assert.ok(line,'Missing '+s+'px result');
   assert.equal(line.includes('Valid '+s+'×'+s+' PNG'),c==='clean','Case '+c+' should '+(c==='clean'?'pass':'FAIL')+' for '+s);
  }
 }
 console.log('PASS HF69: both original icons pass; CRC, tampered IDAT, truncation, trailing bytes, fake dimensions/magic, bogus critical chunk and color rejected; public-only opt-in checks.');
})().catch(e=>{console.error(e);process.exitCode=1;});
