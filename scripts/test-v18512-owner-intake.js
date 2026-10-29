'use strict';
const assert=require('node:assert/strict');
const {install}=require('../src/v18512-ops');
const routes=new Map();const app={get:(path,...f)=>routes.set(path,f)};
let fail=false,calls=[],pool={query:async sql=>{
 calls.push(sql);if(fail)throw Error('Intake storage failure');
 if(sql.includes('englishlegalese_enrollment_requests'))return{rows:[{status:'new',total:4,due:2},{status:'reviewing',total:3,due:1}]};
 if(sql.includes('englishlegalese_teacher_applications'))return{rows:[{status:'new',total:2,due:1}]};
 throw Error('Unexpected query');
}};
const services={mode:()=> 'postgres'},authMiddleware=()=> (req,res,next)=>req.valid?next():res.status(401).json({ok:false});
const requireRoles=(...allowed)=> (req,res,next)=>allowed.includes(req.user?.role)?next():res.status(403).json({ok:false});
install(app,{services,authMiddleware,requireRoles,intakePool:pool});
async function request({role='owner',valid=true,bearer=true}={}){
 const req={valid,user:{role},get:()=>bearer?'Bearer authenticated.test':''};
 const res={statusCode:200,body:null,headers:{},status(code){this.statusCode=code;return this},set(key,value){this.headers[key]=value;return this},json(data){this.body=data;return this}};
 for(const f of routes.get('/api/v18512/owner/intake-summary')){
  let next=false;await f(req,res,()=>{next=true});if(!next)break;
 }return res;
}
(async()=>{
 let r=await request();assert.equal(r.statusCode,200);assert.equal(r.body.queues.enrollment[0].total,4);assert.equal(r.body.queues.teacher[0].due,1);
 assert.equal(r.headers['Cache-Control'],'private, no-store');
 assert(!JSON.stringify(r.body).includes('email')&&!JSON.stringify(r.body).includes('full_name')&&!JSON.stringify(r.body).includes('qualification'));
 assert.equal((await request({role:'student'})).statusCode,403);
 assert.equal((await request({role:'employer'})).statusCode,403);
 assert.equal((await request({valid:false})).statusCode,401);
 assert.equal((await request({bearer:false})).statusCode,401);
 fail=true;r=await request();assert.equal(r.statusCode,503);assert(!('queues' in r.body));
 assert(calls.every(sql=>/^SELECT /.test(sql)),'Intake endpoints cannot modify any records');
 console.log('PASS HF26: intake status only, owner/admin role required, no PII, independent Postgres storage, fail closed and zero writes.');
})().catch(e=>{console.error(e);process.exit(1)});
