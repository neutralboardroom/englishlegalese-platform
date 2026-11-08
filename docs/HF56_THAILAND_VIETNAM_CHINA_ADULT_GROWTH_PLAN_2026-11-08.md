# HF56 — Thailand + Vietnam First, China Third: Professional English Recruitment (Research-Only)

**Date:** 2026-11-08. **Product:** EnglishLegalese (adult professional Legal English and Business English). **Status:** implementation and public-source research in the draft HF56 branch; no outreach, unsolicited promotional email, new customer records, payments or confirmed bookings.

## Binding owner decision
**EnglishLegalese serves adult professionals worldwide. No country or nationality is excluded by this pilot.** Thailand **and Vietnam** are co-primary markets for the first readiness and recruitment validation, not an exclusive market definition. The two-country audiences are practicing lawyers, law firms, in-house legal departments, compliance teams and international business/energy/project professionals. China is the third initial readiness market, contingent on verified learner access and permitted video tools. Other countries retain the normal enrollment inquiry pathway. Existing one-to-one Vietnam teaching experience informs the pedagogical design but **does not authorize identifying the learner or disclosing their client work or consent for a testimonial**.

## Marketing and course delivery
- **Thailand (co-priority):** Bangkok corporate/cross-border legal firms; employer legal departments; project/energy/infrastructure deal teams; locally reachable adult professionals. Claim local in-person instruction only after teacher availability, location and work-authorization checks. Teacher-led online one-to-one classes and company groups only after approval and scheduling.
- **Vietnam (co-priority):** Ho Chi Minh City first for oil/gas, energy, commercial contracts, client negotiation and management communication; Hanoi and Da Nang for broader adult legal/business English. Use the already developed 60-minute privately accessible energy course as a teaching prototype without publishing any student details.
- **China (third):** commercial contracts, bilingual legal teams and English-speaking client interaction. Meet access may be unreliable on mainland networks; do not present Google Meet as universally available. Independently confirm platform and account restrictions before scheduling; consider approved alternative video providers through separate integration acceptance, not an untested switch.

## Buyer personas / qualification
1. Individual lawyer or trainee: negotiate and explain clauses, speak to international clients, qualify uncertain assertions. **Desired action:** request a teacher-led private class.
2. Law-firm professional development, knowledge management or managing partner: group instruction, adult Legal English and business communication with privacy safeguards. **Desired action:** request a training consultation; do not claim a contract.
3. In-house general counsel, legal ops, HR or learning and development: tailored company project, English client calls and clause review. **Desired action:** ask about employer plan and seat options already present.
4. Commercial/project business leader: procurement, risk, investor conversations, contracts and energy-sector negotiation. **Desired action:** select Business English or Contracts & Agreements.

## Prioritized content and actual source code
- `learn/asia-professional-english/index.html` is a **new regional overview** with equal priority for Thai and Vietnamese adults, a later China entry, genuinely localized short introductions (th/vi/zh-Hans), clear teacher-led labels and verified existing `/learn/enroll/` and `/learn/employers/` routes. It does not collect private client data.
- `product-v1950-contracts-agreements.js` adds only the regional overview link on both existing Legal and Business contract tracks. All existing lesson material, protected global homepage design, prices and membership plans are retained.
- Private `/learn/private-energy-contracts/` stays a **sign-in classroom for assigned accounts**, never a public source-document download or unguarded Meet link.
- `research/HF56_TH_VN_ADULT_PROFESSIONAL_TRAINING_PROSPECTS_RESEARCH_ONLY.csv` contains **10 Thailand + 10 Vietnam** public-directory candidate organizations, recommended department types to research, explicit contact-not-verified flags and email-sent count **0**. Directory presence and practice rankings are NOT evidence that the organization needs, wants, or consented to training. No personal contact names or addresses are in this file.

## Source and competitor evidence, reviewed 2026-11-08
- **ADAPT** — Thailand Lawyers Council's 2026 *English for Lawyers+* sessions show that professional legal English for Thai practitioners is an established training topic: https://www.lawyerscouncil.or.th/news/สภาทนายความจัดอบรมหลักสูตร-english-for-lawyers-รุ่นที่-3-ต่อเนื่องสัปดาห์ที่-7-เสริมความรู้ระบบกฎหมายไทยและอิทธิพลจากระบบกฎหมายต่างประเทศ/ (official September 2026 notice). Do not copy course content or claim affiliation.
- **ADAPT** — Thailand Technology Promotion Association, Corporate English course, October 2026, emphasizes organization-specific business English: https://tpif.or.th/WebDev/coursepreview/A26PT064P/ภาษาอังกฤษสำหรับองค์กร . Do not copy pricing or assert its approval of EnglishLegalese.
- **ADAPT** — AmCham Vietnam October 28, 2026 event on choosing English law for Vietnam contracts explicitly addressed general counsel, in-house legal, CFO/deal teams and Vietnam counsel: https://www.amchamvietnam.com/events/hcmc-choosing-english-law-for-vietnam-contracts-what-it-means-what-it-risks-whom . Training needs of specific participants remain unverified.
- **ADAPT** — Phuoc & Partners documents corporate legal training for in-house counsel and managers: https://phuoc-partner.com/practice/legal-training/ . Their offering is a market example, not permission for co-branding or contacting their clients.
- **RESEARCH-ONLY** — 2026 legal directory for Thailand corporate/energy practices, and Vietnam firm directory, offer publicly verifiable starting candidates: https://www.legal500.com/c/thailand/corporate-and-ma ; https://www.legal500.com/c/thailand/projects-and-energy ; https://www.legal500.com/c/vietnam ; https://www.legal500.com/rankings/ranking/c-vietnam/projects-and-energy/30132-vilaf ; https://www.legal500.com/rankings/ranking/c-vietnam/projects-and-energy/31194-tilleke-gibbins . Their rankings do not prove any commercial demand for classes.
- **TEST/DEFER** — 2026 external access research cautions that Google Meet is not reliably accessible on mainland Chinese networks; confirm video access with actual learner before making class commitments: https://whatworksinchina.com/apps/google-workspace/ . Avoid suggesting workarounds or an unapproved workaround-dependent class.

## Functional first-three-market intake MVP — WORLDWIDE still active
- Regional education overview `/learn/asia-professional-english/` now explicitly says **worldwide**, with **three early pilot markets**, not geographic exclusivity.
- Country links lead to the existing enrollment form using nonpersonal query parameters `?market=th&lang=th`, `?market=vn&lang=vi`, `?market=cn&lang=zh-Hans`. Global learners use `?market=other&lang=en`.
- The existing EnglishLegalese intake form now offers selectable **another country / Thailand / Vietnam / China** and **English / Thai / Vietnamese / Simplified Chinese** preferred contact language. It contains concise localized instructional guidance. Contact-language assistance is **requested, not automatically guaranteed**; the core teacher-led curriculum and form remain English-based.
- The existing accepted server intake schema and storage are preserved. The validated market and language choices are prefixed inside the already stored inquiry `note` after the original structured course-package prefix. No new database fields, pricing, checkout, account transfer or marketing automation is added.
- Tests cover **all four** world+first-three market paths and validate that the existing intake endpoint receives the country/language preference, that page layout does not overflow, and that no payment information is provided.
- **Not live verified:** production intake database readiness, real translations by native reviewers, live teacher scheduling and actual China video-provider reachability require separate acceptance before saying any locale is fully ready. No automatic student invitation or specific live video availability is promised.

## Privacy, advertising and conversion guardrails
- No testimonial, public “first Vietnamese lawyer”, client names, specific student identity, quote or case study without explicit permission. Never turn redacted source material back into a discoverable public detail.
- No scraping private contact data or unapproved automated messages. Contact verification and opt-in permission or separately authorized legal business communication must precede any outreach. Marketing automation remains off. Only transactional email as permitted by the project owner rules.
- Distinguish course REQUEST from CONFIRMED booking, billing from request, teacher-led vs AI, private Google Meet vs website page, enrollment submission vs payment. Avoid credential promises or guaranteed English progress.
- Preserve project boundaries with TR-Online children, TR-Classroom public-school content, TR-Clone technology and TR-ControlCenter governance. Do not merge.
- For Vietnam and Thailand, educational language support is NOT the practice of local law or a warranty about contract enforceability. Legal examples must be fictional and local-law claims must be verified by a qualified local professional.

## Next measured rollout gates
1. Complete the exact-head dual CI and responsive accessibility checks, protected UI blob equality, role and session-link privacy review. Keep the HF56 PR draft until passed.
2. Verify live backend PostgreSQL and account email verification; conduct two-device teacher–student pilot only with actual class consent and authorized secure accounts.
3. Collect voluntary learner feedback on intelligibility and speaking confidence, without copying client documents into public logs.
4. Prepare Thailand and Vietnam opt-in channels and corporate group brief in Thai/Vietnamese. Track aggregate opt-in inquiries, attended trials and retained learners, not fabricated leads.
5. Qualify the 20 publicly listed organizations through official department/role and suitable, approved contact methods. **Do not send** until separately directed. China follows only after video/locale acceptance.

**Acceptance status:** Research and source content added to HF56 branch; NOT deployed, no students newly enrolled, no emails sent, no meeting invites created. The exact current GitHub/Render release status must be reverified at each build.
