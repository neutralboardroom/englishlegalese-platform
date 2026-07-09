# EnglishLegalese Custom Domain Handoff — Render + Hover

This note preserves the current launch rule: do not remove Hover forwarding until Render has accepted the custom domains and displayed the exact DNS records.

## Current known state

- Render service: `englishlegalese-platform`
- Render temporary URL: `https://englishlegalese-platform.onrender.com`
- Domain registrar: Hover
- Desired production domains:
  - `englishlegalese.com`
  - `www.englishlegalese.com`
- Current beta mode remains acceptable until production credentials are configured.

## One-step-at-a-time sequence for Roger

1. Open Render service `englishlegalese-platform`.
2. Go to Settings.
3. Find Custom Domains.
4. Add `englishlegalese.com`.
5. Add `www.englishlegalese.com`.
6. Wait for Render to show the exact DNS records.
7. Only after Render shows those records, go to Hover.
8. Remove Hover forwarding if it conflicts with Render DNS.
9. Add the exact Render DNS records.
10. Confirm SSL/TLS and HTTPS redirect after DNS verifies.

## Safety rules

- Do not paste live secrets into chat.
- Do not put live secrets into ZIP files.
- Do not delete DNS records blindly; remove only records that conflict with Render's exact instructions.
- Keep the Render temporary URL available for verification while DNS propagates.
- Keep the build command as `npm install` until production credentials are connected and stricter predeploy checks can be safely restored.
