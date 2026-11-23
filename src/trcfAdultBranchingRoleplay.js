/* EnglishLegalese HF85: controlled, fully scripted adult professional dialogue.
 * NO live AI, provider, advice, storage, microphone, school/child records, or network.
 * All translated teaching text must pass independent native-professional review.
 */
'use strict';
const {getReplyBuilder, SUPPORTED_EXPLANATION_LOCALES, PROFILES}=require('./trcfAdultReplyBuilder');
const {getResponseStudio}=require('./trcfAdultResponseStudio');

// Each two-choice round has a different, authored stakeholder reaction. Only the
// learner's choice determines the next stakeholder line; there is no model call.
const BRANCHES={
 'contract-clarification': [
  {focus:'Separate an obligation from an informal suggestion',
   choices:[
    {reply:'In this fictional clause, a written response is required by Friday. I can explain that wording.',reaction:'Thank you. I understand that the deadline is written into the example.',reason:'It distinguishes the wording of a requirement from legal advice.'},
    {reply:'Friday is only a friendly suggestion. You can ignore it without reviewing the provision.',reaction:'That sounds uncertain. Could you show me where the clause says it is optional?',reason:'It changes the wording without evidence. Re-read the provision before describing the obligation.'}
   ],preferred:0},
  {focus:'Distinguish may from must',
   choices:[
    {reply:'You must request extra time because the word “may” makes the request compulsory.',reaction:'I am confused. I thought “may” offered me a choice.',reason:'May normally indicates permission or an option, not an automatic duty; consider the full context.'},
    {reply:'The word “may” provides an option to ask for more time; it does not itself require a request.',reaction:'That distinction helps me decide what question to ask next.',reason:'It explains the distinction accurately without converting an option into a command.'}
   ],preferred:1},
  {focus:'State the limit of a language explanation',
   choices:[
    {reply:'I can explain the English, but only qualified counsel can evaluate the real legal effect and facts.',reaction:'Understood. I will ask counsel to review the actual agreement.',reason:'It limits the exercise to language and avoids a promised legal outcome.'},
    {reply:'Since the English is clear, I guarantee any court will enforce the clause exactly as you expect.',reaction:'A guarantee without legal review worries me. Can you support that claim?',reason:'Clear grammar does not establish a legal outcome or override applicable law.'}
   ],preferred:0}
 ],
 'negotiation-phrases': [
  {focus:'Request a workable deadline without a false promise',
   choices:[
    {reply:'We promise to finish tomorrow, although no one has confirmed the work can be completed.',reaction:'I will rely on that promise. Can you explain what work has been checked?',reason:'An unverified commitment creates avoidable expectations.'},
    {reply:'We want to respond carefully. Could we discuss a revised deadline that works for both teams?',reaction:'That is constructive. What review period would you propose?',reason:'It acknowledges the concern and invites an achievable agreement.'}
   ],preferred:1},
  {focus:'Confirm a negotiated change in writing',
   choices:[
    {reply:'I will send a short written summary of our agreed date so we can confirm the details.',reaction:'Please do. We can correct any misunderstanding before proceeding.',reason:'A written recap helps the teams check the actual agreement.'},
    {reply:'We can rely on memory; there is no need to write down the revised date.',reaction:'Our teams remember different dates. Could you send a written confirmation?',reason:'Avoid relying only on memory when deadlines are important.'}
   ],preferred:0},
  {focus:'Clarify an ambiguous time period',
   choices:[
    {reply:'Reasonable time means exactly the same number of days to every person.',reaction:'We interpret that phrase differently. Which number of days did you intend?',reason:'Reasonable time can be context-dependent, so the statement overclaims certainty.'},
    {reply:'Could we state an intended number of days rather than leaving “reasonable time” unclear?',reaction:'Yes. Let us specify the period before finalizing the draft.',reason:'Specific timing can reduce ambiguity in professional communication.'}
   ],preferred:1}
 ],
 'project-update': [
  {focus:'Give a responsible estimate',
   choices:[
    {reply:'The report is still in progress. Tuesday is my current estimate, and I will flag any change.',reaction:'Thanks for the realistic update. Please tell me if the estimate changes.',reason:'It distinguishes an estimate from a guarantee and invites timely updates.'},
    {reply:'It is definitely finished on Monday. There is no uncertainty at all.',reaction:'I am surprised. The team told me some figures remain unreviewed.',reason:'An unsupported promise misrepresents the state of the work.'}
   ],preferred:0},
  {focus:'Turn an offer of help into a concrete action',
   choices:[
    {reply:'No one else should be involved. Please stop asking questions.',reaction:'I was hoping to help. What part of the figures needs checking?',reason:'A dismissive reply can lose useful collaboration.'},
    {reply:'Thank you. Could we review the figures together this afternoon?',reaction:'Yes. I can prepare the spreadsheet for our review.',reason:'It accepts help courteously and identifies a next step.'}
   ],preferred:1},
  {focus:'End with an accountable deliverable',
   choices:[
    {reply:'I will send the revised schedule by 3 p.m. tomorrow, or promptly report any change.',reaction:'Perfect. That gives us a clear next checkpoint.',reason:'It names a deliverable, timing and responsible follow-up without guaranteeing results.'},
    {reply:'I will probably send something at some point, when I feel it is ready.',reaction:'I still need a date and a clear deliverable for the project plan.',reason:'Indefinite timing makes coordination harder.'}
   ],preferred:0}
 ],
 'client-meeting': [
  {focus:'Start by hearing the client’s priorities',
   choices:[
    {reply:'We already know what your priorities are. There is no need for you to explain.',reaction:'I would rather tell you what matters most before we begin.',reason:'Assuming priorities can dismiss the other person’s perspective.'},
    {reply:'Thank you for meeting. Could we begin with the concerns most important to you?',reaction:'Yes. My main concern is our upcoming delivery schedule.',reason:'An open question lets the participant set the initial priorities.'}
   ],preferred:1},
  {focus:'Request evidence before deciding what went wrong',
   choices:[
    {reply:'Which part of the delivery process is most urgent? Could you share an example?',reaction:'The issue concerns the final handoff, not the shipment itself.',reason:'Focused questions help avoid jumping to unsupported conclusions.'},
    {reply:'I know your issue must be the shipping company, so no examples are needed.',reaction:'That assumption is not correct. The concern is our handoff procedure.',reason:'Assuming the cause without asking may derail a constructive meeting.'}
   ],preferred:0},
  {focus:'Close with a clear written recap',
   choices:[
    {reply:'We will probably remember everything without putting actions or deadlines in writing.',reaction:'I need a list of owners and dates to follow up effectively.',reason:'An unwritten promise can conceal responsibility and timing.'},
    {reply:'I will send a concise recap with actions, responsible people and the agreed deadlines.',reaction:'Thank you. That will help us verify the next steps.',reason:'A clear recap creates a shared record and supports follow-through.'}
   ],preferred:1}
 ]
};
const SCENE_TITLES={'contract-clarification':'Contract Clause Clarification','negotiation-phrases':'Professional Negotiation','project-update':'Project Status Update','client-meeting':'Client Priorities Meeting'};
const LABELS={
'en-US':{intro:'Choose what you would say next in a fictional professional conversation. Each choice leads to a different scripted stakeholder reaction; this is not a live AI conversation.',privacy:'No speech, microphone, grades, accounts or recordings. Your choices exist only until you change exercises or stop. Never enter actual client details.',select:'Choose a reply to continue.',next:'Read the stakeholder reaction and explanation before advancing.',done:'All three exchanges completed. Review the language and return to the writing studio. No certificate or score is awarded.',reflect:'Consider: What helped clarity, respect, and an appropriate next step?',note:'The English options are authored teaching examples, not professional legal advice.'},
 'th-TH':{intro:'เลือกสิ่งที่คุณจะพูดต่อในบทสนทนาวิชาชีพสมมติ แต่ละตัวเลือกจะนำไปสู่คำตอบของคู่สนทนาที่เขียนไว้ต่างกัน นี่ไม่ใช่การสนทนากับ AI แบบสด',privacy:'ไม่มีการอัดเสียง ไมโครโฟน คะแนน บัญชี หรือบันทึก ตัวเลือกของคุณจะอยู่เพียงจนเปลี่ยนแบบฝึกหรือหยุด ห้ามใส่ข้อมูลลูกค้าจริง',select:'เลือกคำตอบเพื่อดำเนินบทสนทนา',next:'อ่านคำตอบของคู่สนทนาและคำอธิบายก่อนทำข้อถัดไป',done:'ครบสามช่วงสนทนาแล้ว ทบทวนภาษาและกลับไปฝึกเขียน ไม่มีใบรับรองหรือคะแนน',reflect:'ลองคิดว่าอะไรช่วยให้ชัดเจน สุภาพ และมีขั้นตอนต่อไปที่เหมาะสม',note:'ตัวอย่างภาษาอังกฤษนี้เขียนเพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางกฎหมาย'},
 'vi-VN':{intro:'Chọn điều bạn sẽ nói tiếp trong cuộc hội thoại nghề nghiệp giả định. Mỗi lựa chọn dẫn đến một phản hồi khác nhau đã được viết sẵn; đây không phải hội thoại AI trực tiếp.',privacy:'Không ghi âm, dùng micro, chấm điểm, tài khoản hoặc lưu trữ. Lựa chọn chỉ tồn tại đến khi đổi bài hoặc dừng. Không nhập thông tin khách hàng thật.',select:'Chọn lời đáp để tiếp tục.',next:'Đọc phản ứng của đối tác và lời giải trước khi sang lượt tiếp theo.',done:'Đã hoàn thành ba lượt. Hãy ôn cách diễn đạt và trở lại phần luyện viết. Không cấp chứng chỉ hay điểm số.',reflect:'Suy nghĩ: Điều gì giúp rõ ràng, tôn trọng và có bước tiếp theo phù hợp?',note:'Các ví dụ tiếng Anh được viết để học tập, không phải tư vấn pháp lý.'},
 'zh-CN':{intro:'在虚构的职业对话中选择下一句回复。每个选项都有不同的预先编写的对方回应；这不是真实的人工智能对话。',privacy:'不录音、不用麦克风、不评分、不登录也不存储。切换练习或停止时会清除选择。不要输入真实客户信息。',select:'选择一个回复继续。',next:'进入下一轮之前，请阅读对方的回应和解释。',done:'三个对话回合已结束。请复习表达并返回写作练习。没有证书或分数。',reflect:'思考：哪些表达有助于清楚、尊重和恰当的下一步？',note:'英语示例只用于语言学习，不构成法律建议。'},
 'ko-KR':{intro:'가상의 전문 대화에서 다음에 할 말을 선택하세요. 선택에 따라 미리 작성된 상대방의 응답이 달라집니다. 실제 AI 대화가 아닙니다.',privacy:'음성 녹음, 마이크, 채점, 계정 또는 저장 기능이 없습니다. 연습을 바꾸거나 중지하면 선택이 사라집니다. 실제 고객 정보를 입력하지 마세요.',select:'대답을 골라 계속하세요.',next:'다음으로 넘어가기 전에 상대방의 반응과 설명을 읽으세요.',done:'세 번의 대화를 마쳤습니다. 표현을 복습하고 글쓰기 연습으로 돌아가세요. 자격증이나 점수는 없습니다.',reflect:'생각해 보세요. 무엇이 명확성, 존중, 적절한 다음 단계에 도움이 되었나요?',note:'영어 예시는 학습용이며 법률 자문이 아닙니다.'}
};
function deepFreeze(x){if(x&&typeof x==='object'&&!Object.isFrozen(x)){Object.values(x).forEach(deepFreeze);Object.freeze(x)}return x}
deepFreeze(BRANCHES);deepFreeze(LABELS);deepFreeze(SCENE_TITLES);
function getBranchingRoleplay({profile,explanationLocale}){
 if(!PROFILES.includes(profile))throw Error('unsupported_professional_track');
 if(!SUPPORTED_EXPLANATION_LOCALES.includes(explanationLocale))throw Error('unsupported_explanation_locale');
 const previous=getReplyBuilder({profile,explanationLocale});
 const explanationSource=getResponseStudio({profile,explanationLocale});
 const scenes=previous.scenarios.map((scene,sceneIndex)=>{
  const entries=BRANCHES[scene.id];if(!entries||entries.length!==scene.turns.length)throw Error('missing_branching_professional_scenario');
  return {id:scene.id,titleEnglish:SCENE_TITLES[scene.id],turns:scene.turns.map((old,i)=>({
   originalPromptEnglish:old.promptEnglish,focusEnglish:entries[i].focus,
   optionsEnglish:entries[i].choices.map(c=>c.reply),
   outcomesEnglish:entries[i].choices.map(c=>({stakeholderReaction:c.reaction,languageExplanation:c.reason})),
   referenceOptionIndex:entries[i].preferred,
   nativeReviewExplanation:explanationSource.scenarios[sceneIndex].turns[i].rationaleNative,
   nativeLanguage:explanationLocale,
   fictionalAdultOnly:true
  }))};
 });
 return deepFreeze({profile,explanationLocale,taughtLanguage:'en',mode:'BRANCHED_AUTHORED_THREE_ROUND_REHEARSAL',reviewStatus:'DRAFT_NATIVE_PROFESSIONAL_REVIEW_REQUIRED',grading:'NONE',privacy:{network:false,storage:false,microphone:false,provider:false},guidance:LABELS[explanationLocale],scenarios:scenes});
}
module.exports={getBranchingRoleplay,BRANCHES,LABELS,SUPPORTED_EXPLANATION_LOCALES,PROFILES};
