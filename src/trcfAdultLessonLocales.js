/* HF79: source-authored adult Legal/Business English rehearsal explanations.
 * English is the taught language. explanationLocale is independent from the
 * proposed TRCF R2 `lesson_context.language`, which must remain en/en-US.
 * These static texts are NOT a voice, avatar, translation provider, AI response,
 * endorsed legal advice, or a production learning record. Native QA pending.
 */
'use strict';
const LOCALE_LABELS=Object.freeze({
  'en-US':'English (United States)',
  'th-TH':'ไทย (ประเทศไทย)',
  'vi-VN':'Tiếng Việt (Việt Nam)',
  'zh-CN':'简体中文（中国大陆）',
  'ko-KR':'한국어 (대한민국)'
});
const PROFILES=Object.freeze(['legal-english','business-english']);
const ENGLISH_MODELS=Object.freeze({
  'legal-english':'In this fictional clause, “may” grants permission, while “must” expresses a requirement.',
  'business-english':'Could we review the delivery schedule tomorrow? That would help us confirm the next milestone.'
});
// Translation review by fluent legal/business teachers is still mandatory.
const CONTENT={
  'en-US':{
    'legal-english':{
      intro:'Today we will practice how “may” and “must” differ in a fictional contract.',
      explain:'In many English-language contracts, “may” signals permission or discretion and “must” signals an obligation. Legal effect depends on the clause and governing law.',
      practice:'Read this invented clause: “The buyer may request an extension. The seller must respond in writing.” Which action is optional, and which is required?',
      feedback:'A strong answer distinguishes permission from obligation and explains the reasoning in a complete sentence.',
      close:'Try another short contract example. A qualified human teacher should review legal accuracy and context.'
    },
    'business-english':{
      intro:'Today we will practice making professional, polite requests in English.',
      explain:'“Could we…” is a courteous way to propose a shared action. State the request clearly, give a brief reason, and suggest a next step.',
      practice:'Try asking a colleague to review a fictional project schedule tomorrow. Include why the review matters.',
      feedback:'A strong answer is clear, polite, complete, and appropriate for your audience.',
      close:'Repeat your request with a different deadline or audience. A human teacher can review tone and pronunciation.'
    }
  },
  'th-TH':{
    'legal-english':{
      intro:'วันนี้เราจะฝึกความแตกต่างระหว่าง “may” และ “must” ในสัญญาสมมติ',
      explain:'ในสัญญาภาษาอังกฤษ “may” โดยทั่วไปสื่อถึงการอนุญาตหรือดุลพินิจ ส่วน “must” สื่อถึงหน้าที่ที่ต้องปฏิบัติ ผลทางกฎหมายขึ้นอยู่กับข้อความและกฎหมายที่ใช้บังคับ',
      practice:'อ่านข้อความสมมติ: “The buyer may request an extension. The seller must respond in writing.” การกระทำใดเป็นทางเลือก และการกระทำใดเป็นหน้าที่?',
      feedback:'คำตอบที่ดีแยกความแตกต่างระหว่างสิทธิเลือกทำกับหน้าที่ และอธิบายเหตุผลเป็นประโยคภาษาอังกฤษที่สมบูรณ์',
      close:'ลองฝึกกับตัวอย่างสัญญาสั้น ๆ อีกข้อ และให้ครูผู้สอนตรวจสอบความถูกต้องทางกฎหมายและบริบท'
    },
    'business-english':{
      intro:'วันนี้เราจะฝึกการขอความร่วมมืออย่างสุภาพและเป็นมืออาชีพในภาษาอังกฤษ',
      explain:'“Could we…” เป็นวิธีสุภาพในการเสนอให้ทำบางสิ่งร่วมกัน ควรบอกคำขออย่างชัดเจน ให้เหตุผลสั้น ๆ และเสนอขั้นตอนต่อไป',
      practice:'ลองขอให้เพื่อนร่วมงานตรวจตารางโครงการสมมติในวันพรุ่งนี้ พร้อมบอกเหตุผลว่าทำไมต้องตรวจ',
      feedback:'คำตอบที่ดีควรชัดเจน สุภาพ เป็นประโยคสมบูรณ์ และเหมาะสมกับผู้ฟัง',
      close:'ลองพูดคำขอเดิมโดยเปลี่ยนกำหนดเวลาหรือผู้ฟัง ครูผู้สอนสามารถช่วยตรวจน้ำเสียงและการออกเสียงได้'
    }
  },
  'vi-VN':{
    'legal-english':{
      intro:'Hôm nay chúng ta luyện tập sự khác nhau giữa “may” và “must” trong một hợp đồng giả định.',
      explain:'Trong nhiều hợp đồng bằng tiếng Anh, “may” thường thể hiện sự cho phép hoặc quyền quyết định, còn “must” thể hiện nghĩa vụ. Hiệu lực pháp lý phụ thuộc vào điều khoản và luật áp dụng.',
      practice:'Đọc điều khoản giả định: “The buyer may request an extension. The seller must respond in writing.” Hành động nào là tùy chọn và hành động nào là bắt buộc?',
      feedback:'Một câu trả lời tốt phân biệt quyền được làm và nghĩa vụ phải làm, đồng thời giải thích bằng một câu tiếng Anh hoàn chỉnh.',
      close:'Hãy luyện thêm với một ví dụ hợp đồng ngắn khác. Giáo viên cần xem lại độ chính xác pháp lý và bối cảnh.'
    },
    'business-english':{
      intro:'Hôm nay chúng ta luyện cách đưa ra lời đề nghị lịch sự và chuyên nghiệp bằng tiếng Anh.',
      explain:'“Could we…” là cách lịch sự để đề nghị cùng thực hiện một việc. Hãy nêu rõ yêu cầu, đưa ra lý do ngắn gọn và đề xuất bước tiếp theo.',
      practice:'Hãy đề nghị đồng nghiệp xem lại lịch trình của một dự án giả định vào ngày mai, kèm lý do cần xem lại.',
      feedback:'Câu trả lời tốt cần rõ ràng, lịch sự, đầy đủ và phù hợp với người nghe.',
      close:'Thử thay đổi thời hạn hoặc người nghe trong yêu cầu của bạn. Giáo viên có thể nhận xét giọng điệu và phát âm.'
    }
  },
  'zh-CN':{
    'legal-english':{
      intro:'今天我们练习区分虚构合同中的“may”和“must”。',
      explain:'在许多英语合同中，“may”通常表示许可或自由裁量，而“must”表示义务。具体法律效力取决于条款内容和适用法律。',
      practice:'请阅读虚构条款：“The buyer may request an extension. The seller must respond in writing.” 哪项行为是可选择的，哪项是必须履行的？',
      feedback:'好的回答能够区分许可与义务，并用完整的英语句子解释理由。',
      close:'请再练习一个简短的合同示例，并请具备相关知识的人类教师核查法律准确性和语境。'
    },
    'business-english':{
      intro:'今天我们练习在商务场合用英语提出礼貌、清晰、专业的请求。',
      explain:'“Could we…”是一种礼貌地提出共同行动建议的表达。请清楚说明请求、简要解释原因，并提出下一步安排。',
      practice:'请用英语请求同事明天审阅一份虚构的项目进度表，并说明审阅的原因。',
      feedback:'好的回答应该清楚、礼貌、完整，并符合听众和工作场合。',
      close:'请更换截止时间或听众再练习一次。人类教师可以帮助检查语气和发音。'
    }
  },
  'ko-KR':{
    'legal-english':{
      intro:'오늘은 가상의 계약서에서 “may”와 “must”의 차이를 연습합니다.',
      explain:'영어 계약서에서 “may”는 일반적으로 허용이나 재량을, “must”는 의무를 나타냅니다. 구체적인 법적 효력은 조항의 문맥과 준거법에 따라 달라질 수 있습니다.',
      practice:'가상의 조항을 읽어 보세요: “The buyer may request an extension. The seller must respond in writing.” 어느 행동은 선택할 수 있고, 어느 행동은 반드시 해야 하나요?',
      feedback:'좋은 답변은 허용과 의무를 구분하고 그 이유를 완전한 영어 문장으로 설명합니다.',
      close:'다른 짧은 계약 예문으로 다시 연습하세요. 법적 정확성과 문맥은 전문 지식을 갖춘 실제 교사의 검토가 필요합니다.'
    },
    'business-english':{
      intro:'오늘은 영어로 정중하고 전문적인 업무 요청을 하는 연습을 합니다.',
      explain:'“Could we…”는 함께 할 일을 정중하게 제안하는 표현입니다. 요청을 명확히 말하고, 간단한 이유를 제시한 다음, 다음 단계를 제안하세요.',
      practice:'가상의 프로젝트 일정을 내일 검토해 달라고 동료에게 정중하게 요청하고, 검토가 필요한 이유도 말해 보세요.',
      feedback:'좋은 답변은 명확하고 정중하며 완전한 문장으로 이루어지고, 상대방과 상황에 적절해야 합니다.',
      close:'기한이나 상대방을 바꾸어 같은 요청을 다시 연습하세요. 실제 교사는 어조와 발음을 검토할 수 있습니다.'
    }
  }
};
const FIELD_NAMES=Object.freeze(['intro','explain','practice','feedback','close']);
const {bilingualDirections,bilingualDefinitions}=require('./trcfBilingualTeachingContent');
for(const locale of Object.keys(CONTENT)){
  for(const profile of PROFILES)Object.freeze(CONTENT[locale][profile]);
  Object.freeze(CONTENT[locale]);
}
Object.freeze(CONTENT);
function isKnownLocale(locale){return Object.prototype.hasOwnProperty.call(LOCALE_LABELS,locale);}
function isKnownProfile(profile){return PROFILES.includes(profile);}
function getStaticLesson({explanationLocale='en-US',profile}={}){
  if(!isKnownLocale(explanationLocale))throw new RangeError('unsupported_explanation_locale');
  if(!isKnownProfile(profile))throw new RangeError('unsupported_professional_track');
  const p=CONTENT[explanationLocale][profile];
  return Object.freeze({
    explanationLocale,localeLabel:LOCALE_LABELS[explanationLocale],taughtLanguage:'en',profile,
    instructorTarget:'Teacher Roger Avatar',instructorDeployment:'PLANNED_NOT_LIVE',
    provenance:'STATIC_AUTHORED_REHEARSAL_NOT_GENERATIVE',nativeReviewerApproved:false,
    adultFictionalOnly:true, teacherOversightRequired:true, modelEnglish:ENGLISH_MODELS[profile],
    glossary:bilingualDefinitions(explanationLocale,profile),
    classroomInspiration:'READ_ONLY_V105_ENGLISH_FIRST_NATIVE_SUPPORT_ADULT_ADAPTATION',
    bilingualTeachingReady:'STATIC_SCRIPTED_TRANSLATIONS_PENDING_NATIVE_QA',
    stages:Object.freeze(FIELD_NAMES.map((phase,i)=>Object.freeze({
      index:i+1,phase,explanation:p[phase],
      englishExplanation:CONTENT['en-US'][profile][phase],nativeExplanation:p[phase],
      directionsEnglish:bilingualDirections(explanationLocale,phase).english,
      directionsNative:bilingualDirections(explanationLocale,phase).native,
      nativeLang:explanationLocale
    })))
  });
}
module.exports=Object.freeze({
  SUPPORTED_EXPLANATION_LOCALES:Object.freeze(Object.keys(LOCALE_LABELS)),
  LOCALE_LABELS,PROFILES,ENGLISH_MODELS,FIELD_NAMES,getStaticLesson,isKnownLocale,isKnownProfile
});
