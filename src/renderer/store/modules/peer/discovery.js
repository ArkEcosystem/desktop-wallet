import { PeerDiscovery } from '@arkecosystem/peers'
import { optionalChaining } from '@/utils'
import config from '@config'

// Return an object containing chain and net from the networkId. Eg: ark.devnet => { chain: ark, net: devnet}
const chainNetFromNetworkId = networkId => (arr => ({ chain: arr[0], net: arr[1] }))(networkId.split('.'))

// Get the base URL from a peer
const getBaseUrl = (peer) => `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}:${peer.port}`

export default {
  namespaced: true,
  state: {},
  getters: {
    /**
     * Gets a new peer discovery instance. The discovery is based on the following order:
     *
     * 1) It checks for the network peers.
     * 2) It checks for the peer peers.
     * 3) It checks for the network server peer.
     * @param {string} [networkId = currentNetworkId()]
     * @returns {Promise} The instance of the PeerDiscovery.
     */
    get: (getters, _, __, rootGetters) => ({ networkId } = {}) => {
      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) return

      /*
        The application is configured to find peers based on the network names.
        The default network IDs are based on the chain + net, so it need to be
        striped to only use the network name (main or devnet). Otherwise, use
        the network id.
      */
      const defaultNetworks = Object.keys(config.PEERS)
      const net = defaultNetworks.includes(networkId) ? chainNetFromNetworkId(networkId).net : networkId

      // First it checks for the default network peers.
      if (net) return PeerDiscovery.new({ networkOrHost: net })

      // Then checks for the peers connected.
      const currentPeer = getters['peer/current/get']()
      if (currentPeer) return PeerDiscovery.new({ networkOrHost: `${getBaseUrl(currentPeer)}/api/v2/peers` })

      // And then checks for the default network server
      const networkServer = rootGetters.network[networkId].server
      return PeerDiscovery.new({ networkOrHost: `${networkServer}/api/v2/peers` })
    }
  }

}
