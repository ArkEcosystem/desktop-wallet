import DelegateModel from '@/models/delegate'
import Vue from 'vue'

export default {
  namespaced: true,

  state: {
    delegates: {}
  },

  getters: {
    all: (state, _, __, rootGetters) => {
      const network = rootGetters['session/network']
      if (!network || !state.delegates[network.id]) {
        return false
      }

      return state.delegates
    },

    bySessionNetwork: (state, _, __, rootGetters) => {
      const network = rootGetters['session/network']
      if (!network || !state.delegates[network.id]) {
        return false
      }

      return state.delegates[network.id]
    },

    byAddress: (state, _, __, rootGetters) => address => {
      const network = rootGetters['session/network']

      if (!address || !network || !state.delegates[network.id]) {
        return false
      }

      return state.delegates[network.id][address] || false
    },

    byUsername: (state, _, __, rootGetters) => username => {
      const network = rootGetters['session/network']

      if (!username || !network || !state.delegates[network.id]) {
        return false
      }

      return Object.values(state.delegates[network.id]).find(delegate => {
        return delegate.username === username
      }) || false
    },

    byPublicKey: (state, _, __, rootGetters) => publicKey => {
      const network = rootGetters['session/network']

      if (!publicKey || !network || !state.delegates[network.id]) {
        return false
      }

      return Object.values(state.delegates[network.id]).find(delegate => {
        return delegate.publicKey === publicKey
      }) || false
    },

    search: (state, getters) => query => {
      if (query.length <= 20) {
        return getters.byUsername(query)
      } else if (query.length <= 34) {
        return getters.byAddress(query)
      } else {
        return getters.byPublicKey(query)
      }
    }
  },

  mutations: {
    SET_DELEGATES (state, { delegates, networkId }) {
      const result = delegates.reduce((acc, delegate) => {
        acc[delegate.address] = delegate

        return acc
      }, {})

      Vue.set(state.delegates, networkId, result)
    },
    ADD_DELEGATE (state, { delegate, networkId }) {
      Vue.set(state.delegates, networkId, { [delegate.address]: delegate })
    }
  },

  actions: {
    async load ({ dispatch }) {
      const delegates = []

      const delegatePage1 = await this._vm.$client.fetchDelegates({
        page: 1,
        limit: 100
      })

      const requests = []
      for (let page = 2; page <= delegatePage1.meta.pageCount; page++) {
        requests.push(this._vm.$client.fetchDelegates({
          page,
          limit: 100
        }))
      }

      const delegatePages = [delegatePage1, ...await Promise.all(requests)]
      for (const page of delegatePages) {
        delegates.push(...page.delegates)
      }

      dispatch('set', delegates)
    },

    set ({ commit, rootGetters }, delegates) {
      const network = rootGetters['session/network']
      commit('SET_DELEGATES', {
        delegates: delegates.map(delegate => DelegateModel.deserialize(delegate)),
        networkId: network.id
      })
    },

    add ({ commit, rootGetters }, delegate) {
      const network = rootGetters['session/network']
      commit('ADD_DELEGATE', {
        delegate: DelegateModel.deserialize(delegate),
        networkId: network.id
      })
    }
  }
}
