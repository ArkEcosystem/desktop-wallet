import BaseModule from '../base'
import { isEmpty } from 'lodash'
import { NETWORKS } from '@config'
import NetworkModel from '@/models/network'
import Client from '@arkecosystem/client'
import alertEvents from '@/plugins/alert-events'
import i18n from '@/i18n'

export default new BaseModule(NetworkModel, {
  mutations: {
    SET_ALL (state, value) {
      state.all = value
    }
  },

  actions: {
    load ({ commit, getters }) {
      if (!isEmpty(getters.all)) return

      commit('SET_ALL', NETWORKS)
    },

    async updateNetworkConfig ({ dispatch, getters }, networkId) {
      const network = getters['byId'](networkId)
      const response = await dispatch('fetchNetworkConfig', network)

      if (response) {
        dispatch('update', {
          ...network,
          ...response
        })
      }
    },

    async fetchNetworkConfig (_, { server, apiVersion }) {
      const client = new Client(server, apiVersion)
      const resource = apiVersion === 1 ? 'loader' : 'node'
      const api = client.resource(resource)

      try {
        const endpoint = apiVersion === 1 ? 'status' : 'configuration'
        const response = await api[endpoint]()
        const data = response.data.network || response.data

        return data
      } catch (error) {
        console.error(error)
        alertEvents.$error(i18n.t('COMMON.FAILED_FETCH', {
          name: 'configuration',
          msg: error.message
        }))
      }
    }
  }
})
