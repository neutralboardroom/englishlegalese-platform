# EnglishLegalese Mobile Native Prototype M0.1 (HF92)

**Unreleased starter only; not an Android APK, iOS IPA, App Store or Play listing.** Canonical owner: TR-EnglishLegaleseWebsite. The official browser/PWA experience remains `/learn/app/` and the existing EnglishLegalese site.

The bundled native entrypoint (`www/index.html`) is static and **contains no private-data entry points**. All classes, account actions and learning work open the secured website in the system browser with explicit external HTTPS links. No `server.url` (remote WebView), auth interception, passwords, provider credentials, PII recording, telemetry, Stripe, background tasks, microphone or child data are included. This deliberately avoids creating a shadow student-account implementation while native security design is reviewed.

## Build preparation on actual developer hardware

1. Confirm and approve the final package ID, branding, target OS versions, device matrix, accessibility and distribution. `com.englishlegalese.prototype` is a temporary ID, **not an authorized store identifier**.
2. From `mobile/native/`, run `npm install` with an allowed modern Node version and audited dependency lockfile. Run `npx cap add android` and build/test with Android Studio; for iOS use macOS/Xcode and `npx cap add ios`.
3. Check `target=_blank` external browser behavior on actual devices; if the WebView does not open externally, add a reviewed Capacitor Browser integration before release. Never put login flows inside an unreviewed embedded WebView.
4. Independently verify deep-link policies, cookies, origin isolation, browser auth/session continuity, screen-reader and large text, safe-area padding, offline behavior, no private caching, mobile app review/privacy disclosures, and provider/ControlCenter sign-offs.

Source code is part of the cumulative website repository; **there is no second EnglishLegalese builder, user database, or backend**. Native app build and release remains BLOCKED pending actual devices, SDK setup and owner platform choices.
