import { remote } from 'webdriverio';

/**
 * Configurable Android smoke check.
 * Set ANDROID_APP_PACKAGE, ANDROID_APP_ACTIVITY, and SMOKE_ACCESSIBILITY_ID
 * for the target demo application before execution.
 */
async function run() {
  const isSauce = process.env.MOBILE_GRID === 'sauce';
  const required = [
    'ANDROID_APP_PACKAGE',
    'ANDROID_APP_ACTIVITY',
    'SMOKE_ACCESSIBILITY_ID',
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

  const driver = await remote({
    ...connection,
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android Emulator',
      'appium:appPackage': process.env.ANDROID_APP_PACKAGE,
      'appium:appActivity': process.env.ANDROID_APP_ACTIVITY,
      'appium:app': isSauce ? process.env.SAUCE_APP : undefined,
      'appium:newCommandTimeout': 120,
      ...(isSauce
        ? {
            'sauce:options': {
              name: 'Android smoke check',
              build: process.env.GITHUB_RUN_ID ? `release-quality-lab-${process.env.GITHUB_RUN_ID}` : 'release-quality-lab-local'
            }
          }
        : {})
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
