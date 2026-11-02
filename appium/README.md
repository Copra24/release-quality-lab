# Android Appium Smoke Module

This module is intentionally configuration-driven so it can run against a legal demo app or a local Android build. It is not marked as executed until an emulator/device run is recorded in the repository.

## Prerequisites

1. Install Android Studio and create an emulator.
2. Run `npx appium driver install uiautomator2` once.
3. Start the Appium server with `npx appium`.
4. Set the target app identifiers and a stable accessibility identifier.

```powershell
$env:ANDROID_APP_PACKAGE = 'com.example.demo'
$env:ANDROID_APP_ACTIVITY = '.MainActivity'
$env:SMOKE_ACCESSIBILITY_ID = 'home-screen'
npm run test:android
```

The smoke check starts the app and confirms that the specified accessibility-labelled control is visible. Add application-specific journeys only after they are run and documented.
