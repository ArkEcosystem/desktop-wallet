import Vue from 'vue'
import { isEmpty } from 'lodash'
import { optionalChaining } from '@/utils'

const logger = {
  ...console
}

const getBaseUrl = (peer) => `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}:${peer.port}`

export default {
  namespaced: true,

  state: {},

  getters: {
    get: (state, getters, __, rootGetters) => ({ networkId = null } = {}) => {
      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) {
        return false
      }

      const currentPeer = state[networkId]

      if (isEmpty(currentPeer)) {
        logger.warn('currentPeer is empty')
        return false
      }

      return currentPeer
    }
  },

  mutations: {
    SET_CURRENT_PEER (state, { peer, networkId }) {
      Vue.set(state, networkId, peer)
    },

    CLEAR_CURRENT_PEER (state, { networkId }) {
      Vue.delete(state, networkId)
    }
  },

  actions: {
    /**
     * Set current peer for the network
     * @param {Object} peer The peer. If you want to set an empty peer, send an empty object.
     * @param {string} [networkId = defaultNetworkId()] A network ID.
     * @return {void}
     */
    async 'set' ({ commit, dispatch, rootGetters }, { peer, networkId, update = true } = {}) {
      if (!peer) {
        throw new Error('No peer was provided to be set as current.')
      }

      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) return

      if (update) {
        // Use the current peer as the base url for requests.
        this._vm.$client.host = getBaseUrl(peer)

        peer = await dispatch('peer/update', peer, { root: true })

        // Update the static fees when setting a new peer.
        // TODO only when necessary (when / before sending) (if no dynamic)
        await dispatch('transaction/updateStaticFees', null, { root: true })
      }

      commit('SET_CURRENT_PEER', {
        peer,
        networkId: networkId
      })
    },

    /**
     * Clear the current peer.
     * @param {string} [networkId=currentNetworkId()]
     * @returns {void}
     */
    'clear' ({ commit, rootGetters }, { networkId } = {}) {
      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) return

      commit('CLEAR_CURRENT_PEER', { networkId })
    }
  }
}
