export function createEventsSandbox (walletApi, app) {
  return () => {
    walletApi.eventBus = app.$eventBus
  }
}
