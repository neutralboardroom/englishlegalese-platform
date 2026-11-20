/* HF80: deterministic, fictional-adult EnglishLegalese decision drills.
 * No AI, model scoring, legal advice, voice, pupil data, storage, or providers.
 * Bilingual rationales are UNREVIEWED teaching drafts; block production use.
 */
'use strict';
const {SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('./trcfAdultLessonLocales');
const ENGLISH=Object.freeze({
 'legal-english':[
  {id:'legal-duty',prompt:'Fictional clause: “The seller must respond in writing.” Which statement expresses the seller’s duty?',options:['The seller is required to respond in writing.','The seller is free to ignore the request.'],correct:0,rationale:'In this fictional clause, “must” states a requirement. Actual legal effect depends on the complete agreement and governing law.'},
  {id:'legal-choice',prompt:'Fictional clause: “The buyer may request an extension.” Which interpretation fits the word “may”?',options:['The buyer must request an extension.','The buyer has permission to request an extension.'],correct:1,rationale:'Here “may” gives permission or discretion. It does not itself require the buyer to request an extension.'}
 ],
 'business-english':[
  {id:'business-request',prompt:'You want to invite a colleague to review a fictional schedule tomorrow. Which sounds more collaborative?',options:['Could we review the schedule tomorrow?','You must review the schedule tomorrow.'],correct:0,rationale:'“Could we…” proposes a shared action politely; the second version sounds like an instruction.'},
  {id:'business-deadline',prompt:'A fictional project task must be finished by Friday at 3 p.m. What do we call that time?',options:['A deadline','A milestone'],correct:0,rationale:'A deadline is the required completion time; a milestone is an important checkpoint or achievement.'}
 ]
});
const RATIONALES=Object.freeze({
 'en-US':{
  'legal-duty':'In this fictional clause, “must” states a requirement. Actual legal effect depends on the complete agreement and governing law.',
  'legal-choice':'Here “may” gives permission or discretion. It does not itself require the buyer to request an extension.',
  'business-request':'“Could we…” proposes a shared action politely; the second version sounds like an instruction.',
  'business-deadline':'A deadline is the required completion time; a milestone is an important checkpoint or achievement.'},
 'th-TH':{
  'legal-duty':'ในข้อความสัญญาสมมตินี้ “must” หมายถึงสิ่งที่ต้องทำ ผลทางกฎหมายจริงขึ้นอยู่กับสัญญาทั้งฉบับและกฎหมายที่ใช้บังคับ',
  'legal-choice':'ในที่นี้ “may” หมายถึงการอนุญาตหรือดุลพินิจ ไม่ได้บังคับให้ผู้ซื้อต้องขอขยายเวลา',
  'business-request':'“Could we…” เป็นการเสนอให้ร่วมกันทำบางอย่างอย่างสุภาพ ส่วนอีกประโยคฟังดูเหมือนคำสั่ง',
  'business-deadline':'deadline คือกำหนดเวลาที่งานต้องเสร็จ ส่วน milestone คือจุดตรวจสอบหรือความสำเร็จสำคัญของโครงการ'},
 'vi-VN':{
  'legal-duty':'Trong điều khoản giả định này, “must” diễn tả yêu cầu bắt buộc. Hiệu lực pháp lý thực tế phụ thuộc vào toàn bộ hợp đồng và luật áp dụng.',
  'legal-choice':'Ở đây “may” biểu thị sự cho phép hoặc quyền lựa chọn, không bắt buộc bên mua phải yêu cầu gia hạn.',
  'business-request':'“Could we…” lịch sự đề xuất một hành động chung; cách còn lại nghe như một mệnh lệnh.',
  'business-deadline':'Deadline là thời điểm phải hoàn thành; milestone là cột mốc kiểm tra hoặc thành tựu quan trọng.'},
 'zh-CN':{
  'legal-duty':'在这条虚构合同条款中，“must”表示必须履行的要求。实际法律效力取决于完整协议和适用法律。',
  'legal-choice':'这里的“may”表示许可或自行选择，并不要求买方必须申请延期。',
  'business-request':'“Could we…”礼貌地建议共同采取行动；另一种说法听起来像命令。',
  'business-deadline':'Deadline 是必须完成任务的时间；milestone 是重要的检查节点或阶段性成果。'},
 'ko-KR':{
  'legal-duty':'이 가상의 계약 조항에서 “must”는 반드시 해야 할 일을 뜻합니다. 실제 법적 효력은 전체 계약과 준거법에 따라 달라집니다.',
  'legal-choice':'여기서 “may”는 허용이나 선택의 재량을 뜻하며, 구매자가 연장을 요청해야 한다는 의무는 아닙니다.',
  'business-request':'“Could we…”는 함께 할 일을 정중하게 제안합니다. 다른 문장은 명령처럼 들립니다.',
  'business-deadline':'Deadline은 일을 마쳐야 하는 시점이고, milestone은 중요한 점검 시점이나 성과입니다.'}
});
const has=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
function getPracticeSet({profile,explanationLocale}={}){
 if(!PROFILES.includes(profile))throw new RangeError('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw new RangeError('unsupported_explanation_locale');
 return Object.freeze(ENGLISH[profile].map(q=>{
  const native=RATIONALES[explanationLocale][q.id];
  if(typeof native!=='string'||native.length<20)throw new Error('missing_native_practice_rationale');
  return Object.freeze({id:q.id,englishPrompt:q.prompt,options:Object.freeze([...q.options]),correctOptionIndex:q.correct,
   rationaleEnglish:q.rationale,rationaleNative:native,nativeLang:explanationLocale,
   taughtLanguage:'en',teacherReviewRequired:true,nativeReviewerApproved:false,
   gradingMode:'SCRIPTED_OPTION_MATCH_ONLY',studentStorage:false});
 }));
}
module.exports=Object.freeze({getPracticeSet,ENGLISH,REVIEW_STATUS:'DRAFT_NATIVE_AND_SUBJECT_REVIEW_REQUIRED'});
