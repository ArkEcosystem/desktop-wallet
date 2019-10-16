export function createAlertsSandbox (walletApi, app) {
  return () => {
    walletApi.alert = {
      error: app.$error,
      success: app.$success,
      info: app.$info,
      warn: app.$warn
    }
  }
}
