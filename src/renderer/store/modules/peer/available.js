import { random, shuffle, isEmpty } from 'lodash'
import { optionalChaining } from '@/utils'
import Vue from 'vue'
import i18n from '@/i18n'

const logger = {
  ...console
}

const errors = {
  array_zero_length: 'Expected array to return a positive length. Returned 0 instead.',
  falsy_value: 'Expect value to be truthy, but it is falsy instead.',
  wrong_type: 'Expect value to be one type, but is some other type.',
  no_network: 'networkId has the falsy value.'
}

// Remove a peer from a list based on its IP address.
const removePeerFromList = (peer, list) => {
  if (!peer) return list
  if (!list) return false
  return list.filter(listed => listed.ip !== peer.ip)
}

export default {
  namespaced: true,
  state: {},

  getters: {
    /**
     * Get all peers for current network.
     * @param {Boolean} [ignoreCurrent=false] Set if the current peer should be ignored when returning a list of all peers.
     * @param {string} [networkId=null] Network ID, eg 'ark.devnet'.
     * @return { Object[] | Null} The peer list.
     */
    all: (state, _, __, rootGetters) => ({ ignoreCurrent = false, networkId = null } = {}) => {
      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) {
        logger.error(errors.no_network)
        return null
      }

      let peers = optionalChaining(() => state[networkId].peers, [])

      if (!peers) {
        logger.error(errors.falsy_value)
        return null
      }

      if (ignoreCurrent) {
        const currentPeer = rootGetters['peer/current/get']()
        peers = removePeerFromList(currentPeer, peers)
      }

      if (peers.length < 1) logger.error(errors.array_zero_length)

      return peers
    },

    /**
     * Gets the first peer that matches the IP address.
     * @param {string} ip The IP address of the peer.
     * @return {(Object|undefined|Error)} The peer object. Returns undefined if none is found. Returns an error if no peer is provided.
     */
    get: (_, getters) => ({ ip } = {}) => {
      if (!ip) throw new Error('Unable to find peer: no IP is provided')

      const peers = getters.all()

      if (!peers) {
        logger.error(errors.falsy_value)
        return undefined
      }

      const peer = peers.find(peer => peer.ip === ip)

      if (!peer) logger.error(errors.falsy_value)

      return peer
    },

    /**
     * Return the best peer lists. It defaults to RANDOM from TOP 10, but it can be changed.
     * @param {string} [networkId = currentNetworkId()] The networkId.
     * @param {bool} [ignoreCurrent = true] Ignore current peer. This filter is applied before the top.
     * @param {number} [min = 1] Minimum number of peers returned.
     * @param {number} [max] Maximum number of peers returned.
     * @param {number} [top = 10] Selection of the N top peers before random is applied
     */
    best: (_, getters, __, rootGetters) => ({ networkId, ignoreCurrent = true, min = 1, max, top = 10 } = {}) => {
      if ((min < 0) || (top < 1)) throw new Error('Impossible parameters on best')

      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      let peers = getters.all({
        networkId,
        ignoreCurrent
      })

      if (!peers) {
        logger.error(errors.falsy_value)
        return []
      }

      if (!Array.isArray(peers)) logger.error(errors.wrong_type)

      // Prevents minimum and maximum to be bigger than the total of peers.
      if (min > peers.length) logger.error('Impossible minimum length. Ignoring.')

      max = Math.min(max, peers.length)
      top = Math.min(top, peers.length)

      const quantity = max ? random(min, max) : peers.length

      // TOP
      peers = peers.slice(0, top)

      // RANDOM
      peers = peers.sort(() => 0.5 - Math.random())
      peers = peers.slice(0, quantity)

      return peers
    },

    /**
     * Retrieves an amount of random peers
     * @param {number} [amount=5] Number of peers to return.
     * @param {Boolen} [ignoreCurrent = true ] Ignore current peer when returning the random list.
     * @param {string} networkId Include the network Id.
     * @return {Object[]} containing peer objects
     */
    random: (_, getters) => ({ amount = 5, ignoreCurrent = true, networkId } = {}) => {
      const peers = getters.all({ ignoreCurrent, networkId })

      return peers.length ? shuffle(peers).slice(0, amount) : []
    },

    /**
     * Returns an array of peers that can be used to broadcast a transaction to
     * Currently this consists of random top 10 peers + 5 random peers.
     * @return {Object[]} containing peer objects
     */
    broadcast: (_, getters, __, rootGetters) => ({ networkId = null } = {}) => {
      let peers = []

      // top 10
      peers = peers.concat(getters.best({
        max: 10,
        min: 10,
        ignoreCurrent: false,
        networkId
      }))

      // 5 random
      peers = peers.concat(getters.random({
        amount: 5,
        networkId
      }))

      // 5 seed random
      peers = peers.concat(rootGetters['peer/seed/random']({
        amount: 5,
        networkId
      }))

      return peers
    },

    /**
     * Get last updated date for peer list.
     * @return {(Date|null|false)}
     */
    lastUpdated: (state, _, __, rootGetters) => () => {
      const networkId = optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) return false

      const networkPeers = optionalChaining(() => state[networkId].lastUpdated, null)

      return networkPeers
    }
  },

  mutations: {
    SET_PEERS (state, { peers, networkId }) {
      Vue.set(state, networkId, {
        peers: peers,
        lastUpdated: Date.now()
      })
    },

    CLEAR_PEERS (state, { networkId }) {
      Vue.delete(state, networkId)
    }
  },

  actions: {
    /**
     * Set peers for the network
     * @param  {Object[]} peers A list of peer objects.
     * @param  {string} [networkId = currentNetworkId()] A network ID.
     * @return {void}
     */
    'set' ({ rootGetters, commit }, { peers, networkId } = {}) {
      if (!Array.isArray(peers)) {
        throw new Error('Unable to set peers: peers value is not an array.')
      }

      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) {
        logger.error('Unable to set peers')
        return
      }

      commit('SET_PEERS', {
        peers,
        networkId
      })
    },

    /**
       * Clears the peers available to a network.
       * @param {string} [networkId = currentNetworkId()]
       * @returns {void}
       */
    'clear' ({ commit, rootGetters }, { networkId } = {}) {
      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) return

      commit('CLEAR_PEERS', { networkId: networkId })
    },

    /**
       * Refresh peer list.
       * @param {Object} [networkId=null] The network object.
       * @return {void}
       */
    async 'refresh' ({ dispatch, rootGetters }, { networkId } = {}) {
      networkId = networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (!networkId) return

      let peers = []

      try {
        const peerDiscovery = await rootGetters['peer/discovery/get']({ networkId })

        peerDiscovery
          .withLatency(300)
          .sortBy('latency')

        peers = await peerDiscovery
          .findPeersWithPlugin('core-api', {
            additional: [
              'height',
              'latency'
            ]
          })

        if (!peers.length) {
          peers = await peerDiscovery
            .findPeersWithPlugin('core-wallet-api', {
              additional: [
                'height',
                'latency'
              ]
            })
        }
      } catch (error) {
        logger.error(error)
        logger.error('Could not refresh peer list:', error)
        this._vm.$error(i18n.t('PEER.FAILED_REFRESH'))
      }

      if (!peers.length) {
        logger.error('No peers retrieved')
        this._vm.$error(i18n.t('PEER.FAILED_REFRESH'))
      }

      dispatch('set', { peers, networkId })
    },

    /**
       * Get best peer for current network.
       * @param  {Boolean} [refresh=true] Refresh peer list before finding the best peer.
       * @param  {Object} [network=null] The network object
       * @return {(Object|null)}
       */
    async 'findBest' ({ dispatch, getters, rootGetters }, { refresh = true, network = {}, networkId } = {}) {
      networkId = network.id || networkId || optionalChaining(() => rootGetters['session/profile'].networkId, false)

      if (refresh) {
        try {
          await dispatch('refresh', { networkId })
        } catch (error) {
          logger.error(error)
          this._vm.$error(`${i18n.t('PEER.FAILED_REFRESH')}: ${error.message}`)
        }
      }

      let peer = network ? getters.best({ ignoreCurrent: true, networkId, min: 1, max: 1 })[0] : getters.best({ min: 1, max: 1 })[0]

      if (!peer) return null

      peer = await dispatch('peer/update', peer, { root: true })

      return peer
    },

    /**
       * Update to the best peer for current network.
       * @param  {Boolean} [refresh=true] - Should refresh the list when trying to find the best peer.
       * @param  {Boolean} [skipIfCustom=true] Ignore if a custom peer is set.
       * @return {(Object|null)}
       */
    async 'connectToBest' ({ dispatch, rootGetters }, { refresh = true, skipIfCustom = true }) {
      if (skipIfCustom) {
        const currentPeer = rootGetters['peer/current/get']()
        if (!isEmpty(currentPeer) && currentPeer.isCustom) {
          // TODO only when necessary (when / before sending) (if no dynamic)
          await dispatch('transaction/updateStaticFees', null, { root: true })

          return null
        }
      }

      let peer

      try {
        const peer = await dispatch('findBest', { refresh })
        await dispatch('peer/current/set', { peer }, { root: true })
      } catch (error) {
        logger.error(error)
        if (skipIfCustom) await dispatch('system/clear', null, { root: true })
      }

      return peer
    }
  }

}
