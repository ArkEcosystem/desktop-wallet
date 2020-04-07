import config from '@config'
import { shuffle } from 'lodash'
import { optionalChaining } from '@/utils'

export default {
  namespaced: true,

  getters: {
    /**
     * Return all seed peers for the current network
     * @param {string} networkId Specify the network
     * @return {Object[]} An array with the peers.
     */
    'seed/all': (_, __, ___, rootGetters) => ({ networkId } = {}) => {
      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)
      if (!networkId) return []
      const peers = optionalChaining(() => config.PEERS[networkId], [])
      return peers
    },

    /**
     * Retrieves n random seed peers for the current network (excluding current peer)
     * Note that these peers are currently taken from a config file and will an empty array
     * custom networks without a corresponding peers file
     * @param {Number} amount of peers to return
     * @return {Object[]} containing peer objects, can be length = 0.
     */
    'seed/random': (_, getters) => ({ amount = 5, networkId } = {}) => {
      const peers = getters['seed/all']({ networkId })
      return shuffle(peers).slice(0, amount)
    }
  }
}
