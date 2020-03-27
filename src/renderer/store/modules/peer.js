import { isEmpty, random, shuffle } from 'lodash'
import { PeerDiscovery } from '@arkecosystem/peers'
import ClientService from '@/services/client'
import config from '@config'
import i18n from '@/i18n'
import PeerModel from '@/models/peer'
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

// Return an object containing chain and net from the networkId. Eg: ark.devnet => { chain: ark, net: devnet}
const chainNetFromNetworkId = networkId => (arr => ({ chain: arr[0], net: arr[1] }))(networkId.split('.'))

// I still don't know what this does.
const deserializePeer = peer => {
  try {
    return PeerModel.deserialize(peer)
  } catch (error) {
    logger(error.message)
  }
}

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

      let peers = state && state.all && state.all[networkId].peers

      if (!peers) logger.error(errors.falsy_value)

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
    get: (_, getters) => ({ ip, networkId } = {}) => {
      if (!ip) throw new Error('Unable to find peer: no IP is provided')

      const peers = getters.all({ networkId })

      if (!peers) {
        logger.error(errors.falsy_value)
        return undefined
      }

      const peer = peers.find(peer => peer.ip === ip)

      if (!peer) logger.error(errors.falsy_value)

      return peer
    },

    /**
     * Determine best peer for current network (random from top 10).
     * @param  {Boolean} [ignoreCurrent=true] Ignore current peer when selecting the best.
     * @return {(Object|null)}
     */
    best: (_, getters) => ({ ignoreCurrent = true, networkId } = {}) => {
      const peers = getters.bestPeers({ ignoreCurrent, networkId })

      if (!peers) {
        logger.error(errors.falsy_value)
        return null
      }

      return Object.values(peers)[random(peers.length - 1)]
    },

    /**
     * Determine best peer for current network (random from top 10).
     * @param  {Boolean} [ignoreCurrent=true]
     * @return {Object[]}
     */
    bestPeers: (_, getters) => ({ maxRandom = 10, ignoreCurrent = false, networkId } = {}) => {
      const peers = getters.all({ ignoreCurrent, networkId })

      if (!peers) logger.error(errors.falsy_value)

      if (peers.length < 1) {
        logger.error(errors.array_zero_length)
        return []
      }

      return peers.slice(0, Math.min(maxRandom, peers.length))
    },

    /**
     * Retrieves n random peers for the current network (excluding current peer)
     * @param {Number} amount of peers to return
     * @return {Object[]} containing peer objects
     */
    randomPeers: (_, getters) => (amount = 5) => {
      const peers = getters.all({ IgnoreCurrent: true })
      return peers.lenght ? shuffle(peers).slice(0, amount) : []
    },

    /**
     * Retrieves n random seed peers for the current network (excluding current peer)
     * Note that these peers are currently taken from a config file and will an empty array
     * custom networks without a corresponding peers file
     * @param {Number} amount of peers to return
     * @return {Object[]} containing peer objects, can be length = 0.
     */
    randomSeedPeers: (_, __, ___, rootGetters) => (amount = 5, networkId = null) => {
      networkId = networkId || currentNetworkId(rootGetters)
      if (!networkId) return []

      const peers = config.PEERS[networkId]
      if (!peers || !peers.length) return []

      return shuffle(peers).slice(0, amount)
    },

    /**
     * Returns an array of peers that can be used to broadcast a transaction to
     * Currently this consists of top 10 peers + 5 random peers + 5 random seed peers
     * @return {Object[]} containing peer objects
     */
    broadcastPeers: (_, getters) => (networkId = null) => {
      const bestPeers = getters.bestPeers(10, false, networkId)
      const randomPeers = getters.randomPeers(5, networkId)
      const seedPeers = getters.randomSeedPeers(5, networkId)
      let peers = bestPeers.concat(randomPeers)
      if (seedPeers.length) {
        peers = peers.concat(seedPeers)
      }

      return peers
    },

    /**
     * Get current peer.
     * @param {string} networkId The ID of the network. This doesn't make much sense, since you cannot be connected to multiple networks.
     * @return {(Object|boolean)} - false if no current peer
     */
    current: (state, getters, __, rootGetters) => (networkId = null) => {
      networkId = networkId || currentNetworkId(rootGetters)
      if (!networkId) {
        logger.error(errors.no_network)
        return false
      }

      const currentPeer = state.current[networkId]
      if (isEmpty(currentPeer)) {
        logger.error('currentPeer is empty')
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
      const networkPeers = state.all[networkId]
      return networkPeers ? (networkPeers && networkPeers.lastUpdated) : null
    }
  },

  mutations: {
    SET_PEERS (state, { peers, networkId }) {
      Vue.set(state.all, networkId, {
        peers,
        lastUpdated: new Date()
      })
    },
    SET_CURRENT_PEER (state, { peer, networkId }) {
      Vue.set(state.current, networkId, peer)
    }
  },

  actions: {
    /**
     * Set peers for specific network.
     * @param  {Object[]} peers A peer list
     * @param  {string} networkId A network ID.
     * @return {void}
     */
    setToNetwork ({ commit }, { peers, networkId }) {
      commit('SET_PEERS', {
        peers: peers.map(peer => deserializePeer(peer)),
        networkId: networkId
      })
    },

    /**
     * Set peers for current network.
     * @param  {Object[]} peers The peer list.
     * @return {void}
     */
    set ({ rootGetters, dispatch }, peers) {
      const networkId = currentNetworkId(rootGetters)
      if (!networkId) return
      dispatch('setToNetwork', { peers: peers, networkId: networkId })
    },

    /**
     * Set current peer for current network.
     * @param  {Object} peer
     * @return {void}
     */
    async setCurrentPeer ({ commit, dispatch, rootGetters }, peer) {
      if (!peer) return

      peer = await dispatch('updatePeer', peer)

      const networkId = currentNetworkId(rootGetters)
      if (!networkId) return

      this._vm.$client.host = getBaseUrl(peer)

      // TODO only when necessary (when / before sending) (if no dynamic)
      await dispatch('transaction/updateStaticFees', null, { root: true })

      commit('SET_CURRENT_PEER', {
        peer,
        networkId: networkId
      })
    },

    /**
     * Gets a new peer Discovery instance. The discovery is based on the following order:
     *
     * 1) It checks for the network peers.
     * 2) It checks for the peer peers.
     * 3) It checks for the network server peer.
     *
     * @param {string} [network=null] - The network object
     * @return {PeerDiscovery | void}
     */
    async getPeerDiscovery ({ getters, rootGetters }, network = null) {
      network = network || rootGetters['session/network']

      if (!network) return

      const { net } = chainNetFromNetworkId(network.id)

      // 1) It checks for the default network peers.
      if (net) return PeerDiscovery.new({ networkOrHost: net })

      // 2) It checks for the peers connected.
      const currentPeer = getters.current()
      if (currentPeer) return PeerDiscovery.new({ networkOrHost: `${getBaseUrl(currentPeer)}/api/v2/peers` })

      // it checks for the default network server
      return PeerDiscovery.new({ networkOrHost: `${network.server}/api/v2/peers` })
    },

    /**
     * Refresh peer list.
     * @param {Object} [network=null] The network object.
     * @return {void}
     */
    async refresh ({ dispatch }, network = null) {
      let peers = []

      try {
        const peerDiscovery = await dispatch('getPeerDiscovery', network)

        peerDiscovery.withLatency(300)
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
        logger.error('Could not refresh peer list:', error)
        this._vm.$error(i18n.t('PEER.FAILED_REFRESH'))
      }

      if (!peers.length) {
        logger.error('No peers retrieved')
        this._vm.$error(i18n.t('PEER.FAILED_REFRESH'))
      }

      dispatch('set', peers)
    },

    /**
     * Get best peer for current network.
     * @param  {Boolean} [refresh=true] Refresh peer list before finding the best peer.
     * @param  {Object} [network=null] The network object
     * @return {(Object|null)}
     */
    async findBest ({ dispatch, getters }, { refresh = true, network = null }) {
      if (refresh) {
        try {
          await dispatch('refresh', network)
        } catch (error) {
          logger.error(error)
          this._vm.$error(`${i18n.t('PEER.FAILED_REFRESH')}: ${error.message}`)
        }
      }

      let peer = network ? getters.best({ ignoreCurrent: true, networkId: network.id }) : getters.best()

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
        await dispatch('setCurrentPeer', peer)
      } catch (error) {
        logger.error(error)
        if (skipIfCustom) await dispatch('fallbackToSeed')
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
      dispatch('set', [])
      dispatch('setCurrentPeer', null)
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
        await dispatch('setCurrentPeer', peer)
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
    async validatePeer ({ dispatch }, { host, ip, port, nethash, ignoreNetwork = false, timeout = 3000 }) {
      const schemeUrl = host.match(/^(https?:\/\/)+(.+)$/)
      const isHttps = schemeUrl && schemeUrl[1] === 'https://'

      let peer = {
        host: host,
        ip: ip,
        port: +port,
        isHttps: isHttps,
        clientTimeout: timeout
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
