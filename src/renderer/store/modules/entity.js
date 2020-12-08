import Vue from 'vue'
import { filter, uniqBy, set } from '@arkecosystem/utils'
import { Request } from '@arkecosystem/platform-sdk-http-got'
import { File } from '@arkecosystem/platform-sdk-ipfs'

export default {
  namespaced: true,

  state: {
    entities: {},
    ipfsContent: {
      loading: {},
      failed: {},
      result: {}
    }
  },

  getters: {
    bySessionNetwork (state, _, __, rootGetters) {
      const network = rootGetters['session/network']
      const entities = state.entities[network.id]

      if (!entities) {
        return {}
      }

      return entities
    },

    bySessionProfile (_, getters, __, rootGetters) {
      const entities = getters.bySessionNetwork
      const profileId = rootGetters['session/profileId']
      const wallets = rootGetters['wallet/byProfileId'](profileId)
      const addresses = wallets.map(wallet => wallet.address)

      return filter(entities, entity => addresses.includes(entity.address))
    },

    byEntityType: (_, getters) => (type) => {
      const entities = getters.bySessionProfile
      return filter(entities, entity => entity.type === type)
    },

    byRegistrationId: (_, getters) => (registrationId) => {
      return getters.bySessionNetwork[registrationId]
    },

    hasEntityName: (_, getters) => (name) => {
      const entities = getters.bySessionNetwork

      for (const entity of Object.values(entities)) {
        if (entity.data.name.toLowerCase() === name.toLowerCase()) {
          return true
        }
      }

      return false
    },

    ipfsContentByRegistrationId: (state) => (registrationId) => {
      return state.ipfsContent.result[registrationId]
    },

    ipfsContentFailedMessage: (state) => (registrationId) => {
      return state.ipfsContent.failed[registrationId]
    },

    isIpfsContentLoading: (state) => (registrationId) => {
      return !!state.ipfsContent.loading[registrationId]
    }
  },

  mutations: {
    SET_ALL_ENTITIES (state, { entities, networkId }) {
      const result = entities.reduce((acc, entity) => ({ ...acc, [entity.id]: entity }), {})

      Vue.set(state.entities, networkId, result)
    },

    UPDATE_ENTITIES (state, { entities, networkId }) {
      const current = { ...state.entities }
      for (const entity of entities) {
        set(current, `${networkId}.${entity.id}`, entity)
      }
      Vue.set(state, 'entities', current)
    },

    SET_IPFS_CONTENT (state, { registrationId, ipfsContent }) {
      Vue.set(state.ipfsContent.result, registrationId, ipfsContent)
      Vue.delete(state.ipfsContent.failed, registrationId)
      Vue.delete(state.ipfsContent.loading, registrationId)
    },

    SET_IPFS_LOADING (state, { registrationId }) {
      Vue.set(state.ipfsContent.loading, registrationId, true)
      Vue.delete(state.ipfsContent.failed, registrationId)
    },

    SET_IPFS_FAILED (state, { registrationId, message }) {
      Vue.set(state.ipfsContent.failed, registrationId, message)
      Vue.delete(state.ipfsContent.loading, registrationId)
    }
  },

  actions: {
    async loadAll ({ commit, dispatch, rootGetters }) {
      const entities = []

      const firstResponse = await this._vm.$client.fetchEntities({
        page: 1,
        limit: 100
      })

      const requests = []
      for (let page = 2; page <= firstResponse.meta.pageCount; page++) {
        requests.push(this._vm.$client.fetchEntities({
          page,
          limit: 100
        }))
      }

      const responses = [firstResponse, ...await Promise.all(requests)]
      for (const response of responses) {
        entities.push(...response.entities)
      }

      const { id: networkId } = rootGetters['session/network']

      commit('SET_ALL_ENTITIES', { entities, networkId })

      dispatch('fetchAllIpfsContent')
    },

    async loadRecent ({ commit, getters, rootGetters }) {
      const current = Object.values(getters.bySessionNetwork)
      const { entities } = await this._vm.$client.fetchEntities({
        page: 1,
        limit: 100
      })

      const result = uniqBy([...entities, ...current], (item) => item.id)

      const { id: networkId } = rootGetters['session/network']
      commit('UPDATE_ENTITIES', { entities: result, networkId })
    },

    async fetchTransactionsHistory (_, registrationId) {
      const { transactions: registrations } = await this._vm.$client.fetchTransactions({ id: registrationId })
      const { transactions: activities } = await this._vm.$client.fetchTransactions({ 'asset.registrationId': registrationId, limit: 100 })
      return [...activities, ...registrations]
    },

    async fetchIpfsContent ({ commit }, { registrationId, ipfsHash }) {
      commit('SET_IPFS_LOADING', { registrationId })
      try {
        const request = new Request().timeout(5000)
        const ipfsContent = await new File(request).get(ipfsHash)
        commit('SET_IPFS_CONTENT', { registrationId, ipfsContent })
      } catch (error) {
        commit('SET_IPFS_FAILED', { registrationId, message: error.message })
      }
    },

    async fetchAllIpfsContent ({ getters, dispatch }) {
      const registrations = getters.bySessionProfile
      const promises = []
      for (const [registrationId, entity] of Object.entries(registrations)) {
        promises.push(dispatch('fetchIpfsContent', { registrationId, ipfsHash: entity.data.ipfsData }))
      }
      await Promise.allSettled(promises)
    }
  }
}
