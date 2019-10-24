import BaseModule from '../base'
import { cloneDeep, isEmpty } from 'lodash'
import { Managers } from '@arkecosystem/crypto'
import { NETWORKS } from '@config'
import eventBus from '@/plugins/event-bus'
import NetworkModel from '@/models/network'
import Client from '@/services/client'
import Vue from 'vue'

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

      Managers.configManager.setConfig(cloneDeep(rootGetters['session/network'].crypto))
      Managers.configManager.setHeight(rootGetters['session/network'].height)
    },

    /*
     * Update data of the network
     */
    async updateData ({ commit, dispatch, rootGetters }, network = null) {
      if (!network) {
        network = rootGetters['session/network']
      }

      try {
        const crypto = await Client.fetchNetworkCrypto(network.server)
        const { constants } = await Client.fetchNetworkConfig(network.server)
        // Fall back to the height of the current milestone on failure - we don't regularly check the height anyway
        const height = (await dispatch('peer/getAverageHeight', network, { root: true })) || constants.height
        commit('UPDATE', {
          ...network,
          crypto,
          constants,
          height
        })

        Managers.configManager.setConfig(cloneDeep(network.crypto))
        Managers.configManager.setHeight(height)
      } catch (error) {
        // data could not be updated
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
          feeStatistics
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
