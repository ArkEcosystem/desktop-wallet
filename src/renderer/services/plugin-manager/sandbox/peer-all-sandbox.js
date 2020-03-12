export function create (walletApi, app) {
  return async () => {
    if (!walletApi.peers) {
      walletApi.peers = {}
    }

    const peerDiscovery = (await app.$store.dispatch('peer/getPeerDiscovery'))
      .withLatency(300)
      .sortBy('latency')

    walletApi.peers = {
      ...walletApi.peers,

      all: peerDiscovery,

      connectToBest: async () => {
        return app.$store.dispatch('peer/connectToBest', {})
      }
    }
  }
}
