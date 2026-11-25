/* HF86 EnglishLegalese fictional-adult structured revision practice.
 * Fixed authored teaching data; no accounts, AI grading, storage, microphone,
 * legal advice or outbound requests. Native-language content requires review.
 */
'use strict';
const {getBranchingRoleplay,BRANCHES,PROFILES,SUPPORTED_EXPLANATION_LOCALES}=require('./trcfAdultBranchingRoleplay');
const TARGETS={
 'contract-clarification':[
  ['State the written obligation without changing its meaning.','Check whether you distinguished a stated deadline from an optional suggestion.','Use cautious language about the effect of the fictional clause.'],
  ['Distinguish permission from a duty.','Explain the difference between “may” and “must” in your own words.','Do not treat an optional request as compulsory.'],
  ['State the limits of a language explanation.','Avoid predicting an actual court outcome or promising legal certainty.','Describe when a qualified lawyer would need to review real facts.']
 ],
 'negotiation-phrases':[
  ['Acknowledge the other party without making an unsupported promise.','Explain why a revised deadline may be necessary.','Offer a constructive next step for both teams.'],
  ['Confirm the revised date respectfully.','State what will be included in your written summary.','Invite corrections before assuming full agreement.'],
  ['Clarify the agreed time period with a specific question.','Identify why “reasonable time” could be understood differently.','Ask to specify a practical number of days.']
 ],
 'project-update':[
  ['Describe what is actually known about progress.','Distinguish the realistic Tuesday estimate from a guarantee.','Explain when you will communicate any change.'],
  ['Thank the colleague for the offer of help.','Identify the figures that require careful joint review.','Propose a specific time for collaboration.'],
  ['Name a clear deliverable and who is responsible for sending it.','Use an accurate time rather than vague language.','Offer a responsible progress update if the timing changes.']
 ],
 'client-meeting':[
  ['Open the conversation respectfully.','Invite the client to share priorities before you assume them.','Suggest how the meeting can address the key concern.'],
  ['Show that the concern is taken seriously.','Ask a neutral clarifying question about the delivery issue.','Avoid guessing the cause before checking facts.'],
  ['Confirm the next steps accurately.','Mention responsible people and agreed deadlines.','Offer a concise written recap for correction or confirmation.']
 ]
};
const LABELS={
 'en-US':{intro:'Revise your own English response. Check meaning, respectful tone, and next steps. This is independent practice, not an AI grade or teacher evaluation.',privacy:'Use invented adult situations only. Your draft stays in this page memory; no network request, recording, account storage, or automated assessment.',draft:'Write your own revised English response before comparing with a model.',review:'Compare the scripted model only after you have written a response. Different appropriate answers are possible.',copy:'Copying to the main writing studio requires an explicit choice; existing text is protected.'},
 'th-TH':{intro:'แก้ไขคำตอบภาษาอังกฤษของคุณเอง โดยตรวจความหมาย น้ำเสียงที่สุภาพ และขั้นตอนถัดไป นี่เป็นการฝึกด้วยตนเอง ไม่ใช่คะแนนจาก AI หรือการประเมินของครู',privacy:'ใช้เฉพาะสถานการณ์ผู้ใหญ่สมมติ ข้อความอยู่ในหน่วยความจำของหน้านี้ ไม่มีการส่งผ่านเครือข่าย บันทึกเสียง เก็บในบัญชี หรือประเมินอัตโนมัติ',draft:'เขียนคำตอบภาษาอังกฤษฉบับแก้ไขด้วยตนเองก่อนเปรียบเทียบตัวอย่าง',review:'เปรียบเทียบตัวอย่างที่เขียนไว้หลังจากเขียนคำตอบแล้ว คำตอบที่เหมาะสมอาจมีได้หลายแบบ',copy:'การส่งคำตอบไปยังแบบฝึกเขียนหลักต้องกดด้วยตนเอง และข้อความเดิมได้รับการปกป้อง'},
 'vi-VN':{intro:'Tự sửa câu trả lời tiếng Anh, kiểm tra ý nghĩa, giọng điệu tôn trọng và bước tiếp theo. Đây là bài tập cá nhân, không phải điểm AI hay đánh giá của giáo viên.',privacy:'Chỉ dùng tình huống người lớn giả định. Bản nháp chỉ tồn tại trong bộ nhớ trang; không gửi mạng, ghi âm, lưu tài khoản hoặc chấm tự động.',draft:'Viết lại câu trả lời tiếng Anh của chính bạn trước khi so sánh với mẫu.',review:'Chỉ so sánh mẫu có sẵn sau khi bạn đã viết. Có thể có nhiều câu trả lời phù hợp.',copy:'Chỉ sao chép vào phần viết chính khi bạn chủ động chọn; nội dung trước đó được bảo vệ.'},
 'zh-CN':{intro:'修改你自己的英语回答，检查含义、礼貌语气和下一步行动。这是自主练习，不是 AI 评分或教师评估。',privacy:'只使用虚构的成人场景。草稿仅保存在当前页面内存中；不发送网络请求、不录音、不保存账户记录或自动评分。',draft:'请先根据虚构职业情境独立写出修改后的完整英语回答，说明事实、礼貌语气以及适当的下一步，再与范例比较。',review:'请在完成自己的英语回答以后主动点击查看预先编写的示范表达，并核对语言含义。合理的回答可能不止一种。',copy:'只有在你主动点击复制按钮时，修订内容才会进入主要英语写作练习；如果已有文字，必须再次确认，原文才会被替换。'},
 'ko-KR':{intro:'자신의 영어 답변을 수정하며 의미의 정확성, 정중한 어조, 다음 단계를 점검하세요. AI 채점이나 교사 평가가 아닌 자율 연습입니다.',privacy:'가상의 성인 상황만 사용하세요. 초안은 현재 페이지 메모리에만 있으며 네트워크 전송, 녹음, 계정 저장, 자동 평가가 없습니다.',draft:'예시와 비교하기 전에 자신의 영어 답변을 직접 수정하여 작성하세요.',review:'답변을 작성한 후에만 미리 작성된 예시를 비교하세요. 적절한 답변은 여러 가지일 수 있습니다.',copy:'주요 글쓰기 연습으로 복사하려면 직접 선택해야 하며 기존 글은 보호됩니다.'}
};
function frozen(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(frozen);Object.freeze(v)}return v}
frozen(TARGETS);frozen(LABELS);
function getRevisionClinic({profile,explanationLocale}){
 if(!PROFILES.includes(profile))throw Error('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw Error('unsupported_explanation_locale');
 const prior=getBranchingRoleplay({profile,explanationLocale});
 return frozen({profile,explanationLocale,taughtLanguage:'en',mode:'SELF_AUTHORED_PRIVATE_REVISION',reviewStatus:'DRAFT_NATIVE_PROFESSIONAL_REVIEW_REQUIRED',grading:'NONE',privacy:{network:false,storage:false,microphone:false,provider:false},guidance:LABELS[explanationLocale],scenarios:prior.scenarios.map(scene=>({id:scene.id,titleEnglish:scene.titleEnglish,turns:scene.turns.map((turn,i)=>{
  const checklist=TARGETS[scene.id]?.[i];const authored=BRANCHES[scene.id]?.[i];
  if(!checklist||checklist.length!==3||!authored)throw Error('MISSING_REVISION_SCENE');
  return {promptEnglish:turn.originalPromptEnglish,focusEnglish:turn.focusEnglish,goalsEnglish:[...checklist],modelEnglish:authored.choices[authored.preferred].reply,rationaleEnglish:authored.choices[authored.preferred].reason,rationaleNative:turn.nativeReviewExplanation,fictionalAdultOnly:true};
 })}))});
}
module.exports={getRevisionClinic,TARGETS,LABELS,PROFILES,SUPPORTED_EXPLANATION_LOCALES};
