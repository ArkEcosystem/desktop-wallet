export function create (walletApi, app) {
  return () => {
    if (!walletApi.profiles) {
      walletApi.profiles = {}
    }

    walletApi.profiles = {
      ...walletApi.profiles,

      getCurrent: () => {
        return app.$store.getters['profile/public']()
      }
    }
  }
}
