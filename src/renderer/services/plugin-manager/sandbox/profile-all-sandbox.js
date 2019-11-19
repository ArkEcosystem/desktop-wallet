export function createProfileAllSandbox (walletApi, app) {
  return () => {
    if (!walletApi.profiles) {
      walletApi.profiles = {}
    }

    walletApi.profiles.all = app.$store.getters['profile/public'](true)
  }
}
