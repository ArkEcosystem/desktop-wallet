import random from 'lodash/random'
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
        const currentPeer = getters['current']
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
      const peers = getters['all'](ignoreCurrent)

      if (!peers.length) {
        return null
      }

      const highestHeight = peers[0].height
      let maxRandom = 10
      for (let i = 1; i < maxRandom; i++) {
        if (!peers[i]) {
          break
        }
        if (peers[i].height < highestHeight - 50) {
          maxRandom = i - 1
        }
      }

      return peers[random(Math.min(maxRandom, peers.length))]
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

      currentPeer = getters['get'](currentPeer.ip)

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
        this._vm.$error('Failed to refresh peers')
      }
    },

    /**
     * Get best peer for current network.
     * @param  {Boolean} [refresh=true]
     * @return {(Object|null)}
     */
    async connectToBest ({ dispatch, getters }, refresh = true) {
      if (refresh) {
        try {
          await dispatch('refresh')
        } catch (error) {
          //
        }
      }
      const peer = getters['best']()
      if (!peer) {
        return null
      }
      dispatch('setCurrentPeer', peer)

      return peer
    }
  }
}
