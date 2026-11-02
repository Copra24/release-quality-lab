import { remote } from 'webdriverio';

/**
 * Configurable Android smoke check.
 * Set ANDROID_APP_PACKAGE, ANDROID_APP_ACTIVITY, and SMOKE_ACCESSIBILITY_ID
 * for the target demo application before execution.
 */
async function run() {
  const required = ['ANDROID_APP_PACKAGE', 'ANDROID_APP_ACTIVITY', 'SMOKE_ACCESSIBILITY_ID'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Set ${missing.join(', ')} before running this Android smoke check. See appium/README.md.`);
  }

  const driver = await remote({
    hostname: process.env.APPIUM_HOST ?? '127.0.0.1',
    port: Number(process.env.APPIUM_PORT ?? 4723),
    path: '/',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator',
      'appium:appPackage': process.env.ANDROID_APP_PACKAGE,
      'appium:appActivity': process.env.ANDROID_APP_ACTIVITY,
      'appium:newCommandTimeout': 120
    }
  });

  try {
    const target = await driver.$(`~${process.env.SMOKE_ACCESSIBILITY_ID}`);
    await target.waitForDisplayed({ timeout: 10_000 });
    console.log('Android smoke check passed: target control is visible.');
  } finally {
    await driver.deleteSession();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
