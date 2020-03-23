import { isEmpty, random, shuffle } from 'lodash'
import { PeerDiscovery } from '@arkecosystem/peers'
import ClientService from '@/services/client'
import config from '@config'
import i18n from '@/i18n'
import PeerModel from '@/models/peer'
import Vue from 'vue'
import { Peer } from '@/services/peer'

const logger = { ...console }

// Get the base URL from a peer
const getBaseUrl = (peer) => `${peer.isHttps ? 'https://' : 'http://'}${peer.ip}:${peer.port}`

// Remove a peer from a list based on its IP address.
const removePeerFromList = (peer, list) => list ? list.filter(p => p.ip !== peer.ip) : list

// Return the default network ID based on the profile. The profile object is provided by rootGetters.
const defaultNetworkId = profile => profile && profile.networkId

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
     * @param {Boolean} [ignoreCurrentPeer=false] Set if the current peer should be ignored when returning a list of all peers.
     * @param {string} [networkId=null] Network ID, eg 'ark.devnet'.
     * @return { Object[] | Null} The peer list.
     */
    all: (state, getters, _, rootGetters) => ({ ignoreCurrentPeer = false, networkId = null }) => {
      networkId = networkId || defaultNetworkId(rootGetters['session/profile'])

      if (!networkId) return null

      let peers = state && state.all && state.all[networkId].peers

      if (ignoreCurrentPeer) peers = removePeerFromList(getters.current(), peers)

      return peers
    },

    /**
     * Get peer for current network based on ip.
     * @param  {string} ip
     * @return {(Object|undefined)}
     */
    get: (_, getters) => ip => (peers => peers ? peers.find(peer => peer.ip === ip) : undefined)(getters.all()),

    /**
     * Determine best peer for current network (random from top 10).
     * @param  {Boolean} [ignoreCurrent=true]
     * @return {(Object|null)}
     */
    best: (_, getters) => (ignoreCurrent = true) => {
      const peers = getters.bestPeers(undefined, ignoreCurrent)
      return (peers ? Object.values(peers)[random(peers.length - 1)] : null)
    },

    /**
     * Retrieves n random peers for the current network (excluding current peer)
     * @param {Number} amount of peers to return
     * @return {Object[]} containing peer objects
     */
    randomPeers: (_, getters) => (amount = 5) => {
      const peers = getters.all({ IgnoreCurrentPeer: true })
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
      networkId = networkId || defaultNetworkId(rootGetters['session/profile'])
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
     * Determine best peer for current network (random from top 10).
     * @param  {Boolean} [ignoreCurrent=true]
     * @return {Object[]}
     */
    bestPeers: (_, getters) => (maxRandom = 10, ignoreCurrent = true) => {
      const peers = getters.all({ ignoreCurrentPeer: ignoreCurrent })
      if (!peers.length) {
        return []
      }

      return peers.slice(0, Math.min(maxRandom, peers.length))
    },

    /**
     * Get current peer.
     * @param {string} networkId The ID of the network. This doesn't make much sense, since you cannot be connected to multiple networks.
     * @return {(Object|boolean)} - false if no current peer
     */
    current: (state, getters, __, rootGetters) => (networkId = null) => {
      networkId = networkId || defaultNetworkId(rootGetters['session/profile'])
      if (!networkId) return false

      const currentPeer = state.current[networkId]
      if (isEmpty(currentPeer)) return false

      return currentPeer
    },

    /**
     * Get last updated date for peer list.
     * @return {(Date|null|false)}
     */
    lastUpdated: (state, _, __, rootGetters) => () => {
      const networkId = defaultNetworkId(rootGetters['session/profile'])
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
      const networkId = defaultNetworkId(rootGetters['session/profile'])
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

      peer = new Peer(peer)

      await peer.fetchStatus()

      const networkId = defaultNetworkId(rootGetters['session/profile'])
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
     * Gets a new peer Discovery instance.
     * @param {string} [network=null] - The network object
     * @return {PeerDiscovery | void}
     */
    async getPeerDiscovery ({ getters, rootGetters }, network = null) {
      const currentPeer = getters.current()

      if (currentPeer) return PeerDiscovery.new({ networkOrHost: `${getBaseUrl(currentPeer)}/api/v2/peers` })

      network = network || rootGetters['session/network']
      if (!network) return

      const { net } = chainNetFromNetworkId(network.id)

      // this doesnt seems to make sense. Am I submiting a string?
      if (net) return PeerDiscovery.new({ networkOrHost: net })

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
                'latency',
                'version'
              ]
            })
        }
      } catch (error) {
        logger.error('Could not refresh peer list:', error)
      }

      if (!peers.length) {
        this._vm.$error(i18n.t('PEER.FAILED_REFRESH'))
      }

      if (!peers || !peers.length) {
        return
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
          this._vm.$error(`${i18n.t('PEER.FAILED_REFRESH')}: ${error.message}`)
        }
      }

      let peer = network ? getters.best(true, network.id) : getters.best()

      if (!peer) return null

      peer = peer instanceof Peer ? peer : new Peer(peer)

      peer.fetchStatus()

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

      const peer = await dispatch('findBest', { refresh })

      await dispatch('setCurrentPeer', peer)

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
     * Fallback to seed peer.
     */
    async fallbackToSeedPeer ({ dispatch }) {
      dispatch('set', [])
      dispatch('setCurrentPeer', null)
      await dispatch('connectToBest', { skipIfCustom: false })
    },

    /**
     * Updates the whole peer system, checking the current peer is still valid and updating status.
     * @param  {Object} [port]
     * @return {(Object|void)}
     */
    async updatePeerSystem ({ dispatch, getters }) {
      let peer = getters.current()

      // If there is no current peer, fall back to seedPeer
      if (!peer) {
        await dispatch('fallbackToSeedPeer')
        return
      }

      peer = peer instanceof Peer ? peer : new Peer(peer)

      try {
        await peer.fetchStatus()
      } catch (error) {
        await dispatch('fallbackToSeedPeer')
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
    async validatePeer ({ rootGetters }, { host, ip, port, nethash, ignoreNetwork = false, timeout = 3000 }) {
      const schemeUrl = host.match(/^(https?:\/\/)+(.+)$/)
      const isHttps = schemeUrl && schemeUrl[1] === 'https://'

      const peer = new Peer({
        host: host,
        ip: ip,
        port: +port,
        isHttps: isHttps,
        clientTimeout: timeout
      })

      try {
        await peer.checkNetwork({
          nethash: nethash || rootGetters['session/network'].nethash,
          ignoreNetwork: ignoreNetwork,
          timeout: timeout
        })
        await peer.fetchStatus({
          timeout: timeout
        })
      } catch (err) {
        return err
      }

      return peer
    }
  }
}
