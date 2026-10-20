/* EnglishLegalese v1.74.0 — private, non-AI professional message practice. No storage/network. */
(() => {
  'use strict';
  const RELEASE = '1.74.0';
  const drafts = {
    client: {
      label: 'Client update',
      values: ['Fictional document review','The review team received the revised document checklist.','The reviewer has not yet confirmed whether the third page needs another signature.','Ask the reviewer to confirm the signature requirement.','By Thursday, subject to reviewer availability.']
    },
    internal: {
      label: 'Internal team handoff',
      values: ['Fictional contract summary','The team completed an initial language review of the invented clause.','The approval status and legal meaning still need qualified review.','Send the draft to the supervising reviewer with the open questions marked.','Before the next fictional team meeting.']
    },
    meeting: {
      label: 'Meeting follow-up',
      values: ['Fictional project meeting','The participants agreed to circulate a revised discussion outline.','No final approval or delivery date was confirmed in the exercise.','Share the outline and ask participants to confirm any corrections.','Propose a follow-up next week, subject to confirmation.']
    }
  };
  const limit = value => String(value || '').trim().replace(/\s+/g,' ').slice(0,600);
  const view = () => {
    const section=document.createElement('section');
    section.id='professional-message-builder';
    section.className='section v1740-message-builder';
    section.setAttribute('aria-labelledby','v1740-title');
    section.innerHTML=[
      '<div class="container"><div class="section-head"><div>',
      '<div class="eyebrow">Free professional Legal English writing practice</div>',
      '<h2 id="v1740-title">Turn scattered notes into a clear professional message.</h2>',
      '</div><p>Practise client updates, team handoffs and meeting follow-ups with a structured fictional example. Distinguish what is confirmed, what remains uncertain and what happens next.</p></div>',
      '<div class="v1740-layout"><form class="v1740-form panel" novalidate>',
      '<label for="v1740-kind">Message type</label><select id="v1740-kind" class="input" name="kind">',
      '<option value="client">Client update</option><option value="internal">Internal team handoff</option><option value="meeting">Meeting follow-up</option></select>',
      '<button class="btn light v1740-sample" type="button">Load a fictional example</button>',
      '<label for="v1740-matter">Fictional subject or matter <span aria-hidden="true">*</span></label>',
      '<input id="v1740-matter" class="input" name="matter" type="text" maxlength="120" autocomplete="off" />',
      '<label for="v1740-confirmed">What is confirmed? <span aria-hidden="true">*</span></label>',
      '<textarea id="v1740-confirmed" class="input" name="confirmed" maxlength="600" rows="3"></textarea>',
      '<label for="v1740-uncertain">What still needs checking?</label>',
      '<textarea id="v1740-uncertain" class="input" name="uncertain" maxlength="600" rows="3"></textarea>',
      '<label for="v1740-next">Next step or requested action <span aria-hidden="true">*</span></label>',
      '<textarea id="v1740-next" class="input" name="next" maxlength="600" rows="3"></textarea>',
      '<label for="v1740-timing">Timing (state conditions if not confirmed)</label>',
      '<input id="v1740-timing" class="input" name="timing" type="text" maxlength="160" autocomplete="off" />',
      '<p class="v1740-private">Use fictional or anonymized practice facts only. Do not enter real client, personal or confidential information. This exercise runs in your browser; it does not upload, save or send your draft.</p>',
      '<p class="v1740-count" aria-live="polite">0 of 2,080 practice characters entered</p>',
      '<div class="v1740-actions"><button class="btn gold v1740-compose" type="submit">Build my practice message</button>',
      '<button class="btn light v1740-clear" type="reset">Clear everything</button></div>',
      '<p class="v1740-status" role="status" aria-live="polite">Fill in invented facts, then build a practice message.</p>',
      '</form>',
      '<div class="v1740-output panel"><h3>Private writing preview</h3>',
      '<p class="v1740-instructions">The sample structure supports professional wording; it does not verify factual or legal meaning.</p>',
      '<div class="v1740-preview" hidden><pre class="v1740-draft" tabindex="-1"></pre>',
      '<p class="v1740-words" aria-live="polite"></p>',
      '<fieldset class="v1740-checks"><legend>My review checklist (self-check only)</legend>',
      '<label><input type="checkbox" /> Confirmed information is clearly separated from uncertainty.</label>',
      '<label><input type="checkbox" /> The requested next action and timing are understandable.</label>',
      '<label><input type="checkbox" /> A qualified person will check legal meaning and confidentiality before any real use.</label>',
      '</fieldset><p class="v1740-progress" role="status">0 of 3 review checks marked.</p>',
      '<button class="btn teal v1740-copy" type="button">Copy my fictional practice draft</button>',
      '</div><p class="v1740-empty">Your practice message will appear here after you build it.</p>',
      '<p class="v1740-private">Copying is optional. Nothing is emailed, uploaded, stored or graded. This is language practice—not legal advice, legal review, certified translation or a real client communication.</p>',
      '<p class="v1740-links"><a href="#email-clarity-lab">Practise professional email clarity →</a>',
      '<a href="#revision-studio">Compare changed wording →</a></p>',
      '</div></div></div>'
    ].join('');
    return section;
  };
  function wire(section) {
    const form=section.querySelector('.v1740-form');
    const select=form.querySelector('#v1740-kind');
    const fields=['matter','confirmed','uncertain','next','timing'].map(name=>form.elements.namedItem(name));
    const preview=section.querySelector('.v1740-preview');
    const draft=section.querySelector('.v1740-draft');
    const empty=section.querySelector('.v1740-empty');
    const status=section.querySelector('.v1740-status');
    const count=section.querySelector('.v1740-count');
    const words=section.querySelector('.v1740-words');
    const progress=section.querySelector('.v1740-progress');
    const checks=Array.from(section.querySelectorAll('.v1740-checks input'));
    const copy=section.querySelector('.v1740-copy');
    function clearPreview(message) {
      draft.textContent='';preview.hidden=true;empty.hidden=false;
      checks.forEach(c=>{c.checked=false;});
      progress.textContent='0 of 3 review checks marked.';
      if(message)status.textContent=message;
    }
    function updateCount() {
      const n=fields.reduce((sum,field)=>sum+field.value.length,0);
      count.textContent=n.toLocaleString('en-US')+' of 2,080 practice characters entered';
    }
    fields.forEach(field=>field.addEventListener('input',()=>{clearPreview('Draft changed. Build again to review the latest version.');updateCount();}));
    select.addEventListener('change',()=>clearPreview('Message type changed. Build again to see the new structure.'));
    form.querySelector('.v1740-sample').addEventListener('click',()=>{
      const sample=drafts[select.value]||drafts.client;
      fields.forEach((field,i)=>{field.value=sample.values[i];});
      clearPreview('Fictional example loaded. You may revise the notes or build the message.');
      updateCount();fields[0].focus();
    });
    function build() {
      const [matter,confirmed,uncertain,next,timing]=fields.map(f=>limit(f.value));
      if(!matter||!confirmed||!next) {
        clearPreview('Enter a fictional subject, confirmed information and next action before building.');
        const missing=[0,1,3].find(i=>!limit(fields[i].value));if(missing!==undefined)fields[missing].focus();
        return;
      }
      const type=select.value, heading=drafts[type].label;
      const opener=type==='client'?'Hello,':type==='internal'?'Hello team,':'Hello everyone,';
      const intro=type==='client'?'Here is a brief update on: ':type==='internal'?'Here is a handoff regarding: ':'Thank you for the discussion about: ';
      const lines=[
        'Subject: '+heading+' — '+matter,'',opener,'',
        intro+matter,'','Confirmed information: '+confirmed,
        'Still to check: '+(uncertain||'No additional points were provided in this practice exercise.'),
        'Next step: '+next,
        'Timing: '+(timing||'Timing has not been confirmed.'),'',
        'Please flag any corrections or points requiring further review.','',
        'Kind regards'
      ];
      draft.textContent=lines.join('\n');
      const wc=draft.textContent.trim().split(/\s+/).length;
      words.textContent=wc+' words in this browser-only draft.';
      preview.hidden=false;empty.hidden=true;
      checks.forEach(c=>{c.checked=false;});
      progress.textContent='0 of 3 review checks marked.';
      status.textContent='Practice draft created. Review the three questions before using this structure elsewhere.';
      draft.focus();
    }
    form.addEventListener('submit',event=>{event.preventDefault();build();});
    form.addEventListener('reset',()=>{setTimeout(()=>{fields.forEach(f=>{f.value='';});select.value='client';clearPreview('All practice text and review checks cleared.');updateCount();fields[0].focus();},0);});
    checks.forEach(c=>c.addEventListener('change',()=>{progress.textContent=checks.filter(x=>x.checked).length+' of 3 review checks marked. These checks are not an assessment.';}));
    copy.addEventListener('click',async()=>{
      if(preview.hidden||!draft.textContent)return;
      try{
        if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
        await navigator.clipboard.writeText(draft.textContent);
        status.textContent='Fictional practice draft copied at your request.';
      }catch{status.textContent='Clipboard unavailable. You can select and copy the practice text manually.';}
    });
  }
  function mount() {
    const app=document.getElementById('app');
    if(!app||!app.querySelector('#home'))return;
    let section=app.querySelector('#professional-message-builder');
    if(!section) {
      section=view();
      const prior=app.querySelector('#revision-studio');
      if(prior)prior.after(section);else app.appendChild(section);
      wire(section);
    }
    document.documentElement.dataset.englishlegaleseMaterialRelease=RELEASE;
    if(typeof window.englishLegaleseApplyView==='function')window.englishLegaleseApplyView();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  window.addEventListener('hashchange',mount);
})();
