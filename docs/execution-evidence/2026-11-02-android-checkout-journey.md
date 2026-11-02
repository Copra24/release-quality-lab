# Android Checkout Journey Execution

## Result

- **Status:** Passed
- **Executed:** 02 Nov 2026
- **Environment:** Sauce Labs EU Central, Samsung Galaxy S23 FE, Android 16
- **Automation:** Appium 2, UiAutomator2, WebdriverIO, GitHub Actions
- **Application:** Sauce Labs My Demo App, version 2.3.0 build 27

## Journey verified

1. Launch the public demo app and open a catalog product.
2. Add `Sauce Labs Backpack` to the cart and verify the native cart state.
3. Continue to checkout and use the public demo-account login path.
4. Replace the shipping fields with controlled test data and advance to payment.
5. Replace payment fields with fake test data and select the matching-billing-address option.
6. Select `Review Order` and verify that the app leaves the payment screen and reaches order review.

## Locator and test-data approach

The journey uses confirmed Android accessibility labels for user actions and native resource IDs for state checks. It supplies controlled shipping details and fake card data only. No live payment method is used and no final order is placed.

## Scope

This is independent portfolio work against Sauce Labs' public demo application. It demonstrates cloud-device Android automation, native locator design, authenticated state handling, form validation awareness, and a multi-step checkout workflow. It is not claimed as production mobile-app ownership, payment certification, or a complete mobile regression suite.
