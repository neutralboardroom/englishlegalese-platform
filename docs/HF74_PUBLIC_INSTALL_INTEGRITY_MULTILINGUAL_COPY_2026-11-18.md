# EnglishLegalese HF74 — Public installation integrity, multilingual support and opt-in results

**18 November 2026 · Cumulative draft candidate · Not merged / not live.**

## Verified predecessor and authority

- Complete development source predecessor: **HF73**, GitHub draft PR #117, exact commit `4644b0cefa547c7c2dc1d78887d306f664696425`, complete reconstructed **809-file** ZIP SHA-256 `dceecf878e20ebb1cd206d651d5ec026626c197352d17cc5c820be5dc9f5f3ed`.
- Governing Universal Next-Version Builder: **V3.3**, full **142-page, 28-recovery-attachment** PDF SHA-256 `d0aec2d483378af44ab0b66cfd52914b0a9f4cc8ba926e658565c5b631685fc2`.
- Protected production rollback recorded as `05da0352355dbc3fd6eb8b472c49289d594a8e6e` (HF53); verify direct Render data before any deployment.
- Standing owner rule **EL-RGR-020**, all original 19 Roger Rules, ten durable successors and later protections remain authoritative. **Canonical contract:** `governance/ENGLISHLEGALESE_RELEASE_CONTINUITY_NO_DRIFT_2026-11-15.md`. The conditional auto-deploy duty for fully qualified releases is preserved, and no repeated authorization is required once all real-world gates have passed.

## Real cumulative HF74 user improvements

1. **Public manifest safety (install privacy).** The optional on-device check no longer gives a clean manifest result when required local icons coexist with unapproved or remote icon entries, `//` protocol-relative URLs, or shortcuts to unapproved or traversal routes. Only the original three local public icon assets and original approved learning/account shortcut destinations are accepted. This is validation only: the app checker never fetches those extra paths. The original manifest, icons and production assets are byte-unchanged.
2. **Prevent overlapping checks.** A second check cannot run while an earlier one is in flight, even if a synthetic or accessibility-generated event dispatches to a disabled button. No duplicate public requests, mixed rows or stale copied results can be produced.
3. **Opt-in troubleshooting copy.** Only after a seven-row public check is complete, a clearly labeled **Copy public check results** button appears. Nothing is copied until a separate visitor click. Clipboard contents contain only the seven public app-status rows. No cookie, account, student identity, saved work, raw URL, request headers, location, private course content or diagnostic telemetry is accessed. Denied or unsupported browser clipboard APIs fail gracefully without clearing the displayed results.
4. **Real translated setup instructions.** Plain HTML (works without JavaScript) now includes Android/Chrome and iPhone/iPad/Safari setup steps in Thai, Vietnamese and Simplified Chinese, with accurate caveats about optional install, internet-required classes and private work never being stored for offline use. Existing English directions and all standard site navigation remain intact.
5. **Accessible, honest status.** The new clipboard confirmation has `role=status`, `aria-live=polite`; dynamic text uses `textContent` only. The seven original public-only checks, per-file safe read limits, PNG CRC and browser pixel-decode integrity, update consent, and truthful standalone/browser capability descriptions are preserved.
6. **Independent regression suite.** New `scripts/verify-hf74-safe-install-help-and-copy.js` uses the real browser script in a fully isolated Node VM with eight scenarios: normal, malicious extra remote icon, protocol-relative icon, remote shortcut, traversal shortcut, simultaneous check, clipboard unsupported and clipboard permission denied. Every scenario proves no pre-click network and exactly three fixed public no-cookie/no-store GETs, seven results, restored button, and no automatic reload. Existing HF65–HF73 regressions remain in `npm run check`.

## Scope, acceptance and lifecycle

Changed: `pwa-install.js`, `learn/install/index.html`, `package.json`. Added: new HF74 VM test and this governance record. **No predecessor file removed.** All other 806 HF73 source files must be byte-identical. Original homepage, locked teacher photo, logo, 28-topic catalog, Legal/Business English content, approved pricing/memberships, private class and account routes, owners/teacher/employers, verified certificates, transaction email/no-unsolicited-email safeguards, and all other Teacher Roger projects are untouched.

This test-only device checker is not a signed-app/real-phone compliance report. Source checks do not prove a physical iPhone or Android installation, nor a live Render deployment. The full extracted-ZIP historical suite may stop at a Git ancestry check requiring `.git`. Do **not** override or weaken that check. Run both independent GitHub Actions verification jobs on the exact final commit, inspect all source/security/Chromium/WebKit tests, obtain complete exact-commit Git source and additive Builder backups to BOTH ChatGPT Library and canonical Google Drive, independently download and SHA-256 verify both copies, complete actual Android Chrome and iPhone Safari acceptance, verify actual Render rollback/production state, and only then qualify the standing conditional automatic merge/deploy procedure. If any gate is missing, keep HF74 **DRAFT/BLOCKED** and production unchanged; do not send outreach or builder emails.

## Next-version recovery

Reconfirm the newest branch and Builder independently, rather than trusting an apparent version number. For HF74 rollback use the immutable HF73 source commit and full V3.3 Builder. Carry every historical Builder page and recovery object, every original rule and its successors, exact changed-file source hashes, evidence for every acceptance gate, and the protected production rollback forward.
