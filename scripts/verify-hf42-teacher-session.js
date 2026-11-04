'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs');
const js=fs.readFileSync('product-v2040-teacher-session.js','utf8');
const data=js.match(/const phases=(\[[\s\S]*?\]);\n const make=/);
assert.ok(data,'teacher lesson schedule exists');
const phases=JSON.parse(data[1].replace(/([{,]\s*)(start|end|name|instruction):/g,'$1"$2":').replace(/'/g,'"'));
assert.equal(phases.length,8);
assert.equal(phases[0].start,0);assert.equal(phases.at(-1).end,50);
assert.equal(phases.reduce((sum,x,i)=>sum+(x.end-x.start),0),50);
for(let i=1;i<phases.length;i++)assert.equal(phases[i-1].end,phases[i].start,'no timeline gap');
for(const page of ['learn/continuing-practice/index.html','learn/continuing-practice/advanced/index.html'].map(x=>fs.readFileSync(x,'utf8'))){
 assert.equal((page.match(/<article class="v1971-lesson"/g)||[]).length,12);
 for(const item of ['product-v2020-paired-dialogues','product-v2030-listen-repeat','product-v2040-teacher-session.js?v=hf42','hf42-teacher-session.css?v=hf42'])assert.ok(page.includes(item),item);
}
for(const forbidden of ['fetch(','localStorage','sessionStorage','getUserMedia','MediaRecorder','innerHTML','form.submit','open('])assert.ok(!js.includes(forbidden),'no data write: '+forbidden);
assert.ok(js.includes('dialog.showModal'));assert.ok(js.includes('dialog.addEventListener(\'close\''));
assert.ok(js.includes('studentPrompts'));assert.ok(js.includes('Preview text and any translations'));
assert.ok(!fs.readFileSync('index.html','utf8').includes('hf42-teacher-session'));
console.log('PASS HF42: 8 timed phases sum to 50 minutes; 24 teacher guides separated from student-only slides.');
