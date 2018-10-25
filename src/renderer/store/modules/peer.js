import random from 'lodash/random'
import ClientService from '@/services/client'
import i18n from '@/i18n'
import PeerModel from '@/models/peer'

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
    all: (state, getters, _, rootGetters) => (ignoreCurrent = false) => {
      const networkPeers = state.all[rootGetters['session/profile'].networkId]
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
    best: (_, getters) => (ignoreCurrent = true) => {
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
    bestPeers: (_, getters) => (maxRandom = 10, ignoreCurrent = true) => {
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
    current: (state, getters, __, rootGetters) => () => {
      let currentPeer = state.current[rootGetters['session/profile'].networkId]
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
      const networkPeers = state.all[rootGetters['session/profile'].networkId]

      if (networkPeers) {
        return networkPeers.lastUpdated
      }

      return null
    }
  },

  mutations: {
    SET_PEERS (state, { peers, networkId }) {
      state.all[networkId] = {
        peers,
        lastUpdated: new Date()
      }
    },
    SET_CURRENT_PEER (state, { peer, networkId }) {
      state.current[networkId] = peer
    }
  },

  actions: {
    /**
     * Set peers for current network.
     * @param  {Object[]} peers
     * @return {void}
     */
    set ({ commit, rootGetters }, peers) {
      commit('SET_PEERS', {
        peers: peers.map(peer => {
          try {
            return PeerModel.deserialize(peer)
          } catch (error) {
            //
          }

          return null
        }).filter(peer => peer !== null),
        networkId: rootGetters['session/profile'].networkId
      })
    },

    /**
     * Set current peer for current network.
     * @param  {Object} peer
     * @return {void}
     */
    setCurrentPeer ({ commit, rootGetters }, peer) {
      this._vm.$client.host = `http://${peer.ip}:${peer.port}`
      commit('SET_CURRENT_PEER', {
        peer,
        networkId: rootGetters['session/profile'].networkId
      })
    },

    /**
     * Refresh peer list.
     * @return {void}
     */
    async refresh ({ dispatch, getters, rootGetters }) {
      const network = rootGetters['session/network']
      const networkLookup = {
        'ark.mainnet': 'mainnet',
        'ark.devnet': 'devnet'
      }
      const peers = await this._vm.$client.fetchPeers(networkLookup[network.id], getters['all']())
      if (peers.length) {
        for (const peer of peers) {
          peer.height = +peer.height
        }
        if (this._vm.$client.version === 2) {
          for (const peer of peers) {
            peer.delay = peer.latency
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
    async connectToBest ({ dispatch, getters }, { refresh = true, skipIfCustom = true }) {
      if (skipIfCustom) {
        const currentPeer = getters['current']()
        if (currentPeer && currentPeer.isCustom) {
          return null
        }
      }

      if (refresh) {
        try {
          await dispatch('refresh')
        } catch (error) {
          this._vm.$error(`${i18n.t('PEER.FAILED_REFRESH')}: ${error.message}`)
        }
      }

      const peer = getters['best']()
      if (!peer) {
        return null
      }

      await dispatch('updateCurrentPeerStatus', peer)
      dispatch('setCurrentPeer', peer)

      return peer
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
        return
      }

      try {
        const delayStart = performance.now()
        const peerStatus = await this._vm.$client.fetchPeerStatus()
        const delay = (performance.now() - delayStart).toFixed(0)
        currentPeer = {
          ...currentPeer,
          delay: +delay,
          height: +peerStatus.height,
          lastUpdated: new Date()
        }
        if (updateCurrentPeer) {
          dispatch('setCurrentPeer', currentPeer)
        } else {
          return currentPeer
        }
      } catch (error) {
        //
      }
    },

    /**
     * Validate custom peer, used to check it's acceptable to connect.
     * @param  {String} ip
     * @param  {Number} port
     * @return {(Object|String)}
     */
    async validatePeer ({ rootGetters }, { ip, port }) {
      let networkConfig
      let version = 1
      const host = `http://${ip}:${port}`
      try {
        networkConfig = await ClientService.fetchNetworkConfig(host, version, 3000)
      } catch (errorV1) {
        try {
          version = 2
          networkConfig = await ClientService.fetchNetworkConfig(host, version, 3000)
        } catch (errorV2) {
          //
        }
      }

      if (!networkConfig) {
        return i18n.t('PEER.NO_CONNECT')
      } else if (networkConfig.nethash !== rootGetters['session/network'].nethash) {
        return i18n.t('PEER.WRONG_NETWORK')
      }

      const client = new ClientService(false)
      client.host = host
      client.version = version
      client.client.http.timeout = 3000

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
        ip,
        port: +port,
        height: peerStatus.height,
        version: `${version}.0.0`,
        status: 'OK',
        delay: 0,
        isCustom: true
      }
    }
  }
}
