/* eslint-disable no-return-await */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { notarize } = require('electron-notarize')

exports.default = async function notarizing (context) {
  // We intentionally skip notarisation.
  if (process.env.SKIP_NOTARIZE) {
    console.log('[SKIPPING_NOTARISATION] Forced')
    return
  }

  const { electronPlatformName, appOutDir } = context

  // We are not on macOS so we skip notarisation.
  if (electronPlatformName !== 'darwin') {
    console.log('[SKIPPING_NOTARISATION] Invalid Operating System')
    return
  }

  // We are on a fork without the required credentials.
  if (process.env.GITHUB_HEAD_REF || process.env.GITHUB_BASE_REF) {
    console.log('[SKIPPING_NOTARISATION] Detected Fork')
    return
  }

  const appName = context.packager.appInfo.productFilename

  return await notarize({
    appBundleId: 'io.ark.desktop-wallet',
    appPath: `${appOutDir}/${appName}.app`,
    appleApiKey: process.env.APPLE_API_KEY_ID,
    appleApiIssuer: process.env.APPLE_API_KEY_ISSUER_ID
  })
}
