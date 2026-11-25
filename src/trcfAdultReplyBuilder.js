/* HF83 EnglishLegalese fictional-adult English reply construction.
 * Fixed local phrase scaffolds only; no learner interpretation, grading, models,
 * storage, network, media, legal advice, or cross-project SDK.
 * Bilingual teaching directions are draft, pending native professional review.
 */
'use strict';
const {SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('./trcfAdultLessonLocales');
const {getResponseStudio}=require('./trcfAdultResponseStudio');
const FRAMES={
 'contract-clarification':[
  ['Thank you for asking about that clause.','In this fictional example, “must” points to a written response by Friday.','I can explain the wording; an actual legal effect needs professional review.'],
  ['That is an important distinction.','In this example, “may” gives an option rather than imposing a duty.','We should read the complete provision before deciding what it allows.'],
  ['I cannot guarantee a court decision.','Explaining English contract wording differs from giving an opinion on legal outcomes.','Qualified counsel would need the full facts and applicable law.']
 ],
 'negotiation-phrases':[
  ['I understand why the deadline matters.','Our team may need more time to complete a careful review.','Could we discuss a revised deadline that works for both sides?'],
  ['Thank you for agreeing on the revised date.','I will document our understanding in a written summary.','Please let me know if any part of that summary needs correction.'],
  ['I agree this phrase needs more precision.','“Reasonable time” could be understood in different ways.','Could we specify the intended number of days before we finalize?']
 ],
 'project-update':[
  ['Thank you for checking on the report.','It is still in progress; Tuesday is my current estimate.','I will flag any change as soon as I know about it.'],
  ['Thank you for offering to help.','A joint review of the figures would be useful.','Could we meet this afternoon to go through them?'],
  ['The review will inform the final plan.','I will prepare the revised schedule with the agreed updates.','I expect to send it by 3 p.m. tomorrow.']
 ],
 'client-meeting':[
  ['Thank you for meeting with us.','Understanding your priorities will help us use the meeting well.','Could we begin with your most important concern?'],
  ['I understand this delivery concern is urgent.','I would like to understand which part is most pressing.','Could you share a concrete example so we can clarify the issue?'],
  ['Thank you for explaining those priorities.','I will summarize the actions, responsible people and deadlines.','I can send a concise written recap after the meeting.']
 ]
};
const LABELS={
 'en-US':{intro:'Build a three-part English reply: acknowledge, explain the key point, and offer a careful next step. Each phrase is a suggestion, not an automatic assessment.',parts:['Professional opening','Meaning or essential information','Next step or appropriate limitation'],privacy:'Reveal phrases one by one. Review and edit them before using them; no real client information. The tool does not assess your own writing.'},
 'th-TH':{intro:'สร้างคำตอบภาษาอังกฤษ 3 ส่วน: เริ่มตอบอย่างสุภาพ อธิบายประเด็นสำคัญ และบอกขั้นตอนต่อไปหรือข้อจำกัดอย่างรอบคอบ ข้อความเหล่านี้เป็นตัวอย่าง ไม่ใช่การตรวจอัตโนมัติ',parts:['คำขึ้นต้นที่สุภาพ','ความหมายหรือข้อมูลสำคัญ','ขั้นตอนต่อไปหรือข้อจำกัด'],privacy:'เปิดตัวอย่างทีละส่วน ตรวจทานและปรับแก้ก่อนนำไปใช้ อย่าใส่ข้อมูลลูกค้าจริง โปรแกรมไม่ประเมินงานเขียนของคุณ'},
 'vi-VN':{intro:'Xây dựng câu trả lời tiếng Anh gồm ba phần: mở đầu lịch sự, giải thích ý chính và đề xuất bước tiếp theo hoặc giới hạn phù hợp. Đây là gợi ý, không phải chấm bài tự động.',parts:['Mở đầu chuyên nghiệp','Ý nghĩa hoặc thông tin chính','Bước tiếp theo hoặc giới hạn'],privacy:'Tự mở từng mẫu câu, xem lại và chỉnh sửa trước khi dùng. Không nhập thông tin khách hàng thật. Công cụ không đánh giá bài viết của bạn.'},
 'zh-CN':{intro:'用三个部分组织英语回答：礼貌开场、解释重点，以及提出适当的下一步或说明限制。这些是示例提示，不是自动评分。',parts:['专业开场','含义或关键信息','下一步或适当限制'],privacy:'逐项主动显示句型，使用前请审阅和修改。不要输入真实客户信息。工具不会自动评估你的写作。'},
 'ko-KR':{intro:'영어 답변을 세 부분으로 구성하세요. 정중한 시작, 핵심 내용 설명, 적절한 다음 단계나 한계를 제시합니다. 예시 문구일 뿐 자동 채점은 아닙니다.',parts:['전문적인 시작','의미 또는 핵심 정보','다음 단계 또는 적절한 한계'],privacy:'표현을 한 부분씩 직접 공개하고 사용 전에 검토·수정하세요. 실제 고객 정보를 입력하지 마세요. 이 도구는 글을 자동 평가하지 않습니다.'}
};
function deepFreeze(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(deepFreeze);Object.freeze(v)}return v}
deepFreeze(FRAMES);deepFreeze(LABELS);
function getReplyBuilder({profile,explanationLocale}){
 if(!PROFILES.includes(profile))throw Error('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw Error('unsupported_explanation_locale');
 const source=getResponseStudio({profile,explanationLocale});
 const scenes=source.scenarios.map(scene=>({id:scene.id,turns:scene.turns.map((turn,i)=>{
  const parts=FRAMES[scene.id]?.[i];
  if(!parts||parts.length!==3)throw Error('missing_current_adult_scenario');
  return {promptEnglish:turn.promptEnglish,partsEnglish:[...parts],taughtLanguage:'en',fictionalAdultOnly:true};
 })}));
 return deepFreeze({profile,explanationLocale,taughtLanguage:'en',nativeTranslationStatus:'DRAFT_NATIVE_PROFESSIONAL_REVIEW_REQUIRED',grading:'NONE',privacy:{network:false,storage:false,recording:false},guidance:LABELS[explanationLocale],scenarios:scenes});
}
module.exports={getReplyBuilder,SUPPORTED_EXPLANATION_LOCALES,PROFILES,LABELS};
