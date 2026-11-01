# HF38 — optional private lesson draft download and restore (candidate)
Date: 2026-11-01. Base: verified production main 522f1ee6966f052d3110734f24b7c9792bb61019, Render live at same SHA before candidate.

## Meaningful benefit before-change
Previously a learner typing in any of 24 free fictional Legal/Business practice lessons lost the text on close/reload. New explicit opt-in download of a readable .txt draft and manual restoration into the same lesson gives a simple, offline, account-free continuation route. No data sent to EnglishLegalese; no unrequested automatic persistence. This does not replace authenticated cloud backup on the separate student account.

## No-drift
Preserve existing 24 lesson texts, 24 three-choice checks, 24 oral rehearsal panels, both menus/footers, approved HF31 homepage, locked logo and photograph, pricing/role workspaces, enrollment and payment controls and all backend data. Only two practice pages include two additive scoped assets. A local .txt file can expose writing to anyone with access to the learner's device, so the interface asks for fictional examples only. Import accepts only a file created for the exact lesson, 10 KB or smaller, with a lesson's existing character limit; it rejects mismatches without overwriting. Overwrite of a nonempty draft requires explicit confirmation.

## Release gates
New node verifier plus four-viewport Playwright download/reload/restore, cross-lesson rejection, oversized-file rejection, and no-network-write tests are mandatory via existing independent exact-head release jobs. Candidate is not live until both jobs pass, merge, Render live exact commit and both public hosts are verified. Pending: payment, class booking, supervised assessment, true certificate issuance and incomplete backend workflows remain unchanged. No marketing emails or production schema migration.
