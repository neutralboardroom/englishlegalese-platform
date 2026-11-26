/* HF87 EnglishLegalese-only client follow-up email clinic.
 * Scripted fictional adult examples. No email sending, account, microphone,
 * AI grading, provider invocation, storage or network calls.
 */
'use strict';
const {getRevisionClinic,PROFILES,SUPPORTED_EXPLANATION_LOCALES}=require('./trcfAdultRevisionClinic');
const MODELS={
 'contract-clarification':[
  ['Written reply deadline in fictional clause','Thank you for your question about the example clause.','The fictional wording describes a written response by Friday; this is a language explanation, not a legal conclusion.','Could you confirm the exact provision you want us to discuss and ask qualified counsel about any real legal effect?'],
  ['Optional extension request in sample agreement','Thank you for reviewing the example provision.','The word “may” describes an option to request more time, rather than a command to do so.','Would you like to identify the proposed period and have counsel review any real agreement?'],
  ['Limits of sample contract explanation','Thank you for raising the question of legal certainty.','We can discuss the plain-English meaning, but the result in an actual dispute depends on facts and law.','Please refer real enforcement questions to qualified counsel before relying on this language.']
 ],
 'negotiation-phrases':[
  ['Proposed adjustment to review deadline','Thank you for sharing your requested timetable.','Our team has not yet confirmed that the earlier date is achievable.','Could we discuss a revised deadline that allows both teams to review the materials?'],
  ['Written confirmation of revised date','Thank you for discussing the proposed schedule.','My understanding is that both teams discussed a revised deadline, subject to confirmation.','Could you please check the date in our written summary and identify any corrections?'],
  ['Clarifying the meaning of reasonable time','Thank you for reviewing the wording with us.','The phrase “within a reasonable time” may be understood differently without an agreed period.','Could we specify the intended number of days before confirming the draft?']
 ],
 'project-update':[
  ['Updated progress estimate for sample report','Thank you for checking on the report.','The report remains in progress, and Tuesday is our current estimate rather than a guarantee.','I will flag any change promptly and confirm when the review is complete.'],
  ['Joint figures review invitation','Thank you for offering to help check the figures.','Several values need a careful joint review before we confirm the final report.','Could we review the fictional spreadsheet together this afternoon?'],
  ['Next steps following schedule review','Thank you for reviewing the project timetable.','We are preparing a revised schedule that identifies owners, milestones and outstanding checks.','I plan to send the updated schedule by 3 p.m. tomorrow or promptly explain any change.']
 ],
 'client-meeting':[
  ['Your priorities for the sample meeting','Thank you for arranging our meeting.','I would like to understand your priorities before proposing any next step.','Could you share the most important concern for us to address first?'],
  ['Clarifying the delivery handoff concern','Thank you for explaining the urgent delivery concern.','We should establish whether the issue concerns the final handoff or another process before assuming a cause.','Could you provide one fictional example so we can clarify the question accurately?'],
  ['Written follow-up after sample client meeting','Thank you for today’s discussion.','My summary will identify the agreed actions, responsible participants and target dates.','Could you confirm the written recap or note any corrections before we proceed?']
 ]
};
const GUIDANCE={
 'en-US':{intro:'Draft an English follow-up email for the fictional adult situation. Include a descriptive subject, accurate context, a courteous request or next step, and a professional closing.',privacy:'Private practice only. This page does not send emails, save drafts, grade answers or read real client messages. Never enter actual confidential or personal information.',review:'Compare your own message with the authored model. More than one professional response may be suitable. A teacher and native specialist must review before use in live instruction.',copy:'Insert into the earlier writing studio only by explicit choice. Existing work requires a separate confirmation.'},
 'th-TH':{intro:'เขียนอีเมลติดตามผลภาษาอังกฤษสำหรับสถานการณ์วิชาชีพของผู้ใหญ่ที่สมมติขึ้น ระบุหัวข้อที่ชัดเจน อธิบายบริบทอย่างถูกต้อง ขอให้ดำเนินการอย่างสุภาพ และปิดท้ายอย่างเป็นมืออาชีพ',privacy:'ใช้เพื่อฝึกส่วนตัวเท่านั้น หน้าเว็บนี้ไม่ส่งอีเมล ไม่บันทึกฉบับร่าง ไม่ให้คะแนน และไม่อ่านข้อความของลูกค้าจริง ห้ามใส่ข้อมูลส่วนบุคคลหรือความลับจริง',review:'เปรียบเทียบข้อความของคุณกับตัวอย่างที่เขียนไว้ อาจมีคำตอบที่เหมาะสมได้มากกว่าหนึ่งแบบ ต้องให้ครูและผู้เชี่ยวชาญภาษาตรวจทานก่อนใช้สอนจริง',copy:'การนำข้อความไปยังแบบฝึกเขียนเดิมต้องกดด้วยตนเอง และต้องยืนยันอีกครั้งหากมีข้อความอยู่แล้ว'},
 'vi-VN':{intro:'Soạn email theo dõi bằng tiếng Anh cho tình huống nghề nghiệp giả định của người lớn. Viết tiêu đề rõ ràng, trình bày bối cảnh chính xác, yêu cầu hoặc bước tiếp theo lịch sự và lời kết chuyên nghiệp.',privacy:'Chỉ luyện tập riêng tư. Trang này không gửi email, lưu bản nháp, chấm điểm hay đọc email của khách hàng thật. Không nhập dữ liệu cá nhân hoặc bí mật thực tế.',review:'So sánh email của bạn với ví dụ được viết sẵn. Có thể có nhiều cách trả lời chuyên nghiệp phù hợp. Cần giáo viên và chuyên gia ngôn ngữ duyệt trước khi dạy thực tế.',copy:'Chỉ chuyển sang phần viết khi bạn chủ động chọn. Nội dung có sẵn cần xác nhận riêng trước khi thay thế.'},
 'zh-CN':{intro:'针对虚构的成人职场情境撰写英语跟进邮件。使用明确的主题、准确的背景说明、礼貌的后续行动请求以及得体的结尾。',privacy:'仅供私人练习。本页面不会发送邮件、保存草稿、评分，也不会读取真实客户邮件。请勿输入真实个人或机密信息。',review:'将自己的邮件与预先编写的范例进行比较。合适的专业回答可能不止一种。正式教学前需由教师及母语专业人员审核。',copy:'只有主动操作才会复制到原有写作练习。替换已有文字前需要单独确认。'},
 'ko-KR':{intro:'가상의 성인 직장 상황에 맞는 영어 후속 이메일을 작성하세요. 분명한 제목, 정확한 배경 설명, 정중한 다음 단계 요청, 전문적인 맺음말을 포함하세요.',privacy:'개인 연습 전용입니다. 이 페이지는 이메일을 전송하거나 초안을 저장하거나 채점하거나 실제 고객 메시지를 읽지 않습니다. 실제 개인정보나 기밀을 입력하지 마세요.',review:'자신이 쓴 이메일을 미리 작성된 예시와 비교하세요. 적절한 전문 표현은 여러 가지일 수 있습니다. 실제 수업 전 교사와 원어민 전문가의 검토가 필요합니다.',copy:'기존 쓰기 연습으로 옮기려면 직접 선택해야 하며 원래 글을 바꾸려면 별도 확인이 필요합니다.'}
};
const freeze=v=>{if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freeze);Object.freeze(v)}return v};freeze(MODELS);freeze(GUIDANCE);
function getFollowUpEmail({profile,explanationLocale}){
 if(!PROFILES.includes(profile))throw Error('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw Error('unsupported_explanation_locale');
 const prior=getRevisionClinic({profile,explanationLocale});
 return freeze({profile,explanationLocale,taughtLanguage:'en',mode:'PRIVATE_AUTHORED_PROFESSIONAL_EMAIL_REHEARSAL',reviewStatus:'DRAFT_NATIVE_PROFESSIONAL_REVIEW_REQUIRED',grading:'NONE',privacy:{network:false,storage:false,microphone:false,provider:false,emailSending:false},guidance:GUIDANCE[explanationLocale],scenarios:prior.scenarios.map(scene=>({id:scene.id,titleEnglish:scene.titleEnglish,turns:scene.turns.map((turn,i)=>{
  const m=MODELS[scene.id]?.[i];if(!m||m.length!==4)throw Error('EMAIL_TEMPLATE_MISSING');
  return {promptEnglish:turn.promptEnglish,focusEnglish:turn.focusEnglish,subjectEnglish:m[0],greetingEnglish:'Dear colleague,',contextEnglish:m[1]+' '+m[2],requestEnglish:m[3],closingEnglish:'Kind regards,\nYour colleague',rationaleNative:turn.rationaleNative,rationaleEnglish:turn.rationaleEnglish,checklistEnglish:['Is the subject specific and accurate?','Does the context avoid unsupported certainty and confidential facts?','Is the request courteous, actionable, and proportionate?'],fictionalAdultOnly:true};
 })}))});
}
module.exports={getFollowUpEmail,MODELS,GUIDANCE,SUPPORTED_EXPLANATION_LOCALES,PROFILES};
