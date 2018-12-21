import random from 'lodash/random'
import apiClient from '@arkecosystem/client'
import ClientService from '@/services/client'
import i18n from '@/i18n'
import PeerModel from '@/models/peer'
import Vue from 'vue'

/**
 * Get API port if version 2 peer.
 * @param  {Object} peer
 * @return {void}
 */
const getApiPort = async (peer) => {
  if (peer.port) {
    return
  }

  if (getVersion(peer) === 2 && peer.p2pPort) {
    try {
      const config = await apiClient.fetchPeerConfig(getBaseUrl(peer, true))
      if (config && config.plugins && config.plugins['@arkecosystem/core-api']) {
        if (config.plugins['@arkecosystem/core-api'].enabled) {
          peer.port = config.plugins['@arkecosystem/core-api'].port
        }
      }
    } catch (error) {
      const message = error.response ? error.response.data.message : error.message
      throw new Error('Could not determine peer API port: ', message)
    }
  }
}

const getBaseUrl = (peer, p2pPort = false) => {
  const scheme = peer.isHttps ? 'https://' : 'http://'

  return `${scheme}${peer.ip}:${p2pPort ? peer.p2pPort : peer.port}`
}

const getVersion = (peer) => {
  return /^2\./.test(peer.version) ? 2 : 1
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
        const currentPeer = getters['current']()
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
      return getters['all']().find(peer => peer.ip === ip)
    },

    /**
     * Determine best peer for current network (random from top 10).
     * @param  {Boolean} [ignoreCurrent=true]
     * @return {(Object|null)}
     */
    best: (_, getters) => (ignoreCurrent = true, networkId = null) => {
      const peers = getters['bestPeers'](undefined, ignoreCurrent)
      if (!peers || !peers.length) {
        return null
      }

      return Object.values(peers)[random(peers.length - 1)]
    },

    /**
     * Determine best peer for current network (random from top 10).
     * @param  {Boolean} [ignoreCurrent=true]
     * @return {(Object|null)}
     */
    bestPeers: (_, getters) => (maxRandom = 10, ignoreCurrent = true, networkId = null) => {
      const peers = getters['all'](ignoreCurrent)
      if (!peers.length) {
        return null
      }

      const highestHeight = peers[0].height
      for (let i = 1; i < maxRandom; i++) {
        if (!peers[i]) {
          break
        }
        if (peers[i].height < highestHeight - 50) {
          maxRandom = i - 1
        }
      }

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

      let currentPeer = state.current[networkId]
      if (!currentPeer) {
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
            //
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
    async setCurrentPeer ({ commit, rootGetters }, peer) {
      const profile = rootGetters['session/profile']
      if (!profile || !profile.networkId) {
        return
      }

      if (peer) {
        await getApiPort(peer)
        this._vm.$client.host = getBaseUrl(peer)
      }
      commit('SET_CURRENT_PEER', {
        peer,
        networkId: profile.networkId
      })
    },

    /**
     * Refresh peer list.
     * @return {void}
     */
    async refresh ({ dispatch, getters, rootGetters }, network = null) {
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
      let peers = await this._vm.$client.fetchPeers(networkLookup[network.id], getters['all']())
      if (peers.length) {
        for (const peer of peers) {
          peer.height = +peer.height
        }
        if (this._vm.$client.version === 2) {
          for (const peer of peers) {
            peer.delay = peer.latency
            peer.p2pPort = peer.port
            peer.port = null
            delete peer.latency
          }
        }
        dispatch('set', peers)
      } else {
        this._vm.$error(i18n.t('PEER.FAILED_REFRESH'))
      }
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

      let peer = network ? getters['best'](true, network.id) : getters['best']()
      if (!peer) {
        return null
      }

      try {
        await getApiPort(peer)
      } catch (error) {
        return dispatch('findBest', {
          refresh: true,
          network
        })
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
        const currentPeer = getters['current']()
        if (currentPeer && currentPeer.isCustom) {
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

      let networkConfig = await ClientService.fetchNetworkConfig(getBaseUrl(peer), getVersion(peer))
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
      if (!currentPeer) {
        currentPeer = { ...getters['current']() }
        updateCurrentPeer = true
      }
      if (!currentPeer) {
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
          const client = new ClientService(false)
          client.host = getBaseUrl(currentPeer)
          client.version = getVersion(currentPeer)
          client.client.http.timeout = 3000
          peerStatus = await client.fetchPeerStatus()
        }
        const delay = (performance.now() - delayStart).toFixed(0)

        currentPeer = {
          ...currentPeer,
          delay: +delay,
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
    clientServiceFromPeer (_, peer) {
      const client = new ClientService(false)
      client.host = getBaseUrl(peer)
      client.version = getVersion(peer)

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
    async validatePeer ({ rootGetters }, { host, ip, port, ignoreNetwork = false, timeout = 3000 }) {
      let networkConfig
      let version = 2
      if (!host && ip) {
        host = ip
      }
      let baseUrl = `${host}:${port}`
      let schemeUrl = host.match(/^(https?:\/\/)+(.+)$/)
      if (!schemeUrl) {
        baseUrl = `http://${baseUrl}`
      }
      try {
        networkConfig = await ClientService.fetchNetworkConfig(baseUrl, version, timeout)
      } catch (errorV2) {
        try {
          version = 1
          networkConfig = await ClientService.fetchNetworkConfig(baseUrl, version, timeout)
        } catch (errorV1) {
          //
        }
      }

      if (!networkConfig) {
        return i18n.t('PEER.NO_CONNECT')
      } else if (!ignoreNetwork && networkConfig.nethash !== rootGetters['session/network'].nethash) {
        return i18n.t('PEER.WRONG_NETWORK')
      }

      const client = new ClientService(false)
      client.host = baseUrl
      client.version = version
      client.client.http.timeout = timeout

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
        version: `${version}.0.0`,
        status: 'OK',
        delay: 0,
        isHttps: schemeUrl && schemeUrl[1] === 'https://'
      }
    }
  }
}
