import BaseModule from '../base'
import { isEmpty } from 'lodash'
import { NETWORKS } from '@config'
import NetworkModel from '@/models/network'
import Client from '@/services/client'

export default new BaseModule(NetworkModel, {
  getters: {
    feeStatisticsByType: (_, __, ___, rootGetters) => type => {
      const currentNetwork = rootGetters['session/network']

      if (!currentNetwork) {
        throw new Error('[network/feeStatisticsByType] No active network.')
      }

      if (currentNetwork.apiVersion === 1) {
        throw new Error('[network/feeStatisticsByType] Supported only by v2 networks.')
      }

      const { feeStatistics } = currentNetwork
      const data = feeStatistics.find(transactionType => transactionType.type === type)
      return data ? data.fees : []
    }
  },

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
      const response = await Client.fetchNetworkConfig(network.server, network.apiVersion)

      if (response) {
        const result = dispatch('update', {
          ...network,
          ...response
        })

        return result
      }
    }
  }
})
