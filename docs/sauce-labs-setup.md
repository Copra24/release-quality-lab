# Sauce Labs Android Smoke Setup

This optional workflow runs the existing Appium smoke check in Sauce Labs without a locally installed Android emulator. It is manually triggered so credentials and device minutes are never consumed on routine pushes.

## 1. Choose an app and stable control

In Sauce Labs, upload an APK that you are permitted to test. A demo app is appropriate for this portfolio. Record:

- The Sauce app reference, commonly `storage:filename=your-demo.apk`
- The Android package and launch activity, if you need to force a specific entry point
- An optional stable accessibility identifier for additional element-level checks

## 2. Add repository secrets

In GitHub: **Settings -> Secrets and variables -> Actions**, add these repository secrets:

| Secret | Value |
| --- | --- |
| `SAUCE_USERNAME` | Your Sauce Labs username |
| `SAUCE_ACCESS_KEY` | Your Sauce Labs access key |
| `SAUCE_APP` | The Sauce app reference, for example `storage:filename=mda-2.3.0-27.apk` |

Do not commit these values or paste the access key into chat.

Optionally set repository variables `ANDROID_APP_PACKAGE`, `ANDROID_APP_ACTIVITY`, `SMOKE_ACCESSIBILITY_ID`, `ANDROID_DEVICE_NAME`, and `ANDROID_PLATFORM_VERSION`. The workflow defaults to the trial-verified `Samsung Galaxy S23 FE` on Android `16`.

## 3. Run it

Open **Actions -> Sauce Labs Android Smoke -> Run workflow**, select the Sauce region used when your account was created, and run it.

The smoke check validates that `Sauce Labs Backpack` is visible after launch. If you set `SMOKE_ACCESSIBILITY_ID`, it also verifies that specific control. Keep the run URL, device details, screenshots, and video as evidence. Only change the README or CV to say the Appium module is executed after this run passes.

The workflow requests Sauce Labs Appium `2.11.0`, because Android 14 and later require the W3C protocol with Appium 2.
