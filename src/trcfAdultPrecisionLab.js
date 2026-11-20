/* EnglishLegalese HF84: professional precision challenge for fictional adults.
 * Fixed authored contrast pairs only; no semantic AI, scoring, provider, storage,
 * speech or outbound network. All native guidance remains REVIEW_REQUIRED.
 */
'use strict';
const {getResponseStudio,SUPPORTED_EXPLANATION_LOCALES,PROFILES}=require('./trcfAdultResponseStudio');
const QUESTIONS={
 'contract-clarification':[
  {focus:'Explain a stated contractual obligation accurately',question:'Which response more faithfully explains the written-reply requirement in the fictional clause?',choices:['The clause requires a written reply by Friday, though its real legal effect needs review.','It would be nice to reply by Friday, but the clause does not appear to set a deadline.'],best:0},
  {focus:'Distinguish permission from a requirement',question:'The clause says the client MAY request more time. Which explanation is more precise?',choices:['The word “may” instructs the client to ask for more time even if no extension is needed.','The word “may” provides an option to request more time; it is not itself a command.'],best:1},
  {focus:'Avoid unfounded legal guarantees',question:'The client asks whether a court is certain to agree. What is the responsible response?',choices:['I can explain the wording, but a qualified lawyer must assess the facts and actual legal outcome.','Because the phrase is written clearly, I can assure you that a judge will enforce it.'],best:0}
 ],
 'negotiation-phrases':[
  {focus:'Negotiate without an unsupported promise',question:'A counterpart requests an earlier date than the team can confirm. Which reply is more professionally accurate?',choices:['We will meet your deadline even though our team has not confirmed the work.','Could we discuss a revised deadline that allows both teams to review the materials carefully?'],best:1},
  {focus:'Document an agreed change',question:'The fictional parties agree to a revised deadline. Which follow-up best avoids misunderstanding?',choices:['I will summarize the agreed date and any other changes in writing for confirmation.','We probably both remember the new date; there is no need to set it down.'],best:0},
  {focus:'Clarify ambiguous time language',question:'A draft uses “within a reasonable time.” Which suggestion is clearest?',choices:['Everyone knows what reasonable means, so the term does not need discussion.','Could we specify the intended number of days so both sides understand the period?'],best:1}
 ],
 'project-update':[
  {focus:'Report progress without false certainty',question:'A manager asks if a report will be ready Monday, but Tuesday is the honest estimate. Choose the better update.',choices:['The report is still in progress; I currently expect Tuesday and will flag any change.','The report is definitely ready Monday, regardless of our current progress.'],best:0},
  {focus:'Accept help with a concrete action',question:'A colleague offers to help check project figures. Which reply works better?',choices:['I do not need you to be involved; please stop asking questions.','Thank you. Could we review the figures together this afternoon?'],best:1},
  {focus:'State a useful follow-up',question:'After a review meeting, what update gives the clearest deliverable and timeframe?',choices:['I will send the revised project schedule by 3 p.m. tomorrow.','I will look at the schedule soon and get back to you sometime.'],best:0}
 ],
 'client-meeting':[
  {focus:'Invite the client’s priorities',question:'You are opening a fictional client meeting. Which invitation is more collaborative?',choices:['Our team already knows everything important; let us skip your priorities.','Thank you for meeting. Could we begin with the concerns that matter most to you?'],best:1},
  {focus:'Seek facts before assuming the problem',question:'A client reports an urgent delivery concern. Which clarification is more useful?',choices:['Could you explain which part of the delivery process is most urgent?','I assume the problem is shipping; there is no need for more details.'],best:0},
  {focus:'Give an accountable meeting recap',question:'At the end of a meeting, how should you describe the follow-up?',choices:['We will probably remember the next steps without documenting responsibilities.','I will send a concise recap listing actions, responsible people and agreed deadlines.'],best:1}
 ]
};
const GUIDANCE={
 'en-US':{intro:'Choose the wording that best matches this fictional professional situation. Two answers may sound possible, but one is more precise. Your selection is not an AI or teacher grade.',privacy:'Check only after selecting an answer, or deliberately reveal the example. Incorrect answers do not disclose the model. Do not enter real confidential details.',correct:'This matches the scripted example. Read the explanation before trying the next exchange.',wrong:'That wording is not the more precise scripted example. Try again or choose Reveal intentionally.',review:'Professional and native-language review remains required before live teaching.'},
 'th-TH':{intro:'เลือกสำนวนที่ตรงกับสถานการณ์วิชาชีพสมมติมากที่สุด คำตอบทั้งสองอาจฟังดูเป็นไปได้ แต่มีคำตอบหนึ่งที่แม่นยำกว่า นี่ไม่ใช่การให้คะแนนโดย AI หรือครู',privacy:'เลือกคำตอบก่อนกดตรวจสอบ หรือกดแสดงตัวอย่างด้วยตนเอง คำตอบที่ไม่ตรงจะยังไม่เปิดเผยเฉลย ห้ามใส่ข้อมูลลับจริง',correct:'คำตอบตรงกับตัวอย่างที่เขียนไว้ โปรดอ่านคำอธิบายก่อนทำข้อต่อไป',wrong:'สำนวนนี้ไม่ใช่ตัวอย่างที่แม่นยำกว่า ลองอีกครั้งหรือเลือกเปิดเฉลยด้วยตนเอง',review:'ยังต้องให้ผู้เชี่ยวชาญด้านภาษาและวิชาชีพตรวจทานก่อนนำไปสอนจริง'},
 'vi-VN':{intro:'Chọn cách diễn đạt phù hợp nhất với tình huống nghề nghiệp giả định. Cả hai có thể nghe hợp lý, nhưng một cách chính xác hơn. Đây không phải điểm do AI hoặc giáo viên chấm.',privacy:'Chỉ kiểm tra sau khi chọn hoặc chủ động hiện đáp án mẫu. Câu trả lời chưa đúng không làm lộ đáp án. Không nhập thông tin mật thật.',correct:'Cách này khớp với ví dụ có sẵn. Hãy đọc lời giải trước khi sang lượt tiếp theo.',wrong:'Cách diễn đạt này chưa phải ví dụ chính xác hơn. Hãy thử lại hoặc chủ động mở đáp án.',review:'Cần chuyên gia ngôn ngữ và chuyên môn duyệt trước khi dạy thực tế.'},
 'zh-CN':{intro:'为虚构的专业场景选择更准确的英语表达。两个选项听起来可能都合理，但其中一个更精确。这不是人工智能或教师评分。',privacy:'选择答案后再点击检查，或主动显示示范答案。错误选择不会自动透露答案。不要输入真实机密信息。',correct:'你的选择与编写好的示例相符。继续之前请阅读解释。',wrong:'此表达不是更准确的预设示例。请重试或主动查看示范答案。',review:'正式教学前仍需母语和专业人员审核。'},
 'ko-KR':{intro:'가상의 전문 상황에 더 정확한 영어 표현을 선택하세요. 두 선택지가 모두 가능해 보일 수 있지만 하나가 더 정확합니다. AI나 교사의 채점이 아닙니다.',privacy:'답을 고른 뒤 확인하거나 직접 예시 답을 표시하세요. 틀린 선택에서는 정답을 자동으로 공개하지 않습니다. 실제 기밀 정보를 입력하지 마세요.',correct:'작성된 예시와 일치합니다. 다음 대화 전에 설명을 읽어 보세요.',wrong:'이 표현은 더 정확한 작성 예시가 아닙니다. 다시 선택하거나 직접 답을 공개하세요.',review:'실제 수업에 사용하기 전에 원어민과 전문가의 검토가 필요합니다.'}
};
function freezeDeep(v){if(v&&typeof v==='object'&&!Object.isFrozen(v)){Object.values(v).forEach(freezeDeep);Object.freeze(v)}return v}
freezeDeep(QUESTIONS);freezeDeep(GUIDANCE);
function getPrecisionLab({profile,explanationLocale}){
 if(!PROFILES.includes(profile))throw Error('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw Error('unsupported_explanation_locale');
 const prior=getResponseStudio({profile,explanationLocale});
 return freezeDeep({profile,explanationLocale,taughtLanguage:'en',mode:'SCRIPTED_SINGLE_TURN_CHOICE',translationStatus:'DRAFT_NATIVE_PROFESSIONAL_REVIEW_REQUIRED',
   grading:'NO_AUTOMATIC_GRADE_OR_PERSISTED_SCORE',privacy:{network:false,storage:false,microphone:false},guidance:GUIDANCE[explanationLocale],
   scenarios:prior.scenarios.map(s=>({id:s.id,titleEnglish:s.titleEnglish,turns:s.turns.map((t,i)=>{
    const q=QUESTIONS[s.id]?.[i];if(!q||q.choices.length!==2)throw Error('MISSING_PROFESSIONAL_PRECISION_SCENARIO');
    return {focusEnglish:q.focus,questionEnglish:q.question,choicesEnglish:[...q.choices],bestOptionIndex:q.best,englishRationale:t.rationaleEnglish,nativeRationale:t.rationaleNative,nativeLang:explanationLocale,adultFictional:true,answerMode:'DELIBERATE_CHECK_OR_REVEAL'};
   })}))});
}
module.exports={getPrecisionLab,SUPPORTED_EXPLANATION_LOCALES,PROFILES,GUIDANCE,QUESTIONS};
