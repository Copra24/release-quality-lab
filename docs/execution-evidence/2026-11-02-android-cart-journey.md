# Android Cart Journey Execution

## Result

- **Status:** Passed
- **Executed:** 02 Nov 2026
- **Environment:** Sauce Labs EU Central, Samsung Galaxy S23 FE, Android 16
- **Automation:** Appium 2, UiAutomator2, WebdriverIO, GitHub Actions
- **Application:** Sauce Labs My Demo App, version 2.3.0 build 27

## Journey verified

1. Start from the product catalog or an already-open product-detail screen.
2. Open the first catalog product when needed.
3. Add it through the `Tap to add product to cart` accessibility label.
4. Open the cart through the `View cart` accessibility label.
5. Verify the native cart state using confirmed selectors:
   - `productTV` displays `My Cart`
   - `cartTV` displays `1`
   - `titleTV` displays `Sauce Labs Backpack`
   - `Removes product from cart` is displayed

## Evidence and scope

The successful workflow uploaded the Android cart page source as an artifact. It contains all four expected assertions above. This is independent portfolio work against Sauce Labs' public demo application. It demonstrates a cloud-device native Android cart journey and stable locator design, not production mobile-app ownership or a complete mobile regression suite.
