/* EnglishLegalese HF7: local-only discovery across 48 real curriculum records. */
(()=>{'use strict';
 const host=document.getElementById('v1880-topic-discovery');if(!host)return;
 const legal=window.ELCURRICULUM_V1800?.records?.filter(x=>x.group!=='Professional & Business English')||[];
 const business=window.ELBUSINESS_V1850_CATALOG||[];
 if(legal.length!==24||business.length!==24){host.textContent='Subject search is unavailable; the full course outlines below remain accessible.';return}
 const E=(tag,text)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;return x};
 const wrapper=E('div');wrapper.className='v1880-search-bar';const label=E('label','Find a subject by title, terminology, learning outcome or scenario');const search=E('input');search.type='search';search.maxLength=100;search.placeholder='Try: negotiation, confidentiality, earnings, contracts';label.append(search);wrapper.append(label);
 const typeLabel=E('label','Show topic category'),filter=E('select');
 for(const [id,txt] of [['all','All 48 topics'],['legal','24 Legal English'],['business','16 Business English'],['investor','8 Investor English']]){const o=E('option',txt);o.value=id;filter.append(o)}typeLabel.append(filter);wrapper.append(typeLabel);
 host.append(E('h2','Find your next lesson'),E('p','Search all 48 developed subject outlines. Results stay within this browser tab; nothing is uploaded, tracked or saved.'),wrapper);
 const summary=E('p');summary.className='v1880-match-count';summary.setAttribute('role','status');summary.setAttribute('aria-live','polite');host.append(summary);
 const actions=E('div');actions.className='v1880-actions';const open=E('button','Expand visible lesson outlines'),close=E('button','Collapse all outlines'),clear=E('button','Clear search and category');for(const b of [open,close,clear]){b.type='button';actions.append(b)}host.append(actions);
 const records=[
 ...legal.map((r,i)=>({r,kind:'legal',i,container:'v1850-complete-legal-list'})),
 ...business.map((r,i)=>({r,kind:r.id.startsWith('ws-')?'investor':'business',i,container:'v1850-complete-business-list'}))
 ];
 const rows=records.map(({r,kind,i,container})=>{const target=document.getElementById(container)?.children[i];if(!target)return null;return {target,kind,haystack:[r.title,r.outcome,r.scenario,r.homework,...r.vocab.map(v=>v.join(' '))].join(' ').toLocaleLowerCase('en')}});
 if(rows.some(x=>!x)){host.append(E('p','Some outlines could not be indexed; the full unfiltered syllabi remain below.'));return}
 function refresh(){
  const term=search.value.trim().toLocaleLowerCase('en'),kind=filter.value;
  let shown=0;for(const row of rows){const yes=(kind==='all'||kind===row.kind)&&(!term||row.haystack.includes(term));row.target.hidden=!yes;if(!yes)row.target.querySelector('details').open=false;else shown++;}
  const legalFound=rows.filter(x=>!x.target.hidden&&x.kind==='legal').length,businessFound=rows.filter(x=>!x.target.hidden&&x.kind==='business').length,investorFound=rows.filter(x=>!x.target.hidden&&x.kind==='investor').length;
  summary.textContent='Showing '+shown+' of 48 topics: '+legalFound+' Legal, '+businessFound+' Business and '+investorFound+' Investor English.';
  document.getElementById('complete-legal').hidden=legalFound===0;
  document.getElementById('complete-business').hidden=(businessFound+investorFound)===0;
 }
 search.addEventListener('input',refresh);filter.addEventListener('change',refresh);
 open.addEventListener('click',()=>{for(const r of rows)if(!r.target.hidden)r.target.querySelector('details').open=true;});
 close.addEventListener('click',()=>{for(const r of rows)r.target.querySelector('details').open=false;});
 clear.addEventListener('click',()=>{search.value='';filter.value='all';refresh();search.focus()});
 refresh();
})();