export function create (walletApi, app) {
  return async () => {
    if (!walletApi.peers) {
      walletApi.peers = {}
    }

    const peerDiscovery = (await app.$store.getters('peer/discovery'))
      .withLatency(300)
      .sortBy('latency')

    walletApi.peers.all = peerDiscovery
  }
}
