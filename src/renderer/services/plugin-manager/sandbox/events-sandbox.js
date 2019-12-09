export function create (walletApi, app) {
  return () => {
    walletApi.eventBus = app.$eventBus
  }
}
