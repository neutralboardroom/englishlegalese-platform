/* HF81: self-contained scripted adult professional dialogue practice.
 * Fixed educational examples ONLY. No semantic AI, audio capture, providers,
 * authentication, student data, storage, grading, or legal advice.
 * All translations are unreviewed first-party drafts. Production BLOCKED.
 */
'use strict';
const {SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('./trcfAdultLessonLocales');
const DIRECTIONS=Object.freeze({
 'en-US':'Read the fictional instructor prompt. You may practice saying your answer aloud; no audio is captured. Select a response and press Check, or deliberately reveal the example. Your choices stay only in this tab.',
 'th-TH':'อ่านข้อความจากผู้สอนในสถานการณ์สมมติ คุณอาจฝึกพูดคำตอบออกเสียงได้โดยไม่มีการบันทึกเสียง เลือกคำตอบแล้วกดตรวจสอบ หรือกดแสดงตัวอย่างด้วยตนเอง คำตอบจะอยู่เฉพาะในหน้านี้',
 'vi-VN':'Đọc lời nhắc của giảng viên trong tình huống giả định. Bạn có thể luyện nói thành tiếng; không có âm thanh nào được ghi lại. Chọn câu trả lời rồi nhấn Kiểm tra hoặc chủ động hiện đáp án mẫu. Lựa chọn chỉ tồn tại trên trang này.',
 'zh-CN':'阅读虚构教师的情境提示。你可以开口练习回答；系统不会录音。选择回答并点击“检查”，或主动显示示范答案。你的选择仅存在于此页面中。',
 'ko-KR':'가상의 강사 질문을 읽으세요. 원한다면 소리 내어 연습할 수 있지만 음성은 녹음되지 않습니다. 답을 선택해 확인하거나 직접 예시 답을 표시하세요. 선택 내용은 이 페이지 안에서만 유지됩니다.'
});
const ENGLISH=Object.freeze({
 'legal-english':[
  {id:'contract-clarification',title:'Clarify a fictional contract',turns:[
   {prompt:'Fictional client: “What does the clause mean when it says we must respond in writing by Friday?”',options:['It means the clause requires a written response by Friday.','It means we may respond whenever we want.'],best:0,why:'“Must” indicates an obligation in this example; “by Friday” expresses the stated deadline. It does not establish the legal effect of an actual agreement.'},
   {prompt:'Fictional client: “It also says we may request more time. Does that mean we have to?”',options:['Yes. “May” always means the same as “must.”','No. Here “may” indicates permission, not a requirement.'],best:1,why:'In this example, “may” describes an option. Distinguish permission from an obligation when explaining professional documents.'},
   {prompt:'Fictional client: “Can you guarantee what a court would decide?”',options:['No. I can explain the language, but qualified counsel must assess actual legal effect.','Yes. This short practice clause guarantees the outcome.'],best:0,why:'Good professional communication separates plain-English explanation from legal advice and unsupported guarantees.'}
  ]},
  {id:'negotiation-phrases',title:'Negotiate a fictional deadline',turns:[
   {prompt:'Fictional counterpart: “We need your comments tomorrow. Can your team meet that deadline?”',options:['Could we discuss a revised deadline that works for both sides?','Your deadline is bad. We will not reply.'],best:0,why:'A courteous question offers a workable next step without promising an unachievable deadline.'},
   {prompt:'Fictional counterpart: “We have agreed to the revised date. How will you confirm it?”',options:['I will summarize the agreed changes in writing.','There is no need to document the change.'],best:0,why:'A precise written summary supports a shared understanding; this is language practice, not a recommendation about any particular contract.'},
   {prompt:'Fictional colleague: “The term ‘reasonable time’ is unclear. What should we say?”',options:['The term is perfectly clear in every situation.','Let us define the intended period more precisely before finalizing.'],best:1,why:'“Let us define” is collaborative language for identifying and resolving ambiguity in a fictional draft.'}
  ]}
 ],
 'business-english':[
  {id:'project-update',title:'Give a clear project update',turns:[
   {prompt:'Fictional manager: “Will your report be finished by Monday?”',options:['The report is in progress. I expect to finish by Tuesday, and I will flag any change.','Everything is fine; I will say anything you want to hear.'],best:0,why:'A useful project update gives an accurate status, a specific next date and an appropriate commitment to communicate changes.'},
   {prompt:'Fictional colleague: “Can I help you check the figures?”',options:['Leave me alone.','Yes, thank you. Could we review the figures together this afternoon?'],best:1,why:'A polite request names the action and a workable time rather than giving an abrupt response.'},
   {prompt:'Fictional manager: “What happens after the review?”',options:['I will send the revised schedule by 3 p.m. tomorrow.','Something will probably happen sometime.'],best:0,why:'Specify the deliverable and deadline to make a professional next step clear.'}
  ]},
  {id:'client-meeting',title:'Lead a fictional client meeting',turns:[
   {prompt:'Fictional client: “Thank you for organizing the meeting.”',options:['Thanks for meeting with us. Could we start with your priorities?','You should listen while I decide everything.'],best:0,why:'Open with thanks and invite the client to identify priorities in a respectful, collaborative way.'},
   {prompt:'Fictional client: “We have an urgent concern about delivery.”',options:['I know what you mean. There is nothing to discuss.','Could you explain which part of delivery is most urgent?'],best:1,why:'A clarification question helps avoid assumptions and identifies the issue that requires attention.'},
   {prompt:'Fictional client: “What will we receive after this meeting?”',options:['I will send a concise recap with action owners and deadlines.','We will remember everything without any summary.'],best:0,why:'A clear recap states deliverables, responsibility and timing without overstating what has been agreed.'}
  ]}
 ]
});
const NATIVE_WHY=Object.freeze({
 'en-US':{
  'contract-clarification':['In this example “must” expresses a duty and “by Friday” gives a deadline. The real legal effect requires separate professional review.','Here “may” expresses permission, not a mandatory action.','Explain wording honestly; do not promise legal outcomes.'],
  'negotiation-phrases':['A respectful question helps negotiate a realistic deadline.','A written recap improves clarity about agreed wording.','Define unclear terms precisely before finalizing a fictional draft.'],
  'project-update':['Give an accurate status and a realistic next date.','Ask politely for help with a specific task.','Specify the next deliverable and deadline.'],
  'client-meeting':['Thank the client and invite their priorities.','Ask which part is most urgent rather than guessing.','Summarize actions, owners and deadlines.']},
 'th-TH':{
  'contract-clarification':['ในตัวอย่างนี้ must สื่อถึงหน้าที่ที่ต้องทำ และ by Friday ระบุกำหนดเวลา ผลทางกฎหมายจริงต้องให้ผู้เชี่ยวชาญพิจารณา','ในที่นี้ may หมายถึงการอนุญาต ไม่ใช่ข้อบังคับ','อธิบายถ้อยคำอย่างตรงไปตรงมา และไม่รับประกันผลทางกฎหมาย'],
  'negotiation-phrases':['คำถามที่สุภาพช่วยเจรจากำหนดเวลาที่เป็นจริงได้','การสรุปเป็นลายลักษณ์อักษรช่วยให้ข้อความที่ตกลงกันชัดเจน','กำหนดความหมายของคำที่ไม่ชัดเจนให้แน่นอนก่อนสรุปร่างสมมติ'],
  'project-update':['แจ้งสถานะตามจริงและกำหนดวันถัดไปที่ทำได้','ขอความช่วยเหลืออย่างสุภาพโดยระบุงานที่ต้องการ','ระบุผลงานที่จะส่งและกำหนดเวลาให้ชัดเจน'],
  'client-meeting':['ขอบคุณลูกค้าและเชิญให้แจ้งสิ่งที่สำคัญที่สุด','ถามว่าส่วนใดเร่งด่วนที่สุดแทนการคาดเดา','สรุปการดำเนินงาน ผู้รับผิดชอบ และกำหนดเวลา']},
 'vi-VN':{
  'contract-clarification':['Trong ví dụ này, “must” thể hiện nghĩa vụ và “by Friday” nêu hạn chót. Hiệu lực pháp lý thực tế cần được chuyên gia xem xét riêng.','Ở đây “may” thể hiện sự cho phép, không phải nghĩa vụ bắt buộc.','Giải thích từ ngữ chính xác; không hứa hẹn kết quả pháp lý.'],
  'negotiation-phrases':['Một câu hỏi lịch sự giúp thương lượng thời hạn khả thi.','Bản tóm tắt bằng văn bản làm rõ nội dung đã thống nhất.','Cần xác định chính xác thuật ngữ chưa rõ trước khi hoàn tất bản dự thảo giả định.'],
  'project-update':['Nêu tình trạng chính xác và ngày dự kiến thực tế.','Lịch sự đề nghị giúp đỡ cho một công việc cụ thể.','Nêu rõ sản phẩm cần bàn giao và hạn chót.'],
  'client-meeting':['Cảm ơn khách hàng và mời họ nêu các ưu tiên.','Hỏi phần nào khẩn cấp nhất thay vì suy đoán.','Tóm tắt công việc, người phụ trách và thời hạn.']},
 'zh-CN':{
  'contract-clarification':['在这个例子中，“must”表示义务，“by Friday”说明截止时间。实际法律效力需要专业人员另行审核。','这里的“may”表示许可，而非强制义务。','应准确解释措辞，不要承诺法律结果。'],
  'negotiation-phrases':['礼貌的提问有助于协商可行的期限。','书面总结可澄清已达成一致的措辞。','在完成虚构草案之前，应准确界定含糊的术语。'],
  'project-update':['如实说明进度并提出切实可行的后续日期。','礼貌地请求协助处理具体工作。','明确说明下一项交付成果和截止时间。'],
  'client-meeting':['感谢客户，并邀请客户说明优先事项。','询问哪一部分最紧急，而不是自行猜测。','总结行动事项、负责人和期限。']},
 'ko-KR':{
  'contract-clarification':['이 예시에서 “must”는 의무를, “by Friday”는 기한을 나타냅니다. 실제 법적 효력은 전문가의 별도 검토가 필요합니다.','여기서 “may”는 의무가 아니라 허용을 뜻합니다.','문구의 의미를 정확히 설명하되 법적 결과를 보장하지 마세요.'],
  'negotiation-phrases':['정중한 질문은 실현 가능한 기한을 협의하는 데 도움이 됩니다.','서면 요약은 합의된 문구를 명확히 합니다.','가상 초안을 확정하기 전에 모호한 용어를 정확히 정의하세요.'],
  'project-update':['진행 상황을 정확히 말하고 현실적인 다음 일정을 제시하세요.','구체적인 업무에 관해 정중하게 도움을 요청하세요.','다음 결과물과 마감 시간을 명확하게 말하세요.'],
  'client-meeting':['고객에게 감사하고 우선순위를 이야기하도록 요청하세요.','추측하지 말고 어떤 부분이 가장 시급한지 물어보세요.','후속 업무, 담당자, 기한을 요약하세요.']}
});
function freezeDeep(x){if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(freezeDeep);Object.freeze(x);}return x;}
function getDialogueScenarios({profile,explanationLocale}){
 if(!PROFILES.includes(profile))throw Error('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw Error('unsupported_explanation_locale');
 const cases=ENGLISH[profile].map(s=>({
  id:s.id,titleEnglish:s.title,fictionalAdultOnly:true,teacherRole:'FICTIONAL_SCRIPTED_TEACHER_NOT_LIVE',taughtLanguage:'en',nativeLang:explanationLocale,
  directionsEnglish:DIRECTIONS['en-US'],directionsNative:DIRECTIONS[explanationLocale],translationStatus:'DRAFT_NATIVE_AND_SUBJECT_REVIEW_REQUIRED',
  turns:s.turns.map((t,i)=>({index:i+1,nativeLang:explanationLocale,promptEnglish:t.prompt,optionsEnglish:[...t.options],bestOptionIndex:t.best,
   modelEnglish:t.options[t.best],rationaleEnglish:t.why,rationaleNative:NATIVE_WHY[explanationLocale][s.id][i],
   answerMode:'DELIBERATE_CHECK_OR_REVEAL_ONLY',noRecording:true,noStorage:true}))
 }));
 return freezeDeep(cases);
}
module.exports=Object.freeze({getDialogueScenarios,SUPPORTED_EXPLANATION_LOCALES,PROFILES,DIRECTIONS,REVIEW_STATUS:'DRAFT_NATIVE_AND_SUBJECT_REVIEW_REQUIRED'});
