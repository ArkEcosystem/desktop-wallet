import BaseModule from '../base'
import { isEmpty } from 'lodash'
import { NETWORKS } from '@config'
import NetworkModel from '@/models/network'
import { client } from '@/plugins/api-client'
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

    async updateCurrentNetworkConfig ({ dispatch, rootGetters }) {
      const api = client.resource('loader')
      const currentNetwork = rootGetters['session/currentNetwork']

      try {
        const response = await api.status()
        const data = response.data.network || response.data

        dispatch('update', {
          ...currentNetwork,
          ...data
        })
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
