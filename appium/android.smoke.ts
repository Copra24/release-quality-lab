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
  if (!['launch', 'cart'].includes(scenario)) {
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

    if (scenario === 'cart') {
      const products = await driver.$$('~Product Image');
      if (!products.length) {
        throw new Error('Cart scenario cannot start because no Product Image locator was found.');
      }

      await products[0].click();
      const addToCart = await driver.$('~Tap to add product to cart');
      await addToCart.waitForDisplayed({ timeout: 10_000 });
      await addToCart.click();

      const viewCart = await driver.$('~View cart');
      await viewCart.waitForDisplayed({ timeout: 10_000 });
      await viewCart.click();
      await driver.pause(500);

      const cartSource = await driver.getPageSource();
      if (!cartSource.includes('Sauce Labs Backpack') || cartSource.includes('Tap to add product to cart')) {
        throw new Error('Cart scenario did not show the added product in a cart state.');
      }

      if (process.env.MOBILE_CAPTURE_PAGE_SOURCE === 'true') {
        mkdirSync('artifacts', { recursive: true });
        writeFileSync('artifacts/android-cart-page-source.xml', cartSource);
      }
      console.log('Android cart scenario passed: product added and cart state verified.');
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
