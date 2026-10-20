# v1.76.0 Release qualification record — candidate gate, not completed
Pull request: https://github.com/neutralboardroom/englishlegalese-platform/pull/30
Full gate: `npm run audit:high`, `npm run check`, `npm run e2e:browser`, official GitHub Actions workflow `.github/workflows/englishlegalese-release-gate.yml`.
Predecessor original live source v1.75.0. Four browser targets: desktop Chromium, tablet Chromium, tablet WebKit, mobile Chromium.
Do not accept green runs on different SHAs as the required two passes. Record two actual independent complete runs at the same exact final candidate commit in the post-qualification external receipt. Any code/doc change restarts both full gates.
Final status: **PENDING** in this pre-seal evidence file. Do not claim merged/live from this document.
