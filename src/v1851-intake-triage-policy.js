'use strict';
// Private operator-only intake tracking: no routes, messages, uploads or payment changes.
const records=Object.freeze({
 enrollment:Object.freeze({
  source:'englishlegalese_enrollment_requests',review:'englishlegalese_enrollment_triage',
  statuses:Object.freeze(['new','reviewing','awaiting_student','waitlisted','confirmed','closed']),
  protectedStatus:'confirmed',proofFlag:'--verified-class-place'
 }),
 teacher:Object.freeze({
  source:'englishlegalese_teacher_applications',review:'englishlegalese_teacher_triage',
  statuses:Object.freeze(['new','screening','awaiting_teacher','interview','approved','declined','closed']),
  protectedStatus:'approved',proofFlag:'--verified-qualifications'
 })
});
function isUUID(value){return typeof value==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)}
function bounded(value,max){return typeof value==='string' && value.length<=max && !/[\r\n\x00-\x1f]/.test(value)}
function parseFollowup(value){
 if(value==='')return null;
 if(typeof value!=='string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value))throw Error('Follow-up must be UTC YYYY-MM-DDTHH:MM:SSZ or empty to clear');
 const d=new Date(value);
 if(Number.isNaN(d.getTime())||d.toISOString().replace('.000Z','Z')!==value)throw Error('Invalid follow-up UTC date');
 return value;
}
function validate(input){
 const kind=input.kind, config=records[kind];
 if(!config)throw Error('Choose --kind=enrollment or --kind=teacher');
 if(!isUUID(input.id))throw Error('Choose a valid --id=UUID');
 if(!config.statuses.includes(input.status))throw Error('Status not allowed for selected intake kind');
 if(!bounded(input.actor,80)||input.actor.length<2)throw Error('Provide a private --actor name (2–80 characters)');
 if(!bounded(input.action,400))throw Error('Action must be a single line of at most 400 characters');
 if(input.status===config.protectedStatus&&!input.verified)throw Error('Protected confirmation/approval requires '+config.proofFlag);
 return {...input,followup:parseFollowup(input.followup),config};
}
module.exports={records,isUUID,parseFollowup,validate};
