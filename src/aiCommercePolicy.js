'use strict';
// Owner review only: Stripe billing and verified customer entitlements are not live.
const AI_PLAN_DRAFTS=Object.freeze([
  {id:'starter',name:'AI Practice Starter',price_usd_month:12,monthly_responses:100,daily_responses:12,checkout_enabled:false},
  {id:'plus',name:'AI Practice Plus',price_usd_month:19,monthly_responses:250,daily_responses:20,checkout_enabled:false},
  {id:'pro',name:'AI Practice Pro',price_usd_month:29,monthly_responses:500,daily_responses:30,checkout_enabled:false}
]);
const FREE_PREVIEW_SAMPLES=Object.freeze([
  {title:'Write a professional email',question:'How do I ask for a deadline without sounding demanding?',answer:'Could you please confirm the preferred deadline for the fictional report? I can then prioritize the draft.',takeaway:'Ask rather than inventing a deadline.'},
  {title:'Understand a contract clause',question:'Are must and may interchangeable?',answer:'Often, must describes a requirement while may indicates permission. Meaning depends on the complete clause.',takeaway:'Check how a short word changes an obligation.'},
  {title:'Review an uncertain AI statement',question:'An AI draft claims fictional approval is final, but the source says pending.',answer:'Verify the record. Until approval is confirmed, describe it as pending rather than completed.',takeaway:'Fluent writing is not proof.'}
]);
// Never trust signup roles, submitted order IDs, claimed payment or stale webhook logs.
// Production must have verified signed Stripe webhook -> durable fulfillment ledger,
// account/plan binding, expiry/refund/cancellation handling and shared usage quotas.
// Nothing in this release can create a paid entitlement.
async function paidEntitlementVerified({user,store,env}={}){
  if(!user||user.status!=='active')return false;
  if(env?.SMARTTEACHER_PAID_ENABLED!=='true')return false;
  if(!env?.STRIPE_SECRET_KEY||!env?.STRIPE_WEBHOOK_SECRET)return false;
  if(!store||typeof store.mode!=='function'||store.mode()!=='postgres')return false;
  return false; // Verified Stripe fulfillment/entitlement implementation is NOT installed.
}
module.exports={AI_PLAN_DRAFTS,FREE_PREVIEW_SAMPLES,paidEntitlementVerified};
