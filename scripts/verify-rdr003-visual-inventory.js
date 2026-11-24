'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p));
const hash=p=>crypto.createHash('sha256').update(read(p)).digest('hex');
const rulePin='1aa159beaa8ddd05e36d72ef09d4ff010532202c645065beb3636cf5c750701c';
assert.equal(hash('owner-rules/RDR-003.md'),rulePin,'Verbatim owner rule changed');
const ledger=JSON.parse(read('docs/HF108_RDR003_VISUAL_INVENTORY.json'));
assert.equal(ledger.rule_sha256,rulePin);
const names=cp.execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024}).split('\0').filter(Boolean);
const images=names.filter(p=>/\.(png|jpe?g|webp|gif|svg|avif|ico|bmp|tiff?|heic|heif)$/i.test(p)).sort();
assert.deepEqual(ledger.entries.map(e=>e.path).sort(),images,'Standalone image inventory drift; update with evidence');
for(const e of ledger.entries)assert.equal(hash(e.path),e.sha256,'Image bytes changed without updated evidence: '+e.path);
assert.equal(ledger.coverage.standalone_files,images.length);
const reviewed=ledger.entries.filter(e=>e.review==='RENDERED_APPROVED');
assert.equal(ledger.coverage.rendered_reviewed,reviewed.length);
for(const e of reviewed){assert.ok(e.concept_mappings.length>0&&e.provenance&&e.display_offline_evidence,'Incomplete evidence '+e.path);}
const flags=names.filter(p=>/\.(html?|css|js|mjs|cjs|json|md)$/i.test(p)&&!p.startsWith('tests/')&&!p.startsWith('scripts/')&&!p.startsWith('docs/')&&!p.startsWith('owner-rules/')&&!p.startsWith('governance/')).filter(p=>/<(?:img|svg|picture|canvas)\b|data:image\/|background-image\s*:|\.(?:png|jpe?g|webp|gif|svg|avif)\b/i.test(read(p).toString('utf8')));
console.log('RDR-003 structural inventory: '+images.length+' standalone assets, '+reviewed.length+' recorded rendered approvals.');
console.log('Potential inline/reference files (heuristic, NOT complete visual coverage): '+JSON.stringify(flags));
const complete=ledger.coverage.complete===true&&ledger.coverage.inline_remote_complete===true&&reviewed.length===images.length&&ledger.unresolved.length===0&&ledger.status==='VISUAL_EVIDENCE_COMPLETE';
if(!complete){console.log('RDR-003 VISUAL ACCEPTANCE BLOCKED: inventory is not rendered review');if(process.argv.includes('--release'))process.exitCode=1;}
else console.log('RDR-003 recorded evidence complete; independent human/physical approval still required.');
