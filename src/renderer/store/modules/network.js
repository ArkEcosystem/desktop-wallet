import BaseModule from '../base'
import { cloneDeep } from 'lodash'
import { Managers } from '@arkecosystem/crypto'
import { NETWORKS } from '@config'
import { isEmpty } from '@/utils'
import eventBus from '@/plugins/event-bus'
import NetworkModel from '@/models/network'
import Client from '@/services/client'
import Vue from 'vue'
import { reqwest } from '@/utils/http'

export default new BaseModule(NetworkModel, {

  state: () => ({
    all: [],
    customNetworks: {}
  }),

  getters: {
    bySymbol: state => symbol => {
      return state.all.find(network => network.symbol === symbol)
    },
    byToken: state => token => {
      return state.all.find(network => network.token === token)
    },
    byName: state => name => {
      return state.all.find(network => network.name === name)
    },
    customNetworkById: state => id => {
      return state.customNetworks[id]
    },
    customNetworks: state => state.customNetworks
  },

  mutations: {
    SET_ALL (state, value) {
      state.all = value
    },
    ADD_CUSTOM_NETWORK (state, value) {
      Vue.set(state.customNetworks, value.id, value)
    },
    UPDATE_CUSTOM_NETWORK (state, value) {
      if (state.customNetworks[value.id]) {
        Vue.set(state.customNetworks, value.id, value)
      }
    },
    REMOVE_CUSTOM_NETWORK (state, value) {
      Vue.delete(state.customNetworks, value)
    }
  },

  actions: {
    load ({ commit, getters, rootGetters }) {
      const all = cloneDeep(getters.all)
      if (!isEmpty(all)) {
        // TODO: remove in future major version
        // This is a "hack" to make sure all custom networks are in state.all
        let missingCustom = false
        for (const custom of Object.values(getters.customNetworks)) {
          if (!all.find(network => network.name === custom.name)) {
            all.push(custom)
            missingCustom = true
          }
        }
        if (missingCustom) {
          commit('SET_ALL', all)
        }
      } else {
        commit('SET_ALL', NETWORKS)
      }

      const sessionNetwork = rootGetters['session/network']
      if (sessionNetwork && sessionNetwork.crypto && sessionNetwork.constants) {
        Managers.configManager.setConfig(cloneDeep(sessionNetwork.crypto))
        Managers.configManager.setHeight(sessionNetwork.constants.height)
      }
    },

    /*
     * Update data of the network
     */
    async updateData ({ commit, rootGetters }, network = null) {
      if (!network) {
        network = cloneDeep(rootGetters['session/network'])
      }

      try {
        const crypto = await Client.fetchNetworkCrypto(network.server)
        const { constants } = await Client.fetchNetworkConfig(network.server)

        // TODO: remove in future major version
        // this is a "hack" to make sure the known wallets url is set on the default networks
        if (!network.knownWalletsUrl) {
          const defaultNetwork = NETWORKS.find(defaultNetwork => defaultNetwork.id === network.id)

          if (defaultNetwork) {
            network.knownWalletsUrl = defaultNetwork.knownWalletsUrl
          }
        }

        if (network.knownWalletsUrl) {
          try {
            const knownWallets = await reqwest(network.knownWalletsUrl, {
              json: true
            })
            network.knownWallets = knownWallets.body
          } catch (error) {
            this._vm.$logger.error('Could not retrieve known wallets: ', error)
          }
        }

        commit('UPDATE', {
          ...network,
          constants
        })

        Managers.configManager.setConfig(cloneDeep(crypto))
        Managers.configManager.setHeight(constants.height)
      } catch (error) {
        this._vm.$logger.error('Could not update network data: ', error)
      }
    },

    /*
     * Update the fee statistics of the current network
     */
    async fetchFees ({ commit, rootGetters }, network = null) {
      if (!network) {
        network = rootGetters['session/network']
      }

      try {
        const feeStatistics = await Client.fetchFeeStatistics(network.server)
        commit('UPDATE', {
          ...network,
          feeStatistics: { ...feeStatistics }
        })
      } catch (error) {
        // Fees couldn't be updated
      }
    },

    async addCustomNetwork ({ dispatch, commit }, network) {
      commit('ADD_CUSTOM_NETWORK', network)
      dispatch('create', network)

      await dispatch('fetchFees', network)
    },

    async updateCustomNetwork ({ dispatch, commit, rootGetters }, network) {
      commit('UPDATE_CUSTOM_NETWORK', network)
      dispatch('update', network)

      // Trigger a profile change/reload if updating current network
      const currentNetwork = rootGetters['session/network']
      if (currentNetwork.id === network.id) {
        await dispatch('session/setProfileId', rootGetters['session/profileId'], { root: true })
        eventBus.emit('client:changed')
      }

      await dispatch('fetchFees', network)
    },

    removeCustomNetwork ({ dispatch, commit }, id) {
      commit('REMOVE_CUSTOM_NETWORK', id)
      dispatch('delete', { id })
    }
  }
})
