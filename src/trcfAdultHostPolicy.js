/* HF77: TR-CloneFusion EnglishLegalese adult-host readiness policy.
 * This is NOT a live API, provider client, authentication system or deployment.
 * Server-side callers must independently validate identity, tenancy and quota.
 * No network access, storage, voice, image, student-content reads, or model calls.
 */
'use strict';
const CONTRACT='trcf.host.v0.1.0';
const HOST='TR-EnglishLegalese';
const ALLOWED_TRACKS=new Set(['legal-english','business-english']);
const ALLOWED_ROLES=new Set(['student','teacher','owner']);
const ALLOWED_PERMISSIONS=new Set(['text','microphone','voice','avatar']);
const MAX_EXCERPT=500;
const MAX_TURN_CHARS=600;
const MAX_USD=10;
const ALLOWED_CONTEXT=new Set(['contract','host','track','lessonId','sourceVersion','publicExcerpt','excerptLicensed','fictionalFixture']);
const ALLOWED_TRUST=new Set(['issuer','audience','verifiedAdult','role','tenantId','accountId','authorizedLessonIds','approvedPermissions','quotaRemainingUsd','budgetCapUsd','serverConsentVerified']);
const SIMPLE_ID=/^[a-z0-9][a-z0-9_-]{1,63}$/;
const VERSION=/^v\d+\.\d+\.\d+(?:-[a-z0-9.-]+)?$/;
function ownFields(obj,allow){return !!obj&&typeof obj==='object'&&!Array.isArray(obj)&&Object.keys(obj).every(x=>allow.has(x));}
function deny(reason){return Object.freeze({allowed:false,reason,mode:'DISABLED_STAGING_ONLY'});}
function validateContext(context,trusted){
 if(!ownFields(context,ALLOWED_CONTEXT)||!ownFields(trusted,ALLOWED_TRUST))return deny('unknown_or_malformed_field');
 if(context.contract!==CONTRACT||context.host!==HOST)return deny('contract_or_host_mismatch');
 if(!ALLOWED_TRACKS.has(context.track)||!SIMPLE_ID.test(String(context.lessonId??''))||!VERSION.test(String(context.sourceVersion??'')))return deny('invalid_lesson_context');
 if(typeof context.publicExcerpt!=='string'||!context.publicExcerpt.trim()||context.publicExcerpt.length>MAX_EXCERPT||context.excerptLicensed!==true)return deny('unlicensed_or_oversized_excerpt');
 if(context.fictionalFixture!==true)return deny('production_integration_disabled');
 // This preparatory module only accepts trusted TEST context; never an unverified browser flag.
 if(trusted.issuer!=='englishlegalese-server'||trusted.audience!=='tr-englishlegalese-host'||trusted.verifiedAdult!==true)return deny('identity_or_adult_verification_missing');
 if(!ALLOWED_ROLES.has(trusted.role)||!SIMPLE_ID.test(String(trusted.tenantId??''))||!SIMPLE_ID.test(String(trusted.accountId??'')))return deny('role_or_tenancy_invalid');
 if(!Array.isArray(trusted.authorizedLessonIds)||!trusted.authorizedLessonIds.includes(context.lessonId)||trusted.authorizedLessonIds.length>50||!trusted.authorizedLessonIds.every(x=>SIMPLE_ID.test(String(x))))return deny('lesson_not_authorized');
 if(!Array.isArray(trusted.approvedPermissions)||!trusted.approvedPermissions.every(x=>ALLOWED_PERMISSIONS.has(x))||new Set(trusted.approvedPermissions).size!==trusted.approvedPermissions.length)return deny('permissions_invalid');
 if(trusted.serverConsentVerified!==true)return deny('consent_not_server_verified');
 if(!Number.isFinite(trusted.quotaRemainingUsd)||trusted.quotaRemainingUsd<0||!Number.isFinite(trusted.budgetCapUsd)||trusted.budgetCapUsd<=0||trusted.budgetCapUsd>MAX_USD||trusted.quotaRemainingUsd>trusted.budgetCapUsd)return deny('cost_budget_not_enforced');
 // No complete curricula, class identities, user questions, voice IDs, or private text leave this pure function.
 return Object.freeze({allowed:true,mode:'MOCK_ONLY',contract:CONTRACT,host:HOST,track:context.track,lessonId:context.lessonId,sourceVersion:context.sourceVersion,excerpt:context.publicExcerpt,permissions:Object.freeze([...trusted.approvedPermissions]),remainingBudgetUsd:trusted.quotaRemainingUsd});
}
function createMockStopController(){
 let generation=0,stopped=true,muted=true;
 return Object.freeze({
  start(){generation++;stopped=false;muted=true;return generation;},
  mute(){muted=true;generation++;return generation;},
  stop(){stopped=true;muted=true;generation++;return generation;},
  canPublish(token){return !stopped&&!muted&&token===generation;},
  unmute(){if(stopped)return false;muted=false;return true;},
  state(){return Object.freeze({generation,stopped,muted,mode:'MOCK_ONLY'});}
 });
}
module.exports=Object.freeze({CONTRACT,HOST,MAX_EXCERPT,MAX_TURN_CHARS,validateContext,createMockStopController});
