# Android Appium Smoke Module

This module is intentionally configuration-driven so it can run against a legal demo app or a local Android build. It was executed against the My Demo App on a Sauce Labs Samsung Galaxy S23 FE running Android 16. See the sanitized [execution evidence](../docs/execution-evidence/2026-11-02-sauce-labs-android-smoke.md).

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

## Designing stable mobile locators

For a cloud-device diagnostic run, set **capture page source** to `true` when manually triggering the Sauce Labs workflow. The run stores `android-page-source.xml` as a 14-day GitHub Actions artifact. Set **diagnostic open first product** to `true` as well to capture `android-product-detail-page-source.xml`. Use these artifacts to identify stable Android resource IDs or accessibility labels before adding a native user journey. Do not guess selectors from visual button text when a stable identifier is available.

## Native cart scenario

Set the workflow **scenario** to `cart` to execute a real Android journey: open the first catalog product when needed, add it to the cart using the `Tap to add product to cart` accessibility label, open the cart with `View cart`, and verify the `My Cart` title, cart count, selected product, and `Remove Item` control through confirmed native resource IDs and accessibility labels. The scenario also works when a diagnostic run has already opened a product-detail screen. When page-source capture is enabled, the cart source is saved as an artifact too.

## Checkout locator diagnostic

Set **scenario** to `checkout-diagnostic` with page-source capture enabled to run the proven cart journey, open checkout using the `Confirms products for checkout` accessibility label, and save `android-checkout-page-source.xml`. Inspect that source before automating customer-details, payment, review, or order-confirmation steps.

Set **scenario** to `checkout-login-diagnostic` to continue from checkout through the public demo-account login. It uses the confirmed `username1TV` resource ID to auto-fill the demo credentials, submits via `Tap to login with given credentials`, and saves `android-checkout-after-login-page-source.xml` for the next checkout screen.
