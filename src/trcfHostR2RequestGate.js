/* HF77 R2: pure mock-only translation of TR-CloneFusion corrected R2 WIRE schema.
 * NOT a route, SDK, provider invocation, authentication or voice/avatar service.
 * Actual server-side credentials/tenant/permission checks must precede use.
 */
'use strict';
const {validateContext,CONTRACT}=require('./trcfAdultHostPolicy');
const ROOT=new Set(['interface_version','session_id','host','lesson_context','learner_turn','consent','request_id','request_options','versions']);
const LESSON=new Set(['lesson_id','source_version','age_group','language','profile','authorized_excerpt','reveal_policy']);
const TURN=new Set(['text','interrupt']);
const CONSENT=new Set(['adult_fictional_fixture','audio_capture_authorized','retention_seconds']);
const OPTS=new Set(['mute','avatar_enabled','max_estimated_cost_usd']);
const VERSIONS=new Set(['teaching_engine','voice_identity','avatar_identity']);
const ID=/^[A-Za-z0-9_-]{8,128}$/;
function record(obj,allowed){return !!obj&&typeof obj==='object'&&!Array.isArray(obj)&&(Object.getPrototypeOf(obj)===Object.prototype||Object.getPrototypeOf(obj)===null)&&Object.keys(obj).every(k=>allowed.has(k));}
function deny(reason){return Object.freeze({allowed:false,mode:'DISABLED_STAGING_ONLY',reason});}
function validateCorrectedR2Request(wire,trusted){
 if(!record(wire,ROOT))return deny('invalid_top_level');
 if(wire.interface_version!==CONTRACT||wire.host!=='englishlegalese')return deny('version_or_host_invalid');
 if(typeof wire.session_id!=='string'||typeof wire.request_id!=='string'||!ID.test(wire.session_id)||!ID.test(wire.request_id))return deny('session_or_request_id_invalid');
 const l=wire.lesson_context,t=wire.learner_turn,c=wire.consent,o=wire.request_options??{},v=wire.versions??{};
 if(!record(l,LESSON)||!record(t,TURN)||!record(c,CONSENT)||!record(o,OPTS)||!record(v,VERSIONS))return deny('nested_schema_invalid');
 if(l.age_group!=='adult'||!['legal-english','business-english'].includes(l.profile)||!['en','en-US'].includes(l.language))return deny('adult_or_profile_invalid');
 if(typeof l.lesson_id!=='string'||l.lesson_id.length>100||typeof l.source_version!=='string'||l.source_version.length>100)return deny('lesson_id_or_version_invalid');
 if(typeof l.authorized_excerpt!=='string'||l.authorized_excerpt.length>500||!l.authorized_excerpt.trim())return deny('excerpt_invalid');
 if(l.reveal_policy!==undefined&&!['hint-only','teacher-reviewed'].includes(l.reveal_policy))return deny('draft_only_reveal_policy');
 if(typeof t.text!=='string'||t.text.length<1||t.text.length>1500||t.interrupt!==undefined&&typeof t.interrupt!=='boolean')return deny('learner_turn_invalid');
 if(c.adult_fictional_fixture!==true||c.audio_capture_authorized!==false||c.retention_seconds!==0)return deny('fictional_audio_or_retention_invalid');
 if(o.mute!==undefined&&typeof o.mute!=='boolean'||o.avatar_enabled!==undefined&&o.avatar_enabled!==false)return deny('mute_or_avatar_invalid');
 if(o.max_estimated_cost_usd!==undefined&&(!Number.isFinite(o.max_estimated_cost_usd)||o.max_estimated_cost_usd<0||o.max_estimated_cost_usd>10))return deny('request_cost_invalid');
 // Real engine / voice / avatar identities are unproven; cannot assert their existence in staging.
 if(Object.keys(v).length!==0)return deny('provider_identity_not_available');
 // Trust is exclusively provided by a server-side authority; never from the wire request.
 const auth=validateContext({contract:CONTRACT,host:'TR-EnglishLegalese',track:l.profile,lessonId:l.lesson_id,sourceVersion:l.source_version,publicExcerpt:l.authorized_excerpt,excerptLicensed:true,fictionalFixture:true},trusted);
 if(!auth.allowed)return deny('server_policy_'+auth.reason);
 const requestCost=o.max_estimated_cost_usd??0;
 if(requestCost>trusted.quotaRemainingUsd)return deny('request_exceeds_verified_quota');
 // Discard learner text. Do NOT return it, transcripts, ID, profile audio or the trusted account.
 // Unlike the future provider request, this result can never trigger a model or voice call.
 return Object.freeze({allowed:true,mode:'MOCK_ONLY',contract:CONTRACT,wireHost:wire.host,sessionId:wire.session_id,requestId:wire.request_id,lessonId:l.lesson_id,profile:l.profile,sourceVersion:l.source_version,turnCharacters:t.text.length,interrupt:t.interrupt===true,muted:o.mute!==false,avatarEnabled:false,audioCapture:false,retentionSeconds:0,maxEstimatedCostUsd:requestCost,teacherReviewRequired:true,generated:false,live:false});
}
module.exports=Object.freeze({validateCorrectedR2Request});
