/* HF88 — entirely authored fictional-adult Legal/Business English meeting records.
 * NO real case data, learner storage, sending, grading, live AI, provider or network.
 * Non-English teaching text awaits native/professional review before publication.
 */
'use strict';
const {getFollowUpEmail,PROFILES,SUPPORTED_EXPLANATION_LOCALES}=require('./trcfAdultFollowUpEmail');
const MODELS={
 'contract-clarification':[
 ['Written-reply clause: language review','The fictional provision mentions a written response by Friday; no legal effect was determined.','Propose a plain-English clause summary and refer actual legal implications to qualified counsel.','Language-review coordinator','Before any external reliance','Which exact sample wording needs clarification?'],
 ['Permission versus duty','The example uses “may” for an optional extension request rather than a mandatory instruction.','Propose a short comparison of “may” and “must” and request review of the full example.','Draft-review colleague','Before the next drafting discussion','Does any other fictional clause change this interpretation?'],
 ['Limits of language explanation','The team can describe the English but cannot establish a court outcome from grammar alone.','Propose referring actual legal-effect questions to independent qualified counsel.','Meeting facilitator','Before providing external guidance','What real-world facts would counsel need to review?']
 ],
 'negotiation-phrases':[
 ['Review timetable discussion','The original requested completion date has not been checked against the review workload.','Propose a feasible alternative review period for both fictional teams.','Review-team lead','At the next planning meeting','What minimum review time is realistic?'],
 ['Documenting a revised date','The participants discussed a different deadline but have not yet verified the written record.','Propose circulating a written summary for confirmation or corrections.','Meeting note-taker','Before updating the draft schedule','Which date did each fictional team understand?'],
 ['Clarifying reasonable time','The expression “within a reasonable time” may be read differently by participants.','Propose replacing the ambiguous phrase with an agreed number of days.','Drafting coordinator','Before a final fictional draft','What specific period is workable?']
 ],
 'project-update':[
 ['Progress estimate for report','The fictional report remains in progress; Tuesday is an estimate and not a guarantee.','Propose checking remaining figures and providing a revised, clearly labelled estimate.','Project analyst','At the next scheduled update','Which figures still require checking?'],
 ['Collaborative figures review','Some figures in the fictional report still need independent review.','Propose a joint review of the flagged values before the report is finalized.','Reporting colleague','During the next review session','Who can bring the latest fictional worksheet?'],
 ['Actionable revised schedule','The project team is preparing a revised schedule with outstanding checks.','Propose circulating a dated schedule with owners and any changes clearly identified.','Project coordinator','Before the next stakeholder update','Which milestone is most uncertain?']
 ],
 'client-meeting':[
 ['Understanding client priorities','The fictional participant has not yet stated the concerns they consider most urgent.','Propose listening to the participant’s priorities before recommending an action.','Client-relationship colleague','At the next fictional meeting','What is the main concern to address first?'],
 ['Delivery handoff issue','The fictional concern may relate to the final handoff, rather than shipping itself.','Propose requesting an example and checking the handoff sequence without assuming blame.','Operations liaison','Before describing a possible cause','Which step of the handoff needs clarification?'],
 ['Written meeting recap','The fictional meeting discussed actions and dates that need written confirmation.','Propose a concise draft recap identifying owners and proposed deadlines for review.','Meeting secretary','After the meeting, before relying on the recap','Which proposed actions have been explicitly accepted?']
 ]
};
const GUIDANCE={
 'en-US':{intro:'Record fictional professional meeting minutes in accurate English. Separate known facts, proposed actions and confirmed commitments; identify a responsible role, timing and open question.',privacy:'Private unsent practice only. Never enter real client facts, pupil data or personal information. This page makes no network requests, recordings, AI assessments or stored records.',review:'Compare your own record with an authored example. Proposals must not be described as agreed decisions without evidence.',copy:'Copying to the main writing draft is deliberate; existing text is protected by a separate second confirmation.'},
 'th-TH':{intro:'เขียนบันทึกการประชุมภาษาอังกฤษสำหรับสถานการณ์วิชาชีพสมมติ แยกข้อเท็จจริง ข้อเสนอ และข้อตกลงที่ยืนยันแล้ว ระบุผู้รับผิดชอบ กำหนดเวลา และคำถามที่ยังค้างอยู่',privacy:'ใช้ฝึกส่วนตัวเท่านั้น อย่าใส่ข้อมูลลูกค้าจริง ข้อมูลนักเรียน หรือข้อมูลส่วนบุคคล หน้านี้ไม่ส่งข้อมูล ไม่บันทึกเสียง ไม่ให้ AI ประเมิน และไม่จัดเก็บบันทึก',review:'เปรียบเทียบบันทึกของคุณกับตัวอย่างที่เขียนไว้ล่วงหน้า อย่าเขียนว่าข้อเสนอได้รับความเห็นชอบหากไม่มีหลักฐานยืนยัน',copy:'คัดลอกไปยังแบบฝึกเขียนหลักเมื่อเลือกเองเท่านั้น และต้องยืนยันอีกครั้งก่อนแทนที่ข้อความเดิม'},
 'vi-VN':{intro:'Viết biên bản cuộc họp nghề nghiệp giả định bằng tiếng Anh. Phân biệt sự kiện đã biết, hành động được đề xuất và cam kết đã xác nhận; nêu vai trò phụ trách, thời hạn và câu hỏi còn mở.',privacy:'Chỉ luyện tập riêng tư. Không nhập thông tin khách hàng thật, dữ liệu học sinh hoặc thông tin cá nhân. Trang không gửi mạng, ghi âm, chấm AI hoặc lưu biên bản.',review:'So sánh biên bản của bạn với mẫu viết sẵn. Đừng mô tả đề xuất là quyết định đã đồng ý khi chưa được xác nhận.',copy:'Chỉ sao chép sang phần luyện viết khi bạn chủ động chọn; nội dung trước đó cần xác nhận riêng để thay thế.'},
 'zh-CN':{intro:'用英语记录虚构的成人职业会议纪要。明确区分已知事实、拟议行动与已确认的承诺，并写出负责角色、时间及待解决的问题。',privacy:'仅供私人练习。请勿输入真实客户事实、学生资料或个人信息。本页面不发送网络请求、不录音、不使用 AI 评分，也不保存会议记录。',review:'将自己的会议记录与预先编写的示例比较。没有明确证据时，不应把提议写成已经同意的决定。',copy:'只有主动选择才会复制到主要写作练习；替换原有文字前还须再次确认。'},
 'ko-KR':{intro:'가상의 성인 직장 회의 내용을 영어로 기록하세요. 확인된 사실, 제안된 조치, 합의된 약속을 구분하고 담당 역할, 일정, 미해결 질문을 적으세요.',privacy:'비공개 연습 전용입니다. 실제 고객 정보, 학생 자료, 개인정보를 입력하지 마세요. 네트워크 전송, 녹음, AI 채점, 기록 저장은 하지 않습니다.',review:'작성한 회의록을 미리 작성된 예시와 비교하세요. 명확한 근거가 없으면 제안을 이미 합의된 결정처럼 표현하지 마세요.',copy:'직접 선택한 경우에만 주요 글쓰기 연습으로 복사합니다. 기존 내용을 바꾸려면 별도로 다시 확인해야 합니다.'}
};
function freeze(x){if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(freeze);Object.freeze(x)}return x}
freeze(MODELS);freeze(GUIDANCE);
function getMeetingMinutes({profile,explanationLocale}){
 if(!PROFILES.includes(profile))throw Error('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw Error('unsupported_explanation_locale');
 const older=getFollowUpEmail({profile,explanationLocale});
 return freeze({profile,explanationLocale,mode:'PRIVATE_AUTHORED_MEETING_RECORD_REHEARSAL',taughtLanguage:'en',reviewStatus:'DRAFT_NATIVE_PROFESSIONAL_REVIEW_REQUIRED',grading:'NONE',privacy:{network:false,storage:false,microphone:false,provider:false,emailSending:false},guidance:GUIDANCE[explanationLocale],scenarios:older.scenarios.map(scene=>({id:scene.id,titleEnglish:scene.titleEnglish,turns:scene.turns.map((turn,i)=>{
  const m=MODELS[scene.id]?.[i];if(!m||m.length!==6)throw Error('MISSING_MINUTES_MODEL');
  return {focusEnglish:turn.focusEnglish,promptEnglish:turn.promptEnglish,topicEnglish:m[0],factsEnglish:m[1],actionEnglish:m[2],ownerEnglish:m[3],timingEnglish:m[4],questionEnglish:m[5],rationaleNative:turn.rationaleNative,fictionalAdultOnly:true,checklistEnglish:['Are facts distinguished from assumptions?','Is an action explicitly proposed or confirmed?','Is the responsible role, timing and open question clearly stated?']};
 })}))});
}
module.exports={getMeetingMinutes,MODELS,GUIDANCE,PROFILES,SUPPORTED_EXPLANATION_LOCALES};
