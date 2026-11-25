# EnglishLegalese Mobile Workstream · M0.1

One builder: **TR-EnglishLegaleseWebsite**. The established PWA/site and native prototype are separate *presentations*, not separate user accounts or products.

- **Functional development candidate**: `/learn/app/` mobile-first learning home using the real website course/practice/account routes; no new data collection.
- **Existing installable PWA source**: `manifest.webmanifest`, `pwa-install.js`, `sw.js`, `/learn/install/`; installation optional, only generic offline message cached, manual app updates.
- **Native project source started**: `mobile/native/` Capacitor prototype with static bundled welcome, external HTTPS links; no APK/IPA built; no App/Play store approvals; no native login/checkout/recording.

Next gated work: physical iPhone Safari and Android Chrome PWA install/reload checks; accessibility and native language reviews; build native shells using Android Studio and Xcode; validate platform-safe auth and external browser behavior; test privacy and deep links; accept approved CloneFusion adapter only after versioned independent contract.
