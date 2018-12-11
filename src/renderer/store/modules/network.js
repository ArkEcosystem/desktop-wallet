import BaseModule from '../base'
import { isEmpty } from 'lodash'
import { NETWORKS } from '@config'
import i18n from '@/i18n'
import alertEvents from '@/plugins/alert-events'
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

    feeStatisticsByType: (_, __, ___, rootGetters) => type => {
      const network = rootGetters['session/network']

      if (!network) {
        throw new Error('[network/feeStatisticsByType] No active network.')
      }

      if (network.apiVersion === 1) {
        throw new Error('[network/feeStatisticsByType] Supported only by v2 networks.')
      }

      const { feeStatistics } = network
      const data = feeStatistics.find(transactionType => transactionType.type === type)
      return data ? data.fees : []
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
    load ({ commit, getters }) {
      if (!isEmpty(getters['network/all'])) return

      commit('SET_ALL', NETWORKS)
    },

    // TODO: look into where this is used, as it might need to be changed to getters[network/update] instead
    async updateNetworkConfig ({ dispatch, getters, _, rootGetters }, networkId) {
      var network = getters['byId'](networkId)
      if (!network) {
        network = rootGetters['network/customNetworkById'](networkId)
      }

      let response
      try {
        response = await Client.fetchNetworkConfig(network.server, network.apiVersion)
      } catch (error) {
        console.error(`Failed to update network config for ${network.server}`)
        alertEvents.$error(i18n.t('NETWORK.FAILED_CONFIG_UPDATE', {
          network: network.server
        }))

        return
      }

      if (response) {
        try {
          const result = dispatch('update', {
            ...network,
            ...response
          })
          return result
        } catch (error) {
          // Network did not exist yet, so create it
          const result = dispatch('create', {
            ...network,
            ...response
          })
          return result
        }
      }
    },

    addCustomNetwork ({ dispatch, commit }, network) {
      commit('ADD_CUSTOM_NETWORK', network)
      dispatch('create', network)
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
    },

    removeCustomNetwork ({ dispatch, commit }, id) {
      commit('REMOVE_CUSTOM_NETWORK', id)
      dispatch('delete', { id })
    }
  }
})
