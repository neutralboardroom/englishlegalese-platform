'use strict';
// Draft only; paid AI is strictly disabled until verified signed Stripe fulfillment and a durable entitlement ledger are deployed.
const OFFERS=Object.freeze([{id:'single_lesson',name:'Single AI lesson',usd:4,replies:20,available:false},{id:'five_lessons',name:'Five AI lessons',usd:16,replies:100,available:false},{id:'monthly_practice',name:'Monthly AI practice',usd:19,replies:250,available:false}]);
async function paidEntitlementVerified(){return false;}
module.exports={OFFERS,paidEntitlementVerified};
