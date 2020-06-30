import { random, shuffle } from 'lodash'
import { PeerDiscovery } from '@arkecosystem/peers'
import ClientService from '@/services/client'
import config from '@config'
import i18n from '@/i18n'
import { isEmpty } from '@/utils'
import PeerModel from '@/models/peer'
import Vue from 'vue'
import { fallbackSeeds } from './fallback'

const getBaseUrl = (peer) => {
  const scheme = peer.isHttps ? 'https://' : 'http://'

  return `${scheme}${peer.ip}:${peer.port}`
}

const discoverPeers = async (peerDiscovery) => {
  peerDiscovery.withLatency(300).sortBy('latency')

  const peers = await peerDiscovery.findPeersWithPlugin('core-api', {
    additional: [
      'height',
      'latency'
    ]
  })

  if (peers && peers.length) {
    return peers
  }

  return peerDiscovery.findPeersWithPlugin('core-wallet-api', {
    additional: [
      'height',
      'latency',
      'version'
    ]
  })
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
     * @param  {Boolean} [ignoreCurrent=false]
     * @return {Object[]}
     */
    all: (state, getters, _, rootGetters) => (ignoreCurrent = false, networkId = null) => {
      if (!networkId) {
        const profile = rootGetters['session/profile']
        if (!profile || !profile.networkId) {
          return []
        }

        networkId = profile.networkId
      }

      const networkPeers = state.all[networkId]
      let peers = []
      if (networkPeers) {
        peers = Object.values(networkPeers.peers)
      }

      if (ignoreCurrent) {
        const currentPeer = getters.current()
        if (currentPeer) {
          peers = peers.filter(peer => {
            return peer.ip !== currentPeer.ip
          })
        }
      }

      return peers
    },

    /**
     * Get peer for current network based on ip.
     * @param  {String} ip
     * @return {(Object|undefined)}
     */
    get: (_, getters) => ip => {
      return getters.all().find(peer => peer.ip === ip)
    },

    /**
     * Determine best peer for current network (random from top 10).
     * @param  {Boolean} [ignoreCurrent=true]
     * @return {(Object|null)}
     */
    best: (_, getters) => (ignoreCurrent = true) => {
      const peers = getters.bestPeers(undefined, ignoreCurrent)
      if (!peers) {
        return null
      }

      return Object.values(peers)[random(peers.length - 1)]
    },

    /**
     * Retrieves n random peers for the current network (excluding current peer)
     * @param {Number} amount of peers to return
     * @return {Object[]} containing peer objects
     */
    randomPeers: (_, getters) => (amount = 5) => {
      const peers = getters.all(true) // Ignore current peer
      if (!peers.length) {
        return []
      }

      return shuffle(peers).slice(0, amount)
    },

    /**
     * Retrieves n random seed peers for the current network (excluding current peer)
     * Note that these peers are currently taken from a config file and will an empty array
     * custom networks without a corresponding peers file
     * @param {Number} amount of peers to return
     * @return {Object[]} containing peer objects
     */
    randomSeedPeers: (_, __, ___, rootGetters) => (amount = 5, networkId = null) => {
      if (!networkId) {
        const profile = rootGetters['session/profile']
        if (!profile || !profile.networkId) {
          return []
        }

        networkId = profile.networkId
      }

      const peers = config.PEERS[networkId]
      if (!peers || !peers.length) {
        return []
      }

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
      const peers = getters.all(ignoreCurrent)
      if (!peers.length) {
        return []
      }

      // NOTE: Disabled because if a bad peer has a height 50 blocks above the rest it is not returning any peer

      // const highestHeight = peers[0].height
      // for (let i = 1; i < maxRandom; i++) {
      //   if (!peers[i]) {
      //     break
      //   }
      //   if (peers[i].height < highestHeight - 50) {
      //     maxRandom = i - 1
      //   }
      // }

      return peers.slice(0, Math.min(maxRandom, peers.length))
    },

    /**
     * Get current peer.
     * @return {(Object|boolean)} - false if no current peer
     */
    current: (state, getters, __, rootGetters) => (networkId = null) => {
      if (!networkId) {
        const profile = rootGetters['session/profile']
        if (!profile || !profile.networkId) {
          return false
        }

        networkId = profile.networkId
      }

      const currentPeer = state.current[networkId]
      if (isEmpty(currentPeer)) {
        return false
      }

      return currentPeer
    },

    /**
     * Get last updated date for peer list.
     * @return {(Date|null)}
     */
    lastUpdated: (state, _, __, rootGetters) => () => {
      const profile = rootGetters['session/profile']
      if (!profile || !profile.networkId) {
        return false
      }

      const networkPeers = state.all[profile.networkId]

      if (networkPeers) {
        return networkPeers.lastUpdated
      }

      return null
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
     * @param  {Object[]} peers
     * @param  {Number} networkId
     * @return {void}
     */
    setToNetwork ({ commit }, { peers, networkId }) {
      commit('SET_PEERS', {
        peers: peers.map(peer => {
          try {
            return PeerModel.deserialize(peer)
          } catch (error) {
            this._vm.$logger.error(`Could not deserialize peer: ${error.message}`)
          }

          return null
        }).filter(peer => peer !== null),
        networkId
      })
    },

    /**
     * Set peers for current network.
     * @param  {Object[]} peers
     * @return {void}
     */
    set ({ commit, rootGetters }, peers) {
      const profile = rootGetters['session/profile']
      if (!profile || !profile.networkId) {
        return
      }

      commit('SET_PEERS', {
        peers: peers.map(peer => {
          try {
            return PeerModel.deserialize(peer)
          } catch (error) {
            this._vm.$logger.error(`Could not deserialize peer: ${error.message}`)
          }

          return null
        }).filter(peer => peer !== null),
        networkId: profile.networkId
      })
    },

    /**
     * Set current peer for current network.
     * @param  {Object} peer
     * @return {void}
     */
    async setCurrentPeer ({ commit, dispatch, rootGetters }, peer) {
      const profile = rootGetters['session/profile']
      if (!profile || !profile.networkId) {
        return
      }

      if (peer) {
        this._vm.$client.host = getBaseUrl(peer)

        // TODO only when necessary (when / before sending) (if no dynamic)
        await dispatch('transaction/updateStaticFees', null, { root: true })
      }
      commit('SET_CURRENT_PEER', {
        peer,
        networkId: profile.networkId
      })
    },

    /**
     * Get Peer Discovery instance.
     * @return {PeerDiscovery}
     */
    async getPeerDiscovery ({ getters, rootGetters }, network = null) {
      if (!network) {
        network = rootGetters['session/network']
      }

      if (!network) {
        return
      }

      const networkLookup = {
        'ark.mainnet': 'mainnet',
        'ark.devnet': 'devnet'
      }

      if (networkLookup[network.id]) {
        return PeerDiscovery.new({
          networkOrHost: networkLookup[network.id]
        })
      } else if (getters.current()) {
        const peerUrl = getBaseUrl(getters.current())

        return PeerDiscovery.new({
          networkOrHost: `${peerUrl}/api/peers`
        })
      }

      return PeerDiscovery.new({
        networkOrHost: `${network.server}/api/peers`
      })
    },

    /**
     * Refresh peer list.
     * @return {void}
     */
    async refresh ({ dispatch, rootGetters }, network = null) {
      let peers = []

      try {
        const peerDiscovery = await dispatch('getPeerDiscovery', network)
        if (!peerDiscovery) {
          throw new Error('could not initiate peer discovery')
        }

        peers = await discoverPeers(peerDiscovery)
      } catch (error) {
        if (!network) {
          network = rootGetters['session/network']
        }

        const networkLookup = {
          'ark.mainnet': 'mainnet',
          'ark.devnet': 'devnet'
        }

        if (network && networkLookup[network.id]) {
          console.log('Could not refresh peer list. Using fallback seeds: ', error)

          let peerDiscoveryFailed = true

          while (peerDiscoveryFailed) {
            try {
              const seeds = fallbackSeeds[network.id]
              const seed = seeds[Math.floor(Math.random() * seeds.length)]
              const peerDiscovery = await PeerDiscovery.new({ networkOrHost: `http://${seed.ip}:4003/api/peers` })

              peers = await discoverPeers(peerDiscovery)

              peerDiscoveryFailed = false
            } catch (error) {
              peerDiscoveryFailed = true

              console.error('Could not refresh peer list:', error)
            }
          }
        } else {
          console.error('Could not refresh peer list:', error)
        }
      }

      if (!peers.length) {
        this._vm.$error(i18n.t('PEER.FAILED_REFRESH'))
      }

      dispatch('set', peers)
    },

    /**
     * Get best peer for current network.
     * @param  {Boolean} [refresh=true]
     * @param  {Boolean} [skipIfCustom=true]
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
      if (!peer) {
        return null
      }

      peer = await dispatch('updateCurrentPeerStatus', peer)
      if (!peer) {
        return dispatch('findBest', {
          refresh: true,
          network
        })
      }

      return peer
    },

    /**
     * Update to the best peer for current network.
     * @param  {Boolean} [refresh=true]
     * @param  {Boolean} [skipIfCustom=true]
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

      const peer = await dispatch('findBest', {
        refresh
      })

      await dispatch('setCurrentPeer', peer)

      return peer
    },

    async ensureStillValid ({ rootGetters }, peer) {
      if (!peer) {
        throw new Error('Not connected to peer')
      }

      const networkConfig = await ClientService.fetchNetworkConfig(getBaseUrl(peer))
      if (networkConfig.nethash !== rootGetters['session/network'].nethash) {
        throw new Error('Wrong network')
      }
    },

    async fallbackToSeedPeer ({ dispatch }) {
      dispatch('set', [])
      dispatch('setCurrentPeer', null)
      await dispatch('connectToBest', { skipIfCustom: false })
    },

    /**
     * Update peer status.
     * @param  {Object} [port]
     * @return {(Object|void)}
     */
    async updateCurrentPeerStatus ({ dispatch, getters }, currentPeer) {
      let updateCurrentPeer = false
      if (isEmpty(currentPeer)) {
        currentPeer = { ...getters.current() }
        updateCurrentPeer = true
      }
      if (isEmpty(currentPeer)) {
        await dispatch('fallbackToSeedPeer')

        return
      }

      try {
        if (updateCurrentPeer) {
          await dispatch('ensureStillValid', currentPeer)
        }
        const delayStart = performance.now()
        let peerStatus
        if (updateCurrentPeer) {
          peerStatus = await this._vm.$client.fetchPeerStatus()
        } else {
          const client = new ClientService()
          client.host = getBaseUrl(currentPeer)
          client.client.withOptions({ timeout: 3000 })
          peerStatus = await client.fetchPeerStatus()
        }
        const latency = (performance.now() - delayStart).toFixed(0)

        currentPeer = {
          ...currentPeer,
          latency: +latency,
          height: +peerStatus.height,
          lastUpdated: new Date()
        }
        if (updateCurrentPeer) {
          await dispatch('setCurrentPeer', currentPeer)
        } else {
          return currentPeer
        }
      } catch (error) {
        if (updateCurrentPeer) {
          await dispatch('fallbackToSeedPeer')
        }
      }
    },

    /**
     * Create client service object for a peer.
     * @param  {Object} peer
     * @return {ClientService}
     */
    async clientServiceFromPeer (_, peer) {
      const client = new ClientService()
      client.host = getBaseUrl(peer)
      client.client.withOptions({ timeout: 3000 })

      return client
    },

    /**
     * Validate custom peer, used to check it's acceptable to connect.
     * @param  {String} ip
     * @param  {Number} port
     * @param  {Number} [ignoreNetwork=false]
     * @param  {Number} [timeout=3000]
     * @return {(Object|String)}
     */
    async validatePeer ({ rootGetters }, { host, ip, port, nethash, ignoreNetwork = false, timeout = 3000 }) {
      let networkConfig
      if (!host && ip) {
        host = ip
      }
      let baseUrl = `${host}:${port}`
      const schemeUrl = host.match(/^(https?:\/\/)+(.+)$/)
      if (!schemeUrl) {
        baseUrl = `http://${baseUrl}`
      }
      try {
        networkConfig = await ClientService.fetchNetworkConfig(baseUrl, timeout)
      } catch (error) {
        console.error('Could not get network config:', error)
      }

      if (!networkConfig) {
        return i18n.t('PEER.NO_CONNECT')
      } else if (!ignoreNetwork && networkConfig.nethash !== (nethash || rootGetters['session/network'].nethash)) {
        return i18n.t('PEER.WRONG_NETWORK')
      }

      const client = new ClientService()
      client.host = baseUrl
      client.client.withOptions({ timeout: 3000 })

      let peerStatus
      try {
        peerStatus = await client.fetchPeerStatus()
      } catch (error) {
        //
      }

      if (!peerStatus) {
        return i18n.t('PEER.STATUS_CHECK_FAILED')
      }

      return {
        ip: schemeUrl ? schemeUrl[2] : host,
        host: baseUrl,
        port: +port,
        height: peerStatus.height,
        status: 'OK',
        latency: 0,
        isHttps: schemeUrl && schemeUrl[1] === 'https://'
      }
    }
  }
}
