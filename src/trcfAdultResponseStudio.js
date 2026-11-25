/* HF82 EnglishLegalese-only private writing studio: fictional adult practice.
 * No automatic writing evaluation, generative AI, speech, storage or providers.
 * Draft translations pending professional native review; production blocked.
 */
'use strict';
const {SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('./trcfAdultLessonLocales');
const {getDialogueScenarios}=require('./trcfAdultDialogueRehearsal');
const GUIDANCE={
'en-US':{
 introduction:'Write a complete English reply to the fictional professional question. You may use your own words. Do not enter names, confidential information, real client matters, or personal data.',
 checklist:['Did I answer the actual question accurately?','Is my tone respectful and professional?','Did I give a clear next step, limitation, or deadline when needed?'],
 comparison:'Compare the meaning of your response with the example. Different wording can also be appropriate; this tool does not grade your writing.',
 privacy:'Private rehearsal: text exists only in this browser tab until you change the exercise or stop. No AI teacher has reviewed it.',
 noGrade:'Your own checklist is for reflection. This application does not score, assess, save, upload, or send your response.'
},
'th-TH':{
 introduction:'เขียนคำตอบภาษาอังกฤษเป็นประโยคสมบูรณ์สำหรับคำถามในสถานการณ์งานสมมติ ใช้คำของคุณเองได้ ห้ามใส่ชื่อ ข้อมูลลับ เรื่องของลูกค้าจริง หรือข้อมูลส่วนบุคคล',
 checklist:['ฉันตอบคำถามตรงประเด็นและถูกต้องหรือไม่','น้ำเสียงของฉันสุภาพและเป็นมืออาชีพหรือไม่','ฉันระบุขั้นตอนต่อไป ข้อจำกัด หรือกำหนดเวลาที่จำเป็นอย่างชัดเจนหรือไม่'],
 comparison:'เปรียบเทียบความหมายของคำตอบคุณกับตัวอย่าง คำที่ต่างกันอาจถูกต้องได้ เครื่องมือนี้ไม่ให้คะแนนการเขียน',
 privacy:'การฝึกส่วนตัว: ข้อความอยู่ในแท็บนี้เท่านั้นจนกว่าจะเปลี่ยนแบบฝึกหรือหยุด ไม่มีครู AI ตรวจคำตอบ',
 noGrade:'รายการตรวจสอบเป็นการทบทวนด้วยตนเอง โปรแกรมไม่ได้ให้คะแนน ประเมิน บันทึก อัปโหลด หรือส่งคำตอบ'
},
'vi-VN':{
 introduction:'Viết một câu trả lời tiếng Anh đầy đủ cho câu hỏi nghề nghiệp giả định. Có thể dùng lời của riêng bạn. Không nhập tên, thông tin bí mật, vụ việc của khách hàng thật hoặc dữ liệu cá nhân.',
 checklist:['Tôi đã trả lời đúng và chính xác câu hỏi chưa?','Giọng điệu của tôi có lịch sự và chuyên nghiệp không?','Tôi đã nêu rõ bước tiếp theo, giới hạn hoặc thời hạn khi cần chưa?'],
 comparison:'So sánh ý nghĩa câu trả lời của bạn với ví dụ. Cách diễn đạt khác cũng có thể phù hợp; công cụ không chấm điểm bài viết.',
 privacy:'Luyện tập riêng tư: nội dung chỉ tồn tại trong tab này cho đến khi đổi bài hoặc dừng. Không có giáo viên AI nào đọc bài.',
 noGrade:'Danh sách tự kiểm tra chỉ để suy ngẫm. Ứng dụng không chấm điểm, đánh giá, lưu, tải lên hoặc gửi câu trả lời.'
},
'zh-CN':{
 introduction:'针对虚构的职场问题，用自己的话写出完整的英语回答。不要输入姓名、机密信息、真实客户事项或个人数据。',
 checklist:['我是否准确回答了实际问题？','我的语气是否礼貌且专业？','需要时，我是否明确说明下一步、限制或截止时间？'],
 comparison:'对照示范回答比较含义。不同表达方式也可能合适；此工具不会为写作评分。',
 privacy:'私人练习：文字只在当前浏览器标签页中暂存，切换练习或停止时清除。没有人工智能教师审核。',
 noGrade:'自查清单仅用于反思。程序不会评分、评估、保存、上传或发送你的回答。'
},
'ko-KR':{
 introduction:'가상의 직무 질문에 대해 자신만의 완전한 영어 답변을 작성하세요. 이름, 기밀 정보, 실제 고객 사건 또는 개인 정보를 입력하지 마세요.',
 checklist:['실제 질문에 정확하게 답했나요?','어조가 정중하고 전문적인가요?','필요한 후속 조치, 제한 사항 또는 마감일을 명확하게 설명했나요?'],
 comparison:'자신의 답변과 예시의 의미를 비교하세요. 다른 표현도 적절할 수 있습니다. 이 도구는 글을 채점하지 않습니다.',
 privacy:'개인 연습: 글은 이 브라우저 탭에만 잠시 남아 있으며 연습을 바꾸거나 중지하면 지워집니다. AI 교사가 검토하지 않았습니다.',
 noGrade:'자기 점검은 학습을 위한 것입니다. 앱은 답변을 채점, 평가, 저장, 업로드 또는 전송하지 않습니다.'
}};
function deepFreeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(deepFreeze);Object.freeze(v)}return v}
deepFreeze(GUIDANCE);
function getResponseStudio({profile,explanationLocale}){
 if(!PROFILES.includes(profile))throw Error('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw Error('unsupported_explanation_locale');
 const scenes=getDialogueScenarios({profile,explanationLocale});
 return deepFreeze({taughtLanguage:'en',explanationLocale,profile,reviewStatus:'DRAFT_NATIVE_PROFESSIONAL_REVIEW_REQUIRED',privacy:{network:false,storage:false,microphone:false,automaticScoring:false},guidance:GUIDANCE[explanationLocale],scenarios:scenes.map(scene=>({id:scene.id,titleEnglish:scene.titleEnglish,turns:scene.turns.map(turn=>({promptEnglish:turn.promptEnglish,modelEnglish:turn.modelEnglish,rationaleEnglish:turn.rationaleEnglish,rationaleNative:turn.rationaleNative,locale:turn.nativeLang}))}))});
}
module.exports={SUPPORTED_EXPLANATION_LOCALES,PROFILES,GUIDANCE,getResponseStudio};
