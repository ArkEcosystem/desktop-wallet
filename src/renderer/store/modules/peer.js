import { isEmpty, random, shuffle } from 'lodash'
import { PeerDiscovery } from '@arkecosystem/peers'
import ClientService from '@/services/client'
import config from '@config'
import i18n from '@/i18n'
// import PeerModel from '@/models/peer'
import Vue from 'vue'

const logger = {
  ...console,
  error: (message) => console.trace(message)
}

const errors = {
  array_zero_length: 'Expected array to return a positive length. Returned 0 instead.',
  falsy_value: 'Expect value to be truthy, but it is falsy instead.',
  wrong_type: 'Expect value to be one type, but is some other type.',
  no_network: 'networkId has the falsy value.'
}

// Get the base URL from a peer
const getBaseUrl = (peer) => `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}:${peer.port}`

// Remove a peer from a list based on its IP address.
const removePeerFromList = (peer, list) => {
  if (!peer) return list
  if (!list) return false
  return list.filter(listed => listed.ip !== peer.ip)
}

// Return the default network ID based on the profile. The profile object is provided by rootGetters.
const currentNetworkId = getters => {
  const profile = getters['session/profile']
  return profile && profile.networkId
}

// This is used when optional chaining is not available
const optionalChaining = (fn, failsafe) => {
  try {
    return fn()
  } catch (err) {
    return failsafe
  }
}

// Return an object containing chain and net from the networkId. Eg: ark.devnet => { chain: ark, net: devnet}
const chainNetFromNetworkId = networkId => (arr => ({ chain: arr[0], net: arr[1] }))(networkId.split('.'))

// Include peer serialization functions

export default {
  namespaced: true,

  state: {
    all: {},
    current: {}
  },

  getters: {
    /**
     * Get all peers for current network.
     * @param {Boolean} [ignoreCurrent=false] Set if the current peer should be ignored when returning a list of all peers.
     * @param {string} [networkId=null] Network ID, eg 'ark.devnet'.
     * @return { Object[] | Null} The peer list.
     */
    all: (state, getters, _, rootGetters) => ({ ignoreCurrent = false, networkId = null } = {}) => {
      networkId = networkId || currentNetworkId(rootGetters)

      if (!networkId) {
        logger.error(errors.no_network)
        return null
      }

      let peers = optionalChaining(() => state.all[networkId].peers, [])

      if (!peers) {
        logger.error(errors.falsy_value)
        return null
      }

      if (ignoreCurrent) {
        const currentPeer = getters.current()
        peers = removePeerFromList(currentPeer, peers)
      }

      if (peers.length < 1) logger.error(errors.array_zero_length)

      return peers
    },

    /**
     * Gets the first peer that matches the IP address.
     * @param {string} ip The IP address of the peer.
     * @param {string} [networkId = currentNetworkId] The network that the peer is on.
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

      networkId = networkId || currentNetworkId(rootGetters)

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

    'seed/all': (_, __, ___, rootGetters) => ({ networkId } = {}) => {
      networkId = networkId || currentNetworkId(rootGetters)

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
    },

    /**
     * Returns an array of peers that can be used to broadcast a transaction to
     * Currently this consists of random top 10 peers + 5 random peers.
     * @return {Object[]} containing peer objects
     */
    broadcast: (_, getters) => ({ networkId = null } = {}) => {
      const peers = []

      // top 10
      peers.concat(getters.best({
        max: 10,
        min: 10,
        ignoreCurrent: false,
        networkId
      }))

      // 5 random
      peers.concat(getters.random({
        amount: 5,
        networkId
      }))

      // 5 seed random
      peers.concat(getters['seed/random']({
        amount: 5,
        networkId
      }))

      return peers
    },

    /**
     * Get current peer.
     * @param {string} networkId The ID of the network. This doesn't make much sense, since you cannot be connected to multiple networks.
     * @return {(Object|boolean)} - false if no current peer
     */
    current: (state, getters, __, rootGetters) => ({ networkId = null } = {}) => {
      networkId = networkId || currentNetworkId(rootGetters)

      if (!networkId) {
        logger.error(errors.no_network)
        return false
      }

      const currentPeer = state.current[networkId]

      if (isEmpty(currentPeer)) {
        logger.warn('currentPeer is empty')
        return false
      }

      return currentPeer
    },

    /**
     * Get last updated date for peer list.
     * @return {(Date|null|false)}
     */
    lastUpdated: (state, _, __, rootGetters) => () => {
      const networkId = currentNetworkId(rootGetters)

      if (!networkId) return false

      const networkPeers = optionalChaining(() => state.all[networkId].lastUpdated, null)

      return networkPeers
    },

    /**
     * Gets a new peer discovery instance. The discovery is based on the following order:
     *
     * 1) It checks for the network peers.
     * 2) It checks for the peer peers.
     * 3) It checks for the network server peer.
     * @param {string} [networkId = currentNetworkId()]
     * @returns {Promise} The instance of the PeerDiscovery.
     */
    discovery: (getters, __, ___, rootGetters) => ({ networkId } = {}) => {
      networkId = networkId || currentNetworkId(rootGetters)

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
      const currentPeer = getters.current()
      if (currentPeer) return PeerDiscovery.new({ networkOrHost: `${getBaseUrl(currentPeer)}/api/v2/peers` })

      // And then checks for the default network server
      const networkServer = rootGetters.network[networkId].server
      return PeerDiscovery.new({ networkOrHost: `${networkServer}/api/v2/peers` })
    }

  },

  mutations: {
    SET_PEERS (state, { peers, networkId }) {
      Vue.set(state.all, networkId, {
        peers: peers,
        lastUpdated: Date.now()
      })
    },

    CLEAR_PEERS (state, { networkId }) {
      Vue.set(state.all, networkId, {
        peers: undefined,
        lastUpdated: undefined
      })
    },

    SET_CURRENT_PEER (state, { peer, networkId }) {
      Vue.set(state.current, networkId, peer)
    },

    CLEAR_CURRENT_PEER (state, { networkId }) {
      Vue.set(state.current, networkId, undefined)
    }
  },

  actions: {
    /**
     * Set peers for the network
     * @param  {Object[]} peers A list of peer objects.
     * @param  {string} [networkId = currentNetworkId()] A network ID.
     * @return {void}
     */
    'set/peers' ({ rootGetters, commit }, { peers, networkId } = {}) {
      if (!peers) {
        logger.error('No peers to set. Send an empty array if this is the desired behaviour.')
        return
      }

      networkId = networkId || currentNetworkId(rootGetters)

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
     * Set current peer for the network
     * @param {Object} peer The peer. If you want to set an empty peer, send an empty object.
     * @param {string} [networkId = defaultNetworkId()] A network ID.
     * @return {void}
     */
    async 'set/current' ({ commit, dispatch, rootGetters }, { peer, networkId, update = true } = {}) {
      if (!peer) {
        logger.error('No peer was provided to be set as current.')
        return
      }

      networkId = networkId || currentNetworkId(rootGetters)

      if (!networkId) return

      if (update) {
        // Use the current peer as the base url for requests.
        this._vm.$client.host = getBaseUrl(peer)

        peer = await dispatch('updatePeer', peer)

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
     * Clears the peers available to a network.
     * @param {string} [networkId = currentNetworkId()]
     * @returns {void}
     */
    'clear/peers' ({ commit, rootGetters }, { networkId } = {}) {
      networkId = networkId || currentNetworkId(rootGetters)

      if (!networkId) return

      commit('CLEAR_PEERS', { networkId: networkId })
    },

    /**
     * Clear the current peer.
     * @param {string} [networkId=currentNetworkId()]
     * @returns {void}
     */
    'clear/current' ({ commit, rootGetters }, { networkId } = {}) {
      networkId = networkId || currentNetworkId(rootGetters)

      if (!networkId) return

      commit('CLEAR_CURRENT_PEER', { networkId })
    },

    /**
     * Refresh peer list.
     * @param {Object} [networkId=null] The network object.
     * @return {void}
     */
    async refresh ({ getters, dispatch, rootGetters }, { networkId } = {}) {
      networkId = networkId || currentNetworkId(rootGetters)

      if (!networkId) return

      let peers = []

      try {
        const peerDiscovery = await getters.discovery({ networkId })

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

      dispatch('set/peers', { peers })
    },

    /**
     * Get best peer for current network.
     * @param  {Boolean} [refresh=true] Refresh peer list before finding the best peer.
     * @param  {Object} [network=null] The network object
     * @return {(Object|null)}
     */
    async findBest ({ dispatch, getters, rootGetters }, { refresh = true, network = {} }) {
      const networkId = network.id || currentNetworkId(rootGetters)

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

      peer = await dispatch('updatePeer', peer)

      return peer
    },

    /**
     * Update to the best peer for current network.
     * @param  {Boolean} [refresh=true] - Should refresh the list when trying to find the best peer.
     * @param  {Boolean} [skipIfCustom=true] Ignore if a custom peer is set.
     * @return {(Object|null)}
     */
    async connectToBest ({ dispatch, getters }, { refresh = true, skipIfCustom = true }) {
      if (skipIfCustom) {
        const currentPeer = getters.current()
        if (!isEmpty(currentPeer) && currentPeer.isCustom) {
          // TODO only when necessary (when / before sending) (if no dynamic)
          await dispatch('transaction/updateStaticFees', null, { root: true })

          return null
        }
      }

      let peer

      try {
        const peer = await dispatch('findBest', { refresh })
        await dispatch('set/current', { peer })
      } catch (error) {
        logger.error(error)
        if (skipIfCustom) await dispatch('fallbackToSeedPeer')
      }

      return peer
    },

    /**
     * Make sure that the peer is valid for the current network.
     * @param {Peer} peer The peer object to be matched agains the current network.
     * @return
     */
    async ensureStillValid ({ rootGetters }, peer) {
      if (!peer) throw new Error('Not connected to peer')

      const networkConfig = await ClientService.fetchNetworkConfig(getBaseUrl(peer))
      if (networkConfig.nethash !== rootGetters['session/network'].nethash) {
        throw new Error('Wrong network')
      }
    },

    /**
     * Fallback to seed peer, cleaning all the peer data.
     */
    async fallbackToSeedPeer ({ dispatch }) {
      dispatch('clear/peers')
      dispatch('clear/current')
      await dispatch('connectToBest', { skipIfCustom: false })
    },

    /**
     * Checks if the peer is still valid in the provided network.
     * @param {Object} peer The peer.
     * @param {Object} network The network.
     * @return {Boolean | Error} If the peer is compatible with the network.
     */
    async checkPeerNetworkCompatibility ({ dispatch }, { peer, network, nethash }) {
      const networkNethash = nethash || network.nethash
      let peerNethash

      try {
        peerNethash = await dispatch('clientServiceFromPeer', peer)
          .fetchNetworkConfig(getBaseUrl(peer))
          .nethash
      } catch (err) {
        console.error('Could not get network config:' + err)
      }

      if (!peerNethash) {
        throw i18n.t('PEER.NO_CONNECT')
      } else if (peerNethash !== networkNethash) {
        return false
      }

      return true
    },

    /**
     * Update the peer object with it's status
     * @param {Object} peer The peer to be updated.
     * @return {(void | Error)} The status for the update.
     */
    async updatePeer ({ dispatch }, peer) {
      let status

      try {
        status = await dispatch('fetchPeerStatus', peer)
      } catch (err) {
        logger.error(err)
        throw i18n.t('PEER.STATUS_CHECK_FAILED')
      }

      if (!status) {
        logger.error('No status was fetched')
        throw i18n.t('PEER.STATUS_CHECK_FAILED')
      }

      peer.latency = status.latency
      peer.height = status.height
      peer.status = status.status

      return peer
    },

    /**
     * Create a client service from the peer.
     * @param {Object} peer The peer to create the client service
     * @return {Client} The client instance
     */
    async clientServiceFromPeer (_, peer) {
      const client = new ClientService()
      client.host = getBaseUrl(peer)
      client.client.withOptions({ timeout: 3000 })

      return client
    },

    /**
     * Fetch peer status and return it. This does not automatically add the status to the peer, nor saves the peer.
     * @param {Object} peer The peer that is going to be fetched.
     * @return {Object | Error} An object with the peer status fetched.
     */
    async fetchPeerStatus ({ dispatch }, peer) {
      let client, status, latencyStart, latencyEnd

      try {
        latencyStart = performance.now()
        client = await dispatch('clientServiceFromPeer', peer)
        status = await client.fetchPeerStatus()
        latencyEnd = performance.now()
        if (!client || !status) throw new Error()
      } catch (err) {
        logger.error(err)
        throw i18n.t('PEER.STATUS_CHECK_FAILED')
      }

      return {
        status: 'OK',
        height: status.height,
        latency: (latencyEnd - latencyStart).toFixed(0)
      }
    },

    /**
     * Updates the whole peer system, checking the current peer is still valid and updating status.
     * @param  {Object} [port]
     * @return {(Object|void)}
     */
    async updatePeerSystem ({ dispatch, getters }) {
      let peer = getters.current()

      if (!peer) {
        await dispatch('fallbackToSeedPeer')
        return
      }

      try {
        peer = await dispatch('updatePeer', peer)
        await dispatch('set/current', { peer })
      } catch (error) {
        await dispatch('fallbackToSeedPeer')
        await dispatch('refresh')
      }
    },

    /**
     * Validate custom peer, used to check it's acceptable to connect.
     * @param  {string} ip IP address without the schema.
     * @param  {string} host Host address, with or without the schema.
     * @param  {number} port Port number
     * @param  {string} nethash The network hash for the network which the peer belongs to
     * @param  {number} [ignoreNetwork=false] Set to true if validating a peer for other network
     * @param  {number} [timeout=3000] Default timeout for all the client requests.
     * @return {(Object|string)}
     */
    async validatePeer ({ dispatch }, { host, ip, port, nethash, ignoreNetwork = false }) {
      const schemeUrl = host.match(/^(https?:\/\/)+(.+)$/)
      const isHttps = schemeUrl && schemeUrl[1] === 'https://'

      let peer = {
        host: host,
        ip: ip,
        port: +port,
        isHttps: isHttps
      }

      try {
        const isCompatible = await dispatch('checkPeerNetworkCompatibility', {
          peer: peer,
          nethash: nethash
        })
        if (!isCompatible && !ignoreNetwork) return
        peer = await dispatch('updatePeer', peer)
      } catch (err) {
        logger.error(err)
      }

      return peer
    }
  }
}
