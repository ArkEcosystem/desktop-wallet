import DelegateModel from '@/models/delegate'

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

    byAddress: (state, _, __, rootGetters) => address => {
      const network = rootGetters['session/network']
      if (!network || !state.delegates[network.id]) {
        return false
      }

      return state.delegates[network.id][address]
    }
  },

  mutations: {
    SET_DELEGATES (state, { delegates, networkId }) {
      state.delegates[networkId] = delegates.reduce((map, delegate, index) => {
        map[delegate.address] = delegate

        return map
      }, {})
    },
    ADD_DELEGATE (state, { delegate, networkId }) {
      state.delegates[networkId][delegate.address] = delegate
    }
  },

  actions: {
    async load ({ dispatch, rootGetters }) {
      const network = rootGetters['session/network']
      const delegates = []
      const limit = this._vm.$client.version === 1 ? (network.constants.activeDelegates || 51) : 100
      let page = 1
      let totalCount = null
      while (!totalCount || delegates.length < totalCount) {
        const delegateResponse = await this._vm.$client.fetchDelegates({
          page,
          limit
        })
        delegates.push(...delegateResponse.delegates)
        totalCount = delegateResponse.totalCount
        page++
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
