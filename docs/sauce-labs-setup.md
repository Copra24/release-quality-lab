# Sauce Labs Android Smoke Setup

This optional workflow runs the existing Appium smoke check in Sauce Labs without a locally installed Android emulator. It is manually triggered so credentials and device minutes are never consumed on routine pushes.

## 1. Choose an app and stable control

In Sauce Labs, upload an APK that you are permitted to test. A demo app is appropriate for this portfolio. Record:

- The Sauce app reference, commonly `storage:filename=your-demo.apk`
- The Android package and launch activity
- A stable accessibility identifier for a visible control, such as the app home screen

## 2. Add repository secrets

In GitHub: **Settings -> Secrets and variables -> Actions**, add these repository secrets:

| Secret | Value |
| --- | --- |
| `SAUCE_USERNAME` | Your Sauce Labs username |
| `SAUCE_ACCESS_KEY` | Your Sauce Labs access key |
| `SAUCE_APP` | The Sauce app reference |
| `ANDROID_APP_PACKAGE` | Target package name |
| `ANDROID_APP_ACTIVITY` | Target launch activity |
| `SMOKE_ACCESSIBILITY_ID` | Accessibility identifier used by the smoke check |

Do not commit these values or paste the access key into chat.

Optionally set the GitHub repository variable `ANDROID_DEVICE_NAME`. The workflow defaults to `Google Pixel 8 GoogleAPI Emulator`.

## 3. Run it

Open **Actions -> Sauce Labs Android Smoke -> Run workflow**, select the Sauce region used when your account was created, and run it.

The result creates an Appium session in Sauce Labs. Keep the run URL, device details, screenshots, and video as evidence. Only change the README or CV to say the Appium module is executed after this run passes.
