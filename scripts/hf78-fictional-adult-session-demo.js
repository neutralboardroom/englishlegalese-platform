/* HF78 owner-only fictional-adult mock demonstration.
 * Runs locally with node; does not send, save or grade any information.
 */
'use strict';
const {createMockAdultSession}=require('../src/trcfMockAdultSession');
for(const [track,excerpt,question] of [
 ['legal-english','Fictional clause: The party may request an extension.','Does may mean permission rather than an obligation?'],
 ['business-english','Fictional project: The release date is under discussion.','Could we confirm the milestone tomorrow?']
]){
 const req={interface_version:'trcf.host.v0.1.0',session_id:'fictional-'+track+'-1',request_id:'fictional-turn-'+track+'-1',host:'englishlegalese',lesson_context:{lesson_id:'fictional-lesson',source_version:'v1.0.0',age_group:'adult',language:'en',profile:track,authorized_excerpt:excerpt,reveal_policy:'teacher-reviewed'},learner_turn:{text:question},consent:{adult_fictional_fixture:true,audio_capture_authorized:false,retention_seconds:0},request_options:{mute:false,avatar_enabled:false,max_estimated_cost_usd:0},versions:{}};
 const auth={issuer:'englishlegalese-server',audience:'tr-englishlegalese-host',verifiedAdult:true,role:'teacher',tenantId:'fictional-firm',accountId:'fictional-teacher',authorizedLessonIds:['fictional-lesson'],approvedPermissions:['text'],quotaRemainingUsd:1,budgetCapUsd:1,serverConsentVerified:true};
 const s=createMockAdultSession();
 if(s.accept(req,auth).code!=='text_muted')throw Error('mock default muted state violated');
 if(!s.resumeText().ok)throw Error('mock text consent transition failed');
 const answer=s.accept(req,auth),example=s.completeMock(answer.token);
 if(!answer.ok||!example.ok||example.generated)throw Error('mock example failed or falsely generated');
 console.log('\n'+track.toUpperCase()+' — FICTIONAL AUTHOR-DEFINED EXAMPLE, NOT AI');
 console.log('Aim:',example.feedback.aim,'\nSample:',example.feedback.model,'\nHuman review:',example.feedback.review);
 s.stop();if(s.status().active)throw Error('mock STOP failed');
}
console.log('\nThis is a development demonstration only: no model, no voice/avatar, no real users or storage.');
