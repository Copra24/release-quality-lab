import { remote } from 'webdriverio';
import { mkdirSync, writeFileSync } from 'node:fs';

/**
 * Configurable Android smoke check.
 * For Sauce Labs, provide credentials and a Sauce App Storage reference.
 * An optional accessibility identifier enables an additional control check.
 */
async function run() {
  const isSauce = process.env.MOBILE_GRID === 'sauce';
  const scenario = process.env.MOBILE_TEST_SCENARIO ?? 'launch';
  if (!['launch', 'cart', 'checkout-diagnostic', 'checkout-login-diagnostic', 'checkout-payment-diagnostic', 'checkout-shipping-diagnostic', 'checkout-review-diagnostic'].includes(scenario)) {
    throw new Error(`Unsupported MOBILE_TEST_SCENARIO: ${scenario}`);
  }
  const required = [
    ...(isSauce ? ['SAUCE_USERNAME', 'SAUCE_ACCESS_KEY', 'SAUCE_APP'] : [])
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Set ${missing.join(', ')} before running this Android smoke check. See appium/README.md.`);
  }

  const sauceRegion = process.env.SAUCE_REGION ?? 'us-west-1';
  const connection = isSauce
    ? {
        protocol: 'https' as const,
        hostname: `ondemand.${sauceRegion}.saucelabs.com`,
        port: 443,
        user: process.env.SAUCE_USERNAME,
        key: process.env.SAUCE_ACCESS_KEY
      }
    : {
        hostname: process.env.APPIUM_HOST ?? '127.0.0.1',
        port: Number(process.env.APPIUM_PORT ?? 4723),
        path: '/'
      };

  const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator',
    ...(process.env.ANDROID_PLATFORM_VERSION ? { 'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION } : {}),
    'appium:app': isSauce ? process.env.SAUCE_APP : undefined,
    'appium:newCommandTimeout': 120,
    ...(process.env.ANDROID_APP_PACKAGE ? { 'appium:appPackage': process.env.ANDROID_APP_PACKAGE } : {}),
    ...(process.env.ANDROID_APP_ACTIVITY ? { 'appium:appActivity': process.env.ANDROID_APP_ACTIVITY } : {}),
    ...(isSauce
      ? {
          'sauce:options': {
            name: `Android ${scenario} check`,
            build: process.env.GITHUB_RUN_ID ? `release-quality-lab-${process.env.GITHUB_RUN_ID}` : 'release-quality-lab-local',
            // Android 14+ sessions on Sauce require W3C/Appium 2.
            appiumVersion: 'appium2-2025-09'
          }
        }
      : {})
  };

  const driver = await remote({
    ...connection,
    capabilities
  });

  try {
    const expectedText = process.env.SMOKE_EXPECTED_TEXT ?? 'Sauce Labs Backpack';
    const source = await driver.getPageSource();
    if (!source.includes(expectedText)) {
      throw new Error(`App launched but expected text was not found: ${expectedText}`);
    }

    if (process.env.MOBILE_CAPTURE_PAGE_SOURCE === 'true') {
      mkdirSync('artifacts', { recursive: true });
      writeFileSync('artifacts/android-page-source.xml', source);
      console.log('Saved Android page source to artifacts/android-page-source.xml for locator design.');
    }

    if (process.env.MOBILE_DIAGNOSTIC_OPEN_FIRST_PRODUCT === 'true') {
      const products = await driver.$$('~Product Image');
      if (!products.length) {
        throw new Error('Cannot capture product detail page because no Product Image locator was found.');
      }
      await products[0].click();
      await driver.pause(500);
      const detailSource = await driver.getPageSource();
      mkdirSync('artifacts', { recursive: true });
      writeFileSync('artifacts/android-product-detail-page-source.xml', detailSource);
      console.log('Saved product detail page source to artifacts/android-product-detail-page-source.xml for locator design.');
    }

    if (['cart', 'checkout-diagnostic', 'checkout-login-diagnostic', 'checkout-payment-diagnostic', 'checkout-shipping-diagnostic', 'checkout-review-diagnostic'].includes(scenario)) {
      const firstProduct = await driver.$('~Product Image');
      if (await firstProduct.isExisting()) {
        await firstProduct.click();
      }

      const addToCart = await driver.$('~Tap to add product to cart');
      await addToCart.waitForDisplayed({ timeout: 10_000 });
      await addToCart.click();

      const viewCart = await driver.$('~View cart');
      await viewCart.waitForDisplayed({ timeout: 10_000 });
      await viewCart.click();
      await driver.pause(500);

      const cartSource = await driver.getPageSource();
      const cartTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/productTV');
      const cartCount = await driver.$('id=com.saucelabs.mydemoapp.android:id/cartTV');
      const productTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/titleTV');
      const removeItem = await driver.$('~Removes product from cart');

      await cartTitle.waitForDisplayed({ timeout: 10_000 });
      await removeItem.waitForDisplayed({ timeout: 10_000 });
      const [title, count, addedProduct] = await Promise.all([
        cartTitle.getText(),
        cartCount.getText(),
        productTitle.getText()
      ]);
      if (title !== 'My Cart' || count !== '1' || addedProduct !== 'Sauce Labs Backpack') {
        throw new Error(`Cart scenario did not show the expected state. title=${title}, count=${count}, product=${addedProduct}`);
      }

      if (process.env.MOBILE_CAPTURE_PAGE_SOURCE === 'true') {
        mkdirSync('artifacts', { recursive: true });
        writeFileSync('artifacts/android-cart-page-source.xml', cartSource);
      }
      console.log('Android cart scenario passed: product added and cart state verified.');

      if (['checkout-diagnostic', 'checkout-login-diagnostic', 'checkout-payment-diagnostic', 'checkout-shipping-diagnostic', 'checkout-review-diagnostic'].includes(scenario)) {
        const proceedToCheckout = await driver.$('~Confirms products for checkout');
        await proceedToCheckout.waitForDisplayed({ timeout: 10_000 });
        await proceedToCheckout.click();
        await driver.pause(500);
        const checkoutSource = await driver.getPageSource();
        mkdirSync('artifacts', { recursive: true });
        writeFileSync('artifacts/android-checkout-page-source.xml', checkoutSource);
        console.log('Saved checkout page source to artifacts/android-checkout-page-source.xml for locator design.');

        if (['checkout-login-diagnostic', 'checkout-payment-diagnostic', 'checkout-shipping-diagnostic', 'checkout-review-diagnostic'].includes(scenario)) {
          const demoUser = await driver.$('id=com.saucelabs.mydemoapp.android:id/username1TV');
          const login = await driver.$('~Tap to login with given credentials');
          await demoUser.waitForDisplayed({ timeout: 10_000 });
          await demoUser.click();
          await login.waitForDisplayed({ timeout: 10_000 });
          await login.click();
          await driver.pause(500);
          const afterLoginSource = await driver.getPageSource();
          writeFileSync('artifacts/android-checkout-after-login-page-source.xml', afterLoginSource);
          console.log('Saved post-login checkout page source to artifacts/android-checkout-after-login-page-source.xml for locator design.');

          if (['checkout-payment-diagnostic', 'checkout-shipping-diagnostic', 'checkout-review-diagnostic'].includes(scenario)) {
            const checkoutTitle = await driver.$('id=com.saucelabs.mydemoapp.android:id/checkoutTitleTV');
            const fullName = await driver.$('id=com.saucelabs.mydemoapp.android:id/fullNameET');
            const toPayment = await driver.$('~Saves user info for checkout');
            await checkoutTitle.waitForDisplayed({ timeout: 10_000 });
            await fullName.waitForDisplayed({ timeout: 10_000 });
            await toPayment.waitForDisplayed({ timeout: 10_000 });
            if (await checkoutTitle.getText() !== 'Checkout') {
              throw new Error('Expected the shipping-address checkout screen before advancing to payment.');
            }
            if (['checkout-shipping-diagnostic', 'checkout-review-diagnostic'].includes(scenario)) {
              const shippingData = [
                ['fullNameET', 'Clifford Folefac'],
                ['address1ET', '42 Quality Street'],
                ['cityET', 'Douala'],
                ['zipET', '00000'],
                ['countryET', 'Cameroon']
              ];
              for (const [fieldId, value] of shippingData) {
                const field = await driver.$(`id=com.saucelabs.mydemoapp.android:id/${fieldId}`);
                await field.clearValue();
                await field.setValue(value);
              }
            }
            await toPayment.click();
            await driver.pause(500);
            const paymentSource = await driver.getPageSource();
            if (['checkout-shipping-diagnostic', 'checkout-review-diagnostic'].includes(scenario) && paymentSource.includes('Enter a shipping address')) {
              throw new Error('Shipping-address submission did not advance to payment.');
            }
            writeFileSync('artifacts/android-payment-page-source.xml', paymentSource);
            console.log('Saved payment page source to artifacts/android-payment-page-source.xml for locator design.');

            if (scenario === 'checkout-review-diagnostic') {
              const paymentData = [
                ['nameET', 'Clifford Folefac'],
                ['cardNumberET', '4242 4242 4242 4242'],
                ['expirationDateET', '12/30'],
                ['securityCodeET', '123']
              ];
              for (const [fieldId, value] of paymentData) {
                const field = await driver.$(`id=com.saucelabs.mydemoapp.android:id/${fieldId}`);
                await field.clearValue();
                await field.setValue(value);
              }
              const billingAddress = await driver.$('~Select if User billing address and shipping address are same');
              if (!(await billingAddress.isSelected())) {
                await billingAddress.click();
              }
              const reviewOrder = await driver.$('~Saves payment info and launches screen to review checkout data');
              await reviewOrder.waitForDisplayed({ timeout: 10_000 });
              await reviewOrder.click();
              await driver.pause(500);
              const reviewSource = await driver.getPageSource();
              if (reviewSource.includes('Enter a payment method')) {
                const errorMessages = await Promise.all([
                  'nameErrorTV',
                  'cardNumberErrorTV',
                  'expirationDateErrorTV',
                  'securityCodeErrorTV'
                ].map(async (errorId) => {
                  const error = await driver.$(`id=com.saucelabs.mydemoapp.android:id/${errorId}`);
                  return (await error.isExisting()) ? await error.getText() : '';
                }));
                console.log(`Payment validation feedback: ${errorMessages.filter(Boolean).join(' | ') || 'none exposed'}`);
                throw new Error('Payment submission did not advance to order review.');
              }
              writeFileSync('artifacts/android-order-review-page-source.xml', reviewSource);
              console.log('Saved order review page source to artifacts/android-order-review-page-source.xml for locator design.');
            }
          }
        }
      }
    }

    if (process.env.SMOKE_ACCESSIBILITY_ID) {
      const target = await driver.$(`~${process.env.SMOKE_ACCESSIBILITY_ID}`);
      await target.waitForDisplayed({ timeout: 10_000 });
    }

    console.log(`Android smoke check passed: ${expectedText} is visible after app launch.`);
  } finally {
    await driver.deleteSession();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
