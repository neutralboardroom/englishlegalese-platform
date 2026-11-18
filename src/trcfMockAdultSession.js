/* HF78 — EnglishLegalese-only fictional adult mock host-session lifecycle.
 * NOT connected to server.js, browser pages, real learners, provider credentials,
 * audio, avatars, accounts, analytics or billing. No network, disk or timers.
 * The underlying corrected TRCF host v0.1.0 contract is still a proposed wire.
 */
'use strict';
const crypto = require('node:crypto');
const {validateCorrectedR2Request} = require('./trcfHostR2RequestGate');
const MAX_TURNS = 8;
const MAX_TEXT_CHARS = 600;
const MAX_MOCK_BUDGET_USD = 2;
const SAFE_FEEDBACK = Object.freeze({
  'legal-english': Object.freeze({
    aim: 'State the difference between a permission and an obligation in a complete sentence.',
    model: 'In this fictional clause, “may” grants permission, while “must” expresses a requirement.',
    review: 'Ask your teacher to review accuracy, audience, register, and any jurisdiction-specific meaning.'
  }),
  'business-english': Object.freeze({
    aim: 'Use a clear request, a reason, and a courteous next step.',
    model: 'Could we review the delivery schedule tomorrow? That would help us confirm the next milestone.',
    review: 'Ask your teacher to review clarity, tone, pronunciation, and context.'
  })
});
function safe(result) { return Object.freeze(result); }
function deny(code) { return safe({ok:false,code,mode:'MOCK_ONLY',generated:false}); }
function createMockAdultSession({maxTurns=MAX_TURNS,maxMockBudgetUsd=MAX_MOCK_BUDGET_USD}={}) {
  if(!Number.isSafeInteger(maxTurns)||maxTurns<1||maxTurns>MAX_TURNS||!Number.isFinite(maxMockBudgetUsd)||maxMockBudgetUsd<0||maxMockBudgetUsd>MAX_MOCK_BUDGET_USD) throw new TypeError('invalid_mock_limits');
  const key=crypto.randomBytes(32); // ephemeral only; never persisted or emitted
  let bound=null,epoch=0,muted=true,stopped=false,erased=false,turns=0,reservedMockUsd=0;
  const ids = new Map(), pending = new Map();
  function digest(wire, trusted){
    const l=wire.lesson_context;
    return crypto.createHmac('sha256',key).update(JSON.stringify([
      wire.interface_version,wire.session_id,wire.request_id,wire.host,
      l.lesson_id,l.source_version,l.profile,l.authorized_excerpt,
      wire.learner_turn.text,wire.learner_turn.interrupt===true,
      wire.request_options?.max_estimated_cost_usd??0,
      trusted.tenantId,trusted.accountId,trusted.role
    ])).digest('hex');
  }
  function status(){return safe({mode:'MOCK_ONLY',generated:false,live:false,active:!!bound&&!stopped&&!erased,muted,stopped,erased,turns,reservedMockUsd,remainingMockUsd:Math.max(0,maxMockBudgetUsd-reservedMockUsd),teacherReviewRequired:true,transcriptsStored:0,providerCalls:0,audioCaptures:0,avatarFrames:0});}
  function cancelPending(){epoch++;pending.clear();}
  return Object.freeze({
    accept(wire,trusted){
      if(erased)return deny('session_erased');
      if(stopped)return deny('session_stopped');
      const v=validateCorrectedR2Request(wire,trusted);
      if(!v.allowed)return deny('policy_'+v.reason);
      if(wire.learner_turn.text.length>MAX_TEXT_CHARS||!wire.learner_turn.text.trim())return deny('turn_too_long_or_blank');
      if(!bound){bound=Object.freeze({sessionId:v.sessionId,tenantHash:crypto.createHmac('sha256',key).update(trusted.tenantId).digest('hex'),accountHash:crypto.createHmac('sha256',key).update(trusted.accountId).digest('hex'),role:trusted.role,lessonId:v.lessonId,profile:v.profile,sourceVersion:v.sourceVersion,excerptFingerprint:crypto.createHmac('sha256',key).update(wire.lesson_context.authorized_excerpt).digest('hex')});}
      if(crypto.createHmac('sha256',key).update(wire.lesson_context.authorized_excerpt).digest('hex')!==bound.excerptFingerprint||v.sessionId!==bound.sessionId||crypto.createHmac('sha256',key).update(trusted.tenantId).digest('hex')!==bound.tenantHash||crypto.createHmac('sha256',key).update(trusted.accountId).digest('hex')!==bound.accountHash||trusted.role!==bound.role||v.lessonId!==bound.lessonId||v.profile!==bound.profile||v.sourceVersion!==bound.sourceVersion)return deny('cross_session_or_tenant_mismatch');
      const fp=digest(wire,trusted);
      const prior=ids.get(v.requestId);
      if(prior)return prior.fingerprint===fp?safe({...prior.reply,replayed:true}):deny('request_id_reused_with_different_input');
      if(v.interrupt)cancelPending();
      if(muted||v.muted)return deny('text_muted');
      if(turns>=maxTurns)return deny('turn_limit');
      const cost=v.maxEstimatedCostUsd;
      if(reservedMockUsd+cost>maxMockBudgetUsd+Number.EPSILON)return deny('mock_budget_exhausted');
      turns++;reservedMockUsd=Number((reservedMockUsd+cost).toFixed(4));
      const token=crypto.randomBytes(16).toString('hex');
      const reply=safe({ok:true,code:'MOCK_TURN_QUEUED',mode:'MOCK_ONLY',generated:false,token,turn:turns,replayed:false,estimatedMockReservedUsd:cost,teacherReviewRequired:true});
      pending.set(token,epoch);ids.set(v.requestId,{fingerprint:fp,reply});
      return reply;
    },
    completeMock(token){
      if(typeof token!=='string'||!pending.has(token))return deny('unknown_or_stale_token');
      const capturedEpoch=pending.get(token);pending.delete(token);
      if(erased||stopped||muted||capturedEpoch!==epoch)return deny('canceled_or_muted');
      // Static, authored fictional example only — never process or quote learner text.
      const guide=SAFE_FEEDBACK[bound.profile];
      return safe({ok:true,code:'STATIC_FICTIONAL_EXAMPLE',mode:'MOCK_ONLY',generated:false,voiceGenerated:false,avatarGenerated:false,teacherReviewRequired:true,feedback:guide});
    },
    interrupt(){if(erased)return deny('session_erased');cancelPending();return safe({ok:true,code:'INTERRUPTED',mode:'MOCK_ONLY',generated:false});},
    mute(){if(erased)return deny('session_erased');muted=true;cancelPending();return safe({ok:true,code:'MUTED',mode:'MOCK_ONLY',generated:false});},
    resumeText(){if(erased||stopped||!bound)return deny('no_active_session');cancelPending();muted=false;return safe({ok:true,code:'TEXT_ONLY_RESUMED',mode:'MOCK_ONLY',generated:false,audioEnabled:false});},
    stop(){if(erased)return deny('session_erased');stopped=true;muted=true;cancelPending();ids.clear();bound=null;key.fill(0);return safe({ok:true,code:'STOPPED',mode:'MOCK_ONLY',generated:false});},
    erase(){stopped=true;erased=true;muted=true;cancelPending();ids.clear();bound=null;key.fill(0);reservedMockUsd=0;turns=0;return safe({ok:true,code:'ERASED',mode:'MOCK_ONLY',generated:false});},
    status
  });
}
module.exports=Object.freeze({createMockAdultSession,MAX_TURNS,MAX_TEXT_CHARS,SAFE_FEEDBACK});
